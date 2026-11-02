import { Link } from '@tanstack/react-router'
import { DepthLabel } from '@/components/Evidence'
import { SceneFrame } from '@/components/SceneFrame'
import { WorkFabricCompare } from '@/components/WorkFabricCompare'
import { getCase, getEvidence } from '@/data/site'
import { ArrowRight, ICON } from '@/design-system/icons'

const c = getCase('nfr-work-fabric')!

export function S04WorkFabric() {
  return (
    <SceneFrame id="work-fabric">
      <WorkFabricCompare idPrefix="s04" />
      <div className="scene-foot">
        <ul className="scene-foot__evidence" role="list" aria-label="Evidence for this case">
          {c.evidence.map((id) => {
            const e = getEvidence(id)!
            return (
              <li key={id}>
                <DepthLabel depth={e.depth} /> <span>{e.title}</span>
              </li>
            )
          })}
        </ul>
        <Link to="/case/$slug" params={{ slug: c.slug }} search={(p) => ({ lens: p.lens })} className="btn" data-testid="open-nfr-case">
          Open the full case <ArrowRight {...ICON} />
        </Link>
      </div>
      <p className="scene-boundary t-muted">{c.scopeBoundary}</p>
    </SceneFrame>
  )
}
