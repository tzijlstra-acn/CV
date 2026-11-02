import { Link } from '@tanstack/react-router'
import { ArrowLeft, ICON } from '@/design-system/icons'

export function NotFound() {
  return (
    <section className="page page--narrow notfound" aria-labelledby="nf-title">
      <p className="t-eyebrow">404</p>
      <h1 id="nf-title" tabIndex={-1}>
        This page does not exist
      </h1>
      <p className="t-lead">The link may be out of date. The guided story and the evidence explorer start from here.</p>
      <div className="row-actions">
        <Link to="/" search={(p) => ({ lens: p.lens })} className="btn">
          <ArrowLeft {...ICON} /> Guided story
        </Link>
        <Link to="/evidence" search={(p) => ({ lens: p.lens })} className="btn btn--ghost">
          Evidence explorer
        </Link>
      </div>
    </section>
  )
}
