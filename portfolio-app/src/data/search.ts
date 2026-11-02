/**
 * Local structured search (brief section 16.3). No runtime model: a plain-language query is
 * mapped to intents (depth, evidence type, capability group, role family, domain) through a
 * small phrase dictionary, and any remaining words are matched against the evidence text.
 */
import type { Depth, Domain, EvidenceItem, EvidenceType, RoleFamily } from '@data/site-types'
import { getCapability, site } from './site'

export interface SearchFilters {
  types: EvidenceType[]
  depths: Depth[]
  groups: string[]
  roles: RoleFamily[]
  domains: Domain[]
}

export interface ParsedQuery extends SearchFilters {
  terms: string[]
  /** Human-readable interpretation, shown so the visitor can see how the query was read. */
  understood: string[]
}

interface Intent {
  phrases: string[]
  label: string
  apply: (f: SearchFilters) => void
}

const INTENTS: Intent[] = [
  { phrases: ['personally built', 'built myself', 'thomas built', 'what thomas built', 'built', 'prototype', 'prototypes', 'public build', 'public builds'], label: 'built and verified', apply: (f) => f.depths.push('built-verified') },
  { phrases: ['professional delivery only', 'professional delivery', 'client work', 'professional', 'delivered'], label: 'professional delivery', apply: (f) => f.depths.push('professional-delivery') },
  { phrases: ['designed', 'blueprint', 'specified', 'architecture blueprint'], label: 'designed and specified', apply: (f) => f.depths.push('designed-specified') },
  { phrases: ['customer adoption', 'adoption', 'value realisation', 'value realization', 'customer success'], label: 'adoption and change', apply: (f) => f.groups.push('customer-market', 'transformation-programme') },
  { phrases: ['risk and ai', 'risk', 'controls', 'resilience', 'compliance', 'governance', 'regulatory'], label: 'risk and control', apply: (f) => f.groups.push('risk-control') },
  { phrases: ['technical architecture', 'technical depth', 'architecture', 'technical', 'agentic', 'agents', 'workflow architecture'], label: 'AI solution design', apply: (f) => f.groups.push('ai-solution-design') },
  { phrases: ['commercial and gtm', 'commercial', 'gtm', 'go-to-market', 'go to market', 'sales', 'presales', 'partnerships', 'partner'], label: 'customer and market execution', apply: (f) => f.groups.push('customer-market') },
  { phrases: ['economics', 'business case', 'roi', 'value engineering', 'investment', 'finance', 'financial'], label: 'strategy and value', apply: (f) => f.groups.push('strategy-value') },
  { phrases: ['programme', 'program', 'transformation', 'roadmap', 'operating model'], label: 'transformation', apply: (f) => f.groups.push('transformation-programme') },
  { phrases: ['data', 'databricks', 'reporting', 'platform'], label: 'data and platform', apply: (f) => f.groups.push('data-platform') },
  { phrases: ['engineering', 'testing', 'accessibility', 'quality', 'react', 'typescript'], label: 'engineering and quality', apply: (f) => f.groups.push('engineering-quality') },
  { phrases: ['product', 'experience', 'design', 'narrative'], label: 'product and experience', apply: (f) => f.groups.push('product-experience') },
  { phrases: ['insurance', 'insurer', 'reinsurer'], label: 'insurance', apply: (f) => f.domains.push('insurance') },
  { phrases: ['banking', 'bank', 'capital markets', 'dcm'], label: 'banking and capital markets', apply: (f) => f.domains.push('banking', 'capital-markets') },
]

const STOP = new Set(['show', 'me', 'evidence', 'of', 'and', 'the', 'a', 'an', 'what', 'where', 'did', 'has', 'only', 'work', 'for', 'in', 'on', 'with', 'thomas', 'his', 'my', 'all', 'any'])

export function parseQuery(raw: string): ParsedQuery {
  const f: ParsedQuery = { types: [], depths: [], groups: [], roles: [], domains: [], terms: [], understood: [] }
  let text = ` ${raw.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').replace(/\s+/g, ' ')} `
  for (const intent of INTENTS) {
    for (const phrase of [...intent.phrases].sort((a, b) => b.length - a.length)) {
      const needle = ` ${phrase} `
      if (text.includes(needle)) {
        intent.apply(f)
        f.understood.push(intent.label)
        text = text.replace(needle, ' ')
        break
      }
    }
  }
  f.terms = text
    .split(' ')
    .filter((w) => w.length > 1 && !STOP.has(w))
  for (const k of ['types', 'depths', 'groups', 'roles', 'domains'] as const) (f[k] as string[]) = [...new Set(f[k] as string[])]
  return f
}

const haystack = new Map(
  site.evidence.map((e) => [
    e.id,
    [e.title, e.summary, e.contribution, e.organisation, e.scopeBoundary, ...e.capabilities.map((c) => getCapability(c)?.label ?? c)].join(' ').toLowerCase(),
  ]),
)

export function matches(e: EvidenceItem, f: SearchFilters & { terms?: string[] }): boolean {
  if (f.types.length && !f.types.includes(e.evidenceType)) return false
  if (f.depths.length && !f.depths.includes(e.depth)) return false
  if (f.groups.length && !f.groups.some((g) => e.groups.includes(g))) return false
  if (f.roles.length && !f.roles.some((r) => e.roleFamilies.includes(r))) return false
  if (f.domains.length && !f.domains.some((d) => e.domains.includes(d))) return false
  if (f.terms?.length) {
    const h = haystack.get(e.id) ?? ''
    if (!f.terms.every((t) => h.includes(t))) return false
  }
  return true
}

/** Applies explicit filters and a free-text query together. */
export function searchEvidence(query: string, explicit: SearchFilters): { items: EvidenceItem[]; parsed: ParsedQuery } {
  const parsed = parseQuery(query)
  const merged = {
    types: explicit.types.length ? explicit.types : parsed.types,
    depths: explicit.depths.length ? explicit.depths : parsed.depths,
    groups: explicit.groups.length ? explicit.groups : parsed.groups,
    roles: explicit.roles.length ? explicit.roles : parsed.roles,
    domains: explicit.domains.length ? explicit.domains : parsed.domains,
    terms: parsed.terms,
  }
  let items = site.evidence.filter((e) => matches(e, merged))
  // A query that only produced unmatched free text falls back to intents alone.
  if (!items.length && parsed.terms.length && parsed.understood.length) items = site.evidence.filter((e) => matches(e, { ...merged, terms: [] }))
  return { items, parsed }
}
