# Repository publication audit checklist

Before making any linked repository publicly visible or linking to it from a live portfolio site, complete this audit for each repository.

**Repositories referenced in this portfolio:**
- https://github.com/tzijlstra-acn/RealAIInfrastrucure
- https://github.com/tzijlstra-acn/ProReinsuranceAIWorkflow
- https://github.com/tzijlstra-acn/AICostSimulator
- https://github.com/tzijlstra-acn/Selfcare

---

## For each repository, check the following

### Credentials and secrets
- [ ] No API keys anywhere in the codebase (search for `sk-`, `api_key`, `apiKey`, `Bearer `, `token`)
- [ ] No credentials, passwords, or connection strings in `.env`, config files, or comments
- [ ] No secrets accidentally committed and then removed — check **full git history** (`git log -p` or `git grep` across all commits)
- [ ] `.env` files listed in `.gitignore` and not tracked

### Client and employer data
- [ ] No client names, client system names, or client-identifiable information
- [ ] No real client data, even in sample datasets or test fixtures
- [ ] No screenshots of client systems, dashboards, or internal tools
- [ ] No employer-branded materials (logos, templates, internal presentation formats)
- [ ] No internal URLs, internal hostnames, or internal system references

### Confidential content
- [ ] No confidential documents, templates, or proprietary methodologies
- [ ] No copyrighted third-party content without permission
- [ ] No internal Accenture IP, frameworks, or delivery assets
- [ ] No non-public regulatory correspondence or audit materials

### Production configuration
- [ ] No production database URIs, server addresses, or deployment credentials
- [ ] No production service accounts or IAM keys
- [ ] No cloud provider credentials (AWS, Azure, GCP)

### Data
- [ ] All datasets are synthetic, anonymized, mock, or clearly illustrative
- [ ] No real personal data (names, emails, financial records, health data)
- [ ] If sample data is used: verify it is genuinely synthetic, not derived from real data

### Employer obligations
- [ ] Reviewed against any applicable employment agreement or IP assignment clause
- [ ] Confirmed with employer communications policy if required
- [ ] No material that could be construed as confidential under NDA

---

## Audit procedure

For each repository:

```bash
# Check current files for common secret patterns
grep -rE "(api_key|apikey|api_secret|password|passwd|token|secret|credential|private_key)" . --include="*.py" --include="*.js" --include="*.ts" --include="*.env" --include="*.json" --include="*.yaml" --include="*.yml"

# Check git history (every commit, every file)
git log --all --full-history -p | grep -iE "(api_key|secret|token|password|Bearer sk-)"

# Check for .env files tracked in git
git ls-files | grep -i "\.env"

# Check for large binary files that may be documents
git ls-files | grep -iE "\.(pdf|docx|xlsx|pptx|doc|xls)"
```

---

## Status

| Repository | Audit completed | Approved for public linking | Notes |
|---|---|---|---|
| RealAIInfrastrucure | Not yet | Not yet | |
| ProReinsuranceAIWorkflow | Not yet | Not yet | |
| AICostSimulator | Not yet | Not yet | |
| Selfcare | Not yet | Not yet | |

---

**Warning:** Repositories containing internal or employer-specific material are unsuitable for public linking until independently sanitized. Publishing a repository with client data, credentials, or confidential employer content can have legal and professional consequences. Complete this audit before the portfolio goes live.

_Last updated: generated._
