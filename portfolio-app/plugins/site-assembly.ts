/**
 * Site assembly (brief sections 2 and 27): one static artifact for GitHub Pages.
 *
 * - Development: serves the existing web CV, its stylesheet and script, and /assets (PDF,
 *   portrait, flags) from the repository root under the same /CV/ base as production.
 * - Build: copies those files unchanged into dist/, writes one prerendered HTML entry per route
 *   (route-specific title, description, canonical URL and a no-JavaScript fallback), a 404 page,
 *   robots.txt, sitemap.xml and .nojekyll.
 *
 * The CV pipeline (scripts/build.mjs, generate-cv-pdf.mjs) is untouched: cv.html and the PDF are
 * copied byte for byte, so /CV/cv.html and /CV/assets/Thomas_Zijlstra_CV.pdf keep working.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { HtmlTagDescriptor, Plugin } from 'vite'
import { buildSiteData, ROOT } from '../../portfolio-data/build'
import type { SiteData } from '../../portfolio-data/site-types'

export const BASE = '/CV/'
export const CANONICAL = 'https://tzijlstra-acn.github.io/CV/'
/** Files the web CV needs, copied from the repository root without modification. */
export const CV_FILES = ['cv.html', 'styles.css', 'script.js']
const ASSET_DIR = 'assets'
/** Source files that stay in the repository but are not part of the site (the colour photo master). */
const ASSET_EXCLUDE = new Set(['profile.png'])
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.pdf': 'application/pdf',
  '.json': 'application/json',
}

export interface RouteMeta {
  path: string
  title: string
  description: string
  heading: string
  summary: string
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function routeMeta(site: SiteData): RouteMeta[] {
  const name = site.person.name
  const home: RouteMeta = {
    path: '',
    title: `${name} | ${site.profile.title}`,
    description: 'Evidence-driven portfolio spanning Financial Services, enterprise AI strategy, governed workflows, value engineering, risk transformation and commercialisation.',
    heading: name,
    summary: site.profile.headline,
  }
  return [
    home,
    { path: 'evidence/', title: `Evidence explorer | ${name}`, description: 'Search and filter every piece of evidence by role family, capability, domain and evidence depth.', heading: 'Evidence explorer', summary: `${site.stats.evidence} evidence items with depth labels and scope boundaries.` },
    { path: 'capabilities/', title: `Capabilities | ${name}`, description: 'Capability taxonomy where every capability links to evidence and a depth label.', heading: 'Capabilities', summary: `${site.stats.capabilities} capabilities in ${site.groups.length} groups, each linked to evidence.` },
    ...site.cases.map((c) => ({ path: `case/${c.slug}/`, title: `${c.title} | ${name}`, description: c.subtitle, heading: c.title, summary: c.problem })),
  ]
}

function headFor(meta: RouteMeta, site: SiteData, noindex = false): string {
  const url = CANONICAL + meta.path
  const image = `${CANONICAL}assets/og-portfolio.png`
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.person.name,
    jobTitle: site.profile.title,
    url: CANONICAL,
    sameAs: [site.person.github],
    knowsLanguage: site.person.languages.map((l) => l.name),
    address: { '@type': 'PostalAddress', addressLocality: site.person.location },
  }
  return [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}">`,
    `<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow'}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta property="og:type" content="website">`,
    `<meta property="og:title" content="${esc(meta.title)}">`,
    `<meta property="og:description" content="${esc(meta.description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:image" content="${esc(image)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(meta.title)}">`,
    `<meta name="twitter:description" content="${esc(meta.description)}">`,
    `<meta name="twitter:image" content="${esc(image)}">`,
    meta.path === '' ? `<script type="application/ld+json">${JSON.stringify(person).replace(/</g, '\\u003c')}</script>` : '',
  ]
    .filter(Boolean)
    .join('\n    ')
}

/** Static content for crawlers and readers without JavaScript; React replaces it on load. */
function fallbackFor(meta: RouteMeta, site: SiteData): string {
  const cases = site.cases.map((c) => `<li><a href="${BASE}case/${c.slug}/">${esc(c.title)}</a>: ${esc(c.subtitle)}</li>`).join('')
  return `<div class="static-fallback">
      <p>${esc(site.person.name)}, ${esc(site.profile.title)}</p>
      <h1>${esc(meta.heading)}</h1>
      <p>${esc(meta.summary)}</p>
      <ul>${cases}</ul>
      <p><a href="${BASE}cv.html">Web CV</a> | <a href="${BASE}assets/Thomas_Zijlstra_CV.pdf">Download CV (PDF)</a> | <a href="${BASE}evidence/">Evidence explorer</a></p>
    </div>`
}

const HEAD_START = '<!--route-head-->'
const HEAD_END = '<!--/route-head-->'
const BODY_START = '<!--route-fallback-->'
const BODY_END = '<!--/route-fallback-->'

function swap(html: string, start: string, end: string, content: string): string {
  const a = html.indexOf(start)
  const b = html.indexOf(end)
  if (a < 0 || b < 0) throw new Error(`site-assembly: marker ${start} missing from index.html`)
  return html.slice(0, a + start.length) + '\n    ' + content + '\n    ' + html.slice(b)
}

function copyDir(from: string, to: string) {
  fs.mkdirSync(to, { recursive: true })
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, entry.name)
    const dst = path.join(to, entry.name)
    if (entry.isDirectory()) copyDir(src, dst)
    else if (!ASSET_EXCLUDE.has(entry.name)) fs.copyFileSync(src, dst)
  }
}

export function siteAssembly(): Plugin {
  let outDir = ''
  return {
    name: 'site-assembly',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0]
        if (!url.startsWith(BASE)) return next()
        const rel = decodeURIComponent(url.slice(BASE.length))
        const allowed = CV_FILES.includes(rel) || rel.startsWith(`${ASSET_DIR}/`)
        if (!allowed) return next()
        const file = path.resolve(ROOT, rel)
        if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return next()
        res.setHeader('Content-Type', MIME[path.extname(file)] ?? 'application/octet-stream')
        res.end(fs.readFileSync(file))
      })
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const site = buildSiteData()
        const home = routeMeta(site)[0]
        let out = swap(html, HEAD_START, HEAD_END, headFor(home, site))
        out = swap(out, BODY_START, BODY_END, fallbackFor(home, site))
        if (!ctx.bundle) return out
        // Production only: strict same-origin CSP and preloads for the two essential fonts.
        const fonts = Object.keys(ctx.bundle).filter((f) => /(inter-latin-400-normal|space-grotesk-latin-600-normal)-[^/]+\.woff2$/.test(f))
        const tags: HtmlTagDescriptor[] = [
          {
            tag: 'meta',
            attrs: {
              'http-equiv': 'Content-Security-Policy',
              content: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'none'",
            },
            injectTo: 'head-prepend',
          },
          ...fonts.map<HtmlTagDescriptor>((f) => ({ tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', href: `${BASE}${f}`, crossorigin: '' }, injectTo: 'head' })),
        ]
        return { html: out, tags }
      },
    },
    closeBundle() {
      if (!outDir || !fs.existsSync(path.join(outDir, 'index.html'))) return
      const site = buildSiteData()
      // 1. The web CV and its assets, unchanged.
      for (const f of CV_FILES) fs.copyFileSync(path.join(ROOT, f), path.join(outDir, f))
      copyDir(path.join(ROOT, ASSET_DIR), path.join(outDir, ASSET_DIR))
      // 2. One prerendered entry per route.
      const template = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8')
      const metas = routeMeta(site)
      for (const meta of metas.slice(1)) {
        let html = swap(template, HEAD_START, HEAD_END, headFor(meta, site))
        html = swap(html, BODY_START, BODY_END, fallbackFor(meta, site))
        fs.mkdirSync(path.join(outDir, meta.path), { recursive: true })
        fs.writeFileSync(path.join(outDir, meta.path, 'index.html'), html)
      }
      // 3. Unknown paths: the app renders its not-found view.
      const notFound: RouteMeta = { path: '404.html', title: `Page not found | ${site.person.name}`, description: 'This page does not exist.', heading: 'Page not found', summary: 'The page you are looking for does not exist or has moved.' }
      let html404 = swap(template, HEAD_START, HEAD_END, headFor(notFound, site, true))
      html404 = swap(html404, BODY_START, BODY_END, fallbackFor(notFound, site))
      fs.writeFileSync(path.join(outDir, '404.html'), html404)
      // 4. Static-host housekeeping.
      fs.writeFileSync(path.join(outDir, '.nojekyll'), '')
      fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${CANONICAL}sitemap.xml\n`)
      const urls = [...metas.map((m) => CANONICAL + m.path), `${CANONICAL}cv.html`]
      fs.writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${site.build.date}</lastmod></url>`).join('\n')}\n</urlset>\n`,
      )
    },
  }
}
