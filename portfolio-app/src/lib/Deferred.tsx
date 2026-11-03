import { useEffect, useState, type ReactNode } from 'react'

// Blocks waiting to mount, in document order. One mounts per frame.
const queue: Array<() => void> = []
let pending = false

function pump() {
  pending = false
  queue.shift()?.()
  if (queue.length) schedule()
}

function schedule() {
  if (pending) return
  pending = true
  // A hidden tab paints no frames, so there is nothing to wait for.
  if (document.hidden) setTimeout(pump, 0)
  // After the next frame, then in a task of its own: the block before has been laid out and painted.
  else requestAnimationFrame(() => setTimeout(pump, 0))
}

/**
 * Mounts content below the fold after the first paint, one block per frame, so no single task carries the whole page and
 * the opening view is interactive sooner. `now` renders at once, for a deep link that points inside the block. Until it
 * mounts, a block leaves an empty `data-deferred` marker, which tests and captures wait on.
 */
export function Deferred({ children, now = false }: { children: ReactNode; now?: boolean }) {
  const [ready, setReady] = useState(now)
  useEffect(() => {
    if (ready || now) return
    const job = () => setReady(true)
    queue.push(job)
    schedule()
    return () => {
      const i = queue.indexOf(job)
      if (i >= 0) queue.splice(i, 1)
    }
  }, [ready, now])
  return ready || now ? children : <div data-deferred="" hidden />
}
