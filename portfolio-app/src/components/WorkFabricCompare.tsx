import { m } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '@/data/site'
import { useCompact, useInView, useReducedMotion } from '@/lib/hooks'
import './work-fabric.css'

const B = site.blueprint
const W = 1100
const H = 440
const LINE_Y = 214
const stationX = (i: number) => 90 + i * ((W - 180) / (B.workline.length - 1))
const fragments = B.fragments.filter((f) => f.kind !== 'person')

/** Positions of each fragment in the fragmented and the connected state. */
function layout(i: number, connected: boolean) {
  if (connected) return { x: 90 + i * ((W - 180) / (fragments.length - 1)), y: 378 }
  const a = (i / fragments.length) * Math.PI * 2 - Math.PI / 2
  return { x: W / 2 + Math.cos(a) * 380, y: 214 + Math.sin(a) * 150 }
}

/**
 * Today versus target (brief 13.3 "compare fragmented current state with connected target").
 * Today the analyst is the integration layer. In the target state the same systems stay
 * authoritative underneath one governed flow, with services and controls running vertically.
 */
export function WorkFabricCompare({ autoplay = true, idPrefix = 'wfc' }: { autoplay?: boolean; idPrefix?: string }) {
  const reduced = useReducedMotion()
  const compact = useCompact()
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  const [connected, setConnected] = useState(false)
  const [touched, setTouched] = useState(false)
  const [progress, setProgress] = useState(0)
  const last = B.workline.length - 1
  // Derived: the object rests at the start while fragmented and at the end under reduced motion.
  const objectAt = !connected ? 0 : reduced ? last : progress

  useEffect(() => {
    if (!autoplay || !inView || touched) return
    const t = setTimeout(() => setConnected(true), reduced ? 0 : 1400)
    return () => clearTimeout(t)
  }, [autoplay, inView, touched, reduced])

  // One pass of the work object along the workline once the fabric is connected.
  useEffect(() => {
    if (!connected || reduced || progress >= last) return
    const t = setTimeout(() => setProgress((s) => s + 1), progress === 0 ? 700 : 340)
    return () => clearTimeout(t)
  }, [connected, progress, reduced, last])

  const choose = (v: boolean) => {
    setTouched(true)
    setConnected(v)
    setProgress(0)
  }

  const verticals = B.planes.filter((p) => p.axis === 'vertical')
  return (
    <div className="wfc" ref={ref}>
      <div className="wfc__toggle" role="radiogroup" aria-label="Compare today and the target state">
        <button type="button" role="radio" aria-checked={!connected} className="wfc__opt" onClick={() => choose(false)} data-testid={`${idPrefix}-today`}>
          Today: fragmented work
        </button>
        <button type="button" role="radio" aria-checked={connected} className="wfc__opt" onClick={() => choose(true)} data-testid={`${idPrefix}-target`}>
          Target: one governed flow
        </button>
      </div>
      <p className="wfc__state" aria-live="polite" data-copy>
        {connected
          ? 'Systems stay authoritative underneath. One work object carries the context through every step, with shared services and controls running vertically.'
          : 'Capable systems, fragmented work. The analyst carries context between tools, and it breaks at every handover.'}
      </p>
      {compact ? (
        <ol className="wfc__list" aria-label={connected ? 'Target workline' : 'Today'}>
          {connected ? B.workline.map((s) => <li key={s.id}>{s.label}</li>) : fragments.map((f) => <li key={f.id}>{f.label}</li>)}
        </ol>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="wfc__svg" role="img" aria-labelledby={`${idPrefix}-desc`}>
          <desc id={`${idPrefix}-desc`}>
            {connected
              ? `The workline runs ${B.workline.map((s) => s.label).join(', ')}. ${verticals.map((v) => v.label).join(' and ')} cross it vertically. The systems of record sit underneath: ${fragments.map((f) => f.label).join(', ')}.`
              : `An analyst in the middle connects ${fragments.map((f) => f.label).join(', ')} by hand, with broken handovers between them.`}
          </desc>
          {/* Vertical planes */}
          {verticals.map((p, i) => {
            const x = i === 0 ? 290 : 680
            return (
              <m.g key={p.id} initial={false} animate={{ opacity: connected ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.4, delay: connected && !reduced ? 0.3 : 0 }}>
                <rect x={x} y={24} width={190} height={H - 48} rx={8} className={`wfc__plane wfc__plane--${i}`} />
                <text x={x + 95} y={46} textAnchor="middle" className="wfc__plane-label">
                  {i === 0 ? 'Shared services' : 'Controls and management'}
                </text>
                {p.items.slice(0, 3).map((it, j) => (
                  <text key={it} x={x + 95} y={102 + j * 20} textAnchor="middle" className="wfc__plane-item">
                    {it}
                  </text>
                ))}
              </m.g>
            )
          })}
          {/* Today: handovers to the analyst */}
          {fragments.map((f, i) => {
            const p = layout(i, false)
            return <m.line key={`h-${f.id}`} x1={W / 2} y1={214} initial={false} animate={{ x2: p.x, y2: p.y, opacity: connected ? 0 : 1 }} className="wfc__handover" transition={{ duration: reduced ? 0 : 0.35 }} />
          })}
          {/* Target: the workline */}
          <m.g initial={false} animate={{ opacity: connected ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.35, delay: connected && !reduced ? 0.25 : 0 }}>
            <line x1={stationX(0)} y1={LINE_Y} x2={stationX(B.workline.length - 1)} y2={LINE_Y} className="wfc__line" />
            {B.workline.map((s, i) => (
              <g key={s.id}>
                <circle cx={stationX(i)} cy={LINE_Y} r={7} className={`wfc__station${i <= objectAt ? ' is-passed' : ''}`} />
                <text x={stationX(i)} y={LINE_Y - 22} textAnchor="middle" className="wfc__station-label">
                  {s.label}
                </text>
              </g>
            ))}
            {fragments.map((f, i) => {
              const p = layout(i, true)
              return <line key={`c-${f.id}`} x1={p.x} y1={p.y - 18} x2={p.x} y2={LINE_Y + 12} className="wfc__connector" />
            })}
            <text x={W / 2} y={H - 4} textAnchor="middle" className="wfc__caption">
              Systems of record stay authoritative
            </text>
          </m.g>
          {/* Fragments move from scattered to the systems row */}
          {fragments.map((f, i) => {
            const p = layout(i, connected)
            return (
              <m.g key={f.id} initial={false} animate={{ x: p.x, y: p.y }} transition={{ type: 'tween', duration: reduced ? 0 : 0.6, ease: [0.2, 0.7, 0.2, 1], delay: reduced ? 0 : i * 0.03 }}>
                <rect x={-58} y={-17} width={116} height={34} rx={6} className={`wfc__frag wfc__frag--${f.kind}`} />
                <text y={5} textAnchor="middle" className="wfc__frag-label">
                  {f.label}
                </text>
              </m.g>
            )
          })}
          {/* The analyst, today the integration layer */}
          <m.g initial={false} animate={{ opacity: connected ? 0 : 1, scale: connected ? 0.6 : 1 }} style={{ originX: `${W / 2}px`, originY: '214px' }} transition={{ duration: reduced ? 0 : 0.3 }}>
            <circle cx={W / 2} cy={214} r={40} className="wfc__analyst" />
            <text x={W / 2} y={210} textAnchor="middle" className="wfc__analyst-label">
              The analyst
            </text>
            <text x={W / 2} y={228} textAnchor="middle" className="wfc__analyst-sub">
              connects it all
            </text>
          </m.g>
          {/* The work object */}
          <m.g initial={false} animate={{ x: stationX(objectAt), y: LINE_Y, opacity: connected ? 1 : 0 }} transition={{ type: 'tween', duration: reduced ? 0 : 0.3 }}>
            <rect x={-15} y={-15} width={30} height={30} rx={7} className={`wfc__object${objectAt === B.workline.length - 1 ? ' is-done' : ''}`} />
          </m.g>
        </svg>
      )}
    </div>
  )
}
