#!/usr/bin/env node
/**
 * npm run qa:links: every internal link and asset reference in the built site resolves to a file
 * in dist/, including the web CV's own links. With --external, external links are also requested
 * (network access; not run in CI by default).
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
if (!fs.existsSync(path.join(dist, 'index.html'))) {
  console.error('[qa:links] dist/ missing: run npm run build first')
  process.exit(1)
}
const files = fs.readdirSync(dist, { recursive: true }).map(String).filter((f) => f.endsWith('.html'))
const broken = []
const external = new Set()
let checked = 0

const resolveTarget = (fromFile, href) => {
  const clean = href.split('#')[0].split('?')[0]
  if (!clean) return true
  let rel
  if (clean.startsWith('/CV/')) rel = clean.slice(4)
  else if (clean.startsWith('/')) return false
  else rel = path.posix.join(path.posix.dirname(fromFile.split(path.sep).join('/')), clean)
  const abs = path.join(dist, decodeURIComponent(rel))
  return (fs.existsSync(abs) && fs.statSync(abs).isFile()) || fs.existsSync(path.join(abs, 'index.html'))
}

for (const f of files) {
  const html = fs.readFileSync(path.join(dist, f), 'utf8')
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = m[1]
    if (/^(mailto:|tel:|data:|javascript:)/.test(href)) continue
    if (/^https?:\/\//.test(href)) {
      if (!href.startsWith('https://tzijlstra-acn.github.io/CV/')) external.add(href)
      continue
    }
    checked++
    if (!resolveTarget(f, href)) broken.push(`${f}: ${href}`)
  }
}

if (process.argv.includes('--external')) {
  for (const url of external) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
      if (res.status >= 400) broken.push(`external ${url}: HTTP ${res.status}`)
    } catch (err) {
      broken.push(`external ${url}: ${err.message}`)
    }
  }
}

if (broken.length) {
  console.error(`[qa:links] FAIL: ${broken.length} broken link(s)`)
  for (const b of broken) console.error(`  - ${b}`)
  process.exit(1)
}
console.log(`[qa:links] OK: ${checked} internal links across ${files.length} pages resolve; ${external.size} external link(s)${process.argv.includes('--external') ? ' checked' : ' listed (run with --external to request them)'}`)
