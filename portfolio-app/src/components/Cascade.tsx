import * as Tabs from '@radix-ui/react-tabs'
import { m } from 'motion/react'
import { useEffect, useState } from 'react'
import { site } from '@/data/site'
import { useInView, useReducedMotion } from '@/lib/hooks'
import { DepthLabel } from './Evidence'
import './cascade.css'

const B = site.blueprint
const NET = site.network

/** A small, data-driven rendering of each artefact, so the step shows its output, not a claim. */
function Artefact({ id }: { id: string }) {
  switch (id) {
    case 'problem':
      return (
        <ul className="art art--chips" role="list">
          {B.fragments.map((f) => (
            <li key={f.id} className={`art__chip art__chip--${f.kind}`}>
              {f.label}
            </li>
          ))}
        </ul>
      )
    case 'value-thesis':
      return (
        <ul className="art art--grid3" role="list">
          {B.valueLenses.map((v) => (
            <li key={v.id}>
              <b>{v.label}</b>
              <span>{v.measure}</span>
            </li>
          ))}
        </ul>
      )
    case 'process-model':
      return (
        <div className="art">
          <ul className="art art--chips" role="list">
            {NET.processes.map((p) => (
              <li key={p.id} className={`art__chip${p.hub ? ' art__chip--hub' : ''}`}>
                {p.abbreviation}
              </li>
            ))}
          </ul>
          <p className="art__note t-mono">
            {NET.processes.reduce((n, p) => n + p.steps, 0)} source steps, {NET.links.length} cross-process links, hubs RCSA and ORM
          </p>
        </div>
      )
    case 'contract':
      return (
        <ul className="art art--cols" role="list">
          {B.contract.map((g) => (
            <li key={g.group}>
              <b>{g.group}</b>
              <span>{g.fields.slice(0, 4).join(', ')}</span>
            </li>
          ))}
        </ul>
      )
    case 'role-views':
      return (
        <ul className="art art--grid3" role="list">
          {B.roles.map((r) => (
            <li key={r.id}>
              <b>{r.label}</b>
              <span>Can: {r.can[0].toLowerCase()}</span>
              <span>Cannot: {r.cannot[0].toLowerCase()}</span>
            </li>
          ))}
        </ul>
      )
    case 'shared-services':
      return (
        <ul className="art art--chips" role="list">
          {B.planes
            .find((p) => p.id === 'services')!
            .items.map((i) => (
              <li key={i} className="art__chip art__chip--service">
                {i}
              </li>
            ))}
        </ul>
      )
    case 'controls':
      return (
        <ol className="art art--chain">
          {B.securityChain.map((s) => (
            <li key={s.id}>{s.label}</li>
          ))}
        </ol>
      )
    case 'roadmap':
      return (
        <ol className="art art--stages">
          {B.roadmap.map((r) => (
            <li key={r.id}>
              <b>{r.label}</b>
              <span>Gate: {r.gate}</span>
            </li>
          ))}
        </ol>
      )
    case 'operating-model':
      return (
        <ul className="art art--grid2" role="list">
          {B.operatingModel.map((o) => (
            <li key={o.id}>
              <b>{o.label}</b>
              <span>{o.owns.slice(0, 3).join(', ')}</span>
            </li>
          ))}
        </ul>
      )
    default:
      return null
  }
}

export function Cascade({ autoplay = true }: { autoplay?: boolean }) {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  const [value, setValue] = useState(B.cascade[0].id)
  const [touched, setTouched] = useState(false)
  const index = B.cascade.findIndex((c) => c.id === value)

  // Walk the cascade once when it comes into view, until the visitor takes over.
  useEffect(() => {
    if (!autoplay || !inView || touched || reduced || index >= B.cascade.length - 1) return
    const t = setTimeout(() => setValue(B.cascade[index + 1].id), 1500)
    return () => clearTimeout(t)
  }, [autoplay, inView, touched, reduced, index])

  return (
    <div ref={ref}>
      <Tabs.Root
        className="cascade"
        orientation="vertical"
        value={value}
        onValueChange={(v) => {
          setTouched(true)
          setValue(v)
        }}
        activationMode="automatic"
      >
        <Tabs.List className="cascade__list" aria-label="From business problem to operating model">
          {B.cascade.map((c, i) => (
            <Tabs.Trigger key={c.id} value={c.id} className={`cascade__step${i < index ? ' is-done' : ''}`} data-testid={`cascade-${c.id}`}>
              <span className="cascade__no t-mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="cascade__label">{c.label}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {B.cascade.map((c, i) => (
          <Tabs.Content key={c.id} value={c.id} className="cascade__panel">
            <m.div initial={reduced ? false : { opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28 }}>
              <div className="cascade__panel-head">
                <p className="k">
                  Artefact {i + 1} of {B.cascade.length}
                  {i > 0 ? ` | input: ${B.cascade[i - 1].label.toLowerCase()}` : ''}
                </p>
                <DepthLabel depth="designed-specified" />
              </div>
              <h3 className="cascade__title">{c.label}</h3>
              <p className="cascade__detail">{c.detail}</p>
              <Artefact id={c.id} />
            </m.div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <div className="cascade__progress" aria-hidden="true">
        <span style={{ width: `${((index + 1) / B.cascade.length) * 100}%` }} />
      </div>
    </div>
  )
}
