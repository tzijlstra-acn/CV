# Needs confirmation

What only Thomas can decide before the rebuilt portfolio goes live. The Pages workflow's release gate (`npm run qa:release-gate`) fails until every displayed item is confirmed. Specific findings that should not sit in a public file are in the gitignored `private/REPOSITORY_ACTIONS.local.md`.

_Last updated: 2026-11-02._

## 1. Urgent, outside this repository

- [ ] Work through `private/REPOSITORY_ACTIONS.local.md`. Several items concern material that is already public on GitHub and should be dealt with first.

## 2. Decisions from the brief (section 32)

- [ ] **1. Publish the sanitised NFR Work Fabric case?** The case uses abstracted concepts and synthetic examples only; client identity and internal material are excluded. Confirm the client relationship allows describing the blueprint publicly at this level. If yes, set `status` to `approved` for `wf-blueprint`, `wf-experience`, `wf-delivery-plan` (evidence.json) and `nfr-work-fabric` (case-studies.json).
- [ ] **2. Target mode.** Removed from the site and from tracked files; the content is archived in `private/archive/`. Confirm removal is final.
- [ ] **3. Which repositories stay linked.** None is linked yet. See `PUBLICATION_AUDIT.md`. Approve each by setting `decision: "approved"` and `decidedAt` in `portfolio-data/publication-status.json` after its clean-up.
- [ ] **4. Formal Accenture employment title.** The CV still shows a role description. Needed for the CV and PDF.
- [ ] **5. Anonymised engagement detail.** The portfolio uses "a European reinsurer", "a Swiss insurer", "a European core banking provider" and "a European global systemically important bank". Confirm these descriptors and the wording of each Accenture evidence item in `portfolio-data/evidence.json`.
- [ ] **6. Portrait.** A small portrait appears in the hero (`profile.showPortrait`). Keep or remove.
- [ ] **7. Default title.** "Enterprise AI Strategy, Deployment & Commercialisation" is now used on the portfolio and the CV. The alternative, "Financial Services Strategy, Transformation & Enterprise AI", is `titleAlternative` in `profile.json`.
- [ ] **8. Munich as a base.** Not shown. Add to `content.json` personal location if wanted.
- [ ] **9. LinkedIn.** Not shown. Supply the URL to add it to the portfolio, the web CV and the PDF.
- [ ] **10. How to describe the NFR Work Fabric build.** Described as a blueprint plus a private interactive experience (built and verified, AI-assisted). Confirm.

## 3. Evidence and claims

- [ ] **Ownership of the public prototypes.** Several repositories began as employer-branded practice assets. Confirm you may present each as your own prototype; until then each public-build item stays `needs-confirmation`.
- [ ] **Accenture items.** Confirm scope and personal ownership for: the regulatory-change workflow (strategy, economics, roadmap, pilot delivery), RCSA/TPRM/regulatory-change shaping, the AI Maturity Assessment framework, the Swiss NFR and AI team and its DACH go-to-market, FINMA reporting and data adequacy (including your role in the Databricks implementation, shown as "collaborated and applied"), the OeNB audit stream, LIBOR transition and senior stakeholder coordination.
- [ ] **Single family office and Societe Generale items.** Confirm nothing in the summaries is confidential.
- [ ] **Data and reporting case.** Confirm the "delivered programme" maturity, the two decisions, and whether adoption and value detail can be summarised (currently "detail available in conversation").
- [ ] **What I learned.** Every case's learning lines were drafted from the work. Rewrite or approve them in `portfolio-data/case-studies.json`.
- [ ] **Claim register.** When the wording is final, set `publication` to `approved` for each claim in `portfolio-data/claims.json`, and add a `CLAIM_LEDGER.md` entry (interview preparation) for any new claim.
- [ ] **Honest gaps.** The deployment, partnerships, builder and solution-design lenses state what is not evidenced. Confirm the wording, or supply evidence (for example partner or alliance work) that would let a gap close.

## 4. The CV

- [x] Updated on 2026-11-02 (DECISIONS.md D-029): title, summary, client descriptors, selected projects with case-page links instead of repository links.
- [ ] Review the new CV wording, especially the summary and the three project entries.
- [ ] The CV capability lists still include self-described items without portfolio evidence (for example partner and ecosystem strategy). Keep or trim.
- [ ] Carried over: formal title, portrait in the PDF, work authorisation wording, availability and notice period, relocation preferences.

## 5. Going live

- [x] Committed and pushed to the `portfolio-rebuild` branch (not `main`; see D-030).
- [ ] Settings > Pages > Build and deployment > Source: **GitHub Actions** (the new `pages.yml` deploys `dist/`). Do this before anything reaches `main`: the old branch-root deployment would no longer find an `index.html`.
- [ ] Merge `portfolio-rebuild` into `main` (pull request or fast-forward) once the confirmations above are done. The deployment runs lint, tests, the release gate, the build, content, confidentiality and link checks, end-to-end tests and Lighthouse first.
- [ ] Repository settings: description "Evidence-driven portfolio and CV spanning Financial Services, enterprise AI strategy, governed agent workflows, value engineering, risk transformation, and commercialisation.", the topics listed in README.md, and `assets/og-portfolio.png` as the social preview image.
