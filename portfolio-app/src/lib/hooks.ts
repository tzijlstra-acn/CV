import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

const reducedQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null

/** Reduced motion keeps every meaning: sequences jump straight to their final state. */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      reducedQuery?.addEventListener('change', cb)
      return () => reducedQuery?.removeEventListener('change', cb)
    },
    () => reducedQuery?.matches ?? false,
    () => false,
  )
}

/** True when the page was opened with a fragment, so content that may hold its target should not wait. */
export const hasHash = () => typeof location !== 'undefined' && location.hash.length > 1

/** True once the browser has been idle after the first render (for work that can wait). */
export function useIdle(timeout = 2000): boolean {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(() => setIdle(true), { timeout })
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(() => setIdle(true), 600)
    return () => clearTimeout(t)
  }, [timeout])
  return idle
}

/** True once the element has been at least `threshold` visible. */
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current || inView) return
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setInView(true), { threshold })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [inView, threshold])
  return [ref, inView] as const
}

const compactQuery = typeof window !== 'undefined' ? window.matchMedia('(max-width: 900px)') : null
export function useCompact(): boolean {
  return useSyncExternalStore(
    (cb) => {
      compactQuery?.addEventListener('change', cb)
      return () => compactQuery?.removeEventListener('change', cb)
    },
    () => compactQuery?.matches ?? false,
    () => false,
  )
}

/**
 * An explanatory sequence of `count` steps that plays once when `start` becomes true.
 * Skippable (jump to end), replayable, and instant under reduced motion.
 */
export function useSequence(count: number, start: boolean, interval = 700) {
  const reduced = useReducedMotion()
  const final = count - 1
  const [step, setStep] = useState(0)
  const [stopped, setStopped] = useState(false)
  // Effects only schedule the next tick; whether the sequence is running is derived.
  const running = start && !reduced && !stopped && step < final

  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => setStep((s) => Math.min(final, s + 1)), interval)
    return () => clearTimeout(t)
  }, [running, step, final, interval])

  const shown = reduced && start ? final : step
  return {
    step: shown,
    playing: running,
    done: shown >= final,
    replay: () => {
      setStopped(false)
      setStep(reduced ? final : 0)
    },
    skip: () => {
      setStopped(true)
      setStep(final)
    },
    goTo: (n: number) => {
      setStopped(true)
      setStep(Math.max(0, Math.min(final, n)))
    },
  }
}
