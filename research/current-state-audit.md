# Current-state audit (before the rebuild)

Inspected on 2026-11-02: the repository at `c8db62d` (local `main`, one commit ahead of `origin/main`), the live site at https://tzijlstra-acn.github.io/CV/ and a local render of the generated `index.html`. Baseline screenshots and measurements are in `qa/baseline/`.

## Confirmed diagnosis (brief section 5)

| Brief statement | Finding |
|---|---|
| Portfolio generated from `content.json` through `scripts/build.mjs` | Confirmed. `build.mjs` wrote both `index.html` and `cv.html`. |
| One long static page using `styles.css` and `script.js` | Confirmed: 8 sections, about 8,300 px tall at 1440 px, 2,381 visible words. |
| Hero positioned on Enterprise AI Commercialisation and Value Engineering | Confirmed (title, headline and meta). |
| Experience before selected public work | Confirmed (section order: hero, profile, experience, projects, approach, capabilities, education, contact). |
| Prototypes distinguished from client systems | Confirmed by a methodology note and per-project scope boundaries. |
| Featured projects with question, contribution, evidence, boundary, notes | Confirmed for three featured projects. |
| A target-specific mode and a narrow primary-role preference | Confirmed: a `?target=` mode revealed hidden sections and the statement "Primary role interest: Business Builder & Ecosystem". |
| Flags, chips, long lists and repetition create noise | Confirmed: 52 chip or tag elements and 24 flag images on the first page. |
| Framework lists visible enough to invite interrogation | Confirmed: per-project tool lists in "Implementation notes". |
| Strong evidence, no relationships shown | Confirmed: capabilities, projects and experience are separate lists with no links between them. |
| Open publication-audit and claim-confirmation items | Confirmed: seven repositories unaudited, many claims pending. |
| Little repository metadata or preview | Confirmed: no description, no topics; the social image was an SVG, which most platforms do not render. |

## Additional findings

- The legacy `404.html` linked to `/` (the domain root, not `/CV/`).
- One project link used a misspelt repository name that only works through GitHub's rename redirect.
- `NEEDS_CONFIRMATION.md` and `PUBLICATION_AUDIT.md` named a prospective employer in a public repository (now removed from tracked files; history unchanged).
- No console errors on load at any of the six viewports; no horizontal overflow.
- Portrait shipped at 400 x 400 px (123 KB) for a 160 px display.

## Baseline measurements

| Viewport | Load (local) | Page height | Overflow | Console errors |
|---|---|---|---|---|
| 1920 x 1080 | 1.1 s | 8,279 px | none | none |
| 1440 x 900 | 0.8 s | 8,279 px | none | none |
| 1366 x 768 | 0.7 s | 8,279 px | none | none |
| 1024 x 768 | 0.7 s | 8,611 px | none | none |
| 768 x 1024 and 390 x 844 | see `qa/baseline/legacy-baseline.json` | | none | none |

Hashes of `cv.html`, the PDF, `styles.css` and `script.js` at this point are in `qa/baseline/legacy-hashes.txt`; the tests prove `cv.html` and the PDF are unchanged.
