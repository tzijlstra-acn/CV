/// <reference types="vite/client" />

declare module 'virtual:portfolio-data' {
  import type { SiteData } from '@data/site-types'
  const data: SiteData
  export default data
}
