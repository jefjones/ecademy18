#!/usr/bin/env node
/**
 * codemod-fix2.mjs - Fix class component remnants in function components
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
    if (depth <= 0) return i
  }
  return -1
}

function isDeadCodeAssignment(line) {
  const trimmed = line.trim()
  if (!trimmed) return false
  // Must have leading whitespace (inside a function body)
  if (!/^\s/.test(line)) return false
  // Must be an arrow function assignment: identifier = (...) => 
  // Requires `=>` to distinguish from ternaries, JSX assignments, etc.
  if (!/^\s+\w[\w.]*\s*=\s*\([^)]*\)\s*=>/.test(line)) return false
  // Must NOT start with keywords
  if (/^\s*(const|let|var|function|type|interface|export|import|return|if|else|for|while|switch|case|throw|try|catch|finally|class|\/\/|\/\*|this\.|new\s)/.test(trimmed)) return false
  return true
}

function fixTsxFile(content) {
  const lines = content.split('\n')
  const toRemove = new Set()

  for (let i = 0; i < lines.length; i++) {
    if (toRemove.has(i)) continue
    const line = lines[i]
    const trimmed = line.trim()

    // 1. Remove useState(this.props.x) / useState(this.state.x) - single or multi-line
    if (/const\s+\[/.test(trimmed) && /useState\(/.test(trimmed)) {
      // Single-line: useState(this.props.x)
      if (/useState\(\s*this\.(props|state)/.test(trimmed)) {
        toRemove.add(i); continue
      }
      // Multi-line: useState( with this.state/this.props somewhere in the block
      // Find the closing paren of useState(...)
      if (!trimmed.endsWith(')') && !trimmed.endsWith(');')) {
        // Multi-line useState - scan forward to find closing )
        let parenDepth = 0
        let foundThisRef = false
        let endLine = i
        // Count parens starting from the useState( opening
        for (let j = i; j < lines.length; j++) {
          const l = lines[j]
          if (/this\.(props|state)/.test(l)) foundThisRef = true
          for (let k = 0; k < l.length; k++) {
            if (l[k] === '(') parenDepth++
            else if (l[k] === ')') {
              parenDepth--
              if (parenDepth <= 0 && j > i) { endLine = j; break }
            }
          }
          if (endLine > i) break
          if (j > i + 20) break // safety limit
        }
        if (foundThisRef && endLine > i) {
          for (let j = i; j <= endLine; j++) toRemove.add(j)
          i = endLine
          continue
        }
      }
    }

    // 2. Remove `const { ... } = state` (single or multi-line class-state destructuring)
    // Single-line simple: `const { a, b } = state` (no default values with nested {})
    if (/^\s*const\s*\{[^{}]*\}\s*=\s*(state|this\.state)\b/.test(line)) {
      toRemove.add(i); continue
    }
    // End-of-line pattern: `} = state` - catches multi-line and single-line with nested defaults
    // e.g. `const {alert={}, b} = state`  OR multi-line ending with `  b } = state`
    if (/\}\s*=\s*(state|this\.state)\s*$/.test(line)) {
      // Scan backwards to find the opening `const {`
      let start = i
      for (let k = i - 1; k >= 0; k--) {
        if (/^\s*const\s*\{/.test(lines[k])) { start = k; break }
        if (/^\s*(function|const\s+\w+\s*=|let\s|var\s|return\b|if\s*\(|for\s*\()/.test(lines[k].trim())) break
      }
      for (let k = start; k <= i; k++) toRemove.add(k)
      continue
    }

    // 3. Dead code assignments (class-style, no const/let/var)
    if (isDeadCodeAssignment(line)) {
      if (line.trimEnd().endsWith('{')) {
        const closeIdx = findMatchingClose(lines, i)
        if (closeIdx !== -1) {
          for (let j = i; j <= closeIdx; j++) toRemove.add(j)
          i = closeIdx
        } else {
          toRemove.add(i)
        }
      } else {
        toRemove.add(i)
      }
      continue
    }

    // 4. Uncomment `//return (` where next non-empty line is JSX
    if (/^\s*\/\/\s*return\s*\(/.test(line)) {
      let j = i + 1
      while (j < lines.length && !lines[j].trim()) j++
      if (j < lines.length && lines[j].trim().startsWith('<')) {
        lines[i] = line.replace(/(\s*)\/\/\s*(return\s*\()/, '$1$2')
      }
    }

    // 5. Remove leftover `render() { ... }` blocks (not at start of line - inside function body)
    if (/^\s+render\s*\(\s*\)\s*\{/.test(line)) {
      const closeIdx = findMatchingClose(lines, i)
      if (closeIdx !== -1) {
        for (let j = i; j <= closeIdx; j++) toRemove.add(j)
        i = closeIdx
      }
      continue
    }
  }

  if (toRemove.size === 0) return null
  return lines.filter((_, i) => !toRemove.has(i)).join('\n')
}

function fixCssFile(content) {
  const fixed = content.replace(/(\*\/)(\s*\*\/)/g, '$1')
  return fixed !== content ? fixed : null
}

const tsxFiles = getFiles('src/app', ['.tsx', '.ts'])
const cssFiles = getFiles('src/app', ['.css'])
let count = 0

console.log(`Processing ${tsxFiles.length} TSX/TS files...`)
for (const file of tsxFiles) {
  const content = readFileSync(file, 'utf8')
  const fixed = fixTsxFile(content)
  if (fixed !== null) {
    writeFileSync(file, fixed)
    count++
    console.log(' ', file.replace(process.cwd().replace(/\\/g,'/'), ''))
  }
}

console.log(`\nProcessing ${cssFiles.length} CSS files...`)
for (const file of cssFiles) {
  const content = readFileSync(file, 'utf8')
  const fixed = fixCssFile(content)
  if (fixed !== null) {
    writeFileSync(file, fixed)
    count++
    console.log(' ', file.replace(process.cwd().replace(/\\/g,'/'), ''))
  }
}

console.log(`\nDone. Modified ${count} files.`)
