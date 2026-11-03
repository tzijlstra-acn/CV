import { lazy, Suspense, useEffect, useRef, useState, type ComponentType } from 'react'
import { useUi } from '@/app/ui-store'
import { sceneScroll, scrollToScene } from '@/app/useShortcuts'
import { site } from '@/data/site'
import { Deferred } from '@/lib/Deferred'
import { S01Thesis } from '@/scenes/S01Thesis'

/** The opening scene ships with the page; the scenes below the fold load as separate chunks once the visitor approaches them. */
const LAZY: Record<string, React.LazyExoticComponent<ComponentType>> = {
  career: lazy(() => import('@/scenes/S02Career').then((m) => ({ default: m.S02Career }))),
  fabric: lazy(() => import('@/scenes/S03Fabric').then((m) => ({ default: m.S03Fabric }))),
  'work-fabric': lazy(() => import('@/scenes/S04WorkFabric').then((m) => ({ default: m.S04WorkFabric }))),
  'process-network': lazy(() => import('@/scenes/S05Network').then((m) => ({ default: m.S05Network }))),
  blueprint: lazy(() => import('@/scenes/S06Blueprint').then((m) => ({ default: m.S06Blueprint }))),
  'controlled-ai': lazy(() => import('@/scenes/S07ControlledAi').then((m) => ({ default: m.S07ControlledAi }))),
  economics: lazy(() => import('@/scenes/S08Economics').then((m) => ({ default: m.S08Economics }))),
  execution: lazy(() => import('@/scenes/S09Execution').then((m) => ({ default: m.S09Execution }))),
  discipline: lazy(() => import('@/scenes/S10Discipline').then((m) => ({ default: m.S10Discipline }))),
  'selected-evidence': lazy(() => import('@/scenes/S11Selected').then((m) => ({ default: m.S11Selected }))),
  'role-fit': lazy(() => import('@/scenes/S12RoleFit').then((m) => ({ default: m.S12RoleFit }))),
}

function ScenePlaceholder({ id }: { id: string }) {
  const s = site.story.find((x) => x.id === id)!
  return (
    <section id={id} className="scene scene--placeholder" aria-labelledby={`${id}-title`} data-scene={id}>
      <div className="scene__inner">
        <header className="scene__head">
          <p className="scene__kicker t-mono">
            <span className="scene__no">{String(s.number).padStart(2, '0')}</span>
            <span className="scene__chapter">{s.chapter}</span>
          </p>
          <h2 id={`${id}-title`} className="scene__title" tabIndex={-1}>
            {s.title}
          </h2>
        </header>
      </div>
    </section>
  )
}

/**
 * Mounts a lazy scene only when it enters the viewport (or at once for a direct link). The first visit renders the opening scene and nothing else, which keeps the main
 * thread free while the page loads; each later scene loads as a small chunk just before it is seen.
 */
function LazyScene({ id, eager }: { id: string; eager: boolean }) {
  const Comp = LAZY[id]
  const ref = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(eager)
  useEffect(() => {
    if (mounted || !ref.current) return
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setMounted(true), { rootMargin: '0px' })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [mounted])
  return (
    <div ref={ref} className="scene-slot">
      {mounted ? (
        <Suspense fallback={<ScenePlaceholder id={id} />}>
          <Comp />
        </Suspense>
      ) : (
        <ScenePlaceholder id={id} />
      )}
    </div>
  )
}

function StoryRail() {
  const active = useUi((s) => s.activeScene)
  return (
    <nav className="rail" aria-label="Guided story scenes" data-qa-chrome>
      <ol className="rail__list">
        {site.story.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="rail__item"
              aria-current={active === s.id ? 'step' : undefined}
              onClick={(e) => {
                e.preventDefault()
                scrollToScene(s.id)
              }}
            >
              <span className="rail__no t-mono">{String(s.number).padStart(2, '0')}</span>
              <span className="rail__label">{s.short}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function Guided() {
  const setActive = useUi((s) => s.setActiveScene)
  const [target] = useState(() => (typeof location !== 'undefined' ? decodeURIComponent(location.hash.slice(1)) : ''))
  const targetIndex = site.story.findIndex((s) => s.id === target)

  // Which scene is in view drives the rail and the arrow keys.
  useEffect(() => {
    const seen = new Map<string, number>()
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set((e.target as HTMLElement).dataset.scene!, e.intersectionRatio)
        let best = ''
        let ratio = 0
        for (const [id, r] of seen) {
          if (r > ratio) {
            best = id
            ratio = r
          }
        }
        if (best && Date.now() > sceneScroll.lockUntil) setActive(best)
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.85] },
    )
    const observe = () => document.querySelectorAll<HTMLElement>('[data-scene]').forEach((el) => io.observe(el))
    observe()
    const mo = new MutationObserver(observe)
    mo.observe(document.getElementById('story')!, { childList: true, subtree: true })
    return () => (io.disconnect(), mo.disconnect())
  }, [setActive])

  // A deep link such as /CV/#economics lands on its scene once it has mounted.
  useEffect(() => {
    if (targetIndex < 0) return
    const t = setTimeout(() => document.getElementById(target)?.scrollIntoView({ block: 'start' }), 60)
    return () => clearTimeout(t)
  }, [target, targetIndex])

  return (
    <div className="guided">
      <StoryRail />
      <div id="story" className="story">
        <S01Thesis />
        {/* The rest of the story follows the opening scene by a frame, unless the visitor is headed for one of its scenes. */}
        <Deferred now={targetIndex >= 0}>
          {site.story.map((s, i) => (i === 0 ? null : <LazyScene key={s.id} id={s.id} eager={targetIndex >= 0 && i <= targetIndex + 1} />))}
        </Deferred>
      </div>
    </div>
  )
}
