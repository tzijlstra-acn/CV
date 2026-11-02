import { Link } from '@tanstack/react-router'
import { scaleLinear } from 'd3-scale'
import { line } from 'd3-shape'
import { m } from 'motion/react'
import { useMemo, useState } from 'react'
import { SceneFrame } from '@/components/SceneFrame'
import { site } from '@/data/site'
import { ArrowRight, ICON } from '@/design-system/icons'
import { computeEconomics, money, pct, type EconInput, type Hosting } from '@/lib/economics'
import { useReducedMotion } from '@/lib/hooks'
import './economics.css'

const M = site.scenes.economics
const COLOURS: Record<string, string> = { platform: '#121621', dashboards: '#4a3cc9', governance: '#00a6a6', licences: '#d9911b', usage: '#b44d4d' }

function Segmented<T extends string | number>({ label, value, options, onChange, testId }: { label: string; value: T; options: { value: T; label: string }[]; onChange: (v: T) => void; testId: string }) {
  return (
    <div className="econ__control">
      <span className="k" id={`${testId}-label`}>
        {label}
      </span>
      <div className="seg" role="radiogroup" aria-labelledby={`${testId}-label`}>
        {options.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value} className="seg__opt" onClick={() => onChange(o.value)} data-testid={`${testId}-${o.value}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function CumulativeChart({ years, breakEven }: { years: { year: number; cumulative: number }[]; breakEven: number | null }) {
  const W = 520
  const H = 200
  const pad = { l: 64, r: 12, t: 12, b: 28 }
  const ys = years.map((y) => y.cumulative)
  const x = scaleLinear().domain([1, years.length]).range([pad.l, W - pad.r])
  const y = scaleLinear()
    .domain([Math.min(0, ...ys), Math.max(0, ...ys)])
    .nice()
    .range([H - pad.b, pad.t])
  const d = line<{ year: number; cumulative: number }>()
    .x((p) => x(p.year))
    .y((p) => y(p.cumulative))(years)!
  const ticks = y.ticks(4)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="econ__chart" role="img" aria-label={`Cumulative net value over ${years.length} years. ${breakEven ? `Break-even in year ${breakEven}.` : 'No break-even within the horizon.'}`}>
      {ticks.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className={t === 0 ? 'econ__zero' : 'econ__grid'} />
          <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="econ__tick">
            {t === 0 ? '0' : `${t / 1e6}m`}
          </text>
        </g>
      ))}
      {years.map((p) => (
        <text key={p.year} x={x(p.year)} y={H - 8} textAnchor="middle" className="econ__tick">
          {p.year}
        </text>
      ))}
      <path d={d} className="econ__line" />
      {years.map((p) => (
        <circle key={p.year} cx={x(p.year)} cy={y(p.cumulative)} r={p.year === breakEven ? 6 : 3} className={p.year === breakEven ? 'econ__be' : 'econ__dot'} />
      ))}
    </svg>
  )
}

export function S08Economics() {
  const reduced = useReducedMotion()
  const [input, setInput] = useState<EconInput>(M.defaults)
  const r = useMemo(() => computeEconomics(M, input), [input])
  const set = (patch: Partial<EconInput>) => setInput((s) => ({ ...s, ...patch }))

  // "What moves the number": one change at a time, against the current choice.
  const levers = useMemo(() => {
    const delta = (p: Partial<EconInput>) => computeEconomics(M, { ...input, ...p }).allIn - r.allIn
    const out: { label: string; value: number }[] = []
    if (input.functions < 5) out.push({ label: 'One more function shares the platform', value: delta({ functions: input.functions + 1 }) })
    if (input.level < 5) out.push({ label: 'One maturity level up', value: delta({ level: input.level + 1 }) })
    for (const h of M.hosting) if (h.id !== input.hosting) out.push({ label: `Switch hosting to ${h.label.toLowerCase()}`, value: delta({ hosting: h.id }) })
    return out
  }, [input, r.allIn])
  const usageShare = r.lines.find((l) => l.id === 'usage')!.pct

  return (
    <SceneFrame id="economics">
      <div className="econ">
        <div className="econ__controls">
          <Segmented label="Functions sharing the platform" value={input.functions} options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }))} onChange={(v) => set({ functions: v })} testId="econ-functions" />
          <Segmented label="Hosting" value={input.hosting} options={M.hosting.map((h) => ({ value: h.id as Hosting, label: h.label }))} onChange={(v) => set({ hosting: v })} testId="econ-hosting" />
          <Segmented label="Platform maturity" value={input.level} options={[1, 2, 3, 4, 5].map((n) => ({ value: n, label: `L${n}` }))} onChange={(v) => set({ level: v })} testId="econ-level" />
          <div className="econ__levers">
            <p className="k">What moves the number</p>
            <ul role="list">
              {levers.map((l) => (
                <li key={l.label}>
                  <span>{l.label}</span>
                  <b className={l.value < 0 ? 'is-down' : 'is-up'}>
                    {l.value < 0 ? '' : '+'}
                    {money(l.value).replace('minus ', '-')}
                  </b>
                </li>
              ))}
              <li>
                <span>Tokens and usage, all models</span>
                <b>{pct(usageShare)} of cost</b>
              </li>
            </ul>
          </div>
        </div>

        <div className="econ__out" aria-live="polite">
          <dl className="econ__kpis">
            <div>
              <dt>All-in, year one</dt>
              <dd data-testid="econ-allin">{money(r.allIn)}</dd>
            </div>
            <div>
              <dt>Benefit a year, full adoption</dt>
              <dd>{money(r.benefit)}</dd>
            </div>
            <div>
              <dt>Break-even</dt>
              <dd data-testid="econ-breakeven">{r.breakEven ? `Year ${r.breakEven}` : 'Not within 10 years'}</dd>
            </div>
            <div>
              <dt>Ten-year return</dt>
              <dd>{`${r.horizon.roi >= 0 ? '+' : ''}${Math.round(r.horizon.roi * 100)}%`}</dd>
            </div>
          </dl>

          <p className="k econ__bar-k">Where year one goes</p>
          <div className="econ__bar" role="img" aria-label={r.lines.map((l) => `${l.label} ${money(l.value)} (${pct(l.pct)})`).join(', ')}>
            {r.lines.map((l) => (
              <m.span key={l.id} className="seg-fill" style={{ background: COLOURS[l.id] }} initial={false} animate={{ width: `${Math.max(l.pct * 100, 0.6)}%` }} transition={{ duration: reduced ? 0 : 0.35 }} />
            ))}
          </div>
          <ul className="econ__legend" role="list">
            {r.lines.map((l) => (
              <li key={l.id}>
                <span className="econ__sw" style={{ background: COLOURS[l.id] }} aria-hidden="true" />
                <span>{l.label}</span>
                <b>{money(l.value)}</b>
                <span className="t-mono">{pct(l.pct)}</span>
              </li>
            ))}
          </ul>
          <p className="econ__note">
            Sharing saves {money(r.standalone - r.allIn)} a year against running the platform alone ({money(r.standalone)}). Cost per user: {money(r.costPerUserMonth)} a month.
          </p>

          <p className="k econ__bar-k">Cumulative net value, years 1 to {M.horizon}</p>
          <CumulativeChart years={r.years} breakEven={r.breakEven} />
        </div>
      </div>
      <div className="scene-foot">
        <p className="econ__context t-muted">
          {M.context} {M.source}
        </p>
        <Link to="/case/$slug" params={{ slug: 'ai-economics' }} search={(p) => ({ lens: p.lens })} className="btn btn--ghost">
          The simulator case <ArrowRight {...ICON} />
        </Link>
      </div>
    </SceneFrame>
  )
}
