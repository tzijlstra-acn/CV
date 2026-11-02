import { useEffect } from 'react'
import { useNavigate, useRouterState } from '@tanstack/react-router'
import { useUi } from './ui-store'
import { site } from '@/data/site'

const SCENES = site.story.map((s) => s.id)

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  if (!el) return false
  return el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.getAttribute('role') === 'slider'
}

/** Widgets that own the arrow keys (tabs, sliders, toggle groups) keep them. */
function ownsArrows(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null
  return !!el?.closest('[role="tablist"], [role="radiogroup"], [role="slider"], [data-owns-arrows]')
}

/** While a programmatic scroll is in flight, the scroll observer must not overwrite the target. */
export const sceneScroll = { lockUntil: 0 }

export function scrollToScene(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  useUi.getState().setActiveScene(id)
  sceneScroll.lockUntil = Date.now() + 900
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(history.state, '', `${location.pathname}${location.search}#${id}`)
  const heading = el.querySelector<HTMLElement>('h1, h2')
  heading?.focus({ preventScroll: true })
}

/**
 * Keyboard model (brief section 18.2):
 * Left/Right scenes, G overview, E evidence, L lens, M menu, C command palette,
 * P guided/explorer, ? help, Escape closes overlays (handled by Radix).
 */
export function useShortcuts() {
  const navigate = useNavigate()
  const routeId = useRouterState({ select: (s) => s.matches[s.matches.length - 1]?.routeId ?? '' })
  const { overlay, open, activeScene } = useUi()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      if (overlay !== 'none' || isTyping(e.target)) return
      const guided = routeId === '/'
      const key = e.key
      if ((key === 'ArrowRight' || key === 'ArrowLeft') && guided && !ownsArrows(e.target)) {
        const i = Math.max(0, SCENES.indexOf(activeScene))
        const next = key === 'ArrowRight' ? Math.min(SCENES.length - 1, i + 1) : Math.max(0, i - 1)
        if (next !== i) {
          e.preventDefault()
          scrollToScene(SCENES[next])
        }
        return
      }
      switch (key.toLowerCase()) {
        case 'g':
          e.preventDefault()
          open('overview')
          break
        case 'e':
          e.preventDefault()
          void navigate({ to: '/evidence', search: (prev) => ({ lens: prev.lens }) })
          break
        case 'l':
          e.preventDefault()
          open('lens')
          break
        case 'm':
          e.preventDefault()
          open('menu')
          break
        case 'c':
          e.preventDefault()
          open('palette')
          break
        case 'p':
          e.preventDefault()
          if (guided) void navigate({ to: '/evidence', search: (prev) => ({ lens: prev.lens }) })
          else void navigate({ to: '/', search: (prev) => ({ lens: prev.lens }) })
          break
        case '?':
          e.preventDefault()
          open('help')
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [overlay, open, activeScene, navigate, routeId])
}
