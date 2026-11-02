import { create } from 'zustand'

/** Transient presentation state only. Shareable state (lens, filters, case) lives in the URL. */
export type Overlay = 'none' | 'palette' | 'help' | 'overview' | 'menu' | 'lens'

interface UiState {
  overlay: Overlay
  open: (o: Overlay) => void
  close: () => void
  /** The guided scene currently in view, used by the rail and arrow keys. */
  activeScene: string
  setActiveScene: (id: string) => void
}

export const useUi = create<UiState>((set) => ({
  overlay: 'none',
  open: (overlay) => set({ overlay }),
  close: () => set({ overlay: 'none' }),
  activeScene: 'thesis',
  setActiveScene: (activeScene) => set({ activeScene }),
}))
