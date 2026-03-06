#!/usr/bin/env node
/**
 * codemod-fix4.mjs
 * Fix duplicate identifier declarations caused by:
 *   const [X, setX] = useState(...)  ← state variable
 *   ... later in same function body ...
 *   let X = expr  OR  const X = computed   ← orphaned render-body code
 *
 * Rule:
 *   - If setX is NEVER called in the file → remove the useState line, keep the let/const
 *   - If setX IS called in the file → remove the let/const line
 *
 * Also handles:
 *   const [X, setX] = useState(...) where X is a function (const X = () => { ... })
 *   → remove the useState line (state bool conflicts with function)
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join, extname } from 'path'

function getFiles(dir, exts) {
  const results = []
  try {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) results.push(...getFiles(full, exts))
      else if (exts.includes(extname(entry))) results.push(full)
    }
  } catch {}
  return results
}

function countBraces(str) {
  let open = 0, close = 0
  let inSingle = false, inDouble = false, inTemplate = false
  let inLineComment = false, inBlockComment = false
  for (let i = 0; i < str.length; i++) {
    const c = str[i], next = str[i+1]
    if (inLineComment) { if (c === '\n') inLineComment = false; continue }
    if (inBlockComment) { if (c === '*' && next === '/') { inBlockComment = false; i++ }; continue }
    if (inSingle) { if (c === '\\') { i++; continue }; if (c === "'") inSingle = false; continue }
    if (inDouble) { if (c === '\\') { i++; continue }; if (c === '"') inDouble = false; continue }
    if (inTemplate) { if (c === '\\') { i++; continue }; if (c === '`') inTemplate = false; continue }
    if (c === '/' && next === '/') { inLineComment = true; continue }
    if (c === '/' && next === '*') { inBlockComment = true; i++; continue }
    if (c === "'") { inSingle = true; continue }
    if (c === '"') { inDouble = true; continue }
    if (c === '`') { inTemplate = true; continue }
    if (c === '{') open++; else if (c === '}') close++
  }
  return { open, close }
}

function findMatchingClose(lines, startLine) {
  let depth = 0
  for (let i = startLine; i < lines.length; i++) {
    const { open, close } = countBraces(lines[i])
    depth += open - close
    if (depth <= 0 && i > startLine) return i
    if (i === startLine && depth <= 0) return i
  }
  return -1
}

function fixTsxFile(content, filePath) {
  const lines = content.split('\n')
  const toRemove = new Set()
  let modified = false

  // Collect all useState declarations: name → { stateVar, setter, lineIdx }
  const useStateDecls = new Map() // stateVar → { lineIdx, setter, endLineIdx }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const m = line.match(/^\s*const\s+\[(\w+),\s*(\w+)\]\s*=\s*useState\(/)
    if (m) {
      const [, stateVar, setter] = m
      // Find end of this statement (may be multi-line)
      let endLine = i
      if (!line.trimEnd().endsWith(')') && !line.trimEnd().endsWith(');')) {
        let parenDepth = 0
        for (let j = i; j < Math.min(i + 20, lines.length); j++) {
          for (const c of lines[j]) {
            if (c === '(') parenDepth++
            else if (c === ')') { parenDepth--; if (parenDepth <= 0 && j >= i) { endLine = j; break } }
          }
          if (endLine > i) break
        }
      }
      useStateDecls.set(stateVar, { lineIdx: i, setter, endLineIdx: endLine })
    }
  }

  if (useStateDecls.size === 0) return null

  // For each useState declaration, check for duplicate declarations later in same scope
  for (const [stateVar, { lineIdx, setter, endLineIdx }] of useStateDecls) {
    // Does the setter get called (other than in JSX attributes like onChange={setter})?
    // Simple heuristic: is the setter name used ANYWHERE in the file as a call: setter(
    const setterCalledRegex = new RegExp(`\\b${setter}\\s*\\(`)
    const setterCalledLines = lines.filter((l, idx) => idx !== lineIdx && setterCalledRegex.test(l))
    const setterIsCalled = setterCalledLines.length > 0

    // Find any later declaration of the same name: let X = / const X = / var X = (not destructuring)
    // Must be: `  let stateVar = ` or `  const stateVar = ` at top function level (shallow nesting)
    for (let j = endLineIdx + 1; j < lines.length; j++) {
      if (toRemove.has(j)) continue
      const line = lines[j]
      // Check for let/var/const X = with NO opening bracket (not destructuring)
      const dupMatch = line.match(new RegExp(`^\\s*(let|var|const)\\s+${stateVar}\\s*=\\s*`))
      if (!dupMatch) continue

      // Make sure we're still in the same function (rough check - not nested in arrow callback)
      // Skip if this looks like it's inside a map/filter/reduce callback (indentation > 4 spaces extra)
      const baseIndent = (lines[lineIdx].match(/^(\s*)/) || ['',''])[1].length
      const dupIndent = (line.match(/^(\s*)/) || ['',''])[1].length
      if (dupIndent > baseIndent + 6) continue // too deep - probably in a nested callback

      const isArrowFn = /=\s*\(.*\)\s*=>/.test(line) || /=\s*\(\s*\)\s*=>/.test(line)
      const isMultiLineFn = line.trimEnd().endsWith('{') && isArrowFn

      if (setterIsCalled && !isArrowFn) {
        // Setter is called → the state is real → remove the orphaned let/const assignment
        // Check if it's multi-line (ends before a semicolon or assignment spans multiple lines)
        // Simple: remove just this single line if it ends with ; or is a single expression
        // For safety, only remove if the duplicated line is a simple `let X = expr` (no block)
        if (!line.trimEnd().endsWith('{')) {
          // Check if multi-line (continues until ; )
          let endJ = j
          if (!line.includes(';') && !line.trimEnd().endsWith('}')) {
            // Scan for the end
            for (let k = j + 1; k < Math.min(j + 10, lines.length); k++) {
              if (lines[k].includes(';') || lines[k].trim() === '') { endJ = k; break }
              if (lines[k].trim().startsWith('let ') || lines[k].trim().startsWith('const ') || 
                  lines[k].trim().startsWith('return ') || lines[k].trim().startsWith('if ')) { endJ = k - 1; break }
            }
          }
          for (let k = j; k <= endJ; k++) toRemove.add(k)
          modified = true
          console.log(`  ${filePath.split('/src/')[1]}: removed duplicate 'let ${stateVar}' at line ${j+1} (setter ${setter} is called)`)
        }
      } else if (!setterIsCalled) {
        // Setter not called → useState is unused state → remove the useState line
        for (let k = lineIdx; k <= endLineIdx; k++) toRemove.add(k)
        modified = true
        console.log(`  ${filePath.split('/src/')[1]}: removed unused useState '${stateVar}' at line ${lineIdx+1} (${setter} never called)`)
        break // Only remove once
      }
    }

    // Also handle: const [X, setX] = useState(...) where const X = () => { ... } exists
    // The function X shadows the state X
    for (let j = endLineIdx + 1; j < lines.length; j++) {
      if (toRemove.has(j)) continue
      const line = lines[j]
      const fnMatch = line.match(new RegExp(`^\\s*const\\s+${stateVar}\\s*=\\s*\\(`))
      if (!fnMatch) continue
      const isArrowFn = /=\s*\(.*\)\s*=>/.test(line) || /=\s*async\s*\(/.test(line)
      if (!isArrowFn) continue

      // There's `const X = (...) => { ... }` — the stateVar name conflicts with a function
      // Remove the useState line
      for (let k = lineIdx; k <= endLineIdx; k++) toRemove.add(k)
      modified = true
      console.log(`  ${filePath.split('/src/')[1]}: removed useState '${stateVar}' at line ${lineIdx+1} (conflicts with function)`)
      break
    }
  }

  if (toRemove.size === 0) return null
  return lines.filter((_, i) => !toRemove.has(i)).join('\n')
}

const tsxFiles = getFiles('src/app', ['.tsx', '.ts'])
let count = 0

console.log(`Processing ${tsxFiles.length} TSX/TS files...`)
for (const file of tsxFiles) {
  const normPath = file.replace(/\\/g, '/')
  const content = readFileSync(file, 'utf8')
  const fixed = fixTsxFile(content, normPath)
  if (fixed !== null) {
    writeFileSync(file, fixed)
    count++
  }
}

console.log(`\nDone. Modified ${count} files.`)
