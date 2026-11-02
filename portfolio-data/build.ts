/**
 * Build-time projection: canonical data -> validated public SiteData.
 *
 * 1. Parse every data file with its Zod schema (fail fast, no silent defaults beyond the schema).
 * 2. Join CV facts from content.json, so employers, roles and dates are never retyped.
 * 3. Check integrity: ids, references, evidence for every capability, link gating, private sources.
 * 4. Project only what may be published: no blocked evidence, no unapproved repository links,
 *    no private locators, no internal notes.
 * 5. Check every public string against the writing rules and the confidential-term hashes.
 *
 * Used by the Vite plugin (virtual:portfolio-data), `npm run qa:data` and the unit tests.
 */
import fs from 'node:fs'
import path from 'node:path'
import type { z } from 'zod'
import * as S from './schema'
import type { CaseStudy, Capability, CapabilityGroup, EvidenceItem, Pattern, PublicLink, PublicSource, SiteData } from './site-types'
import { checkText, walkStrings, wordCount } from './lib/text-rules'
import { loadHashes, loadLocalTerms, scanConfidential } from './lib/confidential'

export const DATA_DIR = import.meta.dirname
export const ROOT = path.resolve(DATA_DIR, '..')

export const DATA_FILES = {
  profile: 'profile.json',
  career: 'career.json',
  capabilities: 'capabilities.json',
  evidence: 'evidence.json',
  cases: 'case-studies.json',
  lenses: 'role-lenses.json',
  sources: 'source-register.json',
  publication: 'publication-status.json',
  claims: 'claims.json',
  story: 'guided-story.json',
  network: 'nfr-network.json',
  blueprint: 'cases/nfr-work-fabric.json',
  scenes: 'scene-content.json',
} as const

/** Every file the projection reads, for watch mode. */
export const WATCH_FILES = [...Object.values(DATA_FILES).map((f) => path.join(DATA_DIR, f)), path.join(ROOT, 'content.json')]

export interface Issue {
  where: string
  message: string
}

export class PortfolioDataError extends Error {
  constructor(public issues: Issue[]) {
    super(`Portfolio data failed validation (${issues.length} issue${issues.length === 1 ? '' : 's'}):\n${issues.map((i) => `  - ${i.where}: ${i.message}`).join('\n')}`)
  }
}

const DEPTH_RANK: Record<S.Depth, number> = {
  'professional-delivery': 0,
  'built-verified': 1,
  'designed-specified': 2,
  'collaborated-applied': 3,
  explored: 4,
}

const slug = (s: string) =>
  s
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')

/** Paths, drives and local folders must never reach the public projection. */
const PRIVATE_LOCATOR = /([A-Za-z]:[\\/])|(\/Users\/)|(Code Projects)|(\\\\)|(AppData)|(\.local\.)/

interface ContentJson {
  personal: {
    name: string
    nameShort: string
    credential: string
    location: string
    email: string
    github: string
    portfolio: string
    photo: string
    languages: { name: string; level: string }[]
    internationalExperience?: { city: string; period: string }[]
  }
  experience: { company: string; location: string; role: string; start: string; end: string; current: boolean; coverage?: string; items: string[] }[]
  education: { credential: string; institution: string; year?: string | null; start?: string; end?: string; distinction?: string; thesis?: string }[]
  contact?: { availability?: string }
}

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf8'))
}

function parse<T extends z.ZodType>(schema: T, file: string, issues: Issue[]): z.output<T> | undefined {
  let raw: unknown
  try {
    raw = readJson(file)
  } catch (err) {
    issues.push({ where: file, message: `cannot read: ${(err as Error).message}` })
    return undefined
  }
  const result = schema.safeParse(raw)
  if (!result.success) {
    for (const i of result.error.issues) issues.push({ where: `${file}:${i.path.join('.')}`, message: i.message })
    return undefined
  }
  return result.data
}

/** Counts test declarations in this repository, so the site never quotes a stale number. */
function countTests(dir: string, pattern: RegExp): number {
  const abs = path.join(ROOT, dir)
  if (!fs.existsSync(abs)) return 0
  let n = 0
  for (const f of fs.readdirSync(abs)) {
    if (!/\.(ts|mjs)$/.test(f)) continue
    n += (fs.readFileSync(path.join(abs, f), 'utf8').match(pattern) ?? []).length
  }
  return n
}

export interface LoadedPortfolio {
  site: SiteData
  claims: z.output<typeof S.ClaimsSchema>['claims']
  publication: z.output<typeof S.PublicationStatusSchema>
  /** Evidence ids that were withheld from the projection (blocked). */
  withheld: string[]
}

export function loadPortfolio(): { result?: LoadedPortfolio; issues: Issue[] } {
  const issues: Issue[] = []
  const add = (where: string, message: string) => issues.push({ where, message })

  const profile = parse(S.ProfileSchema, DATA_FILES.profile, issues)
  const career = parse(S.CareerSchema, DATA_FILES.career, issues)
  const capabilities = parse(S.CapabilitiesSchema, DATA_FILES.capabilities, issues)
  const evidence = parse(S.EvidenceSchema, DATA_FILES.evidence, issues)
  const cases = parse(S.CaseStudiesSchema, DATA_FILES.cases, issues)
  const lenses = parse(S.RoleLensesSchema, DATA_FILES.lenses, issues)
  const sources = parse(S.SourceRegisterSchema, DATA_FILES.sources, issues)
  const publication = parse(S.PublicationStatusSchema, DATA_FILES.publication, issues)
  const claims = parse(S.ClaimsSchema, DATA_FILES.claims, issues)
  const story = parse(S.GuidedStorySchema, DATA_FILES.story, issues)
  const network = parse(S.NfrNetworkSchema, DATA_FILES.network, issues)
  const blueprint = parse(S.BlueprintSchema, DATA_FILES.blueprint, issues)
  const scenes = parse(S.SceneContentSchema, DATA_FILES.scenes, issues)
  const content = JSON.parse(fs.readFileSync(path.join(ROOT, 'content.json'), 'utf8')) as ContentJson

  if (!profile || !career || !capabilities || !evidence || !cases || !lenses || !sources || !publication || !claims || !story || !network || !blueprint || !scenes) {
    return { issues }
  }

  // ---- Unique ids ---------------------------------------------------------------------------
  const unique = (label: string, ids: string[]) => {
    const seen = new Set<string>()
    for (const id of ids) {
      if (seen.has(id)) add(label, `duplicate id "${id}"`)
      seen.add(id)
    }
    return seen
  }
  const groupIds = unique('capabilities.groups', capabilities.groups.map((g) => g.id))
  const capIds = unique('capabilities', capabilities.groups.flatMap((g) => g.capabilities.map((c) => c.id)))
  const patternIds = unique('capabilities.patterns', capabilities.patterns.map((p) => p.id))
  const evidenceIds = unique('evidence', evidence.items.map((e) => e.id))
  const caseIds = unique('cases', cases.cases.map((c) => c.slug))
  unique('cases.id', cases.cases.map((c) => c.id))
  unique('cases.order', cases.cases.map((c) => String(c.order)))
  unique('career', career.stages.map((s) => s.id))
  unique('story', story.scenes.map((s) => s.id))
  unique('claims', claims.claims.map((c) => c.id))
  const sourceById = new Map(sources.sources.map((s) => [s.id, s]))
  unique('sources', sources.sources.map((s) => s.id))
  const repoById = new Map(publication.repositories.map((r) => [r.id, r]))
  unique('publication', publication.repositories.map((r) => r.id))
  const processIds = new Set(network.processes.map((p) => p.id))
  const linkById = new Map(network.links.map((l) => [l.id, l]))

  // ---- content.json joins -------------------------------------------------------------------
  const experience = content.experience.map((e) => ({ id: slug(e.company), ...e, coverage: e.coverage }))
  const experienceById = new Map(experience.map((e) => [e.id, e]))

  // ---- Sources and links --------------------------------------------------------------------
  for (const s of sources.sources) {
    if (s.visibility === 'private' && s.url) add(`sources.${s.id}`, 'private sources must not carry a URL')
  }
  const toSources = (where: string, refs: S.SourceRef[], confidentiality?: string): PublicSource[] =>
    refs.map((r, i) => {
      const s = sourceById.get(r.source)
      if (!s) {
        add(`${where}.sourceRefs[${i}]`, `unknown source "${r.source}"`)
        return { id: r.source, title: r.source, visibility: 'private', description: '' }
      }
      if (s.visibility === 'private' && r.locator) add(`${where}.sourceRefs[${i}]`, 'private sources take a note, never a locator')
      if (r.locator && PRIVATE_LOCATOR.test(r.locator)) add(`${where}.sourceRefs[${i}]`, 'locator looks like a local or private path')
      if (r.note && PRIVATE_LOCATOR.test(r.note)) add(`${where}.sourceRefs[${i}]`, 'note looks like a local or private path')
      if (s.visibility === 'private' && confidentiality && confidentiality !== 'private-source') add(where, `cites private source "${s.id}" but is not marked private-source`)
      // A repository URL is published only once that repository is approved (same gate as links).
      const gated = s.kind === 'public-repo' || s.kind === 'public-dataset'
      const url = s.url && (!gated || publication.repositories.some((p) => p.decision === 'approved' && s.url!.startsWith(p.url))) ? s.url : undefined
      return { id: s.id, title: s.title, visibility: s.visibility, url, commit: s.commit, description: s.description }
    })
  /** Repository and demo links are published only after an explicit decision by Thomas. */
  const gateLinks = (where: string, links: S.Link[]): PublicLink[] =>
    links.flatMap((l, i) => {
      if (l.kind === 'repo' || l.kind === 'demo') {
        if (!l.repo) {
          add(`${where}.links[${i}]`, 'repository and demo links must reference a publication-status entry')
          return []
        }
        const repo = repoById.get(l.repo)
        if (!repo) {
          add(`${where}.links[${i}]`, `unknown publication-status entry "${l.repo}"`)
          return []
        }
        if (repo.decision !== 'approved') return []
        if (!l.href.startsWith(repo.url)) add(`${where}.links[${i}]`, `href does not match ${repo.repository}`)
      }
      return [{ label: l.label, href: l.href, kind: l.kind }]
    })
  for (const r of publication.repositories) {
    if (r.decision === 'approved' && !r.decidedAt) add(`publication.${r.id}`, 'an approval needs a decision date')
    if (r.decision === 'approved' && r.status === 'blocked pending Thomas decision') add(`publication.${r.id}`, 'approved repository still marked blocked')
  }

  // ---- Evidence -----------------------------------------------------------------------------
  const groupOfCap = new Map(capabilities.groups.flatMap((g) => g.capabilities.map((c) => [c.id, g.id] as const)))
  const withheld: string[] = []
  const publicEvidence: EvidenceItem[] = []
  for (const e of evidence.items) {
    const where = `evidence.${e.id}`
    for (const c of e.capabilities) if (!capIds.has(c)) add(where, `unknown capability "${c}"`)
    for (const p of e.patterns) if (!patternIds.has(p.pattern)) add(where, `unknown pattern "${p.pattern}"`)
    if (e.case && !caseIds.has(e.case)) add(where, `unknown case "${e.case}"`)
    if (e.experience && !experienceById.has(e.experience)) add(where, `unknown experience "${e.experience}"`)
    if (e.confidentiality === 'private-source' && e.publicLinks.length) add(where, 'private-source evidence cannot carry public links')
    if (e.evidenceType === 'private-blueprint' && e.confidentiality !== 'private-source') add(where, 'private blueprints must be marked private-source')
    if (e.evidenceType === 'education' && e.depth !== 'explored') add(where, 'education is supporting evidence: depth must be "explored"')
    const srcs = toSources(where, e.sourceRefs, e.confidentiality)
    if (e.status === 'blocked') {
      withheld.push(e.id)
      continue
    }
    publicEvidence.push({
      id: e.id,
      title: e.title,
      summary: e.summary,
      evidenceType: e.evidenceType,
      depth: e.depth,
      contribution: e.contribution,
      organisation: e.organisation,
      period: e.period,
      experience: e.experience,
      case: e.case,
      capabilities: e.capabilities,
      groups: [...new Set(e.capabilities.map((c) => groupOfCap.get(c)).filter((g): g is string => !!g))],
      roleFamilies: e.roleFamilies,
      domains: e.domains,
      patterns: e.patterns,
      links: gateLinks(where, e.publicLinks),
      sources: srcs,
      confidentiality: e.confidentiality,
      scopeBoundary: e.scopeBoundary,
      status: e.status,
      archive: e.archive,
    })
  }
  const publicEvidenceById = new Map(publicEvidence.map((e) => [e.id, e]))
  const usable = (where: string, id: string) => {
    if (!evidenceIds.has(id)) add(where, `unknown evidence "${id}"`)
    else if (!publicEvidenceById.has(id)) add(where, `references withheld evidence "${id}"`)
  }

  // ---- Capabilities: a capability exists only when evidence links to it ---------------------
  const groups: CapabilityGroup[] = capabilities.groups.map((g) => ({
    id: g.id,
    title: g.title,
    short: g.short,
    summary: g.summary,
    capabilities: g.capabilities.map<Capability>((c) => {
      const links = publicEvidence
        .filter((e) => e.capabilities.includes(c.id))
        .map((e) => ({ id: e.id, depth: e.depth }))
        .sort((a, b) => DEPTH_RANK[a.depth] - DEPTH_RANK[b.depth])
      if (!links.length) add(`capabilities.${c.id}`, 'no evidence links to this capability: remove it or add evidence')
      const strongest = links[0]?.depth ?? 'explored'
      return { id: c.id, label: c.label, group: g.id, evidence: links, strongest, headline: strongest !== 'explored' }
    }),
  }))

  const patterns: Pattern[] = capabilities.patterns.map((p) => {
    const uses = publicEvidence.flatMap((e) => e.patterns.filter((u) => u.pattern === p.id).map((u) => ({ evidence: e.id, depth: e.depth, implementedWith: u.implementedWith })))
    if (!uses.length) add(`patterns.${p.id}`, 'pattern is not linked to any evidence')
    return { ...p, uses }
  })

  // ---- Cases --------------------------------------------------------------------------------
  const publicCases: CaseStudy[] = []
  for (const c of [...cases.cases].sort((a, b) => a.order - b.order)) {
    const where = `cases.${c.slug}`
    if (c.id !== c.slug) add(where, 'case id and slug must match')
    for (const id of c.evidence) usable(where, id)
    for (const id of c.capabilities) if (!capIds.has(id)) add(where, `unknown capability "${id}"`)
    if (c.status === 'blocked') continue
    publicCases.push({ ...c, status: c.status, links: gateLinks(where, c.links), sources: toSources(where, c.sourceRefs) })
  }
  for (const e of publicEvidence) if (e.case && !publicCases.some((c) => c.slug === e.case)) add(`evidence.${e.id}`, `case "${e.case}" is not published`)

  // ---- Career, lenses, blueprint ------------------------------------------------------------
  const careerStages = career.stages.map((s) => {
    for (const id of s.evidence) usable(`career.${s.id}`, id)
    return {
      id: s.id,
      label: s.label,
      capabilityAdded: s.capabilityAdded,
      strand: s.strand,
      evidence: s.evidence,
      experience: s.experience.map((x) => {
        const e = experienceById.get(x)
        if (!e) add(`career.${s.id}`, `unknown experience "${x}"`)
        return { id: x, company: e?.company ?? x, role: e?.role ?? '', location: e?.location ?? '', period: e ? `${e.start} to ${e.end}` : '' }
      }),
    }
  })
  const stageIds = new Set(careerStages.map((s) => s.id))
  for (const l of lenses.lenses) {
    const where = `lenses.${l.id}`
    if (l.param !== l.id) add(where, 'lens param must equal its role-family id')
    for (const g of l.capabilityGroups) if (!groupIds.has(g)) add(where, `unknown capability group "${g}"`)
    for (const id of l.evidenceFirst) usable(where, id)
    if (!publicCases.some((c) => c.slug === l.startCase)) add(where, `start case "${l.startCase}" is not published`)
    for (const s of l.careerFocus) if (!stageIds.has(s)) add(where, `unknown career stage "${s}"`)
  }
  for (const [i, step] of blueprint.event.steps.entries()) {
    const where = `blueprint.event.steps[${i}]`
    if (!processIds.has(step.process)) add(where, `unknown process "${step.process}"`)
    if (i > 0) {
      const link = step.link ? linkById.get(step.link) : undefined
      if (!link) add(where, 'every step after the first must follow a source link')
      else if (![link.from, link.to].includes(step.process)) add(where, `link ${link.id} does not touch ${step.process}`)
      else if (![link.from, link.to].some((p) => blueprint.event.steps.slice(0, i).some((s) => s.process === p))) add(where, `link ${link.id} does not connect to an earlier step`)
    }
  }

  // ---- Scene visual copy
  for (const l of scenes.controlledAi) {
    for (const id of l.evidence) usable(`scenes.controlledAi.${l.id}`, id)
    for (const p of l.patterns) if (!patternIds.has(p)) add(`scenes.controlledAi.${l.id}`, `unknown pattern "${p}"`)
  }
  for (const s of scenes.execution) for (const id of s.evidence) usable(`scenes.execution.${s.id}`, id)

  // ---- Story budgets ------------------------------------------------------------------------
  const storyScenes = story.scenes.map((s, i) => {
    const words = wordCount([s.title, s.subhead, s.caption].filter(Boolean).join(' '))
    if (words > s.budget) add(`story.${s.id}`, `${words} visible words exceeds the budget of ${s.budget}`)
    return { id: s.id, number: i + 1, chapter: s.chapter, short: s.short, title: s.title, subhead: s.subhead, caption: s.caption }
  })

  // ---- Assemble -----------------------------------------------------------------------------
  const p = content.personal
  const site: SiteData = {
    person: {
      name: p.name,
      nameShort: p.nameShort,
      credential: p.credential,
      location: p.location,
      email: p.email,
      github: p.github,
      portfolio: p.portfolio,
      photo: p.photo,
      languages: p.languages,
      international: (p.internationalExperience ?? []).map((x) => ({ city: x.city, period: x.period })),
    },
    profile: { ...profile, availability: profile.showAvailability ? content.contact?.availability : undefined },
    experience: experience.map((e) => ({ id: e.id, company: e.company, location: e.location, role: e.role, start: e.start, end: e.end, current: e.current, coverage: e.coverage, items: e.items })),
    education: content.education.map((e) => ({
      credential: e.credential,
      institution: e.institution,
      period: e.year ?? (e.start && e.end ? `${e.start} to ${e.end}` : undefined),
      distinction: e.distinction ?? undefined,
      thesis: e.thesis ?? undefined,
    })),
    career: careerStages,
    groups,
    patterns,
    evidence: publicEvidence,
    cases: publicCases,
    lenses: lenses.lenses,
    story: storyScenes,
    // The dataset is described, not named: only its derived structure and commit are published.
    network: { $comment: 'Derived structure of a reference NFR process dataset.', processes: network.processes, links: network.links, source: { ...network.source, repository: 'reference dataset' } },
    blueprint,
    scenes,
    stats: {
      evidence: publicEvidence.length,
      capabilities: groups.reduce((n, g) => n + g.capabilities.length, 0),
      headlineCapabilities: groups.reduce((n, g) => n + g.capabilities.filter((c) => c.headline).length, 0),
      patterns: patterns.length,
      cases: publicCases.length,
      professional: publicEvidence.filter((e) => e.evidenceType === 'professional').length,
      publicBuilds: publicEvidence.filter((e) => e.evidenceType === 'public-build').length,
      privateBlueprints: publicEvidence.filter((e) => e.evidenceType === 'private-blueprint').length,
      archive: publicEvidence.filter((e) => e.archive).length,
      unitTests: countTests('tests', /^\s*(it|test)\(/gm),
      e2eTests: countTests('e2e', /^\s*test\(/gm),
      acceptanceChecks: fs.existsSync(path.join(ROOT, 'qa/acceptance-tests.json')) ? (JSON.parse(fs.readFileSync(path.join(ROOT, 'qa/acceptance-tests.json'), 'utf8')).tests?.length ?? 0) : 0,
    },
    build: { date: new Date().toISOString().slice(0, 10), networkCommit: network.source.commit },
  }

  // ---- Writing rules and confidential terms on everything that ships ------------------------
  const hashes = loadHashes()
  const localTerms = loadLocalTerms()
  for (const [where, text] of walkStrings(site)) {
    if (/(^|\.)(href|url|photo|github|portfolio|email|commit)$/.test(where)) continue
    for (const v of checkText(where, text)) add(v.path, `${v.rule}: "${v.excerpt}"`)
  }
  for (const [where, text] of walkStrings(site)) {
    for (const hit of scanConfidential(text, hashes, localTerms)) add(where, `confidential term${hit.term ? ` "${hit.term}"` : ''} (hash ${hit.hash.slice(0, 8)})`)
  }

  return { result: { site, claims: claims.claims, publication, withheld }, issues }
}

/** Throws PortfolioDataError on any issue. */
export function buildSiteData(): SiteData {
  const { result, issues } = loadPortfolio()
  if (issues.length || !result) throw new PortfolioDataError(issues)
  return result.site
}

/** Resolves a dotted claim locator such as `profile.headline` or `cases[slug=airlock].subtitle`. */
export function resolveLocator(site: SiteData, locator: string): unknown {
  let cur: unknown = site
  for (const part of locator.split('.')) {
    const m = /^([\w-]+)(?:\[(\w+)=([\w-]+)\]|\[(\d+)\])?$/.exec(part)
    if (!m || cur == null || typeof cur !== 'object') return undefined
    cur = (cur as Record<string, unknown>)[m[1]]
    if (m[2] && Array.isArray(cur)) cur = cur.find((x) => (x as Record<string, unknown>)[m[2]] === m[3])
    else if (m[4] && Array.isArray(cur)) cur = cur[Number(m[4])]
  }
  return cur
}
