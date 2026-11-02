/**
 * npm run qa:confidential: scans every tracked or untracked-but-not-ignored text file, every
 * commit message on this branch, and dist/ (when built) for confidential terms. Only salted
 * hashes are stored in the repository (see portfolio-data/lib/confidential.ts).
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { loadHashes, loadLocalTerms, ROOT, scanConfidential } from '../portfolio-data/lib/confidential'

const TEXT = /\.(md|json|ts|tsx|mjs|js|css|html|txt|yml|yaml|svg|xml)$/i
const SKIP = [/^package-lock\.json$/, /^qa\/confidential-term-hashes\.json$/, /^qa\/baseline\//]
const hashes = loadHashes()
const terms = loadLocalTerms()
if (!hashes.size) {
  console.error('[qa:confidential] no term hashes found')
  process.exit(1)
}

const git = (...args: string[]) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
const files = git('ls-files', '--cached', '--others', '--exclude-standard')
  .split('\n')
  .filter((f) => f && TEXT.test(f) && !SKIP.some((s) => s.test(f)) && fs.existsSync(path.join(ROOT, f)))

const walk = (dir: string): string[] =>
  fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : TEXT.test(e.name) ? [path.join(dir, e.name)] : [])) : []
const distFiles = walk(path.join(ROOT, 'dist')).map((f) => path.relative(ROOT, f).split(path.sep).join('/'))

let hits = 0
const report = (where: string, text: string) => {
  for (const h of scanConfidential(text, hashes, terms)) {
    hits++
    console.error(`  ${where}: ${h.term ?? `hash ${h.hash.slice(0, 8)}`}`)
  }
}
for (const f of [...files, ...distFiles]) {
  fs.readFileSync(path.join(ROOT, f), 'utf8')
    .split(/\r?\n/)
    .forEach((line, i) => report(`${f}:${i + 1}`, line))
}
// Commits on this branch; on a shallow CI checkout without a main ref, the commit being built.
let range: string[] = []
if (!process.argv.includes('--all-history')) {
  try {
    git('rev-parse', '--verify', '--quiet', 'main')
    range = ['main..HEAD']
  } catch {
    range = ['-1']
  }
}
for (const msg of git('log', ...range, '--format=%h %s%n%b%x00').split(String.fromCharCode(0))) if (msg.trim()) report(`commit ${msg.trim().slice(0, 7)}`, msg)

if (hits) {
  console.error(`[qa:confidential] FAIL: ${hits} confidential term hit(s)`)
  process.exit(1)
}
console.log(`[qa:confidential] OK: ${files.length} files, ${distFiles.length} built files and branch commit messages are clean (${hashes.size} hashed terms)`)
