# QA report

Final verification of the portfolio rebuild on 2026-11-02, against the production build served under `/CV/`.

## Results

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass, 0 warnings |
| Types | `npm run typecheck` | Pass |
| Unit tests | `npm test` | 41 of 41 pass |
| Build, dist checks, bundle budget | `npm run build` | Pass: 186 dist checks, 9 prerendered routes, dist copies of cv.html and the PDF identical to the repository; initial JS 170.9 KB of 175 KB |
| Data, claims, content, confidentiality, links | `qa:data`, `qa:claims`, `qa:content`, `qa:confidential`, `qa:links` | All pass: 22 evidence items, 82 capabilities, 35 claims match; 0 confidential hits; 235 internal links resolve |
| CV pipeline smoke checks | `npm run verify`, `npm run check:copy` | 15 of 15; no em dashes |
| End-to-end and accessibility | `npm run test:e2e` | 88 of 88 pass (axe suite also stable over two repeats) |
| Visual QA | `npm run qa:visual` | 72 renders at 6 viewports, 0 problems; 17 key screenshots and a montage |
| Lighthouse | `npm run qa:lighthouse` | Pass on all 5 URLs (see below) |
| Release gate | `npm run qa:release-gate` | Fails by design until Thomas confirms the items in NEEDS_CONFIRMATION.md |

## Accessibility

- axe-core (WCAG 2.0, 2.1 and 2.2 AA) on every route, the risk lens and every overlay: zero violations. Scans run on final states (reduced motion) so transitions in flight are not sampled.
- Keyboard: Left and Right move between scenes; G, E, L, M, C, P and ? open their views; Escape closes overlays; shortcuts are ignored while typing; widgets that own arrows keep them; a skip link moves focus to the main content.
- Reduced motion: every sequence shows its final state at once (thesis visual, delivery gates, network event).
- Forced colours: controls remain visible. Every button and link has an accessible name that matches its visible label.
- Diagrams: SVGs carry descriptions; the process network is a labelled group of focusable nodes with the same facts in the side panel; depth labels use shape and colour.
- Mobile: no horizontal overflow on any route at 390 px; the menu is a drawer that needs no hover; touch targets are at least 32 px.

Issues found and fixed during QA: accessible names that did not contain their visible label (top bar, lens and search), network nodes nested in an image role, layer panels dimmed by opacity (contrast), fieldset and grid minimum widths causing overflow at 390 px.

## Performance

- Initial JavaScript 166.5 KB gzip against a 175 KB budget; CSS 5.4 KB (after D-031 and D-032). Motion's features, the overlays, scenes 3 to 12, the explorer, the case pages and the d3 chart are lazy.
- Lighthouse (desktop preset, median of three runs):

| URL | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| `/CV/` | 99 | 100 | 100 | 100 |
| `/CV/case/nfr-work-fabric/` | 99 | 100 | 100 | 100 |
| `/CV/case/ai-economics/` | 98 | 100 | 100 | 100 |
| `/CV/evidence/` | 91 | 100 | 100 | 100 |
| `/CV/capabilities/` | 99 | 100 | 100 | 100 |

The representative run for the evidence page was one with a single unattributed 305 ms task; its other two runs scored 98 and 99. LHCI picks the representative run by paint and interactive times, not by score. At two times CPU slowdown, harsher than CI (one and a half times reproduces the CI score of the original build), every URL scores 93 or more in typical runs (D-032).

- Fonts: three self-hosted families (latin subsets, five faces), all preloaded; the first render waits for them, capped at half a second. The hero portrait is a 1.5 KB WebP.

## Visual inspection

The key set in `qa/screenshots/key/` was inspected at full size, and the full matrix (12 routes x 6 viewports, 72 renders) through the automated checks. Notes from the inspection rounds:

- Hero: name, title, headline, proof line and actions fit the first 1440 x 900 viewport; the opportunity visual ends in its decision-ready state; the thesis visual was checked at 1440 and in the 1920 capture; at 390 the hero copy and actions were checked.
- Career arc: strands start at each stage and run to the present; labels do not overlap.
- Capability fabric: connectors are drawn between measured HTML nodes, so they stay correct at every width; below 1100 px the graph becomes lists.
- Work Fabric comparison: the plane bands hold their labels; the analyst view and the target view switch without layout jump.
- Process network: node names have a halo where they cross links; the event highlights only source links.
- Economics: KPIs no longer collide; the tokens line is visible however small.
- Case pages: limitations and the scope boundary are always visible; reference and simulated layers are marked with a dashed amber edge.

Automated checks do not replace this review; re-inspect the key set after any visual change.
