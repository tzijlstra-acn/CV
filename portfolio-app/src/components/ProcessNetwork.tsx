import { m } from 'motion/react'
import { useEffect, useMemo, useState } from 'react'
import { getProcess, site } from '@/data/site'
import { Play, RotateCcw, ICON } from '@/design-system/icons'
import { useCompact, useReducedMotion } from '@/lib/hooks'
import './network.css'

const NET = site.network
const EVENT = site.blueprint.event
const W = 980
const H = 540

/**
 * Fixed, structured layout: the two source hubs (RCSA and ORM) sit in the middle; the rest are
 * placed around them by relationship. Positions are presentation; nodes and links are data.
 */
const POS: Record<string, { x: number; y: number }> = {
  compliance: { x: 140, y: 110 },
  pks: { x: 140, y: 360 },
  rcsa: { x: 420, y: 250 },
  mrm: { x: 420, y: 465 },
  tprm: { x: 640, y: 95 },
  orm: { x: 660, y: 330 },
  isrisk: { x: 880, y: 200 },
  bcm: { x: 860, y: 450 },
}
const BEND: Record<string, number> = { 'bcm-to-rcsa': 70, 'compliance-to-mrm': -40, 'tprm-to-bcm': -50, 'compliance-to-rcsa': 20, 'isrisk-to-orm': 20 }
const radius = (id: string) => (getProcess(id)?.hub ? 46 : 36)

function edgePath(id: string, from: string, to: string) {
  const a = POS[from]
  const b = POS[to]
  const dx = b.x - a.x
  const dy = b.y - a.y
  const len = Math.hypot(dx, dy)
  const ux = dx / len
  const uy = dy / len
  const sx = a.x + ux * (radius(from) + 4)
  const sy = a.y + uy * (radius(from) + 4)
  const ex = b.x - ux * (radius(to) + 10)
  const ey = b.y - uy * (radius(to) + 10)
  const bend = BEND[id] ?? 0
  const cx = (sx + ex) / 2 - uy * bend
  const cy = (sy + ey) / 2 + ux * bend
  return `M${sx} ${sy} Q${cx} ${cy} ${ex} ${ey}`
}

export function ProcessNetwork({ idPrefix = 'net', autoplay = false }: { idPrefix?: string; autoplay?: boolean }) {
  const reduced = useReducedMotion()
  const compact = useCompact()
  const [selected, setSelected] = useState<string>('orm')
  const [eventStep, setEventStep] = useState(autoplay ? 0 : -1)
  const [playing, setPlaying] = useState(autoplay)
  const running = playing && eventStep >= 0 && eventStep < EVENT.steps.length - 1

  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setEventStep((s) => s + 1), reduced ? 0 : 900)
    return () => clearTimeout(t)
  }, [running, eventStep, reduced])

  const trigger = () => {
    setPlaying(!reduced)
    setEventStep(reduced ? EVENT.steps.length - 1 : 0)
  }

  const activeSteps = EVENT.steps.slice(0, eventStep + 1)
  const eventNodes = new Set(activeSteps.map((s) => s.process))
  const eventLinks = new Set(activeSteps.map((s) => s.link).filter(Boolean) as string[])
  const proc = getProcess(selected)!
  const incoming = NET.links.filter((l) => l.to === selected)
  const outgoing = NET.links.filter((l) => l.from === selected)
  const totals = useMemo(() => ({ steps: NET.processes.reduce((n, p) => n + p.steps, 0), regs: NET.processes.reduce((n, p) => n + p.regulations, 0) }), [])

  return (
    <div className="net">
      <div className="net__stage">
        {!compact ? (
          <svg viewBox={`0 0 ${W} ${H}`} className="net__svg" role="group" aria-label="NFR process network" aria-describedby={`${idPrefix}-desc`}>
            <desc id={`${idPrefix}-desc`}>
              Eight NFR processes connected by {NET.links.length} source links. RCSA and ORM are the hubs. {eventStep >= 0 ? `Synthetic event in progress: ${activeSteps.map((s) => getProcess(s.process)?.abbreviation).join(', ')}.` : ''}
            </desc>
            <defs>
              <marker id={`${idPrefix}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className="net__arrowhead" />
              </marker>
              <marker id={`${idPrefix}-arrow-on`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0 0 L10 5 L0 10 z" className="net__arrowhead is-on" />
              </marker>
            </defs>
            {NET.links.map((l) => {
              const on = eventLinks.has(l.id)
              const touches = l.from === selected || l.to === selected
              return (
                <g key={l.id}>
                  <path d={edgePath(l.id, l.from, l.to)} className={`net__link net__link--${l.style}${touches ? ' is-touch' : ''}${on ? ' is-event' : ''}`} markerEnd={`url(#${idPrefix}-arrow${on ? '-on' : ''})`} />
                  {on && !reduced ? <m.path d={edgePath(l.id, l.from, l.to)} className="net__pulse" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} /> : null}
                </g>
              )
            })}
            {NET.processes.map((p) => {
              const pos = POS[p.id]
              const r = radius(p.id)
              const inEvent = eventNodes.has(p.id)
              return (
                <g
                  key={p.id}
                  className={`net__node${p.hub ? ' is-hub' : ''}${selected === p.id ? ' is-selected' : ''}${inEvent ? ' is-event' : ''}`}
                  tabIndex={0}
                  role="button"
                  aria-pressed={selected === p.id}
                  onClick={() => setSelected(p.id)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelected(p.id))}
                  data-testid={`${idPrefix}-node-${p.id}`}
                >
                  <circle cx={pos.x} cy={pos.y} r={r} className="net__circle" />
                  <text x={pos.x} y={pos.y + 5} textAnchor="middle" className={`net__abbr${p.abbreviation.length > 6 ? " net__abbr--long" : ""}`}>
                    {`${p.abbreviation} `}
                  </text>
                  <text x={pos.x} y={pos.y + r + 18} textAnchor="middle" className="net__name">
                    {p.name.replace(' Management', '')}
                  </text>
                </g>
              )
            })}
          </svg>
        ) : (
          <ul className="net__list" role="list">
            {NET.processes.map((p) => (
              <li key={p.id}>
                <button type="button" className={`net__chip${selected === p.id ? ' is-selected' : ''}${eventNodes.has(p.id) ? ' is-event' : ''}`} aria-pressed={selected === p.id} onClick={() => setSelected(p.id)}>
                  {p.abbreviation}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside className="net__side">
        <div className="net__panel" aria-live="polite">
          <p className="k">{proc.hub ? 'Hub process' : 'Process'}</p>
          <h3 className="net__title">{proc.name}</h3>
          <dl className="net__facts">
            <div>
              <dt>Steps</dt>
              <dd>{proc.steps}</dd>
            </div>
            <div>
              <dt>Decisions</dt>
              <dd>{proc.decisions}</dd>
            </div>
            <div>
              <dt>Role lanes</dt>
              <dd>{proc.lanes}</dd>
            </div>
            <div>
              <dt>Regulatory touchpoints</dt>
              <dd>{proc.regulations}</dd>
            </div>
          </dl>
          <p className="net__links-h k">Feeds</p>
          <ul className="net__links" role="list">
            {outgoing.map((l) => (
              <li key={l.id}>
                <b>{getProcess(l.to)?.abbreviation}</b> {l.label}
              </li>
            ))}
            {!outgoing.length ? <li className="t-muted">No outgoing links in the source.</li> : null}
          </ul>
          <p className="net__links-h k">Fed by</p>
          <ul className="net__links" role="list">
            {incoming.map((l) => (
              <li key={l.id}>
                <b>{getProcess(l.from)?.abbreviation}</b> {l.label}
              </li>
            ))}
            {!incoming.length ? <li className="t-muted">No incoming links in the source.</li> : null}
          </ul>
        </div>
        <div className="net__event">
          <div className="net__event-head">
            <div>
              <p className="k">Illustrative</p>
              <p className="net__event-title">{EVENT.title}</p>
            </div>
            <button type="button" className="btn btn--small" onClick={trigger} data-testid={`${idPrefix}-trigger`}>
              {eventStep >= 0 ? <RotateCcw {...ICON} size={16} /> : <Play {...ICON} size={16} />} {eventStep >= 0 ? 'Replay' : 'Trigger event'}
            </button>
          </div>
          <ol className="net__steps" aria-live="polite">
            {EVENT.steps.map((s, i) => (
              <li key={s.process} className={i <= eventStep ? 'is-on' : ''}>
                <span className="t-mono">{getProcess(s.process)?.abbreviation}</span> {s.action}
              </li>
            ))}
          </ol>
        </div>
        <p className="net__source t-mono">
          Source-derived: {NET.processes.length} processes, {totals.steps} steps, {NET.links.length} links, {totals.regs} regulatory touchpoints, from a reference process dataset at commit {NET.source.commit.slice(0, 7)}.
        </p>
      </aside>
    </div>
  )
}
