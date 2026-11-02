import { describe, expect, it } from 'vitest'
import { loadPortfolio } from '../portfolio-data/build'
import { checkClaims } from '../portfolio-data/claims'
import { DASH_PATTERN, walkStrings } from '../portfolio-data/lib/text-rules'
import { loadHashes, scanConfidential } from '../portfolio-data/lib/confidential'
import { DEPTHS, ROLE_FAMILIES } from '../portfolio-data/schema'

const { result, issues } = loadPortfolio()
const site = result!.site

describe('portfolio data (brief sections 8, 15, 21)', () => {
  it('validates with no issues', () => {
    expect(issues).toEqual([])
    expect(result).toBeDefined()
  })

  it('has a typed evidence model with a depth label on every item', () => {
    expect(site.evidence.length).toBeGreaterThanOrEqual(15)
    for (const e of site.evidence) {
      expect(DEPTHS, e.id).toContain(e.depth)
      expect(e.contribution.length, e.id).toBeGreaterThan(10)
      expect(e.scopeBoundary.length, e.id).toBeGreaterThan(10)
    }
  })

  it('keeps professional, public-build and private-blueprint evidence distinguishable', () => {
    const types = new Set(site.evidence.map((e) => e.evidenceType))
    for (const t of ['professional', 'public-build', 'private-blueprint']) expect(types).toContain(t)
    for (const e of site.evidence.filter((x) => x.evidenceType === 'private-blueprint')) {
      expect(e.confidentiality).toBe('private-source')
      expect(e.links).toEqual([])
    }
  })

  it('shows a capability only when evidence links to it', () => {
    for (const g of site.groups)
      for (const c of g.capabilities) {
        expect(c.evidence.length, c.id).toBeGreaterThan(0)
        for (const ref of c.evidence) expect(site.evidence.some((e) => e.id === ref.id && e.capabilities.includes(c.id))).toBe(true)
      }
  })

  it('names a framework only inside a pattern that is linked to evidence with a depth label', () => {
    for (const p of site.patterns) {
      expect(p.uses.length, p.id).toBeGreaterThan(0)
      for (const u of p.uses) expect(DEPTHS).toContain(u.depth)
    }
  })

  it('never ships blocked evidence', () => {
    const json = JSON.stringify(site)
    for (const id of result!.withheld) expect(json).not.toContain(`"${id}"`)
  })

  it('publishes repository links only for repositories Thomas has approved', () => {
    const approved = result!.publication.repositories.filter((r) => r.decision === 'approved').map((r) => r.url)
    const urls = [...JSON.stringify(site).matchAll(/https:\/\/github\.com\/tzijlstra-acn\/[A-Za-z0-9._-]+/g)].map((m) => m[0])
    for (const u of urls) expect(approved.some((a) => u === a || u.startsWith(a)), u).toBe(true)
  })

  it('contains no private locators or local paths', () => {
    for (const [where, text] of walkStrings(site)) {
      // Drive letters at the start of a value or after a space; URLs such as https:// are fine.
      expect(/(^|\s)[A-Za-z]:[\\/]|\/Users\/|Code Projects|AppData/.test(text), where).toBe(false)
    }
  })

  it('contains no en or em dashes and no confidential terms', () => {
    const hashes = loadHashes()
    expect(hashes.size).toBeGreaterThan(0)
    for (const [where, text] of walkStrings(site)) {
      expect(DASH_PATTERN.test(text), where).toBe(false)
      expect(scanConfidential(text, hashes), where).toEqual([])
    }
  })

  it('has a claim register that matches the site word for word', () => {
    expect(checkClaims(result!)).toEqual([])
  })

  it('has no empty case-study sections and states limitations and a boundary for every case', () => {
    expect(site.cases.length).toBeGreaterThanOrEqual(6)
    for (const c of site.cases) {
      for (const k of ['problem', 'whyItMattered', 'role', 'scopeBoundary'] as const) expect(c[k].trim(), `${c.slug}.${k}`).not.toBe('')
      for (const k of ['constraints', 'contributions', 'decisions', 'architecture', 'valueModel', 'learned', 'limitations', 'evidence'] as const) expect(c[k].length, `${c.slug}.${k}`).toBeGreaterThan(0)
    }
  })

  it('features the five primary cases in the order the brief recommends, plus the professional case', () => {
    expect(site.cases.map((c) => c.slug)).toEqual(['nfr-work-fabric', 'ai-economics', 'dora-control-line', 'nfr-agent-platform', 'airlock', 'data-reporting-transformation'])
  })

  it('has twelve guided scenes and seven role lenses, one per role family', () => {
    expect(site.story).toHaveLength(12)
    expect(site.lenses.map((l) => l.id).sort()).toEqual([...ROLE_FAMILIES].sort())
  })

  it('derives the NFR process network from source: eight processes, the source hubs, resolvable links', () => {
    const net = site.network
    expect(net.processes).toHaveLength(8)
    expect(net.processes.filter((p) => p.hub).map((p) => p.id).sort()).toEqual(['orm', 'rcsa'])
    const ids = new Set(net.processes.map((p) => p.id))
    for (const l of net.links) expect(ids.has(l.from) && ids.has(l.to), l.id).toBe(true)
    expect(net.processes.reduce((n, p) => n + p.steps, 0)).toBe(74)
  })

  it('runs the synthetic cross-process event only along source links', () => {
    const steps = site.blueprint.event.steps
    for (const s of steps.slice(1)) expect(site.network.links.some((l) => l.id === s.link)).toBe(true)
  })

  it('takes employer, role and dates from content.json rather than retyping them', () => {
    const acc = site.experience.find((e) => e.id === 'accenture')!
    expect(acc.start).toBe('Jun 2020')
    const stage = site.career.find((s) => s.id === 'capital-markets')!
    expect(stage.experience[0].company).toBe('Societe Generale')
  })

  it('does not name the reference process dataset in the shipped data', () => {
    expect(JSON.stringify(site)).not.toMatch(/NFRProcesses/i)
  })
})
