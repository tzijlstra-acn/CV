# Progress

Portfolio rebuild per `CLAUDE_PORTFOLIO_MARKET_REBUILD.md`. Work is committed on the branch `portfolio-rebuild` and pushed to GitHub; `main` and the live site are unchanged (DECISIONS.md D-030).

## Status (2026-11-02)

| Phase | State |
|---|---|
| P0 Trust and source safety | Done. Current-state audit and baselines; publication audit of nine repositories plus this one; evidence check of every linked prototype; claim register and ledger; confidential-term hashing; target mode removed |
| P1 Data and architecture | Done. Zod schemas, build-time projection, content.json joins, Vite app under `/CV/`, prerendered routes, CV and PDF preserved byte for byte until the requested CV update (D-029) |
| P2 Design system and proof scenes | Done. Executive systems studio tokens, depth labels, twelve scenes reviewed at 1920, 1440, 1366, 1024, 768 and 390 |
| P3 Flagship case | Done. Enterprise NFR Work Fabric with eleven interactive modules and four reading routes |
| P4 Remaining evidence | Done. Five further cases, evidence explorer with local search, capability map, seven lenses, career arc, contact |
| P5 QA and deployment | Done locally: unit, end-to-end, accessibility, visual, Lighthouse, bundle, content, claims, links, confidentiality. Deployment awaits Thomas (NEEDS_CONFIRMATION.md section 5) |

## What changed in the repository

- Added: `portfolio-app/`, `portfolio-data/`, `tests/`, `e2e/`, `research/`, `qa/`, new QA scripts, `.github/workflows/pages.yml`, `lighthouserc.json`, `assets/og-portfolio.png`, `assets/portrait-112.webp`.
- Changed: the CV content at Thomas's request (D-029: title, summary, descriptors, projects with case-page links; PDF regenerated, layout unchanged), `scripts/build.mjs` (writes `cv.html` only; project links point to case pages), `scripts/verify.mjs` and `scripts/check-copy.mjs` (check the built portfolio), `script.js` and `styles.css` (dead target-mode code removed; the CV renders pixel-identical), `content.json` (target-mode and unused legacy blocks archived privately; CV content updated per D-029), `package.json`, `.gitignore`, CI workflow, README, NEEDS_CONFIRMATION, PUBLICATION_AUDIT.
- Removed: generated root `index.html`, legacy `404.html`, `scripts/serve.mjs`, unused assets (14 flags, `og-card.svg`, `monogram.svg`).
- Local only (gitignored): `private/` (confidential terms, detailed audit, action list, archived target mode, a backup of the earlier ledger) and `CLAIM_LEDGER.md` (earlier content kept; rebuild entries appended).

## Next

1. Thomas works through `private/REPOSITORY_ACTIONS.local.md` (urgent items outside this repository).
2. Thomas confirms the items in `NEEDS_CONFIRMATION.md`; statuses move to `approved`; `npm run qa:release-gate` passes.
3. Switch Pages to GitHub Actions, then merge `portfolio-rebuild` into `main`.

## Reconstructing state in a new session

Read `README.md`, `DECISIONS.md`, `NEEDS_CONFIRMATION.md`, `qa/acceptance-tests.json` and this file, then run `npm run qa:data && npm test`.
