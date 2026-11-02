import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // The legacy CV pipeline (build.mjs, script.js, PDF generator) is out of scope for the portfolio rebuild.
  globalIgnores([
    'dist',
    'node_modules',
    'release',
    'coverage',
    'test-results',
    '.lighthouseci',
    'qa',
    'research',
    'private',
    'script.js',
    'scripts/build.mjs',
    'scripts/generate-cv-pdf.mjs',
    'scripts/process-photo.mjs',
    'scripts/serve.mjs',
    'scripts/verify.mjs',
    'scripts/check-copy.mjs',
  ]),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    plugins: { 'react-refresh': reactRefresh },
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    rules: {
      'react-refresh/only-export-components': ['error', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['scripts/**', 'e2e/**', 'tests/**', 'portfolio-data/**', '*.config.{ts,js}', 'portfolio-app/vite.config.ts', 'portfolio-app/plugins/**'],
    languageOptions: { globals: globals.node },
    rules: { 'react-refresh/only-export-components': 'off' },
  },
  {
    files: ['**/*.{js,mjs}'],
    extends: [js.configs.recommended],
    languageOptions: { ecmaVersion: 2022, globals: { ...globals.node } },
  },
  {
    // Visual QA inspector functions run inside the page via Playwright.
    files: ['scripts/capture-portfolio.mjs', 'scripts/render-social-card.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
])
