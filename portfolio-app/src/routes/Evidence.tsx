import { useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { useActiveLens } from '@/app/hooks'
import type { EvidenceSearch } from '@/app/router'
import { DepthLegend, EvidenceRow } from '@/components/Evidence'
import { FabricGraph } from '@/components/FabricGraph'
import { DEPTH_LABEL, DEPTH_ORDER, orderEvidence, site, TYPE_LABEL, type Depth, type EvidenceType, type RoleFamily } from '@/data/site'
import { searchEvidence } from '@/data/search'
import { ICON, Search, X } from '@/design-system/icons'
import type { Domain } from '@data/site-types'
import './explorer.css'

const TYPES: EvidenceType[] = ['professional', 'public-build', 'private-blueprint', 'education']
const DOMAIN_LABEL: Partial<Record<Domain, string>> = {
  'financial-services': 'Financial services',
  'capital-markets': 'Capital markets',
  insurance: 'Insurance',
  banking: 'Banking',
  investment: 'Investment',
  'non-financial-risk': 'Non-financial risk',
  'regulatory-change': 'Regulatory change',
  'regulatory-reporting': 'Regulatory reporting',
  'ai-governance': 'AI governance',
  'enterprise-ai': 'Enterprise AI',
  'data-platforms': 'Data platforms',
  cloud: 'Cloud',
  'customer-and-gtm': 'Customer and GTM',
  'product-and-experience': 'Product and experience',
}
const DOMAINS = (Object.keys(DOMAIN_LABEL) as Domain[]).filter((d) => site.evidence.some((e) => e.domains.includes(d)))

/** Quick views named after the questions reviewers actually ask (brief section 16.2). */
const PRESETS: { label: string; search: EvidenceSearch }[] = [
  { label: 'Professional delivery only', search: { depth: ['professional-delivery'] } },
  { label: 'What I built', search: { depth: ['built-verified'] } },
  { label: 'What I designed', search: { depth: ['designed-specified'] } },
  { label: 'Financial services', search: { domain: ['financial-services', 'capital-markets', 'insurance', 'banking', 'investment'] } },
  { label: 'Risk and controls', search: { group: ['risk-control'] } },
  { label: 'Customer and GTM', search: { group: ['customer-market'] } },
  { label: 'Technical depth', search: { group: ['ai-solution-design', 'engineering-quality'] } },
  { label: 'Product and programme', search: { group: ['product-experience', 'transformation-programme'] } },
]

function Toggle<T extends string>({ label, values, options, render, onChange }: { label: string; values: T[]; options: T[]; render: (v: T) => string; onChange: (v: T[]) => void }) {
  return (
    <fieldset className="filter">
      <legend className="k">{label}</legend>
      <div className="filter__options">
        {options.map((o) => {
          const on = values.includes(o)
          return (
            <button key={o} type="button" className="filter__opt" aria-pressed={on} onClick={() => onChange(on ? values.filter((v) => v !== o) : [...values, o])}>
              {render(o)}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export function Evidence() {
  const search = useSearch({ strict: false }) as EvidenceSearch & { lens?: RoleFamily }
  const navigate = useNavigate()
  const lens = useActiveLens()
  const [draft, setDraft] = useState(search.q ?? '')
  // Keep the box in step with the URL (back, forward, quick views) by adjusting state during render.
  const [seenQ, setSeenQ] = useState(search.q)
  if (seenQ !== search.q) {
    setSeenQ(search.q)
    setDraft(search.q ?? '')
  }

  const set = (patch: Partial<EvidenceSearch>) =>
    void navigate({ to: '/evidence', search: (prev: Record<string, unknown>) => ({ ...(prev as EvidenceSearch), ...patch, focus: undefined }) as never, replace: true, resetScroll: false })

  const filters = { types: search.type ?? [], depths: search.depth ?? [], groups: search.group ?? [], roles: search.role ?? [], domains: search.domain ?? [] }
  const { items, parsed } = useMemo(() => searchEvidence(search.q ?? '', filters), [search.q, search.type, search.depth, search.group, search.role, search.domain]) // eslint-disable-line react-hooks/exhaustive-deps
  const visible = orderEvidence(
    items.filter((e) => search.archive || !e.archive || search.focus === e.id),
    lens,
  )
  const hiddenArchive = items.filter((e) => e.archive).length
  const active = !!(search.q || filters.types.length || filters.depths.length || filters.groups.length || filters.roles.length || filters.domains.length)

  useEffect(() => {
    if (!search.focus) return
    const t = setTimeout(() => document.querySelector(`[data-testid="evidence-${search.focus}"]`)?.scrollIntoView({ block: 'center' }), 80)
    return () => clearTimeout(t)
  }, [search.focus])

  return (
    <div className="page explorer">
      <header className="explorer__head">
        <p className="t-eyebrow">Explorer</p>
        <h1 className="explorer__title" tabIndex={-1}>
          Evidence explorer
        </h1>
        <p className="t-lead">
          Every item says what I personally did, how deep the evidence goes, and where its boundary is. Search in plain language or filter. {lens ? `Ordered for the ${lens.label} lens.` : ''}
        </p>
        <DepthLegend />
      </header>

      <form
        className="explorer__search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          set({ q: draft.trim() || undefined })
        }}
      >
        <label className="explorer__field">
          <Search {...ICON} />
          <span className="sr-only">Search the evidence</span>
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Show evidence of customer adoption" data-testid="evidence-search" />
        </label>
        <button type="submit" className="btn">
          Search
        </button>
        {active ? (
          <button type="button" className="btn btn--ghost" onClick={() => (setDraft(''), void navigate({ to: '/evidence', search: (p) => ({ lens: p.lens }), replace: true }))} data-testid="evidence-clear">
            <X {...ICON} /> Clear
          </button>
        ) : null}
      </form>
      {search.q ? (
        <p className="explorer__understood" data-testid="understood">
          Read as: {parsed.understood.length ? parsed.understood.join(', ') : 'free text'}
          {parsed.terms.length ? ` | words: ${parsed.terms.join(' ')}` : ''}
        </p>
      ) : null}

      <div className="explorer__presets" role="group" aria-label="Quick views">
        {PRESETS.map((p) => (
          <button key={p.label} type="button" className="chip explorer__preset" onClick={() => (setDraft(''), void navigate({ to: '/evidence', search: (prev) => ({ lens: prev.lens, ...p.search }), replace: true }))}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="explorer__body">
        <aside className="explorer__filters" aria-label="Filters">
          <Toggle label="Role family" values={filters.roles} options={site.lenses.map((l) => l.id)} render={(v) => site.lenses.find((l) => l.id === v)!.label} onChange={(v) => set({ role: v.length ? v : undefined })} />
          <Toggle label="Evidence type" values={filters.types} options={TYPES} render={(v) => TYPE_LABEL[v]} onChange={(v) => set({ type: v.length ? v : undefined })} />
          <Toggle label="Depth" values={filters.depths} options={DEPTH_ORDER as Depth[]} render={(v) => DEPTH_LABEL[v]} onChange={(v) => set({ depth: v.length ? v : undefined })} />
          <Toggle label="Capability group" values={filters.groups} options={site.groups.map((g) => g.id)} render={(v) => site.groups.find((g) => g.id === v)!.short} onChange={(v) => set({ group: v.length ? v : undefined })} />
          <Toggle label="Domain" values={filters.domains} options={DOMAINS} render={(v) => DOMAIN_LABEL[v]!} onChange={(v) => set({ domain: v.length ? v : undefined })} />
          <label className="filter__check">
            <input type="checkbox" checked={!!search.archive} onChange={(e) => set({ archive: e.target.checked || undefined })} data-testid="toggle-archive" /> Include the archive of smaller experiments
          </label>
        </aside>

        <section className="explorer__results" aria-labelledby="results-h">
          <div className="explorer__results-head">
            <h2 id="results-h" className="explorer__count" aria-live="polite" data-testid="result-count">
              {visible.length} {visible.length === 1 ? 'item' : 'items'}
              {!search.archive && hiddenArchive ? <span className="t-muted"> (+{hiddenArchive} in the archive)</span> : null}
            </h2>
            <div className="explorer__view" role="radiogroup" aria-label="View">
              <button type="button" role="radio" aria-checked={search.view !== 'graph'} className="filter__opt" onClick={() => set({ view: undefined })}>
                List
              </button>
              <button type="button" role="radio" aria-checked={search.view === 'graph'} className="filter__opt" onClick={() => set({ view: 'graph' })} data-testid="view-graph">
                Graph
              </button>
            </div>
          </div>
          {search.view === 'graph' ? (
            <FabricGraph key={`${lens?.id}-${visible.length}`} lens={lens} evidence={visible} full />
          ) : (
            <div className="explorer__list">
              {visible.map((e) => (
                <EvidenceRow key={e.id} item={e} emphasis={search.focus === e.id} />
              ))}
              {!visible.length ? <p className="explorer__empty">Nothing matches. Try fewer filters, or one of the quick views above.</p> : null}
            </div>
          )}
        </section>
      </div>

      <details className="explorer__confidential">
        <summary>How confidential and private work is shown</summary>
        <ul>
          <li>Client work is anonymised: sector and country at most, never names, materials or results.</li>
          <li>Private blueprints are described, never published. Their screenshots are not reused; the visuals on this site are rebuilt on synthetic data.</li>
          <li>Repository links appear only after each repository has passed a publication audit and I have approved it.</li>
          <li>Where a source could support more than one reading, the most conservative wording is used.</li>
        </ul>
      </details>
    </div>
  )
}
