# Content inventory

Every source of public content, where it now lives, and what happened to the legacy material.

## Sources

| Source | Owner of truth | Used for |
|---|---|---|
| `content.json` | CV pipeline | Employers, roles, dates, locations, education, languages, contact details, the web CV and the PDF |
| `portfolio-data/profile.json` | Portfolio | Title, headline, supporting line, proof line, thesis, conclusion |
| `portfolio-data/career.json` | Portfolio | Six career stages: the capability each added, linked to content.json experience ids |
| `portfolio-data/capabilities.json` | Portfolio | 8 capability groups, 82 capabilities, 16 technology patterns |
| `portfolio-data/evidence.json` | Portfolio | 25 evidence items (22 published, 3 withheld) with depth, contribution, boundary and sources |
| `portfolio-data/case-studies.json` | Portfolio | 6 case studies on one template |
| `portfolio-data/cases/nfr-work-fabric.json` | Portfolio | Sanitised blueprint content: workline, planes, roles, event, contract, security, lifecycle, operating model, value and cost lenses, roadmap, build record |
| `portfolio-data/role-lenses.json` | Portfolio | 7 lenses: opening, emphasis, start case, conclusion, honest gap |
| `portfolio-data/guided-story.json` | Portfolio | 12 scene titles, subheads and word budgets |
| `portfolio-data/scene-content.json` | Portfolio | Visual copy for scenes 1, 7, 8, 9 and 10, and the calibrated economics model |
| `portfolio-data/nfr-network.json` | Imported | Eight processes and fifteen links from the reference dataset at a pinned commit |
| `portfolio-data/source-register.json` | Portfolio | Every source an item can cite, with public or private visibility |
| `portfolio-data/publication-status.json` | Portfolio | Repository decisions and the excluded private inputs |
| `portfolio-data/claims.json` | Portfolio | The public claim register |

## Legacy material

| Legacy element | Outcome |
|---|---|
| Generated `index.html` (one long page) | Removed; replaced by the Vite application |
| Hero headline, sub, process line, chips, flag footprint | Replaced by profile.json copy; flags and chips removed |
| "The case, not the claim" evidence cards | Replaced by the capability fabric and depth labels |
| Experience list | Kept as facts in content.json; shown through the career arc and evidence |
| Seven project cards and dialogs | Four became primary cases (rewritten from verified facts), three archive items withheld |
| Approach (six stages) | Superseded by the blueprint cascade and delivery gates; text left in content.json |
| Capabilities chip lists | Replaced by the evidence-linked capability map |
| Target mode, commercial hypothesis, 90-day plan, role-fit matrix | Removed and archived privately |
| `404.html` | Replaced by a generated not-found page |
| `og-card.svg`, `monogram.svg`, 14 unused flags | Removed (unused) |
| `cv.html`, PDF, the three flags the CV uses, portrait | Unchanged |
