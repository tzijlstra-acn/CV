import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import { portfolioData } from './portfolio-app/plugins/portfolio-data'

export default defineConfig({
  plugins: [portfolioData()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./portfolio-app/src', import.meta.url)),
      '@data': fileURLToPath(new URL('./portfolio-data', import.meta.url)),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
})
