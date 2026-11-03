# Thomas Zijlstra, CFA: portfolio and CV

An evidence-driven portfolio: a guided story for a five-minute read, and an explorer that shows where every capability comes from, how deep the evidence goes and where its boundary is. The web CV and its PDF are generated separately and unchanged.

- Portfolio: https://tzijlstra-acn.github.io/CV/
- Web CV: https://tzijlstra-acn.github.io/CV/cv.html
- PDF: https://tzijlstra-acn.github.io/CV/assets/Thomas_Zijlstra_CV.pdf

> Before the rebuild goes live, read `NEEDS_CONFIRMATION.md`. The deployment's release gate fails whenever a displayed item is awaiting confirmation (all were confirmed on 2026-11-03), and GitHub Pages must be switched to "GitHub Actions" as its source.

## Quick start

```bash
npm install
npx playwright install chromium
npm run dev            # portfolio with live data reload: http://localhost:5174/CV/
npm run build          # web CV (cv.html) + portfolio into dist/, with dist and bundle checks
npm run preview        # serve dist/ at http://localhost:4180/CV/
```

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server under `/CV/`, serving the web CV and assets from the repository root |
| `npm run build` | `build:html` (cv.html from content.json) then `build:portfolio` |
| `npm run build:portfolio` | `qa:data`, Vite build, `check-dist`, bundle report and budget |
| `npm run build:pdf` | Regenerates the PDF from cv.html (Playwright, atomic write) |
| `npm run build:all` | CV, copy check, PDF, portfolio, `verify` |
| `npm test` | Unit tests (Vitest): data, claims, lenses, search, economics, boundaries |
| `npm run test:e2e` | End-to-end and accessibility tests (Playwright and axe) against the production build |
| `npm run qa:visual` | Every route at six viewports, key screenshots, montage, `qa/visual-report.md` |
| `npm run qa:lighthouse` | Lighthouse CI, desktop, three runs per URL, `qa/lighthouse/summary.md` |
| `npm run qa:data` | Schema, joins, integrity, link gating, writing rules, confidential terms, claims |
| `npm run qa:claims` | Claim register matches the site word for word (and the local ledger, when present) |
| `npm run qa:content` | Copy rules on data and prerendered pages; writes `qa/copy-inventory.md` |
| `npm run qa:confidential` | Hashed confidential-term scan of files, built output and branch commits |
| `npm run qa:links` | Every internal link in dist/ resolves (`-- --external` also requests external links) |
| `npm run qa:release-gate` | Fails while anything displayed awaits confirmation (used by the Pages workflow) |
| `npm run qa:hash-terms` | Rebuilds `qa/confidential-term-hashes.json` from the private term list |
| `npm run import:nfr-network -- --from ../NFRProcesses` | Re-imports the process network snapshot at the clone's commit |
| `npm run social:card` | Renders `assets/og-portfolio.png` |
| `npm run release` | `release/portfolio-source.zip` (tracked files) and `release/portfolio-site.zip` (dist) |
| `npm run lint`, `npm run typecheck` | ESLint and TypeScript |

## Structure

```
portfolio-app/            React, Vite, TypeScript application
  plugins/                portfolio-data (virtual module) and site-assembly (CV copy, prerendered routes)
  src/app/                router, shell, overlays, keyboard model, lens menu
  src/scenes/             the twelve guided scenes
  src/routes/             explorer, capability map, case template, not found
  src/case/               the Work Fabric blueprint modules
  src/components/         evidence labels, fabric graph, process network, cascade, comparison
portfolio-data/           canonical portfolio data (JSON) and its Zod schemas
  build.ts                validation and public projection, used by Vite, scripts and tests
scripts/                  CV pipeline (build.mjs, generate-cv-pdf.mjs, verify.mjs, check-copy.mjs) and QA
tests/, e2e/              unit and end-to-end tests
qa/                       acceptance tests, reports, baselines, screenshots, bundle and Lighthouse output
research/                 audits, market and inspiration research, inventories
content.json              CV source of truth (also the source of every employer, role and date on the portfolio)
cv.html, styles.css, script.js, assets/   the web CV and its files
private/                  gitignored: confidential terms, detailed audit, action list, archived target mode
```

## Route map

| Route | Purpose |
|---|---|
| `/CV/` | Guided story, twelve scenes (`#thesis`, `#career`, `#fabric`, `#work-fabric`, `#process-network`, `#blueprint`, `#controlled-ai`, `#economics`, `#execution`, `#discipline`, `#selected-evidence`, `#role-fit`) |
| `/CV/?lens=<id>` | The same story through a role lens: `consulting`, `deployment`, `value-engineering`, `partnerships`, `builder`, `risk`, `solution-design` (works on every route) |
| `/CV/evidence/` | Evidence explorer: `q`, `type`, `depth`, `group`, `role`, `domain`, `view=graph`, `archive=true`, `focus=<evidence id>` |
| `/CV/capabilities/` | Capability map and technology patterns |
| `/CV/case/nfr-work-fabric/` | Flagship: Enterprise NFR Work Fabric (sanitised blueprint) |
| `/CV/case/ai-economics/` | Enterprise AI Economics Simulator |
| `/CV/case/dora-control-line/` | DORA Article 12 AI Control Line |
| `/CV/case/nfr-agent-platform/` | Enterprise NFR Agent Platform |
| `/CV/case/airlock/` | AIRLOCK Regulated AI Workload Foundry |
| `/CV/case/data-reporting-transformation/` | Anonymised professional delivery: regulatory reporting and data |
| `/CV/cv.html`, `/CV/assets/Thomas_Zijlstra_CV.pdf` | Web CV and PDF (unchanged URLs) |

Keyboard: Left and Right (scenes), G (overview), E (evidence), L (lens), M (menu), C (search and commands), P (guided or explorer), ? (help), Escape (close).

## How the data works

1. Edit JSON in `portfolio-data/` (or CV facts in `content.json`).
2. `npm run dev` reloads; any schema, reference, writing-rule or confidentiality problem shows in the error overlay.
3. Headline wording is pinned in `portfolio-data/claims.json`; update the register when you change it.
4. Repository links appear only after an approval in `portfolio-data/publication-status.json`.

Evidence depth labels: professional delivery, built and verified, designed and specified, collaborated and applied, studied or explored. Each label has its own shape and colour.

## Confidentiality

- No client, prospect or colleague name is written into this repository. Hashes only; see `portfolio-data/lib/confidential.ts`.
- Private inputs (the Work Fabric brief and build, client presentation material) are never copied, linked or quoted. See `research/private-inputs.md`.
- The detailed publication audit and the action list live in the gitignored `private/` folder.

## Deliverables

| Deliverable | Where |
|---|---|
| Portfolio source and production build | `portfolio-app/`, `portfolio-data/`, `dist/` (`npm run build`) |
| Progress, decisions, confirmations | `PROGRESS.md`, `DECISIONS.md`, `NEEDS_CONFIRMATION.md` |
| Claim ledger | `portfolio-data/claims.json` (public register), `CLAIM_LEDGER.md` (local, gitignored) |
| Audits and research | `research/current-state-audit.md`, `content-inventory.md`, `claim-inventory.md`, `market-role-map.md`, `visual-inspiration-audit.md`, `publication-risk-audit.md`, `case-evidence.md`, `dependency-adoption.md`, `private-inputs.md`, `PUBLICATION_AUDIT.md` |
| Schemas and data | `portfolio-data/schema.ts` and the JSON files beside it |
| Acceptance tests | `qa/acceptance-tests.json` |
| QA reports | `qa/qa-report.md`, `qa/visual-report.md`, `qa/lighthouse/summary.md`, `qa/bundle/bundle-report.md`, `qa/copy-inventory.md` |
| Screenshots | `qa/screenshots/key/`, `qa/screenshots/montage.png` |
| Archives | `npm run release` |

Repository topics to set: enterprise-ai, financial-services, ai-commercialisation, value-engineering, agentic-ai, risk-management, strategy-consulting, portfolio, react, vite, typescript, data-visualization.

No analytics, no tracking, no runtime fetch of content, fonts or code. Fonts are self-hosted.
