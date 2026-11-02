# Dependency adoption

Every dependency, why it is here, what it costs and how to remove it. Versions are pinned in `package.json` and `package-lock.json`. Licences checked on 2026-11-02.

## Runtime (in the browser bundle)

| Package | Version | Licence | Exact use | Bundle | Risk | Fallback |
|---|---|---|---|---|---|---|
| react, react-dom | 19.3.1 | MIT | Component model | Initial | Low | None needed |
| @tanstack/react-router | 1.170.46 | MIT | Typed routes, validated search params, basepath, history, lazy route components | Initial | Low | A small history router |
| motion | 14.9.0 | MIT | Scene sequences, work-object movement, panel transitions (`m` components; features loaded asynchronously) | Initial core, features lazy | Low; honours reduced motion | CSS transitions |
| @radix-ui/react-dialog | 1.3.1 | MIT | Palette, help, overview, menu drawer (focus management) | Lazy (overlays) | Low | Native `dialog` |
| @radix-ui/react-popover | 1.3.1 | MIT | Lens menu | Initial | Low | Disclosure button |
| @radix-ui/react-tabs | 1.2.1 | MIT | Blueprint cascade, controlled-AI layers, role views | Lazy | Low | Buttons with aria-pressed |
| zustand | 5.0.16 | MIT | Transient UI state (open overlay, active scene) | Initial | Low | React context |
| lucide-react | 1.66.0 | ISC | 23 icons through a curated registry | Initial (only imported icons) | Low | Inline SVG |
| d3-scale, d3-shape | 4.0.2, 3.2.0 | ISC | Scales and the line path in the economics chart | Lazy (scene 8) | Low | Hand-written path |
| @fontsource/inter, space-grotesk, jetbrains-mono | 5.3.0 | OFL-1.1 (fonts), MIT (packaging) | Self-hosted latin subsets, two preloaded | Fonts | Low | System fonts |

## Development and QA only

| Package | Licence | Use |
|---|---|---|
| vite 8.3.5, @vitejs/plugin-react | MIT | Build, dev server, preview |
| typescript 6.0.3, typescript-eslint, eslint, plugins | Apache-2.0 / MIT | Types and lint |
| zod 4.6.7 | MIT | Build-time validation of all data |
| vitest 5.0.5 | MIT | Unit tests |
| @playwright/test, playwright 1.64.1 | Apache-2.0 | End-to-end tests, visual QA, social card, PDF |
| @axe-core/playwright 4.14.0 | MPL-2.0 | Accessibility checks |
| @lhci/cli 0.15.1 | Apache-2.0 | Lighthouse budgets |
| tsx | MIT | Running TypeScript scripts |
| sharp | Apache-2.0 | Portrait resizing, montage (already used by the CV photo script) |
| rollup-plugin-visualizer | MIT | Bundle treemap (`npm run build:report`) |

`npm audit --omit=dev` reports 0 vulnerabilities. Development tools carry known advisories in their own dependency trees (Lighthouse CI, ESLint, sharp); Thomas accepted these as development-only on 2026-11-02. None of them ships to the site.

## Considered and not adopted

| Library | Reason |
|---|---|
| @xyflow/react, @dagrejs/dagre | The fabric and process network read better as fixed, structured layouts with real HTML nodes; pan and zoom adds weight and harms keyboard use |
| @visx/* | Two small charts; d3 scales plus hand-written SVG are enough |
| cmdk | The palette is a short custom list on Radix Dialog |
| Scrollama | IntersectionObserver covers scene tracking |
| ELK.js, GSAP | Not needed |
| Three.js, React Three Fiber, Spline | Ruled out by the brief; no 3D |
| @radix-ui/react-toggle-group | Installed early, removed once unused |
| Analytics, tracking, runtime APIs | Ruled out by the brief |
