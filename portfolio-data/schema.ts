/**
 * Canonical portfolio data schemas (brief sections 15 and 21).
 *
 * Validation runs at build time only (Vite plugin, `npm run qa:data`, unit tests). The browser
 * receives an already-validated public projection, so Zod is not part of the runtime bundle.
 */
import { z } from 'zod'

export const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ids are lower-case kebab-case')
const Text = z.string().trim().min(1)

// ---- Shared vocabularies --------------------------------------------------------------------

export const DEPTHS = ['professional-delivery', 'built-verified', 'designed-specified', 'collaborated-applied', 'explored'] as const
export const Depth = z.enum(DEPTHS)
export type Depth = z.infer<typeof Depth>

export const EVIDENCE_TYPES = ['professional', 'public-build', 'private-blueprint', 'education'] as const
export const EvidenceType = z.enum(EVIDENCE_TYPES)
export type EvidenceType = z.infer<typeof EvidenceType>

export const ROLE_FAMILIES = ['consulting', 'deployment', 'value-engineering', 'partnerships', 'builder', 'risk', 'solution-design'] as const
export const RoleFamily = z.enum(ROLE_FAMILIES)
export type RoleFamily = z.infer<typeof RoleFamily>

export const DOMAINS = [
  'financial-services',
  'capital-markets',
  'insurance',
  'banking',
  'investment',
  'non-financial-risk',
  'regulatory-change',
  'regulatory-reporting',
  'ai-governance',
  'enterprise-ai',
  'data-platforms',
  'cloud',
  'customer-and-gtm',
  'product-and-experience',
] as const
export const Domain = z.enum(DOMAINS)
export type Domain = z.infer<typeof Domain>

export const CONFIDENTIALITY = ['public', 'anonymised', 'private-source'] as const
export const STATUSES = ['approved', 'needs-confirmation', 'blocked'] as const
export const Status = z.enum(STATUSES)

export const SourceRef = z
  .object({
    source: Id,
    /** Public locator only: a path in a public repository or a JSON pointer into content.json. */
    locator: z.string().optional(),
    note: z.string().optional(),
  })
  .strict()
export type SourceRef = z.infer<typeof SourceRef>

export const LinkKind = z.enum(['repo', 'demo', 'cv', 'pdf', 'email', 'internal'])
export const Link = z
  .object({
    label: Text,
    href: Text,
    kind: LinkKind,
    /** For repository and demo links: the publication-status entry that gates the link. */
    repo: Id.optional(),
  })
  .strict()
export type Link = z.infer<typeof Link>

// ---- Profile and career ---------------------------------------------------------------------

export const ProfileSchema = z
  .object({
    title: Text,
    titleAlternative: Text,
    headline: Text,
    headlineAlternative: Text,
    supporting: Text,
    proofLine: z.array(Text).min(3).max(5),
    targetRoles: Text,
    thesis: Text,
    conclusion: Text,
    proposition: Text,
    showPortrait: z.boolean(),
    /** Small portrait for the portfolio hero; the CV keeps its own image. */
    portrait: Text,
    showAvailability: z.boolean(),
  })
  .strict()

export const CareerStageSchema = z
  .object({
    id: Id,
    label: Text,
    /** content.json experience ids (company slugs). Employer, role and dates come from there. */
    experience: z.array(Id).min(1),
    capabilityAdded: Text,
    strand: Text,
    evidence: z.array(Id).min(1),
  })
  .strict()
export const CareerSchema = z.object({ stages: z.array(CareerStageSchema).min(4) }).strict()

// ---- Capabilities and patterns --------------------------------------------------------------

export const CapabilitySchema = z.object({ id: Id, label: Text }).strict()
export const CapabilityGroupSchema = z
  .object({
    id: Id,
    title: Text,
    short: Text,
    summary: Text,
    capabilities: z.array(CapabilitySchema).min(3),
  })
  .strict()
export const PatternSchema = z
  .object({
    id: Id,
    label: Text,
    /** Plain-language description of the pattern. Framework names belong in `implementedWith`. */
    description: Text,
  })
  .strict()
export const CapabilitiesSchema = z
  .object({
    groups: z.array(CapabilityGroupSchema).min(6),
    patterns: z.array(PatternSchema),
  })
  .strict()

// ---- Evidence -------------------------------------------------------------------------------

export const PatternUseSchema = z
  .object({
    pattern: Id,
    /** Framework or library that implements the pattern in this evidence item, if any. */
    implementedWith: z.string().optional(),
  })
  .strict()

export const EvidenceItemSchema = z
  .object({
    id: Id,
    title: Text,
    summary: Text,
    evidenceType: EvidenceType,
    depth: Depth,
    /** What Thomas personally did. */
    contribution: Text,
    organisation: Text,
    period: z.string().optional(),
    experience: Id.optional(),
    case: Id.optional(),
    capabilities: z.array(Id).min(1),
    roleFamilies: z.array(RoleFamily).min(1),
    domains: z.array(Domain).min(1),
    patterns: z.array(PatternUseSchema).default([]),
    sourceRefs: z.array(SourceRef).min(1),
    publicLinks: z.array(Link).default([]),
    confidentiality: z.enum(CONFIDENTIALITY),
    scopeBoundary: Text,
    status: Status,
    archive: z.boolean().default(false),
  })
  .strict()
export type EvidenceItemInput = z.input<typeof EvidenceItemSchema>
export const EvidenceSchema = z.object({ items: z.array(EvidenceItemSchema).min(10) }).strict()

// ---- Case studies (brief section 15) --------------------------------------------------------

export const ContributionSchema = z.object({ area: Text, depth: Depth, detail: Text }).strict()
export const DecisionSchema = z.object({ title: Text, rationale: Text }).strict()
export const ArchitectureLayerSchema = z.object({ id: Id, label: Text, detail: Text, status: z.enum(['implemented', 'reference', 'designed', 'professional']) }).strict()
export const ValueLensSchema = z.object({ lens: Text, question: Text, signal: Text }).strict()

export const CaseStudySchema = z
  .object({
    id: Id,
    slug: Id,
    order: z.number().int().positive(),
    title: Text,
    shortTitle: Text,
    subtitle: Text,
    evidenceType: z.enum(['professional-delivery', 'public-build', 'private-blueprint']),
    maturity: z.enum(['delivered', 'functional-prototype', 'reference-architecture', 'design-blueprint']),
    /** The story the case tells, in order (brief section 14). */
    story: z.array(Text).min(4),
    problem: Text,
    whyItMattered: Text,
    constraints: z.array(Text).min(2),
    role: Text,
    contributions: z.array(ContributionSchema).min(2),
    decisions: z.array(DecisionSchema).min(2),
    architecture: z.array(ArchitectureLayerSchema).min(3),
    valueModel: z.array(ValueLensSchema).min(2),
    learned: z.array(Text).min(1),
    evidence: z.array(Id).min(1),
    capabilities: z.array(Id).min(3),
    roleFit: z.array(RoleFamily).min(1),
    scopeBoundary: Text,
    limitations: z.array(Text).min(2),
    links: z.array(Link).default([]),
    sourceRefs: z.array(SourceRef).min(1),
    status: Status,
  })
  .strict()
export const CaseStudiesSchema = z.object({ cases: z.array(CaseStudySchema).min(5) }).strict()

// ---- Role lenses (brief section 11) ---------------------------------------------------------

export const RoleLensSchema = z
  .object({
    id: RoleFamily,
    param: Id,
    label: Text,
    short: Text,
    opening: Text,
    capabilityGroups: z.array(Id).min(2),
    /** Evidence shown first under this lens, in order. Remaining evidence keeps its default order. */
    evidenceFirst: z.array(Id).min(2),
    startCase: Id,
    careerFocus: z.array(Id).min(1),
    conclusion: Text,
    honestGap: z.string().optional(),
  })
  .strict()
export const RoleLensesSchema = z.object({ lenses: z.array(RoleLensSchema).length(7) }).strict()

// ---- Sources, publication, claims -----------------------------------------------------------

export const SourceSchema = z
  .object({
    id: Id,
    kind: z.enum(['cv-content', 'public-repo', 'public-dataset', 'private-blueprint', 'clarification', 'market-signal', 'portfolio-build']),
    title: Text,
    visibility: z.enum(['public', 'private']),
    url: z.string().url().optional(),
    commit: z.string().optional(),
    description: Text,
  })
  .strict()
export const SourceRegisterSchema = z.object({ sources: z.array(SourceSchema).min(5) }).strict()

export const PUBLICATION_STATUSES = ['approved and linked', 'approved after cleanup', 'public but unlinked', 'private', 'archived', 'blocked pending Thomas decision'] as const
export const RepoPublicationSchema = z
  .object({
    id: Id,
    repository: Text,
    url: z.string().url(),
    auditedCommit: z.string().optional(),
    recommendation: z.enum(PUBLICATION_STATUSES),
    status: z.enum(PUBLICATION_STATUSES),
    /** Only an explicit decision by Thomas makes a repository linkable. */
    decision: z.enum(['pending', 'approved', 'declined']),
    decidedAt: z.string().optional(),
    notes: Text,
  })
  .strict()
export const PrivateInputSchema = z.object({ id: Id, description: Text, handling: Text }).strict()
export const PublicationStatusSchema = z
  .object({
    repositories: z.array(RepoPublicationSchema).min(1),
    privateInputs: z.array(PrivateInputSchema).min(1),
  })
  .strict()

export const ClaimSchema = z
  .object({
    id: Id,
    /** Dotted path into the public projection, for example `profile.headline`. */
    locator: Text,
    wording: Text,
    evidence: z.array(Id).min(1),
    depth: Depth,
    personal: Text,
    decision: z.enum(['retain', 'qualify', 'move', 'remove']),
    publication: z.enum(['approved', 'needs-confirmation']),
  })
  .strict()
export const ClaimsSchema = z.object({ claims: z.array(ClaimSchema).min(10) }).strict()

// ---- Guided story ---------------------------------------------------------------------------

export const GuidedSceneSchema = z
  .object({
    id: Id,
    chapter: Text,
    short: Text,
    title: Text,
    subhead: z.string().optional(),
    caption: z.string().optional(),
    /** Visible word budget for title, subhead and caption together. */
    budget: z.number().int().positive(),
  })
  .strict()
export const GuidedStorySchema = z.object({ scenes: z.array(GuidedSceneSchema).length(12) }).strict()

// ---- NFR process network (imported from the public NFRProcesses dataset) --------------------

export const NfrNetworkSchema = z
  .object({
    $comment: z.string(),
    source: z.object({ repository: Text, commit: Text, file: Text, importedAt: Text }).strict(),
    processes: z
      .array(
        z
          .object({
            id: Id,
            abbreviation: Text,
            name: Text,
            hub: z.boolean(),
            steps: z.number().int().positive(),
            decisions: z.number().int().nonnegative(),
            lanes: z.number().int().positive(),
            phases: z.number().int().positive(),
            regulations: z.number().int().nonnegative(),
            aiSteps: z.number().int().nonnegative(),
          })
          .strict(),
      )
      .length(8),
    links: z.array(z.object({ id: Id, from: Id, to: Id, label: Text, style: z.enum(['solid', 'dashed']) }).strict()).min(8),
  })
  .strict()
export type NfrNetwork = z.infer<typeof NfrNetworkSchema>

// ---- The Work Fabric blueprint (sanitised, synthetic) ---------------------------------------

const Labelled = z.object({ id: Id, label: Text, detail: Text }).strict()
export const BlueprintSchema = z
  .object({
    northStar: Text,
    workline: z.array(z.object({ id: Id, label: Text }).strict()).min(6),
    fragments: z.array(z.object({ id: Id, label: Text, kind: z.enum(['system', 'channel', 'person']) }).strict()).min(5),
    planes: z.array(z.object({ id: Id, label: Text, axis: z.enum(['horizontal', 'vertical']), items: z.array(Text).min(3) }).strict()).length(3),
    workObject: z
      .object({
        title: Text,
        type: Text,
        fields: z.array(z.object({ id: Id, label: Text, value: Text }).strict()).min(5),
      })
      .strict(),
    roles: z
      .array(
        z
          .object({
            id: Id,
            label: Text,
            sees: z.array(Text).min(2),
            hidden: z.array(Text),
            can: z.array(Text).min(1),
            cannot: z.array(Text).min(1),
          })
          .strict(),
      )
      .min(4),
    event: z
      .object({
        title: Text,
        summary: Text,
        steps: z.array(z.object({ process: Id, link: Id.optional(), action: Text }).strict()).min(3),
      })
      .strict(),
    cascade: z.array(Labelled).length(9),
    contract: z.array(z.object({ group: Text, fields: z.array(Text).min(3) }).strict()).min(5),
    securityChain: z.array(Labelled).length(8),
    lifecycle: z.array(z.object({ id: Id, label: Text }).strict()).length(9),
    operatingModel: z.array(z.object({ id: Id, label: Text, owns: z.array(Text).min(3) }).strict()).length(4),
    valueLenses: z.array(z.object({ id: Id, label: Text, question: Text, measure: Text }).strict()).length(6),
    costLenses: z.array(Labelled).min(3),
    routes: z.array(z.object({ id: z.enum(['strategy', 'process', 'technology', 'governance']), label: Text, sections: z.array(Id).min(2) }).strict()).length(4),
    roadmap: z.array(z.object({ id: Id, label: Text, focus: Text, gate: Text }).strict()).length(4),
    /** Aggregate figures from the private build's final verification record. */
    buildRecord: z.array(z.object({ id: Id, label: Text, value: Text }).strict()).min(4),
  })
  .strict()
export type Blueprint = z.infer<typeof BlueprintSchema>

// ---- Scene visual copy ----------------------------------------------------------------------

const Money = z.number().nonnegative()
/** Calibrated constants of the simulator's model; see portfolio-app/src/lib/economics.ts. */
export const EconomicsSchema = z
  .object({
    context: Text,
    source: Text,
    defaults: z.object({ functions: z.number().int().min(1).max(5), hosting: z.enum(['cloud', 'sovereign', 'on-prem']), level: z.number().int().min(1).max(5) }).strict(),
    hosting: z.array(z.object({ id: z.enum(['cloud', 'sovereign', 'on-prem']), label: Text, infra: Money, usage: z.number().positive() }).strict()).length(3),
    levels: z.array(z.object({ level: z.number().int().min(1).max(5), buildPerYear: Money, usage: z.number().positive() }).strict()).length(5),
    sharedRunBase: Money,
    minShare: z.number().positive().max(1),
    dashboards: z.object({ build: Money, firstYearRate: z.number().nonnegative(), upkeepRate: z.number().nonnegative() }).strict(),
    governance: z.object({ base: z.number(), usersPerFte: z.number().positive(), useCases: z.number().int(), perUseCase: z.number(), perLevel: z.number(), costPerFte: Money }).strict(),
    users: z.number().int().positive(),
    seatCost: Money,
    usageBase: Money,
    benefit: z.object({ labour: Money, risk: Money }).strict(),
    goLiveYear: z.number().int().positive(),
    buildWeights: z.array(z.number().nonnegative()).min(1),
    ramp: z.array(z.number().nonnegative()).min(1),
    growth: z.object({ headcount: z.number(), usage: z.number(), price: z.number() }).strict(),
    horizon: z.number().int().positive(),
  })
  .strict()
export type Economics = z.infer<typeof EconomicsSchema>

export const SceneContentSchema = z
  .object({
    thesisViews: z.array(z.object({ id: Id, label: Text, output: Text, lenses: z.array(RoleFamily) }).strict()).length(6),
    thesisResult: Text,
    controlledAi: z.array(z.object({ id: Id, label: Text, detail: Text, evidence: z.array(Id).min(1), patterns: z.array(Id) }).strict()).length(9),
    execution: z.array(z.object({ id: Id, label: Text, evidence: z.array(Id).min(1), gap: z.string().optional() }).strict()).length(8),
    discipline: z.array(z.object({ id: Id, label: Text, portfolio: Text, workFabric: Text }).strict()).length(10),
    economics: EconomicsSchema,
  })
  .strict()
export type SceneContent = z.infer<typeof SceneContentSchema>
