#!/usr/bin/env node
/**
 * npm run social:card: renders assets/og-portfolio.png (1200 x 630), the social preview for the
 * site and the repository. Fonts are inlined from the self-hosted Fontsource files.
 */
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'

const root = path.resolve(import.meta.dirname, '..')
const font = (pkg, file) => fs.readFileSync(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64')
const profile = JSON.parse(fs.readFileSync(path.join(root, 'portfolio-data/profile.json'), 'utf8'))
const stages = ['Problem', 'Economics', 'Workflow', 'Authority', 'Evidence', 'Adoption']

const html = `<!doctype html><html><head><style>
@font-face{font-family:SG;font-weight:600;src:url(data:font/woff2;base64,${font('space-grotesk', 'space-grotesk-latin-600-normal.woff2')})}
@font-face{font-family:IN;font-weight:400;src:url(data:font/woff2;base64,${font('inter', 'inter-latin-400-normal.woff2')})}
@font-face{font-family:JB;font-weight:500;src:url(data:font/woff2;base64,${font('jetbrains-mono', 'jetbrains-mono-latin-500-normal.woff2')})}
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#f5f4ef;color:#121621;font-family:IN;position:relative;overflow:hidden}
.grid{position:absolute;inset:0;background-image:linear-gradient(#e6e5de 1px,transparent 1px),linear-gradient(90deg,#e6e5de 1px,transparent 1px);background-size:40px 40px;opacity:.6}
.wrap{position:absolute;inset:64px 72px}
.k{font-family:JB;font-size:22px;letter-spacing:.04em;text-transform:uppercase;color:#4a3cc9}
h1{font-family:SG;font-size:64px;line-height:1.04;margin-top:18px;letter-spacing:-.02em;max-width:900px}
p{font-size:26px;line-height:1.4;margin-top:22px;color:#2b3140;max-width:900px}
.line{position:absolute;left:72px;right:72px;bottom:72px;display:flex;justify-content:space-between;align-items:center}
.line:before{content:'';position:absolute;left:10px;right:10px;top:9px;height:3px;background:#121621}
.s{position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;font-family:JB;font-size:18px}
.s i{width:20px;height:20px;border-radius:50%;background:#6557e8;display:block}
.s:last-child i{background:#1e8e5a;border-radius:5px}
</style></head><body><div class="grid"></div><div class="wrap">
<div class="k">Thomas Zijlstra, CFA</div>
<h1>${profile.title}</h1>
<p>${profile.headline}</p></div>
<div class="line">${stages.map((s) => `<div class="s"><i></i>${s}</div>`).join('')}</div>
</body></html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'load' })
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: path.join(root, 'assets/og-portfolio.png') })
await browser.close()
console.log('[social:card] wrote assets/og-portfolio.png')
