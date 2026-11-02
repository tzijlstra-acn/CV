#!/usr/bin/env node
/**
 * Post-build checks on the assembled GitHub Pages artifact (brief sections 2, 26 and 27).
 * Exit 1 on any failure.
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const DASH = new RegExp(`[${String.fromCharCode(0x2013)}${String.fromCharCode(0x2014)}]`)
const failures = []
const ok = []
const check = (label, cond, detail = '') => (cond ? ok.push(label) : failures.push(`${label}${detail ? `: ${detail}` : ''}`))
const read = (f) => fs.readFileSync(path.join(dist, f), 'utf8')
const exists = (f) => fs.existsSync(path.join(dist, f))
const same = (f, src = f) => exists(f) && Buffer.compare(fs.readFileSync(path.join(dist, f)), fs.readFileSync(path.join(root, src))) === 0

if (!exists('index.html')) {
  console.error('[check-dist] dist/index.html missing: run the portfolio build first')
  process.exit(1)
}

// 1. Canonical URLs: portfolio, web CV and PDF, byte for byte from the CV pipeline.
check('portfolio entry', /<div id="root">/.test(read('index.html')))
for (const f of ['cv.html', 'styles.css', 'script.js', 'assets/Thomas_Zijlstra_CV.pdf', 'assets/profile-bw.png', 'assets/favicon.svg']) check(`unchanged ${f}`, same(f), 'differs from the repository copy or is missing')
check('PDF signature', exists('assets/Thomas_Zijlstra_CV.pdf') && fs.readFileSync(path.join(dist, 'assets/Thomas_Zijlstra_CV.pdf')).subarray(0, 4).toString() === '%PDF')

// 2. Prerendered routes with their own titles.
const cases = JSON.parse(fs.readFileSync(path.join(root, 'portfolio-data/case-studies.json'), 'utf8')).cases.filter((c) => c.status !== 'blocked')
const routes = ['evidence/', 'capabilities/', ...cases.map((c) => `case/${c.slug}/`)]
for (const r of routes) {
  const f = `${r}index.html`
  check(`route ${r}`, exists(f))
  if (exists(f)) check(`route ${r} has its own title and canonical`, /<title>[^<]+<\/title>/.test(read(f)) && read(f).includes(`https://tzijlstra-acn.github.io/CV/${r}`))
}
for (const c of cases) if (exists(`case/${c.slug}/index.html`)) check(`case title ${c.slug}`, read(`case/${c.slug}/index.html`).includes(c.title.replace(/&/g, '&amp;')))
check('404 page is noindex', exists('404.html') && read('404.html').includes('noindex'))
for (const f of ['.nojekyll', 'robots.txt', 'sitemap.xml']) check(f, exists(f))
check('sitemap lists every route', exists('sitemap.xml') && routes.every((r) => read('sitemap.xml').includes(`/CV/${r}`)))

// 3. Production hygiene.
const html = fs
  .readdirSync(dist, { recursive: true })
  .map(String)
  .filter((f) => f.endsWith('.html') && !['cv.html'].includes(f))
for (const f of html) {
  const text = read(f)
  check(`${f}: strict CSP`, text.includes('Content-Security-Policy'))
  check(`${f}: no dev paths`, !text.includes('/src/main.tsx'))
  const visible = text.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '')
  check(`${f}: no en or em dashes`, !DASH.test(visible))
  for (const m of text.matchAll(/(?:src|href)="\/CV\/(app\/[^"]+)"/g)) check(`${f}: asset ${m[1]}`, exists(m[1]))
}
check('no source maps', !fs.readdirSync(path.join(dist, 'app')).some((f) => f.endsWith('.map')))

if (failures.length) {
  console.error(`[check-dist] FAIL: ${failures.length} problem(s)`)
  for (const f of failures) console.error(`  - ${f}`)
  process.exit(1)
}
console.log(`[check-dist] OK: ${ok.length} checks (${routes.length + 1} routes, CV and PDF unchanged)`)
