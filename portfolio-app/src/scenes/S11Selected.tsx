import { Link } from '@tanstack/react-router'
import { useActiveLens } from '@/app/hooks'
import { CaseTags, DepthLabel } from '@/components/Evidence'
import { SceneFrame } from '@/components/SceneFrame'
import { getCase, getEvidence, orderCases, primaryCases, site } from '@/data/site'
import { ArrowRight, ICON } from '@/design-system/icons'
import './selected.css'

const professional = getCase('data-reporting-transformation')

export function S11Selected() {
  const lens = useActiveLens()
  const cases = orderCases(primaryCases, lens)
  return (
    <SceneFrame id="selected-evidence">
      <ol className="sel" data-testid="selected-cases">
        {cases.map((c, i) => {
          const depths = [...new Set(c.evidence.map((id) => getEvidence(id)!.depth))]
          return (
            <li key={c.slug} className={`sel__row${lens?.startCase === c.slug ? ' is-lens' : ''}`}>
              <span className="sel__no t-mono">{String(i + 1).padStart(2, '0')}</span>
              <div className="sel__main">
                <h3 className="sel__title">
                  <Link to="/case/$slug" params={{ slug: c.slug }} search={(p) => ({ lens: p.lens })}>
                    {c.title}
                  </Link>
                </h3>
                <p className="sel__sub">{c.subtitle}</p>
                <p className="sel__boundary t-muted">{c.limitations[0]}</p>
              </div>
              <div className="sel__meta">
                <CaseTags c={c} />
                <span className="sel__depths">
                  {depths.map((d) => (
                    <DepthLabel key={d} depth={d} />
                  ))}
                </span>
              </div>
              <Link to="/case/$slug" params={{ slug: c.slug }} search={(p) => ({ lens: p.lens })} className="sel__go" aria-label={`Open ${c.title}`}>
                <ArrowRight {...ICON} />
              </Link>
            </li>
          )
        })}
      </ol>
      <div className="scene-foot">
        <p className="sel__more">
          {professional ? (
            <>
              Plus one anonymised professional case:{' '}
              <Link to="/case/$slug" params={{ slug: professional.slug }} search={(p) => ({ lens: p.lens })} className="text-link">
                {professional.title}
              </Link>
              .{' '}
            </>
          ) : null}
          {site.stats.archive} further experiments are in the{' '}
          <Link to="/evidence" search={(p) => ({ lens: p.lens, archive: true })} className="text-link">
            evidence archive
          </Link>
          .
        </p>
      </div>
    </SceneFrame>
  )
}
