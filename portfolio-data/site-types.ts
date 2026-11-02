/**
 * The public projection that the browser receives (virtual:portfolio-data).
 * Produced by portfolio-data/build.ts after validation; everything here is safe to publish.
 */
import type { Blueprint, Depth, Domain, EvidenceType, NfrNetwork, RoleFamily, SceneContent } from './schema'

export type { Blueprint, Depth, Domain, EvidenceType, NfrNetwork, RoleFamily, SceneContent }

export interface PublicLink {
  label: string
  href: string
  kind: 'repo' | 'demo' | 'cv' | 'pdf' | 'email' | 'internal'
}

export interface PublicSource {
  id: string
  title: string
  visibility: 'public' | 'private'
  url?: string
  commit?: string
  description: string
}

export interface Person {
  name: string
  nameShort: string
  credential: string
  location: string
  email: string
  github: string
  portfolio: string
  photo: string
  languages: { name: string; level: string }[]
  international: { city: string; period: string }[]
}

export interface Profile {
  title: string
  titleAlternative: string
  headline: string
  headlineAlternative: string
  supporting: string
  proofLine: string[]
  targetRoles: string
  thesis: string
  conclusion: string
  proposition: string
  showPortrait: boolean
  portrait: string
  showAvailability: boolean
  availability?: string
}

export interface Experience {
  id: string
  company: string
  location: string
  role: string
  start: string
  end: string
  current: boolean
  coverage?: string
  items: string[]
}

export interface Education {
  credential: string
  institution: string
  period?: string
  distinction?: string
  thesis?: string
}

export interface CareerStage {
  id: string
  label: string
  capabilityAdded: string
  strand: string
  evidence: string[]
  experience: { id: string; company: string; role: string; location: string; period: string }[]
}

export interface Capability {
  id: string
  label: string
  group: string
  evidence: { id: string; depth: Depth }[]
  /** Strongest depth across linked evidence (professional delivery first). */
  strongest: Depth
  /** False when the only evidence is study or exploration: never shown as headline expertise. */
  headline: boolean
}

export interface CapabilityGroup {
  id: string
  title: string
  short: string
  summary: string
  capabilities: Capability[]
}

export interface Pattern {
  id: string
  label: string
  description: string
  uses: { evidence: string; depth: Depth; implementedWith?: string }[]
}

export interface EvidenceItem {
  id: string
  title: string
  summary: string
  evidenceType: EvidenceType
  depth: Depth
  contribution: string
  organisation: string
  period?: string
  experience?: string
  case?: string
  capabilities: string[]
  groups: string[]
  roleFamilies: RoleFamily[]
  domains: Domain[]
  patterns: { pattern: string; implementedWith?: string }[]
  links: PublicLink[]
  sources: PublicSource[]
  confidentiality: 'public' | 'anonymised' | 'private-source'
  scopeBoundary: string
  status: 'approved' | 'needs-confirmation'
  archive: boolean
}

export interface CaseStudy {
  id: string
  slug: string
  order: number
  title: string
  shortTitle: string
  subtitle: string
  evidenceType: 'professional-delivery' | 'public-build' | 'private-blueprint'
  maturity: 'delivered' | 'functional-prototype' | 'reference-architecture' | 'design-blueprint'
  story: string[]
  problem: string
  whyItMattered: string
  constraints: string[]
  role: string
  contributions: { area: string; depth: Depth; detail: string }[]
  decisions: { title: string; rationale: string }[]
  architecture: { id: string; label: string; detail: string; status: 'implemented' | 'reference' | 'designed' | 'professional' }[]
  valueModel: { lens: string; question: string; signal: string }[]
  learned: string[]
  evidence: string[]
  capabilities: string[]
  roleFit: RoleFamily[]
  scopeBoundary: string
  limitations: string[]
  links: PublicLink[]
  sources: PublicSource[]
  status: 'approved' | 'needs-confirmation'
}

export interface RoleLens {
  id: RoleFamily
  param: string
  label: string
  short: string
  opening: string
  capabilityGroups: string[]
  evidenceFirst: string[]
  startCase: string
  careerFocus: string[]
  conclusion: string
  honestGap?: string
}

export interface GuidedScene {
  id: string
  number: number
  chapter: string
  short: string
  title: string
  subhead?: string
  caption?: string
}

export interface SiteData {
  person: Person
  profile: Profile
  experience: Experience[]
  education: Education[]
  career: CareerStage[]
  groups: CapabilityGroup[]
  patterns: Pattern[]
  evidence: EvidenceItem[]
  cases: CaseStudy[]
  lenses: RoleLens[]
  story: GuidedScene[]
  network: NfrNetwork
  blueprint: Blueprint
  scenes: SceneContent
  stats: {
    evidence: number
    capabilities: number
    headlineCapabilities: number
    patterns: number
    cases: number
    professional: number
    publicBuilds: number
    privateBlueprints: number
    archive: number
    unitTests: number
    e2eTests: number
    acceptanceChecks: number
  }
  build: { date: string; networkCommit: string }
}
