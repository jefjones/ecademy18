#!/usr/bin/env node
/**
 * codemod-fix3.mjs
 * Pass 2: After dead-code removal, fix unclosed function bodies.
 * 
 * After dead-code blocks (no-const assignments) were removed in pass 1,
 * some arrow functions are left without their closing `}`.
 * This pass detects when a new const/function declaration appears at too-deep
 * a nesting level, then inserts `}` to close preceding unclosed bodies.
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
  let templateDepth = 0
  
  for (let i = 0; i < str.length; i++) {
    const c = str[i], next = str[i+1]
    
    if (inLineComment) { if (c === '\n') inLineComment = false; continue }
    if (inBlockComment) { if (c === '*' && next === '/') { inBlockComment = false; i++ }; continue }
    if (inSingle) { if (c === '\\') { i++; continue }; if (c === "'") inSingle = false; continue }
    if (inDouble) { if (c === '\\') { i++; continue }; if (c === '"') inDouble = false; continue }
    if (inTemplate) {
      if (c === '\\') { i++; continue }
      if (c === '`') inTemplate = false
      else if (c === '$' && next === '{') { templateDepth++; open++; i++ }
      else if (c === '}' && templateDepth > 0) { templateDepth--; close++ }
      continue
    }
    
    if (c === '/' && next === '/') { inLineComment = true; continue }
    if (c === '/' && next === '*') { inBlockComment = true; i++; continue }
    if (c === "'") { inSingle = true; continue }
    if (c === '"') { inDouble = true; continue }
    if (c === '`') { inTemplate = true; continue }
    if (c === '{') open++
    else if (c === '}') close++
  }
  return { open, close }
}

/**
 * Is this line a top-level const/function/let/var declaration of a function?
 * e.g.: `  const handleX = (...) => {`  or  `  function handleX(`
 */
function isFunctionDeclaration(line) {
  return /^\s+(const|let|var)\s+\w+\s*=/.test(line) ||
         /^\s+function\s+\w+/.test(line) ||
         /^\s+(const|let|var)\s+\w+\s*:\s*\w/.test(line)  // typed: const x: Type =
}

/**
 * Is this line a return statement?
 */
function isReturnStatement(line) {
  return /^\s+return\b/.test(line)
}

/**
 * Fix unclosed function bodies.
 *
 * After dead-code removal, some arrow functions lack their closing `}`.
 * Pattern: `const fn = () => { \n  return x \n\nconst fn2 = () => {`
 *
 * Heuristic: only add `}` if ALL conditions met:
 * 1. depth >= 2 (we're inside an unclosed inner function body)
 * 2. Current line declares a new standalone arrow function or named function
 *    (ends with `=> {`, `=> (`, or is `function name(`)
 * 3. The preceding non-empty line is a `return` statement
 *    (meaning the previous function was "just a return" and its body was never closed)
 */
function fixUnclosedBodies(content) {
  const lines = content.split('\n')
  const insertBefore = new Map() // lineIndex -> number of `}` to insert before it
  
  const prevNonEmpty = (before) => {
    for (let k = before - 1; k >= 0; k--) {
      if (lines[k].trim()) return k
    }
    return -1
  }

  // A "standalone arrow function declaration" looks like:
  // `  const fn = (...) => {`  OR  `  const fn = (a, b: Type) => {`
  // Must start with const/let/var at indented position, ending with `=> {`
  function isStandaloneArrowFnDecl(line) {
    return /^\s+(const|let|var)\s+\w+(?:\s*:\s*\S+)?\s*=\s*.+\s*=>\s*\{\s*$/.test(line) &&
           !/const\s+\w+\s*=\s*.*\.map\(|\.filter\(|\.reduce\(|\.forEach\(|\.find\(/.test(line)
  }
  
  let depth = 0
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const { open, close } = countBraces(line)
    
    if (depth >= 2 && isStandaloneArrowFnDecl(line)) {
      // Only add } if the function before this was just a `return`
      const prev = prevNonEmpty(i)
      if (prev >= 0 && isReturnStatement(lines[prev])) {
        const closesNeeded = depth - 1
        insertBefore.set(i, (insertBefore.get(i) || 0) + closesNeeded)
        depth -= closesNeeded
      }
    }
    
    depth += open - close
  }
  
  if (insertBefore.size === 0) return null
  
  const result = []
  for (let i = 0; i < lines.length; i++) {
    if (insertBefore.has(i)) {
      const n = insertBefore.get(i)
      const indent = lines[i].match(/^(\s*)/)[1]
      for (let k = 0; k < n; k++) result.push(indent + '}')
    }
    result.push(lines[i])
  }
  
  return result.join('\n')
}

const tsxFiles = getFiles('src/app', ['.tsx', '.ts'])
let count = 0

console.log(`Processing ${tsxFiles.length} files...`)
for (const file of tsxFiles) {
  const content = readFileSync(file, 'utf8')
  const fixed = fixUnclosedBodies(content)
  if (fixed !== null) {
    writeFileSync(file, fixed)
    count++
    console.log(' ', file.replace(process.cwd().replace(/\\/g,'/'), ''))
  }
}
console.log(`\nDone. Modified ${count} files.`)
