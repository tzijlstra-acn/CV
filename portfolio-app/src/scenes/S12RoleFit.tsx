import { Link } from '@tanstack/react-router'
import { useActiveLens } from '@/app/hooks'
import { SceneFrame } from '@/components/SceneFrame'
import { CV_HREF, mailto, PDF_HREF, site } from '@/data/site'
import { ArrowRight, Download, FileText, GitBranch, ICON, Mail } from '@/design-system/icons'
import './role-fit.css'

export function S12RoleFit() {
  const lens = useActiveLens()
  const p = site.profile
  return (
    <SceneFrame id="role-fit">
      <div className="fit">
        <div className="fit__statement">
          <p className="fit__conclusion" data-copy>
            {p.conclusion}
          </p>
          {lens ? (
            <p className="fit__lens" data-testid="lens-conclusion" data-copy>
              <span className="t-mono">{lens.label} lens</span> {lens.conclusion}
            </p>
          ) : (
            <p className="fit__lens fit__lens--neutral" data-copy>
              {p.targetRoles}
            </p>
          )}
          <p className="fit__proposition t-mono">{p.proposition}</p>
        </div>
        <div className="fit__actions">
          <a href={PDF_HREF} download className="btn" data-testid="fit-pdf">
            <Download {...ICON} /> Download CV
          </a>
          <a href={CV_HREF} className="btn btn--ghost">
            <FileText {...ICON} /> View web CV
          </a>
          <Link to="/evidence" search={(s) => ({ lens: s.lens })} className="btn btn--ghost">
            Explore evidence <ArrowRight {...ICON} />
          </Link>
          <a href={mailto} className="btn btn--ghost">
            <Mail {...ICON} /> {site.person.email}
          </a>
          <a href={site.person.github} className="btn btn--ghost" rel="noopener noreferrer">
            <GitBranch {...ICON} /> GitHub
          </a>
          <p className="fit__meta t-mono t-muted">
            {site.person.location} | {site.person.languages.map((l) => `${l.name} (${l.level.toLowerCase()})`).join(', ')}
            {p.availability ? ` | ${p.availability}` : ''}
          </p>
        </div>
      </div>
    </SceneFrame>
  )
}
