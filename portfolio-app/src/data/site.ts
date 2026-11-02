import data from 'virtual:portfolio-data'
import type { CaseStudy, Depth, EvidenceItem, EvidenceType, RoleFamily, RoleLens } from '@data/site-types'

export const site = data
export type { CaseStudy, Depth, EvidenceItem, EvidenceType, RoleFamily, RoleLens }

export const DEPTH_ORDER: Depth[] = ['professional-delivery', 'built-verified', 'designed-specified', 'collaborated-applied', 'explored']

export const DEPTH_LABEL: Record<Depth, string> = {
  'professional-delivery': 'Professional delivery',
  'built-verified': 'Built and verified',
  'designed-specified': 'Designed and specified',
  'collaborated-applied': 'Collaborated and applied',
  explored: 'Studied or explored',
}

export const DEPTH_SHORT: Record<Depth, string> = {
  'professional-delivery': 'Delivered',
  'built-verified': 'Built',
  'designed-specified': 'Designed',
  'collaborated-applied': 'Applied',
  explored: 'Studied',
}

export const DEPTH_MEANING: Record<Depth, string> = {
  'professional-delivery': 'Directly exercised in paid professional work.',
  'built-verified': 'Implemented in a working prototype with inspectable evidence.',
  'designed-specified': 'Authored as architecture, operating model, specification or blueprint.',
  'collaborated-applied': 'Used while working with specialists, without claiming sole implementation.',
  explored: 'Conceptual familiarity or study. Never shown as headline expertise.',
}

export const TYPE_LABEL: Record<EvidenceType, string> = {
  professional: 'Professional',
  'public-build': 'Public build',
  'private-blueprint': 'Private blueprint',
  education: 'Education',
}

export const MATURITY_LABEL: Record<CaseStudy['maturity'], string> = {
  delivered: 'Delivered programme',
  'functional-prototype': 'Functional prototype',
  'reference-architecture': 'Reference architecture',
  'design-blueprint': 'Design blueprint',
}

export const CASE_TYPE_LABEL: Record<CaseStudy['evidenceType'], string> = {
  'professional-delivery': 'Professional delivery',
  'public-build': 'Public build',
  'private-blueprint': 'Private blueprint',
}

const evidenceById = new Map(site.evidence.map((e) => [e.id, e]))
const caseBySlug = new Map(site.cases.map((c) => [c.slug, c]))
const lensById = new Map(site.lenses.map((l) => [l.id, l]))
const groupById = new Map(site.groups.map((g) => [g.id, g]))
const capabilityById = new Map(site.groups.flatMap((g) => g.capabilities.map((c) => [c.id, c] as const)))
const processById = new Map(site.network.processes.map((p) => [p.id, p]))

export const getEvidence = (id: string) => evidenceById.get(id)
export const getCase = (slug: string) => caseBySlug.get(slug)
export const getLens = (id: string | undefined) => (id ? lensById.get(id as RoleFamily) : undefined)
export const getGroup = (id: string) => groupById.get(id)
export const getCapability = (id: string) => capabilityById.get(id)
export const getProcess = (id: string) => processById.get(id)

export const ROLE_FAMILY_IDS = site.lenses.map((l) => l.id)
export const isRoleFamily = (v: unknown): v is RoleFamily => typeof v === 'string' && lensById.has(v as RoleFamily)

/** Primary cases for the guided story: the five non-professional-delivery cases, in order. */
export const primaryCases = site.cases.filter((c) => c.order <= 5)

/**
 * Lens ordering: evidence named by the lens comes first, then evidence tagged with the lens's
 * role family, then the rest. Facts never change, only the order.
 */
export function orderEvidence(items: EvidenceItem[], lens?: RoleLens): EvidenceItem[] {
  if (!lens) return items
  const first = new Map(lens.evidenceFirst.map((id, i) => [id, i]))
  const score = (e: EvidenceItem) => (first.has(e.id) ? first.get(e.id)! : e.roleFamilies.includes(lens.id) ? 100 : 200)
  return [...items].sort((a, b) => score(a) - score(b))
}

export function orderCases(cases: CaseStudy[], lens?: RoleLens): CaseStudy[] {
  if (!lens) return cases
  const score = (c: CaseStudy) => (c.slug === lens.startCase ? 0 : c.roleFit.includes(lens.id) ? 1 : 2)
  return [...cases].sort((a, b) => score(a) - score(b) || a.order - b.order)
}

export const scenePath = (id: string) => `#${id}`
export const mailto = `mailto:${site.person.email}`
export const PDF_HREF = `${import.meta.env.BASE_URL}assets/Thomas_Zijlstra_CV.pdf`
export const CV_HREF = `${import.meta.env.BASE_URL}cv.html`
export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`
