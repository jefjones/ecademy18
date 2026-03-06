#!/usr/bin/env node
/**
 * codemod-fix-class-remnants.mjs
 * Fixes leftover class component artifacts in function components:
 * 1. Removes `const [x, setX] = useState(this.props.x)` and `useState(this.state.x)` lines
 * 2. Removes `const { ..., x } = state` lines (class state destructuring)  
 * 3. Removes inline `render() { ... }` blocks inside function bodies
 * 4. Removes `//return (` comment artifacts before JSX and uncomments the return
 * 5. Fixes double-closing ` */ */` nested CSS comment issues
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs'
import { join, extname } from 'path'

let totalFiles = 0
let totalChanges = 0

function getFiles(dir, extensions) {
  const results = []
  try {
    for (const entry of readdirSync(dir)) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        results.push(...getFiles(full, extensions))
      } else if (extensions.includes(extname(entry))) {
        results.push(full)
      }
    }
  } catch {}
  return results
}

/**
 * Find the matching closing brace index in an array of lines,
 * starting from lineIndex which contains the opening `{`.
 * Returns -1 if not found.
 */
function findMatchingClose(lines, lineIndex) {
  let depth = 0
  for (let i = lineIndex; i < lines.length; i++) {
    const line = lines[i]
    for (const ch of line) {
      if (ch === '{') depth++
      else if (ch === '}') {
        depth--
        if (depth === 0) return i
      }
    }
  }
  return -1
}

function fixTsxFile(content) {
  let changed = false
  const lines = content.split('\n')
  const toRemove = new Set()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Pattern 1: const [x, setX] = useState(this.props.x) or useState(this.state.x)
    if (/const\s+\[/.test(trimmed) && /useState\(\s*this\.(props|state)/.test(trimmed)) {
      toRemove.add(i)
      changed = true
      continue
    }

    // Pattern 2: const { ..., x } = state  (class state destructuring)
    // Matches single-line: `const { ... } = state`
    if (/^\s*const\s*\{[^}]*\}\s*=\s*state\b/.test(line)) {
      toRemove.add(i)
      changed = true
      continue
    }

    // Pattern 3: render() { ... } block inside function body
    // Matches: `render() {` possibly with leading whitespace
    // But NOT `function render` or `const render` - just bare `render() {`
    if (/^\s+render\s*\(\s*\)\s*\{/.test(line) && !/^\s*(function|const|let|var)\s/.test(line)) {
      const closeIdx = findMatchingClose(lines, i)
      if (closeIdx !== -1) {
        for (let j = i; j <= closeIdx; j++) toRemove.add(j)
        changed = true
        i = closeIdx
        continue
      }
    }

    // Pattern 4: dead code class methods after return in arrow functions
    // handleX = () => ... (without const/let) inside a function body - dead code after return
    // Harder to detect reliably, skip for now
  }

  if (!changed) return null

  // Also handle multi-line `const { ... } = state` - check if the line continues
  // For now, only single-line ones are handled above.

  return lines.filter((_, i) => !toRemove.has(i)).join('\n')
}

/**
 * Fix `//return (` → `return (` uncomment patterns
 * Only uncomment if the very next non-empty line is JSX (<)
 */
function fixCommentedReturn(content) {
  const lines = content.split('\n')
  let changed = false
  
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (/^\/\/\s*return\s*\(/.test(trimmed)) {
      // Check if next non-empty line starts a JSX element
      let nextNonEmpty = i + 1
      while (nextNonEmpty < lines.length && lines[nextNonEmpty].trim() === '') nextNonEmpty++
      if (nextNonEmpty < lines.length && lines[nextNonEmpty].trim().startsWith('<')) {
        // Uncomment the return
        lines[i] = lines[i].replace(/(\s*)\/\/\s*(return\s*\()/, '$1$2')
        changed = true
      }
    }
  }
  
  return changed ? lines.join('\n') : null
}

/**
 * Fix invalid class method remnants that cause Babel parser failures.
 * Specifically: `render() {` as a remnant inside arrow function bodies.
 * These appear after a `return ...` so they're dead code.
 */
function fixClassMethodRemnants(content) {
  const lines = content.split('\n')
  const toRemove = new Set()
  let changed = false

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    
    // Detect lines that look like class method shorthands inside function bodies:
    // e.g. `handleX = () => setIsShowingModal_x(false)` without const/let/var
    // These are ALWAYS inside another arrow function (after return), so dead code
    // We identify them: no `const`/`let`/`var`, with `=`, and the LEFT side is an identifier
    // that later has `const X = () => {` defined outside
    // This is tricky - skip for now

    // Instead, focus on `UNSAFE_componentWillReceiveProps` or other clear class lifecycle
    if (/^\s+(UNSAFE_componentWillReceiveProps|componentDidMount|componentDidUpdate|componentWillUnmount)\s*\(/.test(lines[i])) {
      if (lines[i].trim().endsWith('{')) {
        const closeIdx = findMatchingClose(lines, i)
        if (closeIdx !== -1) {
          for (let j = i; j <= closeIdx; j++) toRemove.add(j)
          changed = true
          i = closeIdx
          continue
        }
      }
    }
  }

  if (!changed) return null
  return lines.filter((_, i) => !toRemove.has(i)).join('\n')
}

/**
 * Fix CSS files: remove extra ` */` from nested comments
 */
function fixCssNestedComments(content) {
  // Pattern: `/* ... /* ... */ */`  → `/* ... /* ... */` (remove trailing ` */`)
  // But be careful not to break valid CSS
  let changed = false
  let result = content.replace(/(\s*\/\*[^*]*\*\/)\s*\*\//g, (match, p1) => {
    changed = true
    return p1
  })
  return changed ? result : null
}

// Process .tsx and .ts files
const srcDir = 'src/app'
const tsxFiles = getFiles(srcDir, ['.tsx', '.ts'])
const cssFiles = getFiles(srcDir, ['.css'])

console.log(`Processing ${tsxFiles.length} TSX/TS files...`)

for (const file of tsxFiles) {
  let content = readFileSync(file, 'utf8')
  let modified = false

  const fixed1 = fixTsxFile(content)
  if (fixed1 !== null) {
    content = fixed1
    modified = true
  }

  const fixed2 = fixCommentedReturn(content)
  if (fixed2 !== null) {
    content = fixed2
    modified = true
  }

  const fixed3 = fixClassMethodRemnants(content)
  if (fixed3 !== null) {
    content = fixed3
    modified = true
  }

  if (modified) {
    writeFileSync(file, content)
    totalFiles++
    totalChanges++
    console.log('  Fixed:', file.replace(process.cwd().replace(/\\/g,'/') + '/', ''))
  }
}

console.log(`\nProcessing ${cssFiles.length} CSS files...`)
for (const file of cssFiles) {
  const content = readFileSync(file, 'utf8')
  const fixed = fixCssNestedComments(content)
  if (fixed !== null) {
    writeFileSync(file, fixed)
    totalFiles++
    totalChanges++
    console.log('  Fixed CSS:', file.replace(process.cwd().replace(/\\/g,'/') + '/', ''))
  }
}

console.log(`\nDone. Fixed ${totalFiles} files.`)
