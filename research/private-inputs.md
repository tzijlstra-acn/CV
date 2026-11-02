# Private inputs deliberately excluded

These inputs informed the portfolio but are not in this repository, are not linked, and are not quoted. The machine-readable list is `privateInputs` in `portfolio-data/publication-status.json`.

| Input | How it was used | What was excluded |
|---|---|---|
| Private Work Fabric execution brief | Concepts were abstracted and rewritten: the work object, three planes, the security chain, the governance lifecycle, the operating model, value and cost lenses | The file itself, the client's identity and context, internal language and every identifier |
| Private Work Fabric interactive build | Aggregate QA figures only (scene count, test counts, axe and Lighthouse results, decision count) | Source code, screenshots, slide exports and reports: they carry client context, so the portfolio renders its own sanitised visuals on synthetic data |
| Client presentation materials referenced by that brief | Not read for this site | Everything |
| The prospective-employer application found in one repository | Not used | Everything; the repository's branch is listed for removal in the private action list |
| Detailed publication audit | Statuses and categories in `PUBLICATION_AUDIT.md` | Paths, branches, line numbers and names; kept in `private/audit/` |
| Confidential term list | Hashed into `qa/confidential-term-hashes.json` | The plain terms; kept in `private/` |
| Interview-preparation claim ledger | Claim ids mirrored in `portfolio-data/claims.json` | The ledger (`CLAIM_LEDGER.md`, gitignored) |
| Former target-mode content | Not used | Archived in `private/archive/` |
| Posting-level market research (named employers and their job postings) | Generalised into the role-family model in `research/market-role-map.md` | The employer names, posting notes and URLs; kept in `private/research/` so the public repository does not show which roles are being considered |

The `private/` folder and `CLAIM_LEDGER.md` are gitignored, and `npm run release` archives tracked files only.
