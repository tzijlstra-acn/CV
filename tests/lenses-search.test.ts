import { describe, expect, it, vi } from 'vitest'
import { loadPortfolio } from '../portfolio-data/build'

// The app modules import the virtual data module; give them the same validated projection.
const site = loadPortfolio().result!.site
vi.mock('virtual:portfolio-data', () => ({ default: site }))

const { orderEvidence, orderCases, getLens } = await import('../portfolio-app/src/data/site')
const { parseQuery, searchEvidence } = await import('../portfolio-app/src/data/search')
const none = { types: [], depths: [], groups: [], roles: [], domains: [] }

describe('role lenses change emphasis, never facts (brief section 11)', () => {
  it('reorders evidence without adding, removing or editing any item', () => {
    for (const l of site.lenses) {
      const ordered = orderEvidence(site.evidence, getLens(l.id))
      expect(ordered.map((e) => e.id).sort()).toEqual(site.evidence.map((e) => e.id).sort())
      expect(ordered.slice(0, l.evidenceFirst.length).map((e) => e.id)).toEqual(l.evidenceFirst)
      for (const e of ordered) expect(e).toBe(site.evidence.find((x) => x.id === e.id))
    }
  })

  it('opens each lens with its start case', () => {
    for (const l of site.lenses) expect(orderCases(site.cases, getLens(l.id))[0].slug).toBe(l.startCase)
  })

  it('ignores unknown lens values', () => {
    expect(getLens('moon')).toBeUndefined()
    expect(getLens(undefined)).toBeUndefined()
  })
})

describe('local plain-language search (brief section 16.3)', () => {
  it('Show evidence of customer adoption', () => {
    const { items, parsed } = searchEvidence('Show evidence of customer adoption', none)
    expect(parsed.understood).toContain('adoption and change')
    expect(items.length).toBeGreaterThan(0)
    for (const e of items) expect(e.groups.some((g) => ['customer-market', 'transformation-programme'].includes(g))).toBe(true)
  })

  it('Show risk and AI work', () => {
    const ids = searchEvidence('Show risk and AI work', none).items.map((e) => e.id)
    expect(ids).toContain('pb-dora-control-line')
    expect(ids).toContain('acn-reg-change-ai')
  })

  it('Show technical architecture', () => {
    expect(searchEvidence('Show technical architecture', none).items.map((e) => e.id)).toContain('pb-nfr-agent-platform')
  })

  it('Show commercial and GTM work', () => {
    expect(searchEvidence('Show commercial and GTM work', none).items.map((e) => e.id)).toContain('acn-nfr-practice')
  })

  it('Show what Thomas personally built', () => {
    const { items } = searchEvidence('Show what Thomas personally built', none)
    expect(items.length).toBeGreaterThan(0)
    for (const e of items) expect(e.depth).toBe('built-verified')
    expect(items.map((e) => e.id)).toContain('pb-ai-economics')
  })

  it('Show professional delivery only', () => {
    const { items } = searchEvidence('Show professional delivery only', none)
    expect(items.length).toBeGreaterThan(5)
    for (const e of items) expect(e.depth).toBe('professional-delivery')
  })

  it('matches free text against titles and contributions', () => {
    expect(searchEvidence('FINMA', none).items.map((e) => e.id)).toEqual(['acn-finma-reporting'])
    expect(parseQuery('Databricks').understood).toContain('data and platform')
  })

  it('lets explicit filters win over the parsed intent', () => {
    const { items } = searchEvidence('built', { ...none, depths: ['designed-specified'] })
    for (const e of items) expect(e.depth).toBe('designed-specified')
  })
})
