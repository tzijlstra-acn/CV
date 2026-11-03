import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/space-grotesk/latin-600.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import './design-system/tokens.css'
import './design-system/base.css'
import './app/shell.css'
import './design-system/evidence.css'
import './scenes/scenes.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './app/router'

/**
 * The first render waits for the five faces, which the page preloads, so they are usually here already. Laying out with the
 * fallback stacks first costs a system font lookup and then a second full layout when the faces arrive. A slow font never
 * holds the page back for long.
 */
const FACES = ['400 1em Inter', '500 1em Inter', '600 1em Inter', '600 1em "Space Grotesk"', '400 1em "JetBrains Mono"']
const fontsReady = Promise.all(FACES.map((f) => document.fonts.load(f))).catch(() => undefined)
const cap = new Promise((resolve) => setTimeout(resolve, 500))

void Promise.race([fontsReady, cap]).then(() =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  ),
)
