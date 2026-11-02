import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useActiveLens } from '@/app/hooks'
import { DepthGlyph, DepthLabel } from '@/components/Evidence'
import { SceneFrame } from '@/components/SceneFrame'
import { DEPTH_LABEL, getEvidence, site } from '@/data/site'
import { useInView } from '@/lib/hooks'
import './execution.css'

const STAGES = site.scenes.execution

/** The commercial path, with each stage's evidence underneath and thinner stages marked. */
export function S09Execution() {
  const lens = useActiveLens()
  const [ref, inView] = useInView<HTMLDivElement>(0.3)
  const [focus, setFocus] = useState<string | null>(null)
  const gapNote = lens?.honestGap
  return (
    <SceneFrame id="execution">
      <div ref={ref} className={`exe${inView ? ' is-in' : ''}`}>
        <ol className="exe__path">
          {STAGES.map((s, i) => {
            const evidence = s.evidence.map((id) => getEvidence(id)!)
            const lensMatch = !!lens && evidence.some((e) => e.roleFamilies.includes(lens.id))
            return (
              <li
                key={s.id}
                className={`exe__stage${s.gap ? ' is-thin' : ''}${focus === s.id ? ' is-focus' : ''}${lensMatch ? ' is-lens' : ''}`}
                style={{ transitionDelay: `${i * 70}ms` }}
                onMouseEnter={() => setFocus(s.id)}
                onMouseLeave={() => setFocus(null)}
                data-testid={`exe-${s.id}`}
              >
                <div className="exe__marker" aria-hidden="true">
                  <span>{i + 1}</span>
                </div>
                <h3 className="exe__label">{s.label}</h3>
                <ul className="exe__evidence" role="list">
                  {evidence.map((e) => (
                    <li key={e.id}>
                      <DepthGlyph depth={e.depth} />
                      <span className="sr-only">{`${DEPTH_LABEL[e.depth]}: `}</span>
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
                {s.gap ? <p className="exe__gap">{s.gap}</p> : null}
              </li>
            )
          })}
        </ol>
        <div className="exe__foot">
          <DepthLabel depth="professional-delivery" />
          <DepthLabel depth="built-verified" />
          <DepthLabel depth="designed-specified" />
          <span className="exe__thin-key">
            <span aria-hidden="true" className="exe__thin-swatch" /> Thinner evidence, stated openly
          </span>
        </div>
        {gapNote ? (
          <p className="exe__lens-gap" data-testid="lens-gap">
            <span className="t-mono">{lens!.label} lens</span> {gapNote}
          </p>
        ) : null}
      </div>
    </SceneFrame>
  )
}
