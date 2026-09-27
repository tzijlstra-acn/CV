# Repository publication audit checklist

Before making any linked repository publicly visible or linking to it from a live portfolio site, complete this audit for each repository. Items marked with **FLAG** require immediate review before the repository can be safely linked.

**Repositories referenced in this portfolio (7 total):**
- https://github.com/tzijlstra-acn/RealAIInfrastrucure _(confirm spelling — possible typo for "RealAIInfrastructure")_
- https://github.com/tzijlstra-acn/ProReinsuranceAIWorkflow
- https://github.com/tzijlstra-acn/AICostSimulator
- https://github.com/tzijlstra-acn/ai-risk-dashboard
- https://github.com/tzijlstra-acn/Autonomous-Operations-Control-Center
- https://github.com/tzijlstra-acn/AIRLOCK
- https://github.com/tzijlstra-acn/Selfcare

---

## Specific flags by repository

### RealAIInfrastrucure

**FLAG — repo name spelling:** The URL uses "Infrastrucure" (missing one 'u'). Confirm whether this is the actual GitHub repository name or a typo. A misspelled URL will silently 404 for portfolio visitors. If misspelled, correct the URL in content.json and rebuild.

**FLAG — NFR practice methodology:** This repo covers RCSA, TPRM, regulatory change workflows. Check for any references to Accenture NFR methodology names, internal framework names, or client-engagement wording ("for [client name]", "as delivered at", "internal engagement use only").

**FLAG — Accenture references:** Search for any Accenture branding, project codes, engagement IDs, or internal system names.

Other checks: credentials/API keys in code and git history, synthetic data only, no client system names.

---

### ProReinsuranceAIWorkflow

**FLAG — client-identifying repo name:** The repository name includes "Reinsurance" which could be interpreted as a reference to a specific client engagement. Confirm that the name was chosen for generic industry context and is not identifiable as a specific client project.

**FLAG — client names in history:** Run `git log --all --full-history -p | grep -i "reinsur"` and check for any client-identifiable names in commit messages, file content, or removed files.

**FLAG — DORA engagement content:** This repo is linked to the DORA Article 12 demonstrator. Check that all data used is genuinely synthetic and anonymised, and that no real regulatory submission documents, internal policy drafts, or client-engagement materials are present.

Other checks: credentials/API keys in code and git history, no internal system references.

---

### AICostSimulator

**FLAG — mixed content:** This repository contains two separate applications: (1) the NFR static tool (AI Cost Simulator) which is a legitimate portfolio demonstrator, and (2) a separate Kimi Europe Expansion OS Next.js application which is a strategy planning document and should not be publicly discoverable from the portfolio. Before linking this repo, either:
  - Remove the Kimi/Moonshot Next.js application from the public repo (move to a separate private repo), or
  - Make the AICostSimulator repo private and host only the static NFR tool separately.

**FLAG — brag-output directory:** The `brag-output/` directory (if present in git history) may contain strategy content ("production-grade strategy command center" language has been observed). Confirm what is in this directory and whether it is tracked in git.

**FLAG — Kimi/Moonshot branding:** The Next.js app contains references to Kimi AI and Moonshot. This should not be publicly discoverable from a professional portfolio that doesn't reference these.

Other checks: no API keys (check for `KIMI_API_KEY`, `MOONSHOT_API_KEY`, `OPENAI_API_KEY` in git history).

---

### ai-risk-dashboard

**FLAG — not previously audited.** This repository has not been reviewed. Required checks:

- Confirm all data is synthetic (no real model names, client organisation names, or real governance records)
- Check for NIST AI RMF, DORA, SR 11-7 references — confirm these are general regulatory framework references, not specific client audit materials
- Check for Accenture branding or internal methodology names (AI risk assessment methodology, internal scoring frameworks)
- Check for any "for internal engagement use only" markers

---

### Autonomous-Operations-Control-Center

**FLAG — not previously audited.** This repository has not been reviewed. Required checks:

- Confirm all events and state transitions are synthetic (no real production system names, real incident data, or real ITSM records)
- Check for production system credentials, API keys, or real endpoint URLs in code or git history
- Check for Accenture branding or client-identifiable content in demo scenarios

---

### AIRLOCK

**FLAG — not previously audited.** This repository has not been reviewed. Required checks:

- **Terraform modules:** Check `*.tf` files for real AWS account IDs, ARNs, region-specific identifiers that could identify a production environment, or real IAM user/role names
- **AWS configuration:** Check for any real AWS credentials, access keys, or secret keys in code, `.env` files, or git history
- Confirm the demo workload uses only synthetic data (the portfolio states "primary markets bond structuring assistant using synthetic data")
- Check for Accenture branding, client names, or internal deployment environment names
- The phrase "compliant deployment" in portfolio copy is intentionally qualified as reference architecture — confirm the repo itself does not claim production deployment status

---

### Selfcare

Lowest assessed risk — personal project with no enterprise or client data. Still requires:

- Credential check in code and git history
- Confirm no personal data or third-party copyrighted content is present without permission

---

## Standard audit procedure (run for each repository)

```bash
# Check current files for common secret patterns
grep -rE "(api_key|apikey|api_secret|password|passwd|token|secret|credential|private_key|sk-|Bearer )" . \
  --include="*.py" --include="*.js" --include="*.ts" \
  --include="*.env" --include="*.json" --include="*.yaml" --include="*.yml" \
  --include="*.tf" --include="*.tfvars"

# Check git history (every commit, every file)
git log --all --full-history -p | grep -iE "(api_key|secret|token|password|Bearer sk-|OPENAI|KIMI|MOONSHOT)"

# Check for .env files tracked in git
git ls-files | grep -i "\.env"

# Check for tracked binary documents
git ls-files | grep -iE "\.(pdf|docx|xlsx|pptx|doc|xls)"

# Check for internal wording
grep -ri "accenture\|for internal engagement use only\|large european bank\|production-ready\|client engagement" .

# Check for Terraform/cloud credentials
grep -rE "(account_id|aws_access_key|aws_secret|subscription_id|tenant_id)" . --include="*.tf" --include="*.yaml"
```

---

## Audit status

| Repository | Audit completed | Approved for public linking | Specific flags |
|---|---|---|---|
| RealAIInfrastrucure | Not yet | Not yet | Repo name spelling; NFR methodology references; Accenture references |
| ProReinsuranceAIWorkflow | Not yet | Not yet | Client-identifying repo name; DORA content check |
| AICostSimulator | Not yet | Not yet | Mixed content (Kimi app must be separated or removed before linking) |
| ai-risk-dashboard | Not yet | Not yet | Not previously audited |
| Autonomous-Operations-Control-Center | Not yet | Not yet | Not previously audited |
| AIRLOCK | Not yet | Not yet | Not previously audited; Terraform/AWS check required |
| Selfcare | Not yet | Not yet | Lowest risk; standard audit required |

---

## Immediate actions required

1. **AICostSimulator:** Separate or remove the Kimi Europe Expansion OS app before this repo is publicly linked from the portfolio.
2. **RealAIInfrastrucure:** Confirm the repo name spelling — if misspelled, the portfolio link is broken.
3. **AIRLOCK:** Run Terraform file audit for real AWS identifiers before any public linking.
4. All repositories: complete the standard audit procedure above before the portfolio goes live.

---

**Warning:** Repositories containing internal or employer-specific material are unsuitable for public linking until independently sanitised. Publishing a repository with client data, credentials, or confidential employer content can have legal and professional consequences. Complete this audit before the portfolio goes live.

_Last updated: 2026-09-27._
