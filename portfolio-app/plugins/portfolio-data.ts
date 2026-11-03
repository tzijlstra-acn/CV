/**
 * Vite plugin: exposes the validated public projection as `virtual:portfolio-data`.
 * A validation issue fails the build and shows the error overlay in development.
 */
import type { Plugin } from 'vite'
import { buildSiteData, WATCH_FILES } from '../../portfolio-data/build'

const ID = 'virtual:portfolio-data'
const RESOLVED = '\0' + ID

export function portfolioData(): Plugin {
  return {
    name: 'portfolio-data',
    resolveId(id) {
      return id === ID ? RESOLVED : undefined
    },
    load(id) {
      if (id !== RESOLVED) return undefined
      for (const f of WATCH_FILES) this.addWatchFile(f)
      const site = buildSiteData()
      // A JSON.parse of a string literal parses far faster than the same data as an object literal.
      return `export default JSON.parse(${JSON.stringify(JSON.stringify(site))})`
    },
    configureServer(server) {
      server.watcher.add(WATCH_FILES)
      server.watcher.on('change', (file) => {
        if (!WATCH_FILES.some((f) => f.replace(/\\/g, '/') === file.replace(/\\/g, '/'))) return
        const mod = server.moduleGraph.getModuleById(RESOLVED)
        if (mod) server.moduleGraph.invalidateModule(mod)
        server.ws.send({ type: 'full-reload' })
      })
    },
  }
}
