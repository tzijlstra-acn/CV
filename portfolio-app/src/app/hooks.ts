import { useRouterState, useSearch } from '@tanstack/react-router'
import { getLens } from '@/data/site'

export function useRouteId() {
  return useRouterState({ select: (s) => s.matches[s.matches.length - 1]?.routeId ?? '' })
}

/** The active role lens from the URL (?lens=risk), or undefined. */
export function useActiveLens() {
  const { lens } = useSearch({ strict: false }) as { lens?: string }
  return getLens(lens)
}
