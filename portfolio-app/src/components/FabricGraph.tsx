import './fabric.css'
import { Link } from '@tanstack/react-router'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { orderEvidence, site, type EvidenceItem, type RoleFamily, type RoleLens } from '@/data/site'
import { DepthGlyph } from './Evidence'

type Selection = { kind: 'role'; id: RoleFamily } | { kind: 'group'; id: string } | null

interface Edge {
  from: string
  to: string
  weight: number
}

/**
 * The capability fabric (brief section 16.1): role families, capability groups and evidence,
 * with every connector derived from the evidence data. HTML nodes keep the text accessible;
 * an SVG layer draws the connectors between their measured positions.
 */
export function FabricGraph({ lens, evidence, full = false }: { lens?: RoleLens; evidence?: EvidenceItem[]; full?: boolean }) {
  const items = useMemo(() => orderEvidence(evidence ?? site.evidence.filter((e) => !e.archive && e.evidenceType !== 'education'), lens), [evidence, lens])
  const [selected, setSelected] = useState<Selection>(lens ? { kind: 'role', id: lens.id } : null)
  const [hover, setHover] = useState<Selection>(null)
  const active = hover ?? selected

  const roleGroup = useMemo<Edge[]>(() => {
    const out: Edge[] = []
    for (const l of site.lenses)
      for (const g of site.groups) {
        const weight = items.filter((e) => e.roleFamilies.includes(l.id) && e.groups.includes(g.id)).length
        if (weight) out.push({ from: `role-${l.id}`, to: `group-${g.id}`, weight })
      }
    return out
  }, [items])
  const groupEvidence = useMemo<Edge[]>(() => items.flatMap((e) => e.groups.map((g) => ({ from: `group-${g}`, to: `ev-${e.id}`, weight: 1 }))), [items])

  const lit = useMemo(() => {
    const nodes = new Set<string>()
    if (!active) return nodes
    if (active.kind === 'role') {
      nodes.add(`role-${active.id}`)
      for (const e of items.filter((x) => x.roleFamilies.includes(active.id))) {
        nodes.add(`ev-${e.id}`)
        for (const g of e.groups) nodes.add(`group-${g}`)
      }
    } else {
      nodes.add(`group-${active.id}`)
      for (const e of items.filter((x) => x.groups.includes(active.id))) {
        nodes.add(`ev-${e.id}`)
        for (const r of e.roleFamilies) nodes.add(`role-${r}`)
      }
    }
    return nodes
  }, [active, items])

  const edgeLit = (e: Edge) => {
    if (!active) return false
    if (active.kind === 'role') {
      if (e.from === `role-${active.id}`) return true
      if (e.from.startsWith('group-') && lit.has(e.from) && lit.has(e.to)) {
        const ev = items.find((x) => `ev-${x.id}` === e.to)
        return !!ev?.roleFamilies.includes(active.id)
      }
      return false
    }
    return e.from === `group-${active.id}` || (e.to === `group-${active.id}` && lit.has(e.from))
  }

  // ---- Geometry -------------------------------------------------------------------------
  const wrap = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<Record<string, { l: number; r: number; y: number }>>({})
  const [size, setSize] = useState({ w: 0, h: 0 })
  useLayoutEffect(() => {
    const el = wrap.current
    if (!el) return
    const measure = () => {
      const box = el.getBoundingClientRect()
      const next: Record<string, { l: number; r: number; y: number }> = {}
      el.querySelectorAll<HTMLElement>('[data-node]').forEach((n) => {
        const b = n.getBoundingClientRect()
        next[n.dataset.node!] = { l: b.left - box.left, r: b.right - box.left, y: b.top - box.top + b.height / 2 }
      })
      setPos(next)
      setSize({ w: box.width, h: box.height })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [items])

  const path = (a: string, b: string) => {
    const p = pos[a]
    const q = pos[b]
    if (!p || !q) return ''
    const x1 = p.r + 6
    const x2 = q.l - 6
    const mx = (x1 + x2) / 2
    return `M${x1} ${p.y} C${mx} ${p.y} ${mx} ${q.y} ${x2} ${q.y}`
  }

  const state = (id: string) => (!active ? '' : lit.has(id) ? ' is-lit' : ' is-dim')
  const pick = (s: Selection) => setSelected((cur) => (cur && s && cur.kind === s.kind && cur.id === s.id ? null : s))
  const count = (gid: string) => items.filter((e) => e.groups.includes(gid)).length

  return (
    <div className={`fabric${full ? ' fabric--full' : ''}`} ref={wrap} data-testid="fabric-graph">
      <svg className="fabric__edges" width={size.w} height={size.h} aria-hidden="true">
        {roleGroup.map((e) => (
          <path key={`${e.from}-${e.to}`} d={path(e.from, e.to)} className={`fabric__edge${edgeLit(e) ? ' is-lit' : active ? ' is-dim' : ''}`} strokeWidth={Math.min(4, 0.8 + e.weight * 0.45)} />
        ))}
        {groupEvidence.map((e) => (
          <path key={`${e.from}-${e.to}`} d={path(e.from, e.to)} className={`fabric__edge fabric__edge--thin${edgeLit(e) ? ' is-lit' : active ? ' is-dim' : ''}`} />
        ))}
      </svg>
      <div className="fabric__col fabric__col--roles">
        <p className="fabric__h k">Role families</p>
        {site.lenses.map((l) => (
          <button
            key={l.id}
            type="button"
            data-node={`role-${l.id}`}
            className={`fabric__node fabric__node--role${state(`role-${l.id}`)}${selected?.kind === 'role' && selected.id === l.id ? ' is-selected' : ''}`}
            aria-pressed={selected?.kind === 'role' && selected.id === l.id}
            onClick={() => pick({ kind: 'role', id: l.id })}
            onMouseEnter={() => setHover({ kind: 'role', id: l.id })}
            onMouseLeave={() => setHover(null)}
            data-testid={`fabric-role-${l.id}`}
          >
            {l.label}
          </button>
        ))}
      </div>
      <div className="fabric__col fabric__col--groups">
        <p className="fabric__h k">Capability groups</p>
        {site.groups.map((g) => (
          <button
            key={g.id}
            type="button"
            data-node={`group-${g.id}`}
            className={`fabric__node fabric__node--group${state(`group-${g.id}`)}${selected?.kind === 'group' && selected.id === g.id ? ' is-selected' : ''}`}
            aria-pressed={selected?.kind === 'group' && selected.id === g.id}
            onClick={() => pick({ kind: 'group', id: g.id })}
            onMouseEnter={() => setHover({ kind: 'group', id: g.id })}
            onMouseLeave={() => setHover(null)}
            data-testid={`fabric-group-${g.id}`}
          >
            <span>{g.short}</span>
            <span className="fabric__count t-mono">{count(g.id)}</span>
          </button>
        ))}
      </div>
      <div className="fabric__col fabric__col--evidence">
        <p className="fabric__h k">Evidence</p>
        <ul role="list" className="fabric__evidence">
          {items.map((e) => (
            <li key={e.id} data-node={`ev-${e.id}`} className={`fabric__ev${state(`ev-${e.id}`)}`}>
              <DepthGlyph depth={e.depth} />
              {e.case ? (
                <Link to="/case/$slug" params={{ slug: e.case }} search={(p) => ({ lens: p.lens })}>
                  {e.title}
                </Link>
              ) : (
                <Link to="/evidence" search={(p) => ({ lens: p.lens, focus: e.id })}>
                  {e.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
      <p className="sr-only" aria-live="polite">
        {active ? `${lit.size - 1} connected items highlighted.` : ''}
      </p>
    </div>
  )
}
