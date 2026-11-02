import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { DASH_PATTERN, checkText } from '../portfolio-data/lib/text-rules'
import { hashTerm, loadHashes, normalise, scanConfidential } from '../portfolio-data/lib/confidential'
import { CV_FILES, routeMeta } from '../portfolio-app/plugins/site-assembly'
import { loadPortfolio } from '../portfolio-data/build'

const root = path.resolve(import.meta.dirname, '..')
const sha = (f: string) => createHash('sha256').update(fs.readFileSync(path.join(root, f))).digest('hex')
const baseline = Object.fromEntries(
  fs
    .readFileSync(path.join(root, 'qa/baseline/legacy-hashes.txt'), 'utf8')
    .trim()
    .split(/\r?\n/)
    .map((l) => {
      const [h, f] = l.split(/\s+\*?/)
      return [f.replace(/^\*/, ''), h]
    }),
)

const recorded = JSON.parse(fs.readFileSync(path.join(root, 'qa/baseline/cv-hashes.json'), 'utf8'))

describe('the web CV and PDF are not redesigned (brief section 2)', () => {
  it('keeps the pre-rebuild baseline on record', () => {
    expect(baseline['cv.html']).toMatch(/^[0-9a-f]{64}$/)
    expect(baseline['assets/Thomas_Zijlstra_CV.pdf']).toMatch(/^[0-9a-f]{64}$/)
  })

  it('matches the recorded CV outputs (after an intentional CV change run npm run qa:rebaseline-cv)', () => {
    expect(sha('cv.html')).toBe(recorded['cv.html'])
    expect(sha('assets/Thomas_Zijlstra_CV.pdf')).toBe(recorded['assets/Thomas_Zijlstra_CV.pdf'])
  })

  it('changes the CV stylesheet and script only by the recorded target-mode removal', () => {
    expect(sha('styles.css')).toBe(recorded['styles.css'])
    expect(sha('script.js')).toBe(recorded['script.js'])
    for (const f of CV_FILES) expect(fs.existsSync(path.join(root, f)), f).toBe(true)
  })

  it('no longer carries the public target mode in the CV script, styles or content', () => {
    const hashes = loadHashes()
    for (const f of ['script.js', 'styles.css', 'content.json']) expect(scanConfidential(fs.readFileSync(path.join(root, f), 'utf8'), hashes), f).toEqual([])
    expect(fs.readFileSync(path.join(root, 'script.js'), 'utf8')).not.toMatch(/[?&]target=/)
  })
})

describe('writing and confidentiality rules', () => {
  it('detects both dash characters, built from code points', () => {
    expect(DASH_PATTERN.test(`a${String.fromCharCode(0x2013)}b`)).toBe(true)
    expect(DASH_PATTERN.test(`a${String.fromCharCode(0x2014)}b`)).toBe(true)
    expect(DASH_PATTERN.test('a - b')).toBe(false)
  })

  it('flags inflated and unsupported language', () => {
    expect(checkText('x', 'An AI-powered, cutting-edge platform').length).toBe(2)
    expect(checkText('x', 'production-ready agents')[0].rule).toMatch(/production/)
    expect(checkText('x', 'A governed workflow with human approval')).toEqual([])
  })

  it('matches confidential terms by whole-word windows, never inside other words', () => {
    const hashes = new Set([hashTerm('Acme Bank')])
    expect(scanConfidential('Work for the ACME-bank team', hashes)).toHaveLength(1)
    expect(scanConfidential('Acmebanking and subscription', hashes)).toHaveLength(0)
    expect(normalise('  Zürich  Re! ')).toBe('zurich re')
  })
})

describe('site assembly', () => {
  it('prerenders one entry per case plus the explorer routes', () => {
    const site = loadPortfolio().result!.site
    const paths = routeMeta(site).map((m) => m.path)
    expect(paths).toContain('')
    expect(paths).toContain('evidence/')
    expect(paths).toContain('capabilities/')
    for (const c of site.cases) expect(paths).toContain(`case/${c.slug}/`)
    for (const m of routeMeta(site)) expect(DASH_PATTERN.test(m.title + m.description)).toBe(false)
  })
})
