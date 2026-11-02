import { defineConfig, devices } from '@playwright/test'

const PORT = 4180

export default defineConfig({
  testDir: 'e2e',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'qa/playwright-report', open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}/CV/`,
    trace: 'retain-on-failure',
    viewport: { width: 1440, height: 900 },
  },
  // E2E runs against the assembled production site so the /CV/ base path, prerendered routes,
  // the CV page and the PDF are all exercised exactly as GitHub Pages serves them.
  webServer: {
    command: `npm run build --silent && npx vite preview --config portfolio-app/vite.config.ts --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/CV/`,
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
})
