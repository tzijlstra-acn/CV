import { Link } from '@tanstack/react-router'
import { useActiveLens } from '@/app/hooks'
import { asset, CV_HREF, mailto, PDF_HREF, site } from '@/data/site'
import { ArrowRight, Download, ICON, RotateCcw } from '@/design-system/icons'
import { useCompact, useIdle, useInView, useSequence } from '@/lib/hooks'

const scene = site.story[0]
const VIEWS = site.scenes.thesisViews
// Steps: 0 scattered signal, 1 condensed into a work object, 2..7 one view each, 8 decision-ready.
const STEPS = VIEWS.length + 3

/** Deterministic scatter so server-free renders and screenshots are stable. */
const DOTS = Array.from({ length: 18 }, (_, i) => {
  const a = (i * 137.508 * Math.PI) / 180
  const r = 10 + ((i * 47) % 42)
  return { x: 70 + Math.cos(a) * r, y: 116 + Math.sin(a) * r * 1.4 }
})

function OpportunityVisual({ start }: { start: boolean }) {
  const lens = useActiveLens()
  const compact = useCompact()
  const seq = useSequence(STEPS, start, 650)
  const step = seq.step
  const W = compact ? 360 : 620
  const H = compact ? 560 : 260

  // Station geometry: horizontal on wide screens, vertical on narrow ones.
  const station = (i: number) => (compact ? { x: 92, y: 120 + i * 66 } : { x: 170 + i * 82, y: 116 })
  const origin = compact ? { x: 92, y: 46 } : { x: 70, y: 116 }
  const objectAt = step <= 1 ? origin : step >= STEPS - 1 ? station(VIEWS.length - 1) : station(step - 2)
  const done = step >= STEPS - 1

  return (
    <figure className="thesis-visual" aria-labelledby="thesis-title">
      <h2 id="thesis-title" className="thesis-visual__title" tabIndex={-1} data-copy>
        {scene.title}
      </h2>
      <div className="thesis-visual__stage">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-labelledby="thesis-svg-desc" className="thesis-svg">
          <desc id="thesis-svg-desc">
            An ambiguous opportunity condenses into one work object, which passes through six views: {VIEWS.map((v) => `${v.label} (${v.output})`).join(', ')}. It ends {site.scenes.thesisResult.toLowerCase()}.
          </desc>
          {/* Track */}
          {compact ? (
            <line x1={92} y1={station(0).y} x2={92} y2={station(VIEWS.length - 1).y} className="thesis-track" />
          ) : (
            <line x1={station(0).x} y1={116} x2={station(VIEWS.length - 1).x} y2={116} className="thesis-track" />
          )}
          {/* Ambiguous signal */}
          {!compact
            ? DOTS.map((d, i) => (
                <circle
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  r={3}
                  className="thesis-dot"
                  style={{ transform: step === 0 ? undefined : `translate(${origin.x - d.x}px, ${origin.y - d.y}px)`, opacity: step === 0 ? 1 : 0, transitionDelay: `${i * 12}ms` }}
                />
              ))
            : null}
          {!compact ? (
            <text x={70} y={step === 0 ? 196 : 158} textAnchor="middle" className="thesis-label thesis-label--muted">
              {step === 0 ? 'Ambiguous opportunity' : 'One work object'}
            </text>
          ) : null}
          {/* Stations */}
          {VIEWS.map((v, i) => {
            const p = station(i)
            const passed = step >= i + 2
            const current = step === i + 2
            const emphasised = !!lens && v.lenses.includes(lens.id)
            return (
              <g key={v.id} className={`thesis-station${passed ? ' is-passed' : ''}${current ? ' is-current' : ''}${emphasised ? ' is-lens' : ''}`}>
                <circle cx={p.x} cy={p.y} r={current ? 11 : 8} className="thesis-station__node" />
                {compact ? (
                  <>
                    <text x={p.x - 24} y={p.y + 5} textAnchor="end" className="thesis-label">
                      {v.label}
                    </text>
                    <text x={p.x + 30} y={p.y + 5} className={`thesis-output${passed ? ' is-on' : ''}`}>
                      {v.output}
                    </text>
                  </>
                ) : (
                  <>
                    <text x={p.x} y={p.y - 30} textAnchor="middle" className="thesis-label">
                      {v.label}
                    </text>
                    {v.output.split(' ').map((w, j) => (
                      <text key={j} x={p.x} y={p.y + 40 + j * 17} textAnchor="middle" className={`thesis-output${passed ? ' is-on' : ''}`}>
                        {w}
                      </text>
                    ))}
                  </>
                )}
              </g>
            )
          })}
          {/* The work object */}
          <g className="thesis-object-group" style={{ transform: `translate(${objectAt.x}px, ${objectAt.y}px)`, opacity: step === 0 ? 0 : 1 }}>
            <rect x={-17} y={-17} width={34} height={34} rx={7} className={`thesis-object${done ? ' is-done' : ''}`} />
            {Array.from({ length: Math.min(VIEWS.length, Math.max(0, step - 1)) }, (_, i) => (
              <rect key={i} x={-11 + (i % 3) * 8} y={-9 + Math.floor(i / 3) * 10} width={6} height={6} rx={1.5} className="thesis-object__facet" />
            ))}
          </g>
          {/* Result */}
          <g className={`thesis-result${done ? ' is-on' : ''}`}>
            {compact ? (
              <text x={92 + 30} y={station(VIEWS.length - 1).y + 44} className="thesis-result__text">
                {site.scenes.thesisResult}
              </text>
            ) : (
              <text x={station(VIEWS.length - 1).x + 18} y={station(0).y + 112} textAnchor="end" className="thesis-result__text">
                {site.scenes.thesisResult}
              </text>
            )}
          </g>
        </svg>
      </div>
      <figcaption className="thesis-visual__caption">
        <span data-copy>{scene.caption}</span>
        <button type="button" className="btn btn--quiet btn--small" onClick={seq.done ? seq.replay : seq.skip} data-testid="thesis-replay">
          {seq.done ? (
            <>
              <RotateCcw {...ICON} size={16} /> Replay
            </>
          ) : (
            'Skip'
          )}
        </button>
      </figcaption>
    </figure>
  )
}

export function S01Thesis() {
  const lens = useActiveLens()
  const [ref, inView] = useInView<HTMLElement>(0.2)
  const idle = useIdle()
  const p = site.profile
  const person = site.person
  return (
    <section id="thesis" ref={ref} className="scene scene--hero" aria-labelledby="hero-title" data-scene="thesis">
      <div className="scene__inner hero">
        <div className="hero__copy">
          <div className="hero__who">
            {p.showPortrait ? <img src={asset(p.portrait)} alt={`Portrait of ${person.name}`} width={56} height={56} className="hero__portrait" /> : null}
            <div>
              <p className="hero__name">{person.name}</p>
              <p className="hero__title t-mono" data-copy>
                {p.title}
              </p>
            </div>
          </div>
          <h1 id="hero-title" className="hero__headline" tabIndex={-1} data-copy>
            {p.headline}
          </h1>
          {lens ? (
            <p className="hero__lens" data-testid="lens-opening" data-copy>
              <span className="t-mono">{lens.label} lens</span> {lens.opening}
            </p>
          ) : (
            <p className="hero__supporting" data-copy>
              {p.supporting}
            </p>
          )}
          <ul className="proof-line" aria-label="Proof line">
            {p.proofLine.map((x) => (
              <li key={x} data-copy>
                {x}
              </li>
            ))}
          </ul>
          <div className="hero__actions">
            <Link to="/evidence" search={(s) => ({ lens: s.lens })} className="btn" data-testid="cta-evidence">
              Explore the evidence <ArrowRight {...ICON} />
            </Link>
            <a href={PDF_HREF} download className="btn btn--ghost" data-testid="cta-pdf">
              <Download {...ICON} /> Download CV
            </a>
            <a href={CV_HREF} className="btn btn--quiet">
              Web CV
            </a>
            <a href={mailto} className="btn btn--quiet">
              Email
            </a>
          </div>
          <p className="hero__roles t-muted" data-copy>
            {p.targetRoles}
          </p>
          <p className="hero__meta t-mono t-muted">
            {person.location} | {person.languages.map((l) => l.name).join(', ')} | {person.international.map((x) => x.city).join(', ')}
          </p>
        </div>
        <OpportunityVisual start={inView && idle} />
      </div>
    </section>
  )
}
