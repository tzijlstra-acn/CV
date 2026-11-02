import { createRootRoute, createRoute, createRouter, lazyRouteComponent, notFound, retainSearchParams } from '@tanstack/react-router'
import { DEPTH_ORDER, getCase, isRoleFamily, ROLE_FAMILY_IDS, site, type Depth, type EvidenceType, type RoleFamily } from '@/data/site'
import type { Domain } from '@data/site-types'
import { Shell } from './Shell'
import { Guided } from '@/routes/Guided'
import { NotFound } from '@/routes/NotFound'

export interface RootSearch {
  lens?: RoleFamily
}

/** Unknown or malformed values are dropped, never trusted. */
const list = <T extends string>(v: unknown, allowed: readonly T[]): T[] | undefined => {
  const raw = Array.isArray(v) ? v : typeof v === 'string' ? v.split(',') : []
  const out = raw.filter((x): x is T => typeof x === 'string' && (allowed as readonly string[]).includes(x))
  return out.length ? [...new Set(out)] : undefined
}

const TYPES: EvidenceType[] = ['professional', 'public-build', 'private-blueprint', 'education']
const GROUPS = site.groups.map((g) => g.id)
const DOMAINS = [...new Set(site.evidence.flatMap((e) => e.domains))] as Domain[]

export interface EvidenceSearch {
  q?: string
  type?: EvidenceType[]
  depth?: Depth[]
  group?: string[]
  role?: RoleFamily[]
  domain?: Domain[]
  view?: 'list' | 'graph'
  archive?: boolean
  /** An evidence id to highlight and scroll to. */
  focus?: string
}

const rootRoute = createRootRoute({
  validateSearch: (s: Record<string, unknown>): RootSearch => (isRoleFamily(s.lens) ? { lens: s.lens } : {}),
  search: { middlewares: [retainSearchParams(['lens'])] },
  component: Shell,
  notFoundComponent: NotFound,
})

const guidedRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Guided })

const evidenceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/evidence',
  validateSearch: (s: Record<string, unknown>): EvidenceSearch => ({
    q: typeof s.q === 'string' && s.q.trim() ? s.q.slice(0, 120) : undefined,
    type: list(s.type, TYPES),
    depth: list(s.depth, DEPTH_ORDER),
    group: list(s.group, GROUPS),
    role: list(s.role, ROLE_FAMILY_IDS),
    domain: list(s.domain, DOMAINS),
    view: s.view === 'graph' ? 'graph' : undefined,
    archive: s.archive === true || s.archive === 'true' ? true : undefined,
    focus: typeof s.focus === 'string' && site.evidence.some((e) => e.id === s.focus) ? s.focus : undefined,
  }),
  component: lazyRouteComponent(() => import('@/routes/Evidence'), 'Evidence'),
})

const capabilitiesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/capabilities',
  component: lazyRouteComponent(() => import('@/routes/Capabilities'), 'Capabilities'),
})

const caseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/case/$slug',
  beforeLoad: ({ params }) => {
    if (!getCase(params.slug)) throw notFound()
  },
  component: lazyRouteComponent(() => import('@/routes/Case'), 'Case'),
})

/** Arrays travel as readable comma lists (?depth=built-verified,designed-specified), not JSON. */
function stringifySearch(search: Record<string, unknown>): string {
  const parts: string[] = []
  for (const [k, v] of Object.entries(search)) {
    if (v === undefined || v === null || v === '' || v === false) continue
    const value = Array.isArray(v) ? v.join(',') : String(v)
    parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(value).replace(/%2C/g, ',')}`)
  }
  return parts.length ? `?${parts.join('&')}` : ''
}
const parseSearch = (s: string) => Object.fromEntries(new URLSearchParams(s.startsWith('?') ? s.slice(1) : s))

const routeTree = rootRoute.addChildren([guidedRoute, evidenceRoute, capabilitiesRoute, caseRoute])

export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL.replace(/\/$/, ''),
  trailingSlash: 'preserve',
  scrollRestoration: true,
  defaultPreload: 'intent',
  defaultNotFoundComponent: NotFound,
  stringifySearch,
  parseSearch,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
