import { Link, useParams } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'
import { useActiveLens } from '@/app/hooks'
import { CaseTags, DepthLabel, EvidenceRow } from '@/components/Evidence'
import { getCapability, getCase, getEvidence, orderCases, site } from '@/data/site'
import { ArrowLeft, ArrowRight, ArrowUpRight, ICON } from '@/design-system/icons'
import { Deferred } from '@/lib/Deferred'
import { hasHash } from '@/lib/hooks'
import './case.css'

const NfrBlueprint = lazy(() => import('@/case/NfrBlueprint').then((m) => ({ default: m.NfrBlueprint })))

const STATUS_LABEL = { implemented: 'Implemented', reference: 'Reference or simulated', designed: 'Designed', professional: 'Delivered' } as const

function Section({ id, title, children, kicker }: { id: string; title: string; kicker?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="case__section" aria-labelledby={`${id}-h`}>
      <div className="case__section-head">
        {kicker ? <p className="k">{kicker}</p> : null}
        <h2 id={`${id}-h`}>{title}</h2>
      </div>
      <div className="case__section-body">{children}</div>
    </section>
  )
}

/** Case template (brief section 15): problem, constraints, role, decisions, architecture, evidence, value, learning, limits. */
export function Case() {
  const { slug } = useParams({ strict: false }) as { slug: string }
  const lens = useActiveLens()
  const c = getCase(slug)!
  const ordered = orderCases(site.cases, lens)
  const i = ordered.findIndex((x) => x.slug === c.slug)
  const next = ordered[(i + 1) % ordered.length]
  const prev = ordered[(i - 1 + ordered.length) % ordered.length]
  const evidence = c.evidence.map((id) => getEvidence(id)!).filter(Boolean)
  const isNfr = c.slug === 'nfr-work-fabric'
  // The opening and the problem render first; the rest follows a block per frame, unless a fragment points into it.
  const now = hasHash()

  return (
    <article className="page case" data-testid={`case-${c.slug}`}>
      <nav className="case__crumbs t-mono" aria-label="Breadcrumb">
        <Link to="/" search={(p) => ({ lens: p.lens })} hash="selected-evidence">
          Guided story
        </Link>
        <span aria-hidden="true">/</span>
        <Link to="/evidence" search={(p) => ({ lens: p.lens })}>
          Evidence
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{c.shortTitle}</span>
      </nav>

      <header className="case__hero">
        <CaseTags c={c} />
        <h1 className="case__title" tabIndex={-1}>
          {c.title}
        </h1>
        <p className="case__subtitle">{c.subtitle}</p>
        <ol className="case__story" aria-label="The story this case tells">
          {c.story.map((s, n) => (
            <li key={s}>
              <span className="t-mono">{String(n + 1).padStart(2, '0')}</span> {s}
            </li>
          ))}
        </ol>
        <p className="case__boundary" data-testid="scope-boundary">
          <span className="k">Scope boundary</span> {c.scopeBoundary}
        </p>
        {c.links.length ? (
          <div className="row-actions">
            {c.links.map((l) => (
              <a key={l.href} href={l.href} className="btn btn--ghost btn--small" rel="noopener noreferrer">
                {l.label} <ArrowUpRight {...ICON} size={16} />
              </a>
            ))}
          </div>
        ) : null}
      </header>

      <Section id="problem" title="Problem" kicker="01">
        <p className="case__lead">{c.problem}</p>
        <p className="case__why">
          <span className="k">Why it mattered</span> {c.whyItMattered}
        </p>
      </Section>

      <Deferred now={now}>
        <Section id="constraints" title="Constraints" kicker="02">
          <ul className="case__list" role="list">
            {c.constraints.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Section>

        <Section id="role" title="My role" kicker="03">
          <p className="case__lead">{c.role}</p>
          <ul className="case__contrib" role="list" data-testid="contributions">
            {c.contributions.map((x) => (
              <li key={x.area}>
                <DepthLabel depth={x.depth} />
                <div>
                  <h3>{x.area}</h3>
                  <p>{x.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

      </Deferred>

      <Deferred now={now}>
        <Section id="decisions" title="Key decisions" kicker="04">
          <ol className="case__decisions">
            {c.decisions.map((d) => (
              <li key={d.title}>
                <h3>{d.title}</h3>
                <p>{d.rationale}</p>
              </li>
            ))}
          </ol>
        </Section>

      </Deferred>

      <Deferred now={now}>
        <Section id="architecture" title={isNfr ? 'Architecture and operating model' : 'Architecture'} kicker="05">
          <ol className="case__layers">
            {c.architecture.map((a) => (
              <li key={a.id} className={`case__layer case__layer--${a.status}`}>
                <span className="case__layer-status t-mono">{STATUS_LABEL[a.status]}</span>
                <h3>{a.label}</h3>
                <p>{a.detail}</p>
              </li>
            ))}
          </ol>
          {isNfr ? (
            <Suspense fallback={<p className="t-muted">Loading the interactive blueprint.</p>}>
              <NfrBlueprint />
            </Suspense>
          ) : null}
        </Section>

      </Deferred>

      <Deferred now={now}>
        <Section id="evidence" title="Evidence" kicker="06">
          {evidence.map((e) => (
            <EvidenceRow key={e.id} item={e} />
          ))}
          <p className="case__caps">
            <span className="k">Capabilities shown</span>{' '}
            {c.capabilities.map((id, n) => (
              <span key={id}>
                {n ? ', ' : ''}
                {getCapability(id)?.label}
              </span>
            ))}
          </p>
        </Section>

        <Section id="value" title="Value logic" kicker="07">
          <div className="case__value">
            {c.valueModel.map((v) => (
              <div key={v.lens} className="case__value-item">
                <h3>{v.lens}</h3>
                <p>{v.question}</p>
                <p className="case__signal">
                  <span className="k">Signal</span> {v.signal}
                </p>
              </div>
            ))}
          </div>
        </Section>

      </Deferred>

      <Deferred now={now}>
        <Section id="learned" title="What I learned" kicker="08">
          <ul className="case__list" role="list">
            {c.learned.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Section>

        <Section id="limitations" title="Limitations" kicker="09">
          <ul className="case__list case__list--limits" role="list" data-testid="limitations">
            {c.limitations.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <div className="case__sources">
            <p className="k">Sources</p>
            <ul role="list">
              {c.sources.map((s) => (
                <li key={s.id}>
                  {s.url ? (
                    <a href={s.url} className="text-link" rel="noopener noreferrer">
                      {s.title}
                    </a>
                  ) : (
                    <span>{s.title}</span>
                  )}
                  <span className="t-muted">{s.visibility === 'private' ? ' (private, not published)' : ''}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        <nav className="case__pager" aria-label="More cases">
          <Link to="/case/$slug" params={{ slug: prev.slug }} search={(p) => ({ lens: p.lens })} className="case__pager-link" data-testid="case-prev">
            <ArrowLeft {...ICON} />
            <span>
              <span className="k">Previous</span>
              {prev.title}
            </span>
          </Link>
          <Link to="/case/$slug" params={{ slug: next.slug }} search={(p) => ({ lens: p.lens })} className="case__pager-link case__pager-link--next" data-testid="case-next">
            <span>
              <span className="k">Next</span>
              {next.title}
            </span>
            <ArrowRight {...ICON} />
          </Link>
        </nav>
      </Deferred>
    </article>
  )
}
