#!/usr/bin/env node
/**
 * npm run release: source and production archives in release/ (gitignored).
 *   portfolio-source.zip  tracked and untracked files that git does not ignore, so private/,
 *                         CLAIM_LEDGER.md, node_modules and build output never leak
 *   portfolio-site.zip    the built dist/ artifact, deployable to any static host under /CV/
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const NL = String.fromCharCode(10)
// On Windows use the system bsdtar (it writes zip); Git Bash's GNU tar would read C: as a host.
const TAR = process.platform === 'win32' ? path.join(process.env.SystemRoot ?? 'C:/Windows', 'System32', 'tar.exe') : 'tar'
const root = path.resolve(import.meta.dirname, '..')
const out = path.join(root, 'release')
if (!fs.existsSync(path.join(root, 'dist/index.html'))) {
  console.error('[release] dist/ missing: run npm run build first')
  process.exit(1)
}
fs.rmSync(out, { recursive: true, force: true })
fs.mkdirSync(out)

const list = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8' })
  .split(NL)
  .map((f) => f.trim())
  .filter((f) => f && fs.existsSync(path.join(root, f)))
const listFile = path.join(out, 'files.txt')
fs.writeFileSync(listFile, list.join(NL) + NL)
const source = path.join(out, 'portfolio-source.zip')
try {
  // bsdtar (Windows, macOS) writes zip with -a
  execFileSync(TAR, ['-a', '-c', '-f', source, '-T', listFile], { cwd: root, stdio: 'inherit' })
} catch {
  execFileSync('zip', ['-q', source, '-@'], { cwd: root, input: list.join(NL) })
}
fs.rmSync(listFile)

const site = path.join(out, 'portfolio-site.zip')
try {
  execFileSync(TAR, ['-a', '-c', '-f', site, '-C', path.join(root, 'dist'), '.'], { stdio: 'inherit' })
} catch {
  execFileSync('zip', ['-qr', site, '.'], { cwd: path.join(root, 'dist'), stdio: 'inherit' })
}
console.log(`[release] ${list.length} source files`)
for (const f of fs.readdirSync(out)) console.log(`[release] ${f} ${(fs.statSync(path.join(out, f)).size / 1024).toFixed(0)} KB`)
