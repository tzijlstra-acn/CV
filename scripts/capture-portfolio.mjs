#!/usr/bin/env node
/**
 * npm run qa:visual (brief section 25): renders every route at the six target viewports from the
 * production build, checks each render, and writes the key screenshot set, a montage and a report.
 *
 * Checks per render: no console or page errors, no horizontal overflow, no broken images, no text
 * smaller than 12 px (metadata) and no body text smaller than 14 px, and no en or em dash, banned
 * phrase or confidential term in the visible text.
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { preview } from 'vite'
import { checkText } from '../portfolio-data/lib/text-rules.ts'
import * as conf from '../portfolio-data/lib/confidential.ts'

const root = path.resolve(import.meta.dirname, '..')
if (!fs.existsSync(path.join(root, 'dist/index.html'))) {
  console.error('[qa:visual] dist/ missing: run npm run build first')
  process.exit(1)
}

const PORT = 4181
const server = await preview({ configFile: path.join(root, 'portfolio-app/vite.config.ts'), preview: { port: PORT, strictPort: true, open: false }, logLevel: 'warn' })
const BASE = `http://localhost:${PORT}/CV/`
const VIEWPORTS = [
  [1920, 1080],
  [1440, 900],
  [1366, 768],
  [1024, 768],
  [768, 1024],
  [390, 844],
]
const SCENES = ['thesis', 'career', 'fabric', 'work-fabric', 'process-network', 'blueprint', 'controlled-ai', 'economics', 'execution', 'discipline', 'selected-evidence', 'role-fit']
const CASES = JSON.parse(fs.readFileSync(path.join(root, 'portfolio-data/case-studies.json'), 'utf8')).cases.map((c) => c.slug)
const ROUTES = [
  { id: 'home', path: '' },
  { id: 'home-lens-risk', path: '?lens=risk' },
  { id: 'evidence', path: 'evidence/' },
  { id: 'evidence-graph', path: 'evidence/?view=graph' },
  { id: 'capabilities', path: 'capabilities/' },
  ...CASES.map((c) => ({ id: `case-${c}`, path: `case/${c}/` })),
  { id: 'not-found', path: 'case/missing/' },
]

const fullDir = path.join(root, 'qa/screenshots/full')
const keyDir = path.join(root, 'qa/screenshots/key')
fs.rmSync(fullDir, { recursive: true, force: true })
fs.rmSync(keyDir, { recursive: true, force: true })
fs.mkdirSync(fullDir, { recursive: true })
fs.mkdirSync(keyDir, { recursive: true })

/** Runs inside the page: layout and typography checks on everything visible. */
function inspect() {
  const vw = window.innerWidth
  const out = { overflowX: document.documentElement.scrollWidth - vw, small: [], tiny: [], brokenImages: 0 }
  for (const img of document.images) if (img.complete && img.naturalWidth === 0) out.brokenImages++
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (!node.textContent.trim()) continue
    const el = node.parentElement
    if (!el || el.closest('.sr-only, [aria-hidden="true"], script, style, .static-fallback')) continue
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    const cs = getComputedStyle(el)
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue
    const size = parseFloat(cs.fontSize)
    const isMeta = /mono|JetBrains/i.test(cs.fontFamily) || el.closest('svg')
    if (size < 11.5) out.tiny.push(`${size}px ${el.tagName.toLowerCase()}.${el.className} "${node.textContent.trim().slice(0, 30)}"`)
    else if (size < 13.5 && !isMeta) out.small.push(`${size}px ${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)} "${node.textContent.trim().slice(0, 30)}"`)
  }
  out.tiny = [...new Set(out.tiny)].slice(0, 8)
  out.small = [...new Set(out.small)].slice(0, 8)
  return out
}

async function mountAll(page) {
  for (const id of SCENES) {
    await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id)
    await page.waitForTimeout(90)
  }
  await page.waitForFunction(() => !document.querySelector('.scene--placeholder'), null, { timeout: 15000 }).catch(() => {})
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(150)
}

const browser = await chromium.launch()
const results = []
const hashes = conf.loadHashes()
for (const [w, h] of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  for (const route of ROUTES) {
    const page = await ctx.newPage()
    const errors = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await page.goto(BASE + route.path, { waitUntil: 'networkidle' })
    if (route.id.startsWith('home')) await mountAll(page)
    if (route.id === 'case-nfr-work-fabric') await page.getByTestId('nfr-blueprint').scrollIntoViewIfNeeded()
    await page.evaluate(() => document.fonts.ready)
    const checks = await page.evaluate(inspect)
    const text = await page.locator('body').innerText()
    const writing = checkText(route.id, text).map((v) => `${v.rule}: ${v.excerpt}`)
    const confidential = conf.scanConfidential(text, hashes).map((x) => x.hash.slice(0, 8))
    const file = `${route.id}-${w}x${h}.png`
    await page.screenshot({ path: path.join(fullDir, file), fullPage: true })
    const problems = [
      ...errors.map((e) => `console: ${e}`),
      ...(checks.overflowX > 1 ? [`horizontal overflow ${checks.overflowX}px`] : []),
      ...(checks.brokenImages ? [`${checks.brokenImages} broken image(s)`] : []),
      ...checks.tiny.map((t) => `text below 12 px: ${t}`),
      ...writing,
      ...confidential.map((c) => `confidential term ${c}`),
    ]
    results.push({ route: route.id, viewport: `${w}x${h}`, problems, smallBodyText: checks.small })
    await page.close()
  }
  await ctx.close()
}

// Key screenshot set (brief section 25): viewport captures of named views.
const KEY = [
  ['01-hero', '', 'thesis', 1440, 900],
  ['02-career-arc', '', 'career', 1440, 900],
  ['03-capability-graph', '', 'fabric', 1440, 900],
  ['04-nfr-work-fabric', '', 'work-fabric', 1440, 900],
  ['05-process-network', '', 'process-network', 1440, 900],
  ['06-controlled-ai-cutaway', '', 'controlled-ai', 1440, 900],
  ['07-economics', '', 'economics', 1440, 900],
  ['08-role-views', 'case/nfr-work-fabric/', 'bp-roles', 1440, 900],
  ['09-security-governance', 'case/nfr-work-fabric/', 'bp-security', 1440, 900],
  ['10-case-study', 'case/airlock/', '', 1440, 900],
  ['11-explorer', 'evidence/', '', 1440, 900],
  ['12-capabilities', 'capabilities/', '', 1440, 900],
  ['13-mobile-hero', '', '', 390, 844],
  ['14-mobile-case', 'case/nfr-work-fabric/', '', 390, 844],
  ['15-hero-1920', '', '', 1920, 1080],
  ['16-lens-risk', '?lens=risk', '', 1440, 900],
]
const keyFiles = []
for (const motion of ['no-preference', 'reduce']) {
  const set = motion === 'reduce' ? [['17-reduced-motion-hero', '', '', 1440, 900]] : KEY
  for (const [name, p, anchor, w, h] of set) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, reducedMotion: motion })
    const page = await ctx.newPage()
    await page.goto(BASE + p, { waitUntil: 'networkidle' })
    if (p === '' || p.startsWith('?')) await mountAll(page)
    if (anchor) {
      await page.evaluate((a) => document.getElementById(a)?.scrollIntoView({ block: 'start' }), anchor)
      await page.waitForTimeout(motion === 'reduce' ? 200 : 4200)
    } else await page.waitForTimeout(motion === 'reduce' ? 200 : 4200)
    const file = path.join(keyDir, `${name}.png`)
    await page.screenshot({ path: file })
    keyFiles.push(file)
    await ctx.close()
  }
}
await browser.close()
await new Promise((r) => server.httpServer.close(() => r()))

// Montage of the key set.
const thumbW = 480
const thumbH = 300
const thumbs = await Promise.all(keyFiles.map((f) => sharp(f).resize({ width: thumbW, height: thumbH, fit: 'contain', background: '#f5f4ef' }).png().toBuffer({ resolveWithObject: true })))
const cols = 4
const cellH = Math.max(...thumbs.map((t) => t.info.height)) + 36
const rows = Math.ceil(thumbs.length / cols)
const composites = []
for (const [i, t] of thumbs.entries()) {
  const x = (i % cols) * (thumbW + 16) + 16
  const y = Math.floor(i / cols) * (cellH + 16) + 16
  composites.push({ input: t.data, left: x, top: y + 28 })
  const label = path.basename(keyFiles[i], '.png')
  composites.push({ input: Buffer.from(`<svg width="${thumbW}" height="24"><text x="0" y="17" font-family="Segoe UI, Arial" font-size="15" fill="#121621">${label}</text></svg>`), left: x, top: y })
}
await sharp({ create: { width: cols * (thumbW + 16) + 16, height: rows * (cellH + 16) + 16, channels: 3, background: '#f5f4ef' } })
  .composite(composites)
  .png()
  .toFile(path.join(root, 'qa/screenshots/montage.png'))

const failing = results.filter((r) => r.problems.length)
const smallBody = results.filter((r) => r.smallBodyText.length)
fs.writeFileSync(path.join(root, 'qa/visual-report.json'), JSON.stringify({ generatedAt: new Date().toISOString().slice(0, 10), renders: results.length, failing: failing.length, results }, null, 2) + '\n')
fs.writeFileSync(
  path.join(root, 'qa/visual-report.md'),
  `# Visual QA report

Generated by \`npm run qa:visual\` against the production build (${new Date().toISOString().slice(0, 10)}). ${ROUTES.length} routes x ${VIEWPORTS.length} viewports = ${results.length} full-page renders with reduced motion, plus ${keyFiles.length} key screenshots in \`qa/screenshots/key/\` and \`qa/screenshots/montage.png\`.

Checks per render: no console or page errors, no horizontal overflow, no broken images, no text below 12 px, no en or em dash, banned phrase or confidential term in the visible text.

| Result | Count |
|---|---|
| Renders | ${results.length} |
| Renders with a blocking problem | ${failing.length} |
| Renders with body text between 12 and 14 px (review list, not blocking) | ${smallBody.length} |

${failing.length ? `## Problems\n\n${failing.map((r) => `- ${r.route} ${r.viewport}: ${r.problems.join('; ')}`).join('\n')}\n` : 'No blocking problems.\n'}
${smallBody.length ? `## Small body text to review\n\n${smallBody.slice(0, 30).map((r) => `- ${r.route} ${r.viewport}: ${r.smallBodyText.slice(0, 3).join('; ')}`).join('\n')}\n` : ''}
Visual inspection of the key set is recorded in qa/qa-report.md. Automated checks do not replace it.
`,
)
console.log(`[qa:visual] ${results.length} renders, ${failing.length} with problems, ${keyFiles.length} key screenshots, montage written`)
if (failing.length) {
  for (const r of failing.slice(0, 20)) console.error(`  - ${r.route} ${r.viewport}: ${r.problems.join('; ')}`)
  process.exit(1)
}
