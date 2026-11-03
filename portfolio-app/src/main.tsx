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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
