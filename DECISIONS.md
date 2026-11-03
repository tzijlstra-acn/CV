# Decisions

Decisions made during the portfolio rebuild (brief: CLAUDE_PORTFOLIO_MARKET_REBUILD.md). Each records the choice, the reason and, where relevant, what Thomas still has to confirm (see NEEDS_CONFIRMATION.md).

## Architecture

**D-001 Two surfaces, one artifact.** The portfolio is a React, Vite and TypeScript application in `portfolio-app/`; the web CV and PDF stay on the existing pipeline (`content.json`, `scripts/build.mjs`, `scripts/generate-cv-pdf.mjs`). The Vite build copies `cv.html`, `styles.css`, `script.js` and `assets/` into `dist/` unchanged, so `/CV/`, `/CV/cv.html` and `/CV/assets/Thomas_Zijlstra_CV.pdf` keep working from one GitHub Pages artifact.

**D-002 Real URLs, prerendered.** Routes use browser history under the absolute base `/CV/` (not hash routing). The build writes one HTML entry per route (`/CV/evidence/`, `/CV/capabilities/`, `/CV/case/<slug>/`) with its own title, description, canonical URL, social tags and a no-JavaScript fallback, plus a `404.html`, `sitemap.xml` and `robots.txt`. Shareable state (`?lens=`, explorer filters) lives in the URL as readable comma lists.

**D-003 Validation at build time only.** Zod schemas (`portfolio-data/schema.ts`) validate every data file in a Vite plugin, `npm run qa:data` and the unit tests. The browser receives an already-validated public projection (`virtual:portfolio-data`), so Zod is not in the runtime bundle.

**D-004 Facts are joined, not retyped.** Employers, roles, dates, education, languages and contact details come from `content.json`. Portfolio data refers to them by id (`accenture`, `societe-generale`).

**D-005 Scroll-based guided story.** The guided mode is one page of twelve full-height scenes with a rail, Left and Right keys and stable `#scene` anchors, rather than slide routes. Recruiters read on phones and scroll; there is no scroll capture. Scenes below the fold load as separate chunks when they come within two screens.

**D-006 Bundle budget.** Initial JavaScript is held under 175 KB gzip. Motion's animation features load asynchronously (`LazyMotion`), the overlays (palette, help, overview, menu) load on first use, and the explorer, capability map, case pages, economics charts (d3) and the Work Fabric blueprint are lazy chunks.

## Evidence and trust

**D-007 One depth per evidence item.** Where depth differs, the item is split: the Work Fabric blueprint (designed and specified) and its interactive build (built and verified); AIRLOCK's local mode (built) and its cloud reference architecture (designed). Education is supporting evidence with depth "studied or explored".

**D-008 A capability exists only with evidence.** The build fails on any capability no published evidence links to. Partner and ecosystem strategy, cost of inaction as a professional claim, and similar items without evidence were not invented; where evidence is thin, the lens and scene 9 say so.

**D-009 Repository links need an explicit approval.** `publication-status.json` gates every repository link and every repository source URL. No repository was approved automatically; the site currently shows no repository links except this repository.

**D-010 Release gate.** `npm run qa:release-gate` fails while any displayed evidence, case or claim still awaits Thomas's confirmation. The Pages workflow runs it, so the rebuild cannot go live unreviewed.

**D-011 Public builds rewritten from verified facts.** An evidence check of each repository (research/case-evidence.md) found several earlier claims unsupported or overstated. The cases now state what is implemented, what is simulated or reference, and the limitations found in the code. "Independent" was dropped from every description because several repositories began as employer-branded practice assets.

**D-012 CV pipeline untouched in output.** `cv.html` and the PDF are byte-identical to the pre-rebuild baseline. `styles.css` and `script.js` lost only the dead target-mode rules and code; `cv.html` was rendered before and after in screen and print media and the images are pixel-identical. Hashes are recorded in `qa/baseline/`. The CV content was then updated at Thomas's request (D-029).

**D-013 Three archive items withheld.** The AI Model Risk Dashboard (employer sales material in the repository), the Autonomous Operations Control Center (the public repository is empty) and the Interactive Personal Story (personal content) are marked `blocked` and are not in the shipped data.

**D-014 The process dataset is described, not named.** The eight-process network is imported at a pinned commit by `scripts/import-nfr-network.mjs` and validated. Because the dataset repository carries employer branding and its provenance is unconfirmed, the site calls it a reference process dataset and does not link it.

**D-015 Confidential terms as hashes.** Client, prospect, colleague and internal names are never written into this repository, not even in a denylist. `qa/confidential-term-hashes.json` holds salted SHA-256 hashes; the plain list lives in the gitignored `private/`. The data build, `npm run qa:confidential` (files, built output, branch commit messages) and the visual QA all scan against it.

**D-016 Detailed audit kept private.** The publication audit's paths, branches and line numbers point at live problems in other public repositories, so they are kept under `private/audit/`. `PUBLICATION_AUDIT.md` and `research/publication-risk-audit.md` record statuses and categories.

**D-017 Claim register public, ledger private.** `portfolio-data/claims.json` pins every headline claim's exact wording to its evidence and depth; `npm run qa:claims` fails when wording drifts. The interview-preparation ledger (`CLAIM_LEDGER.md`) stays gitignored, as decided before the rebuild.

## Content

**D-018 Title.** The portfolio and, since D-029, the CV use "Enterprise AI Strategy, Deployment & Commercialisation"; the alternative is kept in `profile.json`.

**D-019 Proof line.** "Frontier AI" became "enterprise AI" (it implies frontier-lab work) and "Europe-wide delivery" became "Delivery across Europe".

**D-020 Conservative client descriptors.** "A European reinsurer" (not "leading"), "a Swiss insurer", "a European core banking provider", "a European global systemically important bank". The internal division name from the CV is not repeated on the portfolio.

**D-021 Target mode removed.** The `?target=` mode, its hidden sections and its copy are gone from the site, `script.js`, `styles.css` and `content.json`. The removed content is archived privately in `private/archive/`. Git history is unchanged.

**D-022 Economics widget follows the simulator.** The scene 8 widget re-implements the AI Economics Simulator's cost and benefit model, calibrated to its default scenario and unit-tested against the re-computed defaults (year one about EUR 833k, break-even in year four). At those defaults fixed platform and governance costs are about 96 percent and tokens about 0.3 percent, so the widget leads with sharing, maturity and hosting, not routing.

**D-023 Honest gaps.** The deployment, partnerships, builder and solution-design lenses each state what is not evidenced (customer-success targets, a partner-management role, a P&L or quota, production engineering).

**D-024 Availability hidden, portrait shown.** Availability is not shown until confirmed. The portrait appears small in the hero (a 1.5 KB WebP made from the CV photo) pending decision 6.

**D-025 What I learned.** Every case's "What I learned" lines are drafted from the work and need Thomas's review before release.

## Dependencies (see research/dependency-adoption.md)

**D-026 Adopted:** React, React DOM, TanStack Router, Motion, Radix Dialog, Popover and Tabs, Zustand, Lucide (curated registry), d3-scale and d3-shape (economics chart only), Fontsource Inter, Space Grotesk and JetBrains Mono (latin subsets). Development: Vite, TypeScript, Zod, Vitest, Playwright, axe-core, Lighthouse CI, ESLint, tsx, sharp, rollup-plugin-visualizer.

**D-027 Not adopted:** xyflow and Dagre (the capability fabric and process network read better as fixed, structured layouts with HTML nodes), Visx (two small charts do not justify it), cmdk (a custom palette on Radix Dialog), Scrollama (native IntersectionObserver), ELK.js, GSAP, Three.js and React Three Fiber (no need, and the brief rules out 3D). `@radix-ui/react-toggle-group` was installed early and removed once it was clear it was not needed.

## CV update and publication

**D-029 CV content updated, layout unchanged.** At Thomas's request the CV now matches the portfolio and the audit: the title above; a summary that separates regulated transformation from the later enterprise AI work; "a European reinsurer" and "a Swiss insurer" instead of "leading"; "deployment and rollout planning" instead of "production-readiness planning"; and the three selected projects (Work Fabric, AI Economics Simulator, DORA control line) rewritten from verified facts, each linking to its portfolio case page instead of a repository. The section heading became "Selected Projects". Copy that only the removed generated page used (meta, hero, evidence, thesis, footer, the old project details) moved to `private/archive/`. The PDF was regenerated (four pages, as before) and the hashes re-recorded with `npm run qa:rebaseline-cv`; the generator's layout and styles are unchanged.

**D-030 Pushed to a branch, not to main.** The work is committed to `portfolio-rebuild` and pushed to GitHub. It is not on `main`: GitHub Pages still deploys from the branch root, which no longer has an `index.html`, so a push to `main` before switching Pages to GitHub Actions would take the live site down, and the release gate would block the Actions deployment until the confirmations are done.

**D-031 Load-time work cut after the first CI Lighthouse run.** On the GitHub runner the home page scored 84 for performance (budget 90), almost entirely from total blocking time. Profiling with CPU throttling and A/B runs against the committed build led to six changes, none of which loosens a gate: lazy scenes mount only when they enter the viewport (the career scene too); the opening and career animations use CSS transitions instead of Motion (no per-frame JavaScript or SVG measurement); the data module ships as a `JSON.parse` string; the no-JavaScript fallback moved into `<noscript>` (layout shift 0.06 to 0.001); `text-wrap: pretty` and the top bar's backdrop blur were dropped; and the font faces went from eight to five. Under the same conditions blocking time fell by roughly 40 to 60 percent at four times CPU slowdown. Initial JavaScript is now 166.3 KB. Lighthouse stays a blocking gate.

## Deployment

**D-028 Publishing needs Thomas.** The work is on the `portfolio-rebuild` branch. Going live needs: merging, switching Settings > Pages > Source to GitHub Actions (the new `pages.yml` deploys `dist/`), and pushing. The previous branch-root deployment would serve nothing at `/CV/` because the generated root `index.html` was removed. The repository description, topics and social preview image are also left for Thomas (`assets/og-portfolio.png` is ready).
