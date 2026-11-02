import { Link } from '@tanstack/react-router'
import { useActiveLens } from '@/app/hooks'
import { DepthLegend } from '@/components/Evidence'
import { FabricGraph } from '@/components/FabricGraph'
import { SceneFrame } from '@/components/SceneFrame'
import { site } from '@/data/site'
import { ArrowRight, ICON } from '@/design-system/icons'

export function S03Fabric() {
  const lens = useActiveLens()
  const s = site.stats
  return (
    <SceneFrame
      id="fabric"
      aside={
        <p className="fabric-stats t-mono">
          {s.headlineCapabilities} capabilities | {s.evidence} evidence items | {s.professional} professional | {s.publicBuilds} public builds | {s.privateBlueprints} private blueprint
        </p>
      }
    >
      <FabricGraph key={lens?.id ?? 'all'} lens={lens} />
      <div className="fabric-foot">
        <DepthLegend />
        <div className="row-actions">
          <Link to="/capabilities" search={(p) => ({ lens: p.lens })} className="btn btn--ghost btn--small">
            All {s.capabilities} capabilities <ArrowRight {...ICON} size={16} />
          </Link>
          <Link to="/evidence" search={(p) => ({ lens: p.lens })} className="btn btn--ghost btn--small">
            Evidence explorer <ArrowRight {...ICON} size={16} />
          </Link>
        </div>
      </div>
    </SceneFrame>
  )
}
