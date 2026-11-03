import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useActiveLens } from '@/app/hooks'
import { SceneFrame } from '@/components/SceneFrame'
import { getEvidence, site } from '@/data/site'
import { DepthLabel } from '@/components/Evidence'
import { useCompact, useInView, useReducedMotion } from '@/lib/hooks'

const STAGES = site.career
const STRAND_COLOURS = ['#9aa3b5', '#121621', '#4a3cc9', '#00a6a6', '#6557e8', '#d9911b']

/**
 * Career arc: each stage starts a capability strand that runs on to the present, so the right
 * edge shows everything accumulated. Employers, roles and dates come from content.json.
 */
function Strands({ start, focus }: { start: boolean; focus: number }) {
  const reduced = useReducedMotion()
  const W = 1200
  const H = 230
  const x = (i: number) => 60 + i * ((W - 420) / (STAGES.length - 1))
  const y = (i: number) => 40 + i * 30
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="career-svg" aria-hidden="true">
      {STAGES.map((s, i) => {
        const d = `M ${x(i)} ${H - 24} C ${x(i)} ${y(i) + 40}, ${x(i) + 40} ${y(i)}, ${x(i) + 90} ${y(i)} L ${W - 20} ${y(i)}`
        return (
          <path
            key={s.id}
            d={d}
            pathLength={1}
            fill="none"
            stroke={STRAND_COLOURS[i]}
            strokeWidth={focus === i ? 4 : 2.5}
            strokeLinecap="round"
            className="career-strand"
            style={{ strokeDashoffset: start || reduced ? 0 : 1, opacity: focus === -1 || focus === i ? 1 : 0.35, transitionDelay: `${0.15 * i}s, 0s` }}
          />
        )
      })}
      {STAGES.map((s, i) => (
        <text key={s.id} x={W - 26} y={y(i) - 7} textAnchor="end" className={`career-strand-label${focus === i ? ' is-focus' : ''}`}>
          {s.strand}
        </text>
      ))}
      <line x1={40} y1={H - 24} x2={W - 20} y2={H - 24} className="career-baseline" />
      {STAGES.map((s, i) => (
        <circle key={s.id} cx={x(i)} cy={H - 24} r={focus === i ? 8 : 6} fill={STRAND_COLOURS[i]} className="career-node" />
      ))}
    </svg>
  )
}

export function S02Career() {
  const lens = useActiveLens()
  const compact = useCompact()
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  const initial = lens ? STAGES.findIndex((s) => s.id === lens.careerFocus[0]) : STAGES.length - 1
  const [focus, setFocus] = useState<number | null>(null)
  const current = focus ?? initial
  const stage = STAGES[current]
  return (
    <SceneFrame id="career">
      <div ref={ref} className="career">
        {!compact ? <Strands start={inView} focus={current} /> : null}
        <ol className="career__stages" data-owns-arrows>
          {STAGES.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                className={`career__stage${current === i ? ' is-active' : ''}${lens?.careerFocus.includes(s.id) ? ' is-lens' : ''}`}
                aria-pressed={current === i}
                onClick={() => setFocus(i)}
                onMouseEnter={() => setFocus(i)}
                onFocus={() => setFocus(i)}
                data-testid={`career-${s.id}`}
              >
                <span className="career__swatch" style={{ background: STRAND_COLOURS[i] }} aria-hidden="true" />
                <span className="career__label">{s.label}</span>
                <span className="career__org t-mono">{s.experience.map((e) => e.company).join(', ')}</span>
              </button>
            </li>
          ))}
        </ol>
        <div className="career__detail" aria-live="polite">
          <p className="t-eyebrow">
            {stage.experience.map((e) => `${e.role}, ${e.company}, ${e.location}`).join(' | ')} <span className="career__period">{stage.experience[0].period}</span>
          </p>
          <p className="career__added" data-copy>
            <span className="career__k">Capability added</span> {stage.capabilityAdded}
          </p>
          <ul className="career__evidence" role="list">
            {stage.evidence.map((id) => {
              const e = getEvidence(id)!
              return (
                <li key={id}>
                  <DepthLabel depth={e.depth} compact />
                  {e.case ? (
                    <Link to="/case/$slug" params={{ slug: e.case }} search={(p) => ({ lens: p.lens })} className="text-link">
                      {e.title}
                    </Link>
                  ) : (
                    <Link to="/evidence" search={(p) => ({ lens: p.lens, focus: e.id })} className="text-link">
                      {e.title}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </SceneFrame>
  )
}
