import * as Tabs from '@radix-ui/react-tabs'
import { m } from 'motion/react'
import { useState } from 'react'
import { Cascade } from '@/components/Cascade'
import { DepthLabel } from '@/components/Evidence'
import { ProcessNetwork } from '@/components/ProcessNetwork'
import { WorkFabricCompare } from '@/components/WorkFabricCompare'
import { site } from '@/data/site'
import { Check, ICON, X } from '@/design-system/icons'
import { useReducedMotion } from '@/lib/hooks'
import './nfr.css'

const B = site.blueprint
type RouteId = (typeof B.routes)[number]['id'] | 'all'

function Module({ id, title, children, label = 'designed-specified' as const }: { id: string; title: string; children: React.ReactNode; label?: 'designed-specified' | 'built-verified' }) {
  return (
    <section id={`bp-${id}`} className="bp__module" aria-labelledby={`bp-${id}-h`} data-module={id}>
      <div className="bp__module-head">
        <h3 id={`bp-${id}-h`}>{title}</h3>
        <span className="bp__tags">
          <DepthLabel depth={label} />
          <span className="type-tag">Synthetic example</span>
        </span>
      </div>
      {children}
    </section>
  )
}

/** Switch the role; the work object, its state and its history stay exactly the same. */
function RoleViews() {
  const [role, setRole] = useState(B.roles[0].id)
  const reduced = useReducedMotion()
  const r = B.roles.find((x) => x.id === role)!
  const wo = B.workObject
  return (
    <Tabs.Root value={role} onValueChange={setRole} className="roles">
      <Tabs.List className="roles__tabs" aria-label="View the same work object as">
        {B.roles.map((x) => (
          <Tabs.Trigger key={x.id} value={x.id} className="roles__tab" data-testid={`role-${x.id}`}>
            {x.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {B.roles.map((x) => (
        <Tabs.Content key={x.id} value={x.id} className="roles__panel">
          <div className="roles__object" data-testid="work-object">
            <p className="k">{wo.type}</p>
            <p className="roles__object-title">{wo.title}</p>
            <dl className="roles__fields">
              {wo.fields.map((f) => (
                <div key={f.id}>
                  <dt>{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="roles__same t-mono">Same object, same state, same history for every role.</p>
          </div>
          <m.div className="roles__view" key={r.id} initial={reduced ? false : { opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.22 }}>
            <div>
              <p className="k">Sees</p>
              <ul role="list" className="roles__list">
                {x.sees.map((s) => (
                  <li key={s}>{s}</li>
                ))}
                {x.hidden.map((s) => (
                  <li key={s} className="roles__hidden">
                    <span className="roles__redact" aria-hidden="true" />
                    <span>Withheld: {s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="k">Can and cannot</p>
              <ul role="list" className="roles__list">
                {x.can.map((s) => (
                  <li key={s} className="roles__can">
                    <Check {...ICON} size={16} /> {s}
                  </li>
                ))}
                {x.cannot.map((s) => (
                  <li key={s} className="roles__cannot">
                    <X {...ICON} size={16} /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </m.div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

/** Work runs horizontally; switch on the vertical planes that every step relies on. */
function LayersReveal() {
  const [on, setOn] = useState<Record<string, boolean>>({ services: true, security: false, governance: false })
  const layers = [
    { id: 'services', label: 'Shared services', items: B.planes.find((p) => p.id === 'services')!.items, tone: 0 },
    { id: 'security', label: 'Security and authority', items: B.securityChain.map((s) => s.label), tone: 1 },
    { id: 'governance', label: 'Governance and management', items: B.lifecycle.map((l) => l.label), tone: 2 },
  ]
  return (
    <div className="layers">
      <div className="layers__toggles" role="group" aria-label="Vertical layers">
        {layers.map((l) => (
          <button key={l.id} type="button" className="filter__opt" aria-pressed={on[l.id]} onClick={() => setOn((s) => ({ ...s, [l.id]: !s[l.id] }))} data-testid={`layer-${l.id}`}>
            {l.label}
          </button>
        ))}
      </div>
      <div className="layers__stage">
        <ol className="layers__line" aria-label="Workline">
          {B.workline.map((s) => (
            <li key={s.id}>{s.label}</li>
          ))}
        </ol>
        <div className="layers__planes">
          {layers.map((l) => (
            <div key={l.id} className={`layers__plane layers__plane--${l.tone}${on[l.id] ? ' is-on' : ''}`} aria-hidden={!on[l.id]}>
              <p className="layers__plane-h">{l.label}</p>
              <ul role="list">
                {l.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="layers__rule t-mono">Work moves horizontally. Shared services, controls and management run vertically through every step.</p>
    </div>
  )
}

function ContractInspector() {
  const [group, setGroup] = useState(B.contract[0].group)
  return (
    <div className="contract">
      <div className="contract__doc" role="group" aria-label="Process module contract">
        <p className="contract__head t-mono">module: third-party-incident | version 1.4 | owner: TPRM process owner</p>
        <div className="contract__groups">
          {B.contract.map((g) => (
            <button key={g.group} type="button" className={`contract__group${group === g.group ? ' is-on' : ''}`} aria-pressed={group === g.group} onClick={() => setGroup(g.group)} data-testid={`contract-${g.group.toLowerCase()}`}>
              <span className="contract__g">{g.group}</span>
              <span className="contract__n t-mono">{g.fields.length} fields</span>
            </button>
          ))}
        </div>
      </div>
      <div className="contract__fields" aria-live="polite">
        <p className="k">{group}</p>
        <ul role="list">
          {B.contract
            .find((g) => g.group === group)!
            .fields.map((f) => (
              <li key={f} className="t-mono">
                {f}
              </li>
            ))}
        </ul>
        <p className="contract__note">Processes differ, but every module declares the same contract, so the platform does not have to be rebuilt for each one.</p>
      </div>
    </div>
  )
}

function SecurityModule() {
  return (
    <div className="sec">
      <ol className="sec__chain">
        {B.securityChain.map((s, i) => (
          <li key={s.id}>
            <span className="sec__no t-mono">{String(i + 1).padStart(2, '0')}</span>
            <b>{s.label}</b>
            <span>{s.detail}</span>
          </li>
        ))}
      </ol>
      <div className="sec__life">
        <p className="k">Every governed asset follows one lifecycle</p>
        <ol className="sec__steps">
          {B.lifecycle.map((l) => (
            <li key={l.id}>{l.label}</li>
          ))}
        </ol>
        <p className="t-muted sec__assets">Process modules, workspaces, models, agents, prompts, rules, connectors and data products.</p>
      </div>
    </div>
  )
}

function OperatingModel() {
  return (
    <div>
      <div className="om">
        {B.operatingModel.map((o) => (
          <div key={o.id} className={`om__group${o.id === 'oversight' ? ' om__group--oversight' : ''}`}>
            <h4>{o.label}</h4>
            <ul role="list">
              {o.owns.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="om__rule">The Work Fabric team does not own every NFR process. Process owners do not rebuild shared infrastructure.</p>
    </div>
  )
}

function ValueCost() {
  const [view, setView] = useState<'value' | 'cost'>('value')
  return (
    <div>
      <div className="seg" role="radiogroup" aria-label="Lens">
        <button type="button" role="radio" aria-checked={view === 'value'} className="seg__opt" onClick={() => setView('value')} data-testid="lens-value">
          Six value lenses
        </button>
        <button type="button" role="radio" aria-checked={view === 'cost'} className="seg__opt" onClick={() => setView('cost')} data-testid="lens-cost">
          Four cost lenses
        </button>
      </div>
      {view === 'value' ? (
        <ul className="vc" role="list">
          {B.valueLenses.map((v) => (
            <li key={v.id}>
              <h4>{v.label}</h4>
              <p>{v.question}</p>
              <p className="t-mono vc__m">{v.measure}</p>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="vc" role="list">
          {B.costLenses.map((v) => (
            <li key={v.id}>
              <h4>{v.label}</h4>
              <p>{v.detail}</p>
            </li>
          ))}
          <li className="vc__unit">
            <h4>Unit measure</h4>
            <p>Cost per completed, controlled process, with onboarding cost and change latency per module.</p>
          </li>
        </ul>
      )}
      <p className="t-muted vc__note">No value numbers are claimed: they need a baseline in the organisation's own context.</p>
    </div>
  )
}

function Roadmap() {
  return (
    <ol className="rm">
      {B.roadmap.map((r, i) => (
        <li key={r.id}>
          <span className="rm__no t-mono">Phase {i + 1}</span>
          <h4>{r.label}</h4>
          <p>{r.focus}</p>
          <p className="rm__gate">
            <span className="k">Gate</span> {r.gate}
          </p>
        </li>
      ))}
    </ol>
  )
}

function BuildRecord() {
  return (
    <div>
      <dl className="br">
        {B.buildRecord.map((b) => (
          <div key={b.id}>
            <dt>{b.label}</dt>
            <dd>{b.value}</dd>
          </div>
        ))}
      </dl>
      <p className="t-muted br__note">From the private build's final verification record. Every library was adopted only after its purpose, licence, bundle impact, risk and fallback were written down.</p>
    </div>
  )
}

const MODULES: { id: string; title: string; label?: 'built-verified'; render: () => React.ReactNode }[] = [
  { id: 'journey', title: 'From fragmented work to one governed flow', render: () => <WorkFabricCompare idPrefix="case" /> },
  { id: 'planes', title: 'Services and controls as vertical layers', render: () => <LayersReveal /> },
  { id: 'roles', title: 'One work object, a different view for every role', render: () => <RoleViews /> },
  { id: 'network', title: 'Eight processes, one network, one synthetic event', render: () => <ProcessNetwork idPrefix="case-net" /> },
  { id: 'contract', title: 'The process-module contract', render: () => <ContractInspector /> },
  { id: 'cascade', title: 'From business problem to operating model', render: () => <Cascade autoplay={false} /> },
  { id: 'security', title: 'Authority is checked at every action', render: () => <SecurityModule /> },
  { id: 'operating-model', title: 'Federated ownership on a shared platform', render: () => <OperatingModel /> },
  { id: 'value', title: 'Value and cost lenses', render: () => <ValueCost /> },
  { id: 'roadmap', title: 'Understand first, start small, grow by cluster', render: () => <Roadmap /> },
  { id: 'delivery', title: 'Delivery and quality record', label: 'built-verified', render: () => <BuildRecord /> },
]

export function NfrBlueprint() {
  const [route, setRoute] = useState<RouteId>('all')
  const active = route === 'all' ? null : new Set(B.routes.find((r) => r.id === route)!.sections)
  const shown = MODULES.filter((mod) => !active || active.has(mod.id))
  return (
    <div className="bp" data-testid="nfr-blueprint">
      <div className="bp__routes">
        <p className="k" id="bp-route-label">
          Read the blueprint as
        </p>
        <div className="seg" role="radiogroup" aria-labelledby="bp-route-label">
          {(['all', ...B.routes.map((r) => r.id)] as RouteId[]).map((id) => (
            <button key={id} type="button" role="radio" aria-checked={route === id} className="seg__opt" onClick={() => setRoute(id)} data-testid={`route-${id}`}>
              {id === 'all' ? 'Everything' : B.routes.find((r) => r.id === id)!.label}
            </button>
          ))}
        </div>
        <p className="bp__count t-mono" aria-live="polite">
          {shown.length} of {MODULES.length} modules
        </p>
      </div>
      {shown.map((mod) => (
        <Module key={mod.id} id={mod.id} title={mod.title} label={mod.label}>
          {mod.render()}
        </Module>
      ))}
    </div>
  )
}
