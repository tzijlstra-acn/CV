import type { ReactNode } from 'react'
import { site } from '@/data/site'

const sceneById = new Map(site.story.map((s) => [s.id, s]))

/**
 * One guided scene: number, chapter, a conclusion-led title, at most one subhead, and one
 * dominant visual. Copy comes from portfolio-data/guided-story.json.
 */
export function SceneFrame({ id, children, tone = 'light', aside, titleOverride, wide = false }: { id: string; children: ReactNode; tone?: 'light' | 'dark'; aside?: ReactNode; titleOverride?: string; wide?: boolean }) {
  const scene = sceneById.get(id)
  if (!scene) throw new Error(`Unknown scene ${id}`)
  return (
    <section id={id} className={`scene scene--${tone}${wide ? ' scene--wide' : ''}`} aria-labelledby={`${id}-title`} data-scene={id}>
      <div className="scene__inner">
        <header className="scene__head">
          <p className="scene__kicker t-mono">
            <span className="scene__no">{String(scene.number).padStart(2, '0')}</span>
            <span className="scene__chapter">{scene.chapter}</span>
          </p>
          <h2 id={`${id}-title`} className="scene__title" tabIndex={-1} data-copy>
            {titleOverride ?? scene.title}
          </h2>
          {scene.subhead ? (
            <p className="scene__subhead" data-copy>
              {scene.subhead}
            </p>
          ) : null}
          {aside}
        </header>
        <div className="scene__visual">{children}</div>
      </div>
    </section>
  )
}
