# Items requiring confirmation before final publication

Items below cannot be resolved from repository evidence alone. Edit this file with confirmed answers and remove each item once resolved. Items marked **BLOCKING** must be resolved before the corresponding section is published.

---

## Resolved

- [x] **Accenture start date** — "Jun 2020" is populated in content.json.
- [x] **Single Family Office end date** — "Mar 2020" is populated in content.json.
- [x] **Phone number format** — formatted as "+41 79 768 57 45" in content.json. ✓
- [x] **TECH VIEW removed** — removed from nav, JS, CSS. No visual or accessibility residue.
- [x] **Three evidence pillars** — "Commercial and C-suite", "Enterprise AI adoption", "European financial-services credibility."
- [x] **"Operator Thesis" section label** — changed to "How I work" in build.mjs.

---

## Open items

### Personal and career

- [ ] **Accenture formal employment title** (BLOCKING for CV/PDF) — content.json uses the role description "Financial Services AI & Digital Transformation" rather than a formal employment title. What is the exact title as it appears on employment records? Options may include Manager, Senior Manager, Principal, or Associate Director. This appears in the cv.html header and PDF.

- [ ] **"AI-assisted prototypes" accuracy** (BLOCKING for project section) — the methodology note added above the project grid states "independently developed, AI-assisted public prototypes." Confirm this is accurate for all seven public repositories. Which tools or AI assistance was used in each?

- [ ] **RealAIInfrastrucure repo name** (BLOCKING for project links) — the repo URL uses the spelling "Infrastrucure" (missing one 'u'). Is this the actual GitHub repository name, or a typo for "RealAIInfrastructure"? A broken link would silently 404 for any visitor who clicks through.

- [ ] **"10+ years"** — hero copy no longer uses this phrasing after the repositioning; confirm the current headline and sub accurately describe your experience timeline.

### Contact and online presence

- [ ] **LinkedIn URL** (IMPORTANT) — no LinkedIn field exists in content.json. Should a LinkedIn profile link be added to the portfolio, web CV, and PDF? If yes, provide the URL.

- [ ] **Portrait in PDF** (IMPORTANT) — the portrait photo currently appears in the web CV and PDF. Should it remain in the printed PDF? If not, a single `@media print { .cv-header-photo { display: none; } }` rule will remove it without affecting the web CV.

- [ ] **Canonical GitHub Pages URL** — confirm that `https://tzijlstra-acn.github.io/CV/` is correct once Pages is enabled.

### Wording and accuracy

- [ ] **"Leading European reinsurer" in cv.summary** (BLOCKING for CV) — the professional summary visible on cv.html and in the PDF download reads "...AI-enabled regulatory-change workflow at a leading European reinsurer." There are relatively few global reinsurers of this description. Three options: (a) keep as-is if the client would not object; (b) replace with "a major European financial institution"; (c) replace with "a regulated European enterprise." Confirm preferred wording before the CV is publicly accessible.

- [ ] **Accenture lead sentence** (IMPORTANT) — a new one-line framing sentence for the Accenture role is proposed: "Leading AI strategy, economics, workflow design and pilot delivery in European financial services, with a focus on regulatory change programmes and go-to-market development." Confirm this is accurate and appropriate before adding it to content.json.

- [ ] **Accenture engagement descriptions** (BLOCKING) — each bullet under the Accenture role has been revised to remove "hands-on implementation" and "Architecture and delivery" framing. Confirm the revised wording accurately reflects your contribution and is consistent with any applicable employer communications policy.

- [ ] **"Moonshot" target mode** — the ?target=moonshot URL parameter shows a different headline, sub, and target-role statement. The "Solution Architecture" reference has been removed from moonshot.statement. Confirm the remaining moonshot copy is accurate and appropriate.

- [ ] **Single Family Office description** — confirm that the bullets (company valuation, financing discussions, investor engagement) do not inadvertently disclose confidential information about the family office.

### Publication readiness

- [ ] **Repository approval: RealAIInfrastrucure** — not yet audited. Portfolio links to this repo. Complete the audit in PUBLICATION_AUDIT.md before linking from a live site.
- [ ] **Repository approval: ProReinsuranceAIWorkflow** — not yet audited. The repo name references "reinsurance," which could be client-identifying. Review git history.
- [ ] **Repository approval: AICostSimulator** — not yet audited. This repo contains both the NFR static tool and a separate Kimi Europe Expansion OS Next.js application. The Kimi app should not be publicly discoverable from the portfolio. Consider making it a separate private repo or removing it before public linking.
- [ ] **Repository approval: ai-risk-dashboard** — not in original audit. Verify all data is synthetic and no internal methodology references are present.
- [ ] **Repository approval: Autonomous-Operations-Control-Center** — not in original audit. Verify all events are synthetic and no production credentials are present.
- [ ] **Repository approval: AIRLOCK** — not in original audit. Terraform modules should be checked for real AWS account IDs, ARNs, or IAM configuration.
- [ ] **Repository approval: Selfcare** — not yet audited. Likely lowest risk; still requires credential and content check.

### Work status and availability

- [ ] **Work authorization** — what work authorizations do you hold? Content.json currently shows "EU · Switzerland" as the display string. Confirm this is accurate and the preferred wording.
- [ ] **Relocation preferences** — are you open to relocation? If so, to where?
- [ ] **Availability / notice period** — the contact section currently reads "Available within 3 months of confirmation." Confirm this is accurate.

---

### Pending content.json edits (blocked in auto mode — apply manually)

The following changes to content.json require elevated permissions. Apply manually in your editor:

1. **Remove `techNote` fields** — delete `"techNote": "executive"` and `"techNote": "technical"` lines from all 7 project entries and all experience entries (lines 139, 161, 183, 204, 222, 248, 271). These are residual TECH VIEW data fields no longer read by build.mjs.

2. **Clear `evidenceLabel`** — change line 68 from `"evidenceLabel": "Evidence, not self-ratings."` to `"evidenceLabel": ""`. The buildEvidence() function is now conditional and will suppress the footer paragraph when the value is empty.

3. **Update `projectsMethodologyNote`** (line 278) — shorten to: `"Independently developed, AI-assisted public prototypes using synthetic or illustrative data. Problem framing, requirements, workflow design, commercial logic, review and deployment owned by me. These demonstrate translating enterprise requirements into testable artefacts — they are not production client systems."`

4. **Change capability item** — in `capabilities[1].items` (line 542), change `"production-readiness planning"` to `"deployment and rollout planning"`.

5. **Update contact heading** — in `contact.headline` (line 578), change `"Happy to discuss how this applies to your context."` to `"Open to conversations in these areas."`

6. **Clean personal-story commercial field** — in `projects[6].commercial` (line 272), change `"the ability to work across the full stack independently"` to `"end-to-end workflow design independently"`.

7. **Add Accenture lead field** — in the first experience entry (Accenture), add after `"current": true,` on a new line: `"lead": "Leading AI strategy, economics, workflow design and pilot delivery in European financial services, with a focus on regulatory change programmes and go-to-market development."` — but **confirm with Thomas first** (see item above about Accenture lead sentence).

After making these edits, run: `npm run build:all`

### Pending package.json edit (blocked in auto mode)

Add to `devDependencies`: `"pdf-parse": "^1.1.1"` — then run `npm install`. The verify.mjs script already uses it gracefully (falls back to raw binary scan if not installed).

---

_Last updated: 2026-09-27 (Phase 2 refinement)._
