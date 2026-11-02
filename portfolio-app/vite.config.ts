import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { portfolioData } from './plugins/portfolio-data'
import { BASE, siteAssembly } from './plugins/site-assembly'

// GitHub Pages project site: everything lives under /CV/, so the base path is absolute and every
// route has a real prerendered HTML entry (see plugins/site-assembly.ts).
export default defineConfig(({ mode }) => {
  const plugins: PluginOption[] = [react(), portfolioData(), siteAssembly()]
  if (mode === 'report') {
    plugins.push(visualizer({ filename: fileURLToPath(new URL('../qa/bundle/bundle-treemap.html', import.meta.url)), template: 'treemap', gzipSize: true, title: 'Portfolio bundle' }) as PluginOption)
    plugins.push(visualizer({ filename: fileURLToPath(new URL('../qa/bundle/bundle-modules.json', import.meta.url)), template: 'raw-data', gzipSize: true }) as PluginOption)
  }
  return {
    root: fileURLToPath(new URL('.', import.meta.url)),
    base: BASE,
    publicDir: false,
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@data': fileURLToPath(new URL('../portfolio-data', import.meta.url)),
      },
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      assetsDir: 'app',
      target: 'es2022',
      manifest: true,
      sourcemap: false,
      assetsInlineLimit: 0,
      chunkSizeWarningLimit: 300,
    },
    server: { port: 5174, strictPort: false, fs: { allow: ['..'] } },
    preview: { port: 4180, strictPort: true },
  }
})
