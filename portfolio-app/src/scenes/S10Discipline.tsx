import { SceneFrame } from '@/components/SceneFrame'
import { site } from '@/data/site'
import { useInView, useSequence } from '@/lib/hooks'
import './discipline.css'

const GATES = site.scenes.discipline
const fill = (t: string) => t.replace(/\{(\w+)\}/g, (_, k: string) => String((site.stats as Record<string, number>)[k] ?? k))

/** Ten release gates. Figures for this portfolio are derived from its own source at build time. */
export function S10Discipline() {
  const [ref, inView] = useInView<HTMLDivElement>(0.25)
  const seq = useSequence(GATES.length + 1, inView, 260)
  return (
    <SceneFrame id="discipline">
      <div ref={ref} className="gates" role="table" aria-label="Delivery gates with evidence from this portfolio and from the Work Fabric build">
        <div className="gates__row gates__row--head" role="row">
          <span role="columnheader" className="k">
            Gate
          </span>
          <span role="columnheader" className="k">
            This portfolio
          </span>
          <span role="columnheader" className="k">
            Work Fabric build (private)
          </span>
        </div>
        {GATES.map((g, i) => (
          <div key={g.id} className={`gates__row${seq.step > i ? ' is-passed' : ''}`} role="row" data-testid={`gate-${g.id}`}>
            <span role="rowheader" className="gates__gate">
              <span className="gates__tick" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              {g.label}
            </span>
            <span role="cell">{fill(g.portfolio)}</span>
            <span role="cell" className="t-muted">
              {g.workFabric}
            </span>
          </div>
        ))}
      </div>
    </SceneFrame>
  )
}
