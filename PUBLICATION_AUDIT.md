# Repository publication audit

Status of every repository the portfolio links to, or might link to. Audited on 2026-11-02 against fresh clones of what is public on GitHub (all branches, full history). No audited repository was changed.

This public file records statuses and categories only. File paths, branch names, line numbers and other specifics are kept in a private, gitignored audit file so that this repository does not point readers at problems before they are fixed.

## Rule

A repository is linked from the portfolio only when `portfolio-data/publication-status.json` records `"decision": "approved"` with a date. Until then the build removes its links, its source URLs and its name from the shipped bundle, and the Pages deployment fails its release gate. No repository was approved automatically.

## Status

| Repository | Audited HEAD | Recommendation | Status | Finding categories |
|---|---|---|---|---|
| RealAIInfrastructure | `e76a013` | approved after cleanup | blocked pending Thomas decision | Employer provenance of the first commit; demo credentials in seed data; README wording |
| ProReinsuranceAIWorkflow | `b607dbf` | private | private | Client-identifying content at HEAD; material prepared for a client |
| AICostSimulator | `3bb08e2` | approved after cleanup | blocked pending Thomas decision | A stray public branch with unrelated material; employer branding in history; access-code gate; README wording |
| ai-risk-dashboard | `eb09cef` | private | private | Employer sales material; production-readiness wording |
| Autonomous-Operations-Control-Center | empty | public but unlinked | public but unlinked | The repository has no commits; the code was never pushed |
| AIRLOCK | `ff0e25c` | approved after cleanup | blocked pending Thomas decision | Employer attribution in the first commit; one client reference in a design record; wording |
| Selfcare | `256a041` | public but unlinked | blocked pending Thomas decision | Personal content not suited to a professional portfolio |
| NFRProcesses | `1ed5903` | private | private | Employer branding; provenance of the process content unconfirmed |
| NFRAIAssets | `8e67dd6` | private | private | Personal data of third parties; internal-use material |
| CV | this repository | approved and linked | approved and linked | The portfolio's own source |

Clean across all repositories: no real API keys, tokens, private keys or connection strings in any commit, no committed `.env` files, and only placeholders in infrastructure code.

## What the portfolio does meanwhile

- Shows no repository links. Case pages describe the work and its limits without linking.
- Withholds three archive items entirely (ai-risk-dashboard, Autonomous-Operations-Control-Center, Selfcare).
- Uses only derived structure (process names, step counts, links) from the reference process dataset, and does not name or link it.
- Describes the public prototypes as AI-assisted prototypes, not as independent production software, and states each one's implemented and reference parts.

## Steps for Thomas

1. Act on the private action list first; several items concern material that is already public.
2. For each repository you want linked: complete its clean-up, re-run the audit procedure below, then set `decision` to `approved` with `decidedAt` in `portfolio-data/publication-status.json`.
3. Confirm ownership: several repositories began as employer-branded practice assets. Check your employment terms before presenting them as personal work.

## Audit procedure (repeat before approving)

```bash
# Fresh mirror of what is public, every branch and every commit
git clone --mirror https://github.com/tzijlstra-acn/<repo>.git
cd <repo>.git
git log --all --format='%H %an <%ae> %s'                 # authors, emails, commit messages
git log --all --name-only --format='' | sort -u          # every path ever committed
git log --all -p | grep -iE 'api[_-]?key|secret|token|password|BEGIN .*PRIVATE KEY|sk-|AKIA|ghp_'
git log --all -p | grep -iE 'confidential|internal use|client|as delivered'
# Then: search for organisation names (client, prospect, employer), personal data and
# production claims; open a sample of committed images; check README and Pages output.
```

Record findings in the private audit file, update the table above at category level, and never write a client, prospect or colleague name into this repository. `npm run qa:confidential` checks the repository against hashed confidential terms.
