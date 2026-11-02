import * as Tabs from '@radix-ui/react-tabs'
import { Link } from '@tanstack/react-router'
import { m } from 'motion/react'
import { useState } from 'react'
import { useActiveLens } from '@/app/hooks'
import { DepthGlyph, DepthLabel, DepthLegend } from '@/components/Evidence'
import { SceneFrame } from '@/components/SceneFrame'
import { getEvidence, site } from '@/data/site'
import { useReducedMotion } from '@/lib/hooks'
import './controlled-ai.css'

const LAYERS = site.scenes.controlledAi
const patternById = new Map(site.patterns.map((p) => [p.id, p]))

export function S07ControlledAi() {
  const reduced = useReducedMotion()
  const lens = useActiveLens()
  const [value, setValue] = useState(lens?.id === 'risk' ? 'human' : LAYERS[0].id)
  return (
    <SceneFrame id="controlled-ai" tone="dark">
      <Tabs.Root className="cai" orientation="vertical" value={value} onValueChange={setValue}>
        <Tabs.List className="cai__stack" aria-label="Layers of a controlled AI workflow">
          {LAYERS.map((l, i) => {
            const depths = [...new Set(l.evidence.map((id) => getEvidence(id)!.depth))]
            return (
              <Tabs.Trigger key={l.id} value={l.id} className="cai__layer" style={{ marginLeft: `${i * 10}px` }} data-testid={`cai-${l.id}`}>
                <span className="cai__no t-mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="cai__label">{l.label}</span>
                <span className="cai__marks" aria-hidden="true">
                  {depths.map((d) => (
                    <DepthGlyph key={d} depth={d} onDark />
                  ))}
                </span>
              </Tabs.Trigger>
            )
          })}
        </Tabs.List>
        {LAYERS.map((l, i) => (
          <Tabs.Content key={l.id} value={l.id} className="cai__panel">
            <m.div initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <p className="cai__k t-mono">Layer {i + 1} of {LAYERS.length}</p>
              <h3 className="cai__title">{l.label}</h3>
              <p className="cai__detail">{l.detail}</p>
              <p className="cai__k t-mono">Where the pattern appears</p>
              <ul className="cai__evidence" role="list">
                {l.evidence.map((id) => {
                  const e = getEvidence(id)!
                  return (
                    <li key={id}>
                      <DepthLabel depth={e.depth} onDark />
                      {e.case ? (
                        <Link to="/case/$slug" params={{ slug: e.case }} search={(p) => ({ lens: p.lens })} className="cai__link">
                          {e.title}
                        </Link>
                      ) : (
                        <Link to="/evidence" search={(p) => ({ lens: p.lens, focus: e.id })} className="cai__link">
                          {e.title}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
              {l.patterns.length ? (
                <>
                  <p className="cai__k t-mono">Patterns</p>
                  <ul className="cai__patterns" role="list">
                    {l.patterns.map((pid) => {
                      const p = patternById.get(pid)!
                      const tools = [...new Set(p.uses.map((u) => u.implementedWith).filter(Boolean))]
                      return (
                        <li key={pid}>
                          <b>{p.label}.</b> {p.description}
                          {tools.length ? <span className="cai__tools t-mono"> Implemented with {tools.join(', ')}.</span> : null}
                        </li>
                      )
                    })}
                  </ul>
                </>
              ) : null}
            </m.div>
          </Tabs.Content>
        ))}
      </Tabs.Root>
      <div className="cai__foot">
        <DepthLegend onDark />
      </div>
    </SceneFrame>
  )
}
