# Case evidence: public prototype repositories

Prepared on 2 November 2026 to check the `projects` entries in `content.json` against the code.

**Method**
- Every local clone was fetched and compared with GitHub.
- Verdicts rest on the GitHub default branch, which is what a reader following a portfolio link sees.
- Repository contents were treated as data. No dependencies were installed and no repository scripts were run.
- Test counts come from reading the test files.
- References are `path:line`, relative to the root of each repository at the SHA given.

**Verdict key**
- SUPPORTED.
- PARTLY SUPPORTED: the accurate part is stated.
- NOT FOUND: either no evidence in the repository, or the repository contradicts the claim.

**Confidentiality.** Real client or financial-institution names found in the repositories are written as [redacted client name]. Access codes, passwords and personal contact details found in the repositories are left out.

---

## 1. Repository state (checked 2 November 2026)

| Portfolio project | GitHub repository (default branch) | GitHub commit used | Local clone | Difference |
|---|---|---|---|---|
| Enterprise AI Economics Simulator | `tzijlstra-acn/AICostSimulator` (`main`) | `3bb08e2575fbb611fd0e2c876ea1d2d0b01a56e8` (single commit, 8 Sep 2026) | `main` at the same commit | Same commit. GitHub also has `gh-pages` (`cc8de5d`, the same two HTML files) and a public non-default branch `worktree-agent-a674b27b54af7e43e` (`056e7b4`, 44 commits). The local working tree has many untracked files (see 3.9). |
| DORA Article 12 AI Control Line | `tzijlstra-acn/ProReinsuranceAIWorkflow` (`main`) | `b607dbf67b74592eca5208034a35b619db52a42f` | `3aa3fd7` | Local is 3 commits ahead (`bbfe899`, `044930f`, `3aa3fd7`) and not pushed. |
| Enterprise NFR Workflow (Agent) Platform | `tzijlstra-acn/RealAIInfrastructure` (`main`) | `e76a013ad1f149b235b5cd8970f8e4da3abaa61f` | `a784e20` | Local is 2 commits ahead (`1cc2d81`, `a784e20`) and not pushed, with uncommitted edits to 8 files. The portfolio link spells the repository `RealAIInfrastrucure`; GitHub redirects it (HTTP 301). |
| AIRLOCK | `tzijlstra-acn/AIRLOCK` (`main`) | `ff0e25c7242fd148c7e0505503d815a492851bf9` | Checked out on `hardening/production-foundation` `5078ab0` (matches GitHub). Local `main` is `2eb2333`. | Local `main` is 1 commit ahead of GitHub `main` and not pushed. The GitHub hardening branch is 4 commits ahead of `main`. |
| AI Model Risk Dashboard | `tzijlstra-acn/ai-risk-dashboard` (`master`) | `eb09cef8367e201c121bd8e8d5432d4aeff1cbb8` | Same commit | Two mock-data files are modified locally and not committed. |
| Autonomous Operations Control Center | `tzijlstra-acn/Autonomous-Operations-Control-Center` (`main`) | **None: the GitHub repository is empty** (no refs, size 0) | `777ae0d` (3 commits), plus 41 staged and 2 unstaged files | Nothing has ever been pushed. |
| Interactive Personal Story | `tzijlstra-acn/Selfcare` (`main`) | `256a0417dea8759ec933a0636e1773aa37274160` | Same commit | None. |

**Live deployments** (HTTP checks on 2 November 2026):
- `tzijlstra-acn.github.io/AICostSimulator/`: 200.
- `tzijlstra-acn.github.io/ai-risk-dashboard/`: 200.
- `tzijlstra-acn.github.io/Selfcare/`: 404.
- No other project has a hosted deployment.

---

## 2. Cross-cutting findings

### 2.1 Authorship

Commit counts include local branches.

| Repository | Commits | Commit author | AI co-author trailers | AI-assistant files |
|---|---|---|---|---|
| AICostSimulator | 100 (1 on GitHub `main`) | Thomas Zijlstra (3 through the GitHub web UI) | 79 Claude Sonnet 4.6, 4 Claude Opus 4.8 | Local `.claude/worktrees/agent-*` folders. The pushed branch name `worktree-agent-...` is a Claude Code agent-worktree artefact. |
| ProReinsuranceAIWorkflow | 20 (17 on GitHub `main`) | Thomas Zijlstra | 18 (15 on GitHub `main`) | `CLAUDE.md` contains only `@AGENTS.md`. `AGENTS.md` is the agent-rules block that Next.js generates. |
| RealAIInfrastructure | 7 | Thomas Zijlstra | 6 | None. The initial commit `8ccfe0d` holds 121 files and about 25,400 lines. |
| AIRLOCK | 6, all on 16 Aug 2026 | Thomas Zijlstra | 6 | `docs/NEXT_SESSION.md` (hardening branch) is an AI-session hand-off. The initial commit holds 172 files and 35,324 lines. |
| ai-risk-dashboard | 23 | Thomas Zijlstra | 17 | None |
| Autonomous Operations Control Center | 3 (local only) | Thomas Zijlstra | 3 | None |
| Selfcare | 13 | Thomas Zijlstra | 12 | None |

**"AI-assisted" is strongly supported.**
- Code arrives in large single commits that carry assistant co-author trailers.
- The AI assistant very likely generated most of the code and documentation.

**Thomas owning framing, requirements and review is supported by planning and narrative documents:**
- DORA: `IMPLEMENTATION_PLAN.md` (stack decisions with reasons, recorded assumptions, risks), `docs/DEMO_STORY.md`, `docs/demo-script.md` and `docs/assumptions-and-disclaimers.md`.
- AIRLOCK: `docs/CLAIMS_LEDGER.md` and `docs/IMPLEMENTATION_STATUS.md`. The hand-off `docs/NEXT_SESSION.md` lists standing guardrails set by the human: do not push, do not run `terraform apply`, and make no licence or compliance claims without explicit approval.
- AICostSimulator: README disclaimers, plus commit messages that show iterative direction ("Simplify to banking-only", "Reword scenario questions").

**Evidence that weakens "independently developed":**
- Several repositories show they were produced in an employer and client-engagement context.
- Employer practice branding appears in the current public tree of ai-risk-dashboard (README and `public/client-story.html`) and in the public history of AIRLOCK and RealAIInfrastructure.
- "Remove employer references" commits exist in AIRLOCK (`ff0e25c`), RealAIInfrastructure (`be8dd97`) and the AICostSimulator worktree branch (`d253dd6`). They clean the current tree, but the earlier text stays in the public history.
- A real client is named as the audience in the public DORA repository and in one AIRLOCK ADR. It is also named in the unpushed Autonomous Operations Control Center README, which refers to a client "Use Case 2".
- The AICostSimulator and ai-risk-dashboard pages sit behind client-side access-code gates labelled "Protected asset".
- Specifics are reported separately, not in this file.

**Deployment.**
- Only AICostSimulator and ai-risk-dashboard are deployed (GitHub Pages).
- DORA, NFR, AIRLOCK and the Operations Control Center run locally only.
- For those four, "deployment" in the contribution lines would be more accurate as "publication on GitHub".

### 2.2 Continuous integration (GitHub Actions public API, 2 November 2026)

| Repository | CI |
|---|---|
| AICostSimulator | Pages deploy workflow only (`.github/workflows/deploy.yml`), no tests. Runs on `main`: 7 succeeded, 4 failed. |
| ProReinsuranceAIWorkflow | None: there is no `.github/` directory. |
| RealAIInfrastructure | `ci.yml` failed on `e76a013`. It runs gateway tests, ruff, mypy, Docker builds, Helm lint, a benchmark smoke run and pip-audit. `security.yml` runs succeed. |
| AIRLOCK | 5 workflows. **All 70 runs concluded failure** (see 6.3). |
| ai-risk-dashboard | Pages deploy: 18 succeeded, 2 failed. |
| Autonomous Operations Control Center | No remote. |
| Selfcare | None. |

### 2.3 Related claims elsewhere in `content.json`

**`roleFit.rows.0.evidence`**: "Working builds published: agents, knowledge graphs, workflow orchestration, document intelligence, human approval gates, enterprise integrations, AI economics tools".
- Verdict: PARTLY SUPPORTED.
- Each item exists in at least one public repository: agents, NetworkX graph, document pipeline and ServiceNow in NFR; approval gates in DORA and AIRLOCK; the economics tool in AICostSimulator.
- Every committed document-intelligence output in the NFR repository records an extraction failure.
- The Operations Control Center is not published.

**`roleFit.rows.4.evidence`**: "... model evaluation and routing ...".
- Verdict: PARTLY SUPPORTED.
- Routing exists in three forms:
  - DORA: a static task-to-model assignment.
  - NFR: an ordered fallback.
  - AICostSimulator: benchmark-weighted selection over placeholder scores.
- Model evaluation does not exist as such. The AIRLOCK evals test deterministic components and a scripted adapter, and no repository evaluates live model output.

---

## 3. Enterprise AI Economics Simulator (AICostSimulator)

**Evidence base:** GitHub `main` `3bb08e2`. It contains five files:
- `index.html` (255 lines);
- `app.html` (3,712 lines);
- `README.md`;
- `.gitignore`;
- `.github/workflows/deploy.yml`.

Byte-identical copies of the two HTML files are on `gh-pages` and on the public worktree branch. All line numbers below refer to `app.html` unless stated.

### 3.1 What exists

**Form.**
- A single-file static web app: vanilla JavaScript in `app.html:1429-3670`, plus a canvas animation at `3671-3710`.
- There is no framework, no build step, no backend and no model API call. Model names are pricing inputs only.

**Access gate.**
- `index.html` is a "Protected asset" page that asks for an access code (`index.html:156`, `209-220`).
- `app.html:5` redirects back to it unless a `sessionStorage` flag is set.
- The code is in plain text in the public source, so the gate is cosmetic. Both pages are live on GitHub Pages.

**Flow.**
1. Context: organisation size and staff count, where the AI runs, existing platform.
2. What you want AI to do: maturity target L1 to L5, scenario chips, active users, source systems.
3. Advanced calibration.

**Views:**
- cost flow (Sankey-style);
- per-task waterfall from ungoverned to governed;
- request flow;
- "what moves the number";
- scale;
- model picks;
- "Models & math";
- journey;
- performance radar;
- ROI and benefits;
- a 10-year chart with cash-flow, amortised and level views.

The render list is at `2319` and the chart toggle at `1144`.

**Exports and saved scenarios.**
- Client summary and methodology, both printed to PDF through the browser (`1145`, `1412`, `1422`, `3550`).
- Saved scenarios in `localStorage` with a percentage comparison (`3605-3670`).

**Sectors and regions.**
- Only Banking is defined (`INDUSTRIES` `1558-1593`), with five sub-types: cooperative, retail or commercial, private and wealth, regional or Landesbank, neobank.
- The README still claims banking, insurance, healthcare and telecom. The `REG` (`1456-1461`) and `STACK` (`1643-1648`) tables keep entries for the other three, but nothing can reach them. Commit `cc0c469` is "Simplify to banking-only".
- Regions are Germany, Austria and Switzerland, with EUR and CHF (`1446-1454`).

**Scope.** 18 scenario definitions (`1478-1535`) across 10 departments (`1541-1552`).

**Model catalogue** (`1606-1621`). Prices are USD per million tokens, input/output.

| Model | Price |
|---|---|
| Claude Opus 4.8 | 5 / 25 |
| Claude Sonnet 4.6 | 3 / 15 |
| Claude Haiku 4.5 | 1 / 5 |
| OpenAI GPT-5.5 | 5 / 30 |
| OpenAI GPT-5.4 | 2.5 / 15 |
| Gemini 3.1 Pro | 2 / 12 |
| Gemini 3.5 Flash | 1.5 / 9 |
| Mistral Large | 2 / 6 |
| Aleph Alpha (estimate) | 3 / 12 |
| Llama, self-hosted (estimate) | 1.2 / 2.2 |
| Azure OpenAI GPT-4o (manual override only) | 2.5 / 10 |
| Azure OpenAI GPT-4o-mini (manual override only) | 0.15 / 0.6 |

- The two Azure models are excluded from auto-routing (`1617-1619`; `realModels` at `1713`).
- Each model carries placeholder scores for reasoning, speed, context, sovereignty and safety.
- The comment at `1600-1605` dates the prices "verified ~June 2026" and labels Llama and Aleph Alpha as estimates.

### 3.2 Input parameters and default values

**Context and scope**

| Parameter | Variable or element | Default | Reference |
|---|---|---|---|
| Industry, sub-type | `state.industry`, `state.sub` | Banking, cooperative bank | `1699` |
| Region | `state.region` | DE (EUR) | `1699` |
| Organisation size band | `state.orgSize` | mid (5,000 to 20,000 staff) | `1699`, `ORGSIZE` `1810-1814` |
| Staff count | `orgStaff` | 12,000 | `887`, `1699` |
| Hosting | `state.hosting` | EU-sovereign for banking and insurance; on-prem for health; vendor cloud otherwise. In CH, cloud becomes sovereign. | `1658`, `1699` |
| Existing platform | `platformExists`, `platProgress` | "building", 30% complete | `1699`, `967` |
| Maturity target | `state.level` | L3 "Automated workflows" | `1699` |
| Scenarios | `state.scenarios` | RCSA, control testing, TPRM | `1557`, `1699` |
| Task complexity (manual mode only) | `state.tier` | medium | `1699` |
| Active users | `users` | Auto-set to 0.75 x the sum of scenario FTEs: 72 at defaults. The HTML default of 150 applies only when no scenario is selected. | `924`, `3334-3338` |
| Source systems | `systems` | 12 | `931` |
| Requests per user per day (manual mode only) | `intensity` | 0.6 | `955` |

**Routing and usage behaviour**

| Parameter | Variable or element | Default | Reference |
|---|---|---|---|
| Smart routing | `smartRoute` | on | `969` |
| Single-pass resolution rate | `warmShare` | 85% | `975` |
| Follow-ups per continuing user | `nFollow` | 4 | `979` |
| Live re-assessment intensity | `liveMon` | 100% | `986` |
| Model override | `model` | auto | `1013`, `3471` |

**Financial benchmarks**

| Parameter | Variable or element | Default | Reference |
|---|---|---|---|
| Seat cost per user per year | `perUser` | EUR 430 (CHF 560) | `1017`, `1452-1453` |
| Platform build by maturity level | `BUILD` | L1 400,000; L2 900,000; L3 1,600,000; L4 2,400,000; L5 3,400,000. Multiplied by the org factor and overridable. | `1676` |
| Integration cost per system | `intgRate` | 35,000 | `1025` |
| Dashboard (use-case) build, medium reference | `ucRate` | 90,000. Simple x0.5, high x1.65. | `1029`, `1873` |
| Amortisation and go-live years | `amort` | 3 (range 1 to 10) | `1033`, `1688` |
| EUR/USD rate | `eurusd` | 1.137 (CHF 1.235) | `1037`, `1452` |
| Dashboard upkeep | `ucUpkeep` | 8% of build per year | `1063` |
| Enhancements per dashboard per year | `ucChanges` | 2 | `1067` |
| Cost per enhancement | `ucChangeCost` | 6% of build | `1071` |

**Value inputs**

| Parameter | Variable or element | Default | Reference |
|---|---|---|---|
| Analyst day rate | `staffRate` | 500 | `1051` |
| Avoided supervisory findings per year | `riskFindings` | 1 | `1055` |
| Remediation cost per finding | `riskCostPer` | 250,000 | `1059` |

**10-year forecast**

| Parameter | Variable or element | Default | Reference |
|---|---|---|---|
| Token price change per year | `priceDelta` | -15%. Presets: -40% and +12%. | `1093` |
| Headcount growth per year | `hcGrowth` | +2% | `1105` |
| Usage growth per user per year | `intGrowth` | +6% | `1112` |

The reset function `applyBase` (`3469-3485`) restores all of these defaults.

**Hard-coded constants (not editable in the UI)**

*Complexity tiers* (`TIERS` `1663-1667`):

| Tier | Steps | Input tokens per step | Output tokens per step |
|---|---|---|---|
| Simple | 3 | 8,000 | 600 |
| Medium | 7 | 18,000 | 1,200 |
| High | 18 | 35,000 | 2,000 |

*Maturity levels* (`LEVELS` `1623-1629`):

| Level | Cache | Context multiplier | Retry | Batched |
|---|---|---|---|---|
| L1 | 25% | 1.30 | 12% | 0% |
| L2 | 45% | 1.00 | 8% | 0% |
| L3 | 60% | 0.85 | 6% | 15% |
| L4 | 72% | 0.70 | 5% | 25% |
| L5 | 88% | 0.55 | 3% | 40% |

*Hosting* (`HOSTING` `1653-1657`):

| Hosting | Infrastructure per year | Token multiplier |
|---|---|---|
| Vendor cloud | 0 | 1.00 |
| EU-sovereign | 180,000 | 1.10 |
| On-prem | 1,100,000 | 0.30 |

On-prem restricts the candidate models to Llama, Mistral Large and Aleph Alpha (`1659-1660`).

*Other constants:*
- **Live re-assessment multiplier** by level L1 to L5: 0, 0, 0.15, 0.6, 1.3 (`1769`).
- **Org factor:** linear in staff count within each band (`1810-1815`):
  - small: 0.55 to 0.85;
  - mid: 0.85 to 1.2;
  - large: 1.2 to 2.0.
- **Shared run base:** 140,000 x org factor, plus 9,000 per system (`1881`).
- **Governance cost per FTE:** 125,000 (150,000 in CH) (`1890`).
- **Working days:** 20 per month and 240 per year for usage (`1686-1687`); 220 per year for benefits (`2193`).
- **Scenario FTE share of total staff** (`1536-1540`): RCSA 0.30%, control testing 0.35%, TPRM 0.15%.
- **Scenario request volume per user per year and AI time-saving share** (`1478-1535`):
  - RCSA: 36, 25%;
  - control testing: 132, 30%;
  - TPRM: 91, 35%.
- **Display-only indicators by level**, not used in cost (`1639-1640`):
  - automation coverage: 8, 20, 65, 85, 95%;
  - share of tasks a person still reviews: 95, 80, 45, 15, 5%.

### 3.3 Formulas

**(a) Model routing** (`1713-1732`)

1. **Price score.**
   - Blended price = 0.75 x input price + 0.25 x output price.
   - Cost score = 100 x (1 - blended price / highest blended price) (`1714-1716`).
2. **Tier weights** over reasoning, speed, cost, context and safety (`1720-1727`):
   - simple: 0.18, 0.40, 0.28, 0.09, 0.05;
   - medium: 0.36, 0.16, 0.24, 0.16, 0.08;
   - high: 0.50, 0.04, 0.08, 0.22, 0.16.
3. **Adjust for maturity**, then renormalise:
   - cost weight x (1 + 0.12 x (level - 1));
   - reasoning weight x max(0.6, 1 - 0.04 x (level - 1)).
4. **Score** = sum of (weight x axis score) + sovereignty bonus x (model sovereignty score / 100).
   - Sovereignty bonus = sector weight x 38, or x 26 for the high tier.
   - Sector weight is 0.22 for banking, insurance and health, 0.12 otherwise, plus 0.06 in CH (`1719`, `1729-1730`).
5. **Winner.** The highest score among the models allowed by the hosting choice wins (`1660`, `1729`).

Follow-up ("warm") requests use fixed weights with the full sovereignty bonus (`1732`): cost 0.50, speed 0.34, reasoning 0.10, context 0.04, safety 0.02.

A manual model override replaces both picks (`1731-1732`).

The `ROUTE` table (`1669-1675`) has no references, and `LEVELS[].model` is used only when no tier is passed. Neither drives auto-routing.

**(b) Cost per request** (`taskParts` `1748-1763`)

- Input tokens = steps x input tokens per step x the level's context multiplier.
- Output tokens = steps x output tokens per step.
- Effective input price = input price x hosting multiplier x ((1 - cache) + cache x 0.10).
- Heavy-lift ("cold") cost in EUR = (input tokens x effective input price + output tokens x output price x hosting multiplier) x (1 - batch share x 0.5) x (1 + retry share), divided by the EUR/USD rate.
- A follow-up ("warm") call uses the warm model, with cache raised by 30 points (maximum 95%).
- **Cost per request = cold cost + (1 - single-pass rate) x follow-ups x warm cost.**

**(c) Annual usage** (`1770-1800`)

Scenario mode:
- Scenario FTEs = round(staff x FTE% / 100) (`3329-3333`).
- Requests per month per scenario = round(scenario FTEs x requests per year / 12) (`1770-1774`).
- Usage per year = sum of (requests per month x 12 x cost per request).
- Live re-assessment adds the sum of (requests per month x 12 x level multiplier x `liveMon` x cold cost) (`1778-1789`).

Manual mode:
- Usage = users x intensity x 20 x 12 x cost per request.

**(d) Fixed costs** (`fixedYr` `1867-1901`)

*Factors:*
- Org factor: see 3.2 (`1815`).
- Platform factor (`1866`):
  - none: 1.0;
  - building: 1 - 0.75 x progress;
  - in place: 0.40 - 0.32 x reusable share.

*Shared platform:*
- Shared one-off = (BUILD[level] x org factor + systems x 35,000) x platform factor.
- Shared run per year = 140,000 x org factor + systems x 9,000 + hosting infrastructure x org factor.
- Shared annual = shared one-off / amortisation years + shared run.

*Division share:*
- Share = 1 / number of functions sharing, with a minimum of 5% (`1832-1842`, `1864`).
- Functions are the distinct departments of the selected scenarios, including the core division.

*Dashboards:*
- Build = sum of 90,000 x complexity weight (simple 0.5, medium 1.0, high 1.65).
- Annual = build / years + build x 8% + build x 2 x 6%.

*Governance:*
- FTE = 0.4 + users / 1,400 + use cases x 0.10 + (level - 1) x 0.20.
- Cost = FTE x 125,000 (`1889-1891`).
- Governance is charged in full to the division, not shared.

*Totals:*
- **Fixed total = share x shared annual + dashboards annual + governance.**
- Standalone comparison = the same with share = 100% (`1896`).

**(e) Headline annual cost** (`levelTotals` `1902-1906`)

- **All-in per year = fixed total + licences (seat cost x users) + usage.**
- It is shown as "Year 1 of an N-year plan, build amortised" (`2218`).
- Cost per user per month = all-in / 12 / users.
- Cost per task = request-weighted average cost per request.

**(f) Benefits** (`2187-2204`)

- **Labour benefit per scenario = staff x FTE% / 100 x AI time-saving share x day rate x 220** (`2187-2194`).
- With no scenarios selected: staff x 0.0015 x 0.40 x day rate x 220.
- **Risk reduction = avoided findings x remediation cost per finding** (`2197`).
- Annual benefit = labour + risk reduction.
- Benefits do not depend on maturity level, hosting, model choice or the user count.

**(g) Ten-year projection and ROI** (`1689-1697`, `2180-2186`, `2205-2211`, `2599-2629`)

*Build and adoption:*
- The go-live year g equals the amortisation years.
- Build spend is spread over years 1 to g with bell-shaped (Gaussian) weights (`1689-1696`). For the 3-year default: 22.6%, 54.9%, 22.6%.
- One-off investment = (allocated shared build per year + dashboard build per year) x g.
- Adoption ramp: 0 before year g, 40% in year g, 75% in year g+1, 100% after (`1697`).

*Yearly cost from year g (t = year):*
- run cost (allocated run + governance);
- plus dashboard upkeep and enhancements;
- plus licences x ramp x (1 + headcount growth)^(t - g);
- plus usage x ramp x ((1 + headcount growth)(1 + usage growth)(1 + price change))^(t - g).

*Benefit and results:*
- Yearly benefit from year g = annual benefit x ramp x (1 + headcount growth)^(t - g).
- Outputs (`2623-2629`):
  - break-even year: the first year in which cumulative net is zero or above;
  - 10-year net value, total benefit and total cost;
  - ROI = net / cost.
- Best-case and worst-case growth multipliers (`2208-2209`) feed a recommended buffer (`2304`).

**(h) Viability score** (`2006-2079`)

- A display heuristic from 0 to 100.
- 70% cost-efficiency: utilisation, sharing breadth, user scale, intensity and per-seat cost.
- 30% value: coverage and the drop in human review.
- Caps apply.

**(i) Ungoverned baseline** (`1908-1913`; waterfall `2432-2475`)

- Baseline: frontier price 5/25, no cache, context x1.45, 18% retries, no batching.
- The waterfall then applies the governed choices in steps: routed model, context, caching, then batch and retry.

### 3.4 Outputs

- Headline all-in annual cost, split into fixed, licences and usage.
- Cost per user per month.
- Cost per task, and its change against L1.
- Automation-coverage and human-review indicators.
- The division's shared-platform share, with the standalone comparison.
- 10-year cumulative cost.
- ROI KPIs: break-even year, 10-year net value, benefit, cost and ROI.
- Year-by-year table.
- Benefit drivers by scenario.
- Rule-based recommendations.
- "What moves the number" deltas: hosting switch, adding a function, doubling users, coverage, one more dashboard (`2859-2866`).
- Model picks per tier.
- Printable methodology (`2780-2858`).
- Viability score.

### 3.5 Worked default example (re-computed)

These figures come from an independent re-implementation of the formulas in 3.3 (a scratch script, not repository code). They were not captured from the running page, so treat them as a consistency check; small rounding differences are possible.

**Scenario: all defaults**
- Banking, Germany, 12,000 staff, EU-sovereign hosting, platform 30% built, L3.
- Scenarios: RCSA, control testing, TPRM.
- Two functions share the platform (Risk & Compliance; Procurement/TPRM), so the division's share is 50%.
- 72 users, 12 systems, 3-year go-live.

**Year-1 cost build-up**

| Item | Value |
|---|---|
| Org factor / platform factor | 1.013 / 0.775 |
| Shared one-off | (1,621,333 + 420,000) x 0.775 = 1,582,033 |
| Shared run per year | 141,867 + 108,000 + 182,400 = 432,267 |
| Allocated build per year (50% of 1,582,033 / 3) | 263,672 |
| Allocated run per year (50%) | 216,133 |
| Dashboards (build 328,500: RCSA 148,500 + 2 x 90,000) | 109,500 + 65,700 = 175,200 |
| Governance (1.15 FTE x 125,000) | 143,929 |
| **Fixed total** | **798,934 (96%)** |
| Licences (72 x 430) | 30,960 (4%) |
| Usage (707 requests per month) | 2,799 (0.3%) |
| **All-in, Year 1** | **about 832,700 (unshared standalone: about 1,312,500)** |

**Routing at defaults**
- RCSA (high tier): Gemini 3.1 Pro.
- Control testing and TPRM (medium tier): Mistral Large.
- Follow-ups: Llama (self-hosted).
- Cost per request: about EUR 0.99 for the high tier and 0.17 for the medium tier; blended 0.29.

**By maturity level (same inputs)**
- L1: 628,622
- L2: 716,945
- L3: 832,693
- L4: 961,781
- L5: 1,117,526

Cost per request falls from 0.68 (L1) to 0.12 (L5), yet the total rises, because build cost grows faster than token savings.

**By hosting at L3**
- Vendor cloud: 741,239.
- EU-sovereign: 832,693.
- On-prem: 1,296,708.

**Benefit at full adoption**
- Labour: 3,069,000 (RCSA 990,000; control testing 1,386,000; TPRM 693,000).
- Risk: 250,000.
- Total: 3,319,000 per year.

**Ten years**
- Cumulative cost 4.78m, benefit 25.65m, net 20.87m, ROI +437%.
- Break-even in year 4. Cumulative net by year: -252,574, -866,942, -231,182, then +1,856,477.

**Implication for the portfolio widget**
- At defaults, the cost side is driven almost entirely by fixed costs: shared platform, dashboards and governance.
- The benefit side is driven by assumed FTE time savings.
- Token prices and routing move the headline by well under 1%.
- A widget that presents token routing as the main lever would misrepresent the simulator.
- A faithful minimal widget has:
  - inputs: users, functions sharing, hosting, maturity level;
  - cost = fixed (shared x 1/functions + dashboards + governance) + licences + usage;
  - benefit = FTE x saving share x day rate x 220 + avoided findings x cost per finding;
  - output: break-even on the 3-year bell-shaped build and the 40/75/100% adoption ramp.

### 3.6 Human approval and control

Not applicable: the simulator has no workflow and no approvals. It models governance as a people-cost line, and shows a per-level indicator of the share of tasks a person still reviews (`1639-1640`).

### 3.7 Tests and CI

- No tests on `main`.
- CI is the Pages deploy workflow only.
- The public worktree branch has Vitest and Playwright configuration, but it belongs to the separate Next.js app (see 3.9).

### 3.8 Data

- All values are labelled illustrative placeholders: the README "Important" section and the methodology disclaimer in `buildMathSummary` (`2780-2858`).
- No personal or client data.
- Realistic content includes:
  - real model-vendor names and list prices;
  - regulator names by region (`1456-1461`);
  - sub-type narratives describing market archetypes, for example a cooperative banking group sharing one core banking platform, without naming an institution.
- An "[redacted employer practice asset]" is cited for an Azure reference architecture (`1344`, `1617`, `2195`), with no further context.

### 3.9 "[redacted prospective-employer application]" Next.js app

The app is not on `main` or `gh-pages`.

**On GitHub**
- It is on the public non-default branch `worktree-agent-a674b27b54af7e43e` at `056e7b4` ("[redacted prospective employer] EU Strategy OS, full dashboard build", 23 August 2026).
- It is a Next.js 15 / React 19 app with a redacted package name, containing `src/`, `messages/`, `tests/e2e` and Playwright and Vitest configuration.
- The same branch carries the identical simulator `app.html` and the simulator's 44-commit development history.

**Locally**
- The app exists as untracked files in the main working tree: `package.json`, `src/`, `messages/`, `public/`, `tests/`, `.next/`, `out/`, `dist/`.
- The same working tree also holds unrelated untracked items: `orbit_challenge/`, `brag-output/` and `pitch.html`.
- It also exists in the Claude Code worktree `.claude/worktrees/agent-a674b27b54af7e43e` at `46e94c4`, which is 2 commits ahead of the GitHub branch (`54bb040`, `0fab573`).

If the portfolio should point only at the simulator, consider deleting or renaming the public branch. Its name also exposes the agent-worktree workflow.

### 3.10 Limitations visible in the code

- Banking only, although the README claims four sectors.
- Benefits ignore maturity level, hosting and model choice. Only costs respond to those levers, so at the same benefit a higher level always costs more in Year 1.
- Governance is not shared across functions, although platform cost is.
- In scenario mode, two request totals coexist:
  - usage counts requests as FTE x per-year volume (`1770-1800`);
  - the viability score and summary use users x adoption x per-day rate (`2008`, `2100`).
- The unused `ROUTE` table can mislead anyone reading the code.
- Benchmarks and prices are placeholders, and the access gate is cosmetic.
- No tests.

### 3.11 Claim check (`content.json` entry `ai-economics`)

| Claim (quoted) | Verdict | Evidence |
|---|---|---|
| title "Enterprise AI Economics Simulator" | PARTLY SUPPORTED: an AI cost and value simulator; scoped to a banking risk division and adjacent functions, titled "AI Cost Simulator, NFR" in the app | `index.html:6`; `INDUSTRIES` `1558-1593` |
| "What is the full all-in cost of an enterprise AI platform, and how do model selection, hosting scenario and governance overhead affect the economics?" | SUPPORTED | `levelTotals` `1902-1906`; `HOSTING` `1653-1657`; governance `1889-1891` |
| "Problem framing, scenario logic, cost-model design, workflow and UI design, review and deployment." | PARTLY SUPPORTED: deployment is real (Pages workflow, live). Design ownership cannot be proven from code; 83 of 100 commits carry AI co-author trailers | `.github/workflows/deploy.yml`; git log |
| "AI economics, scenario modelling, model-routing economics, hosting trade-offs, governance cost, executive decision support." | SUPPORTED, with a caveat: routing has a negligible effect on totals at defaults (3.5) | 3.3 and 3.5 |
| "Interactive public demonstrator using illustrative planning assumptions." | PARTLY SUPPORTED: illustrative assumptions and interactivity are accurate. It is hosted publicly but behind an access-code page labelled "Protected asset ... contact the author" | `README.md` "Important"; `index.html:156`, `209-220` |
| "Not a client tool or production system." | PARTLY SUPPORTED: not production. The README describes a presentation tool "for DACH banking, insurance, healthcare and telecom clients", to be calibrated "before any client use" | `README.md:3`, "Important" |
| "Tools used in this public prototype: JavaScript, HTML/CSS." | SUPPORTED | `app.html` |
| problem "Enterprise buyers struggle to connect model usage, hosting, shared-platform costs, governance, and expected gains to an all-in AI business case." | SUPPORTED as framing: the tool connects all five | 3.3 |
| "Interactive tool for modelling the full economics of an enterprise AI platform: model selection and routing, token costs, cloud vs. sovereign vs. on-premise hosting, shared infrastructure costs, governance overhead, and net value projections." | SUPPORTED | 3.3 (a) to (g) |
| "Built for executive decision-making and proposal development." | PARTLY SUPPORTED: built for executives ("built for non-technical executives"). Its own disclaimer says it is "not an offer, proposal, quotation or commitment" | `README.md:5`, "Important" |
| tech "JavaScript", "HTML/CSS" | SUPPORTED | `app.html` |
| commercial "...not only capability but also what shared infrastructure and governance overhead do to unit economics." | SUPPORTED: share, standalone comparison, cost per user and per task | `1864`, `1896`, `2213-2250` |
| diagram "Model selection → usage assumptions → hosting scenario → shared platform costs → governance overhead → net economics" | PARTLY SUPPORTED: every stage is computed; in the UI hosting is chosen first and model selection is automatic | 3.1, 3.3 |
| limitations "All prices, benchmarks, gains, and allocation values are illustrative planning assumptions." | SUPPORTED | `README.md` "Important" |
| "Built for enterprise buyers and architects who need to make defensible investment decisions about AI platforms." | PARTLY SUPPORTED: banking risk divisions only | `INDUSTRIES` `1558-1593` |
| "Covers model selection and routing strategy" | SUPPORTED: benchmark-weighted routing | `1713-1732` |
| "token-cost modelling across providers" | SUPPORTED: 10 models from 6 providers plus 2 Azure overrides | `1606-1621` |
| "hosting scenario comparison (cloud, sovereign, on-premise)" | SUPPORTED: three modes; the movers view computes the delta of switching | `1653-1657`, `2859-2866` |
| "shared-platform cost amortization" | SUPPORTED | `1879-1882`, `1689-1696` |
| "governance overhead allocation" | PARTLY SUPPORTED: governance is costed with an FTE formula but charged in full to the division, not allocated | `1889-1895` |
| "projected value gains" | SUPPORTED | `2187-2204`, `2599-2629` |
| "Outputs are scenario-comparable" | SUPPORTED: saved scenarios with percentage comparison; comparison across levels | `3605-3670`, `2214` |
| "designed to support structured proposal development" | PARTLY SUPPORTED: see the disclaimer above | `README.md` |

### 3.12 Proposed case-study content (verified facts only)

**Problem.**
- A risk division weighing a shared AI platform needs one all-in figure, not a token price.
- That figure combines build, integration, hosting, dashboards, governance staff, licences and usage.
- It must also show how the costs split when other functions share the platform.

**Constraints.**
- No client data.
- Illustrative list prices and placeholder benchmarks.
- Must run as a static page in an executive conversation.
- Every number must be explainable, and printable as a methodology.

**Key design decisions**
1. **Allocation by number of functions sharing (1/functions), shown against a standalone figure.** This makes the economics of sharing visible (`1864`, `1896`).
2. **A maturity ladder (L1 to L5) that couples build cost to per-task efficiency** (caching, context size, batching, retries), so the trade-off is explicit (`1623-1629`, `1676`).
3. **Vendor-neutral, benchmark-weighted model selection** with a sovereignty bonus and a hosting-constrained candidate pool, rather than a fixed vendor (`1713-1732`).
4. **Hosting treated as a cost shape**, as described in the code comment (`1649-1657`):
   - cloud: per token, no infrastructure;
   - sovereign: small token premium plus a fixed commitment;
   - on-prem: large fixed infrastructure and low marginal cost.
5. **Transparent methodology.** Every figure is reproduced in a printable calculation breakdown with a disclaimer (`2780-2858`).

**Architecture layers, in order**
1. Inputs: context, scope, calibration.
2. Model routing per complexity tier.
3. Per-request token cost.
4. Annual usage.
5. Fixed costs: shared allocation, dashboards, governance.
6. Annual all-in cost.
7. 10-year cash flow and ROI.
8. Explanations and print exports.

**Value logic.**
- For a regulated division, fixed platform and governance costs dominate AI cost, not tokens.
- Sharing the platform across functions is the strongest cost lever.
- Benefits are modelled as FTE time savings plus avoided supervisory findings.

**Limitations**
1. Banking only.
2. Benefits are independent of maturity level and hosting.
3. Placeholder prices and benchmarks.
4. No automated tests.

**Technology patterns**

| Pattern | Implemented with |
|---|---|
| Single-file static web app with no build step | vanilla JavaScript, HTML, CSS |
| Weighted multi-criteria model selection | custom JavaScript scoring |
| Parameterised cost model with derived defaults | a JavaScript state object and pure functions |
| Data-driven charts (Sankey-style flow, waterfall, radar) | hand-generated SVG |
| Client-side scenario persistence | browser `localStorage` |
| Print-to-PDF reporting | `window.print` with print styles |
| Static hosting with CI deployment | GitHub Actions and GitHub Pages |

---

## 4. DORA Article 12 AI Control Line (ProReinsuranceAIWorkflow)

**Evidence base:** GitHub `main` `b607dbf` (17 commits, last pushed 10 August 2026).

**Unpushed local commits** (`bbfe899`, `044930f`, `3aa3fd7`, all dated 19 August):
- They change 125 files (+20,046 / -4,543).
- They add a 20-scene storyboard and video-capture system and 4 further test files.
- They delete the `dashboard`, `demo`, `workflow` and `remediation` pages.
- No verdict below relies on them.

### 4.1 What exists

**Stack** (`package.json`): Next.js 16.3, React 19.2, TypeScript, better-sqlite3 with Drizzle ORM, `openai` SDK v7, docx, mammoth, cheerio, csv-parse, Recharts, Tailwind v4 and Vitest 4.

XState and Playwright are named in `IMPLEMENTATION_PLAN.md` but are not present in the code.

**Size and navigation.**
- 24 pages (`app/**/page.tsx`) and 81 API route files (42 GET and 38 POST handlers).
- Main navigation (`components/MainNav.tsx:8-12`): compliance hub, product hub, [redacted client term], portfolio, evidence centre.
- Other pages: `/stages/[stage]`, `/workflow`, `/demo`, `/dashboard`, `/audit`, `/traceability`, `/system-map`, `/explorer`, `/remediation`.

**Scope.**
- Wider than the portfolio says. The README describes a multi-regulation platform covering DORA, NIS2, GDPR, the EU AI Act and Solvency II (`README.md:3-5`; seed `lib/db/seed.ts:531-563`), with 5 synthetic products.
- DORA Article 12 is the reference scenario.

**Core workflow: an 11-state machine** (`lib/state-machine.ts:6-17`)
- States, in order: BASELINE, STANDARD_PROPOSED, STANDARD_APPROVED, IAC_PR_CREATED, DEPLOYMENT_APPROVED, DEPLOYED, POLICY_VERIFIED, [redacted client term]_UPDATED, DOCS_PROPOSED, DOCS_APPROVED, EVIDENCE_READY.
- The transition table (`:21-33`) has 13 edges, including 3 reject edges:
  - STANDARD_PROPOSED to BASELINE;
  - IAC_PR_CREATED to STANDARD_APPROVED;
  - DOCS_PROPOSED to [redacted client term]_UPDATED.
- Each transition updates `demo_runs` and inserts an `audit_events` row (`:80-102`).
- A transition to the current state does nothing (it is idempotent) (`:65-67`).
- There is one fixed run, `DEMO-RUN-001` (`:52`).
- Stage routes live under `app/api/stage/{1..6}/...`.
- A guided-run orchestrator (`lib/guided-run.ts:205-356`) calls the stages in order and pauses at each gate (`:163-168`, `:236-238`, `:262-264`, `:326-328`).

**Agents and roles.**
- Two named AI-assistant personas: one for compliance analysis, one for product-documentation updates (`README.md:84-86`; `lib/terminology.ts`).
- They are prompt-specific methods on a single provider, not autonomous agents.

**Model providers and routing** (`lib/ai/provider.ts`)
- The `AiProvider` interface has 13 methods (`:76-129`).
- Task-based model constants (`:277-283`): `MODEL_REASONING = 'o3'`, `MODEL_CODE = 'gpt-4o'`, `MODEL_WRITING = 'gpt-4o-mini'`.
- o3 is used for: guideline proposal, control activity, audit answer, gap analysis, control change, regulatory delta, document update, regulatory scan and linked changes (`:444-773`).
- gpt-4o is used for: IaC proposal (`:479`), remediation suggestions (`:618-624`) and evidence chat (hard-coded at `:903`, `:920`).
- gpt-4o-mini is used only by `generateDocumentationProposal` (`:493-494`).
- Routing is static: each method picks a constant.
- o3 calls drop JSON mode and temperature (`:416-435`).
- Per-model throttling (`:341-357`) plus retry on HTTP 429/503 that honours Retry-After (`:359-384`).
- The factory (`:931-944`) returns `OpenAiProvider` when `OPENAI_API_KEY` is set, and otherwise `NoAiProvider`, which throws on every call (`:318-335`).
- There is no mock or offline provider. Without a key the AI fails visibly (commit `bd48670`, "remove all deterministic fallback answers").

**Data model** (`lib/db/schema.ts`): 43 `sqliteTable`s (the README says 26), in two groups.
- Legacy demo chain: regulation sources, guidelines and versions, control activities, cloud resources, IaC changes, deployments, policy definitions and evaluations, compliance work products, document versions, evidence artefacts and links, `approvals` (`:165-175`), `audit_events` (`:177-188`), value assumptions, demo runs, guided runs.
- Multi-regulation platform: regulatory sources and requirements, internal documents, compliance gaps, control changes, products and product gaps, verification criteria and results, evidence packages, requirement status history, [redacted client term] items, history and reporting records.

**Integrations: real or simulated**
- Real:
  - OpenAI API.
  - EUR-Lex CELLAR SPARQL (`app/api/compliance-hub/regulatory-intelligence/scan/route.ts:34-59`). It is optional; if it fails, the scan falls back to model knowledge (`:105-110`).
- Simulated:
  - Azure resources are SQLite fixtures, and deployment is simulated (`app/api/stage/2/approve/route.ts:128-170`).
  - ServiceNow, Archer and GitLab appear only as seeded register rows; there are no API clients.
  - There is no GitHub client.
  - The Terraform in `infra/it-app-x/` is a fixture and is never applied.

### 4.2 Approval and control mechanics

**Gates in the core flow:**
- standard approval: `app/api/stage/1/approve/route.ts`;
- IaC and deployment approval: `stage/2/approve/route.ts`;
- documentation approval: `stage/5/approve/route.ts`.

**How each gate works:**
1. It checks the current state first (`stage/1/approve/route.ts:23-26`).
2. It inserts an `approvals` row with the decision, reviewer name and comment (`:31-40`).
3. It writes `audit_events` (`:135-153`) and moves the state on (`:155`).
4. On rejection it returns to the previous state (`:168-187`).

The guided-run `continue` endpoint refuses to advance past a gate and returns 409 (`app/api/guided-run/continue/route.ts:16-33`).

**Evidence records:**
- `audit_events`: actor, action, object, outcome, correlation ID and JSON metadata.
- `approvals`, `evidence_artifacts` and `evidence_links`.
- A JSONL transformation log at `data/evidence/transformation_log.jsonl`. Each entry holds SHA-256 hashes (truncated to 16 hex characters) of the source and target files, plus the approval and correlation IDs (`lib/fs-service.ts:53-60`, `:101-104`).
- A stage-6 evidence manifest and an audit-response DOCX (`app/api/stage/6/generate/route.ts`).

**Not tamper-evident.**
- There is no hash chaining.
- Demo reset deletes approvals and evidence rows (`app/api/demo/reset/route.ts:24-33`) and truncates the transform log (`lib/fs-service.ts:152-153`).
- Seeding deletes `audit_events` (`lib/db/seed.ts:66`).

**What is committed on approval is often a template, not the AI output:**
- Stage 1 persists the AI guideline and control proposal. On approval, however, the DOCX is built from a template and a hard-coded control row is appended (`stage/1/approve/route.ts:47-92`).
- Stage 2 approval writes a fixed `BACKUP_TF_CONTENT` constant rather than the gpt-4o diff (`stage/2/approve/route.ts:11`, `:84-103`).
- Stage 5 calls gpt-4o-mini, but the proposed document content is templated, and the AI output is used for provenance metadata only (`stage/5/propose/route.ts:172-221`).

**Gate weaknesses:**
- There is no authentication. The reviewer is a free-text field that defaults to "Compliance Review Board" (`components/ApprovalModal.tsx:22`).
- Control-change approve and publish has no status precondition and writes no audit event (`app/api/compliance-hub/control-changes/[id]/approve/route.ts:16-24`).
- `app/api/workflow/bulk-approve/route.ts:17-90` generates AI control changes, then approves and publishes them all in one call.
- `product-hub/.../confirm-compliant/route.ts:66-122` writes PASSED results and a COMPLETE evidence package without running verification.

**A genuine evidence gate does exist:** `lib/domain/[redacted]/status-engine.ts:129-205`, used by `app/api/[redacted]/transition/route.ts:29`.
- It blocks a COMPLIANT status when any of the following holds:
  - there is no complete evidence package;
  - a mandatory criterion has not passed;
  - gaps are open;
  - a change is unpublished.
- The confirm-compliant route bypasses it.

### 4.3 Tests

11 Vitest files with 112 `it(` cases. They run serially against a test SQLite file (`vitest.config.ts`, `test-setup.ts`).

| File | Cases | Coverage |
|---|---|---|
| `__tests__/state-machine.test.ts` | 26 | All 13 valid edges, including the 3 reject (human-override) edges; 4 invalid transitions; idempotency; audit event written |
| `__tests__/policy-engine.test.ts` | 13 | All 5 policies; missing-resource and unknown-policy cases |
| `__tests__/guided-run.test.ts` | 13 | Run persistence, resume, failure tracking. The gate test only checks stored state. |
| `__tests__/product-hub.test.ts` | 11 | Domain queries |
| `__tests__/[redacted]-status.test.ts` | 9 | Evidence-gate blockers, compliant transition, aggregates |
| `__tests__/value-formula.test.ts` | 9 | A formula defined inside the test file |
| `__tests__/compliance-hub.test.ts` | 8 | Queries, approve and publish setters |
| `__tests__/nis2-incident-handling.test.ts` | 7 | NIS2 gap lifecycle and register gate |
| `__tests__/traceability.test.ts` | 6 | Seed completeness |
| `__tests__/[redacted]-adapter.test.ts` | 5 | Work-product status derivation |
| `__tests__/path-validation.test.ts` | 5 | A local copy of the allow-list logic |

- Not covered: API route handlers (including the approval routes), the AI provider, end-to-end runs and the UI.
- There is no CI.

### 4.4 Data

**Synthetic.**
- The README banner (`README.md:9-11`) and the disclaimers (`docs/assumptions-and-disclaimers.md`) say so.
- Fixtures: a fictional application, a fictional control ID, guideline and design DOCX files, a controls CSV and an Azure JSON.
- `data/raw/eurlex/dora_article_12.html` appears to reproduce public DORA text, although the disclaimers call it a paraphrase.

**Not anonymised.**
- The public tree names [redacted client name] throughout:
  - UI pages and seeded legal entities;
  - three seeded email addresses on that organisation's domain;
  - two documentation files whose names include it;
  - a client asset-request manifest (`data/client-assets.ts`).
- Some vocabulary is listed as "approved terms" awaiting client confirmation (`docs/TERMINOLOGY_DECISIONS.md`).
- The 3 unpushed commits would increase the number of affected files.

### 4.5 Limitations and production gaps

- Deployment, cloud state, the compliance register (GRC) and service-management (ITSM) systems are simulated. One fixed demo run.
- Approvals are unauthenticated, and three routes bypass the gates.
- The approved IaC and documents are fixed templates, not the AI output.
- The audit trail can be reset and is not tamper-evident.
- Every AI step fails without an OpenAI key. o3 needs a higher usage tier (`README.md:219`).
- `.env.example` is referenced in the setup steps but is not committed (`.gitignore:34`).
- Documentation has drifted from the code:
  - 26 versus 43 tables;
  - XState and Playwright are named but not used;
  - the README model table omits gpt-4o-mini.
- No hosted deployment.

### 4.6 Claim check (`content.json` entry `dora-control`)

| Claim (quoted) | Verdict | Evidence |
|---|---|---|
| "Regulatory requirement framing, workflow architecture, state-machine design, human approval gate design, review, testing and deployment." | PARTLY SUPPORTED: consistent with the commits and planning documents; no deployment exists (local run only) | git log; `IMPLEMENTATION_PLAN.md` |
| "Regulatory workflow design, traceability, human approval, evidence generation, translation between business, regulatory and technical requirements." | SUPPORTED | stage routes; `docs/DEMO_STORY.md` |
| "Public prototype using synthetic and anonymised data." | PARTLY SUPPORTED: synthetic yes; not anonymised (real client named in the code) | `lib/db/seed.ts`; `data/client-assets.ts` |
| "No client systems, credentials or confidential information." | PARTLY SUPPORTED: no client systems or credentials; the client name and possibly client terminology are present | `docs/TERMINOLOGY_DECISIONS.md` |
| "Integration patterns are illustrative." | SUPPORTED | `docs/assumptions-and-disclaimers.md` |
| implementationNotes "Next.js, React, TypeScript, SQLite, Drizzle ORM, OpenAI API, Vitest." | SUPPORTED | `package.json` |
| problem "...a process that spans weeks and multiple teams." | PARTLY SUPPORTED: a 74-hour multi-team chain is modelled as a workshop estimate; "weeks" is not stated | `lib/db/seed.ts:492-499` |
| "A fully functional AI workflow demonstrator" | PARTLY SUPPORTED: runs end to end only with an OpenAI key; deployment and integrations are simulated | `lib/ai/provider.ts:931-944` |
| "built around a real regulatory requirement (DORA Article 12)" | SUPPORTED | `data/raw/eurlex/`; `lib/policy-engine.ts` |
| "AI-generated control updates, infrastructure proposals, policy-engine verification, compliance documentation, human approval gates" | PARTLY SUPPORTED: AI control updates are generated and persisted; IaC and documentation are AI-proposed but templates are committed; the policy engine is deterministic | stage 1, 2 and 5 routes; `lib/policy-engine.ts:38-95` |
| "a complete traceable evidence chain" | PARTLY SUPPORTED: hashed transform log, audit events and manifest exist; resettable and not tamper-evident | `lib/fs-service.ts:53-153` |
| tech "Next.js", "React", "TypeScript", "SQLite", "Drizzle ORM", "Vitest" | SUPPORTED | `package.json` |
| tech "OpenAI o3 / GPT-4o" | SUPPORTED | `lib/ai/provider.ts:281-283` |
| tech "AI-provider abstraction" | SUPPORTED, with one real implementation | `lib/ai/provider.ts:76`, `931` |
| tech "State machine", "Policy engine", "Human approval gates" | SUPPORTED | `lib/state-machine.ts`; `lib/policy-engine.ts`; stage approve routes |
| "OpenAI o3 for regulatory reasoning, GPT-4o for infrastructure, GPT-4o-mini for documentation" (commercial) and "...o3 for regulatory reasoning and control design, GPT-4o for infrastructure code generation, and GPT-4o-mini for documentation" (caseStudy) | PARTLY SUPPORTED: the constants match exactly. gpt-4o also serves chat and remediation; the gpt-4o-mini output is not used for the committed document, only logged as provenance | `lib/ai/provider.ts:277-283`, `618`, `903`; `stage/5/propose/route.ts:172-221` |
| "an 11-state machine for end-to-end traceability" | SUPPORTED | `lib/state-machine.ts:6-17`, `80-102` |
| "human approval gates at every consequential step" / "embedded at each consequential decision point" | PARTLY SUPPORTED: 3 gates in the core flow, each with a reject path. Verification and register steps run automatically, and three routes bypass review | `lib/state-machine.ts:141-143`; `app/api/workflow/bulk-approve/route.ts` |
| diagram "Regulation → AI guideline proposal → AI control design → AI infrastructure change → policy verification → compliance work product → AI documentation → evidence package" | SUPPORTED: maps to stages 1 to 6 | `lib/state-machine.ts:35-49` |
| "The AI provider layer is abstracted so the architecture is not locked to any single model." | PARTLY SUPPORTED: an interface and factory exist; only OpenAI is implemented and the model names are hard-coded | `lib/ai/provider.ts:76-129`, `931-944` |
| "Tests cover the full workflow including edge cases and human-override paths." | PARTLY SUPPORTED: 112 unit cases cover every state edge, including the 3 reject paths and invalid transitions. There are no route, AI or end-to-end tests and no CI | `__tests__/state-machine.test.ts` |
| "The architecture reflects patterns from enterprise delivery experience." | NOT FOUND: cannot be verified from the repository | none |

### 4.7 Proposed case-study content (verified facts only)

**Problem.**
- One regulatory obligation (DORA Article 12, geographically separate backups) has to become:
  - an updated guideline and control;
  - an infrastructure change and its verification;
  - a compliance-register update and documentation;
  - an audit answer.
- Today this is a manual hand-over chain across compliance, platform and product teams.

**Constraints.**
- Synthetic fixtures only, with no real cloud or compliance-register access.
- Zero-infrastructure local run on SQLite.
- AI output must be reviewable before it changes artefacts.
- AI must fail visibly rather than invent output.
- o3 rate limits must be respected.

**Key design decisions**
1. **An explicit transition table with reject edges back to the prior state**, so the workflow is testable and auditable (`lib/state-machine.ts:21-33`).
2. **Task-based model assignment**, with the rationale written in code comments (`lib/ai/provider.ts:277-283`).
3. **No silent fallback:** without a key, the provider throws (`lib/ai/provider.ts:318-335`; commit `bd48670`).
4. **Deterministic policy-as-code verification** instead of model judgement (`lib/policy-engine.ts:38-95`).
5. **File-level provenance plus an evidence gate on compliant status.** Source and target hashes are linked to approval and correlation IDs (`lib/fs-service.ts:53-104`; `lib/domain/[redacted]/status-engine.ts:129-205`).

**Architecture layers, in order**
1. Source fixtures: EUR-Lex HTML, guideline DOCX, controls CSV, Azure JSON.
2. Ingestion and normalisation.
3. AI proposal layer.
4. State machine with three human gates.
5. Simulated IaC write and deployment.
6. Deterministic policy verification.
7. Compliance work-product (register) update.
8. Documentation (DOCX).
9. Evidence manifest and audit response.

Cross-cutting: audit events, approval records and the hashed transform log.

**Value logic.**
- Seeded stage hours, manual versus assisted (`lib/db/seed.ts:492-499`): 32/8, 16/4, 4/0.75, 2/0.25, 8/2 and 12/2.
- One chain therefore takes 74 hours manually versus 17 hours assisted, about 77% lower.
- The hours are labelled illustrative workshop estimates.

**Limitations**
1. Deployment, cloud and register integrations are simulated.
2. Approvals are unauthenticated, and some routes bypass the gates.
3. The committed IaC and documents are templates, with the AI proposals alongside them.
4. Unit tests only; the audit trail can be reset.

**Technology patterns**

| Pattern | Implemented with |
|---|---|
| Provider-abstracted, task-based model assignment | a TypeScript interface and the `openai` SDK |
| Persisted finite-state machine with reject paths | TypeScript, Drizzle ORM, better-sqlite3 |
| Human-in-the-loop approval records | Next.js route handlers and the `approvals` table |
| Deterministic policy-as-code verification | an in-process TypeScript rule engine |
| Content-hash provenance log | Node `crypto` SHA-256 and a JSONL append |
| Evidence-gated status transitions | the register status engine, on Drizzle |
| Rate-limit-aware AI client | per-model throttle plus backoff that honours Retry-After |
| Document generation and extraction | `docx`, `mammoth`, `cheerio`, `csv-parse` |

---

## 5. Enterprise NFR Workflow Platform, to be renamed Enterprise NFR Agent Platform (RealAIInfrastructure)

**Evidence base:** GitHub `main` `e76a013`, which merged two systems into one repository: an NFR agent dashboard and an inference gateway.

**Unpushed local commits:**
- `1cc2d81`: Argon2id password hashing, opt-in seeding, authentication on the LLM routes, and a monitoring UI.
- `a784e20`: a fix to the monitoring view.
- Together they touch 9 files (+754 / -84). No verdict below relies on them.

### 5.1 What exists

**A. NFR agent dashboard** (`backend/`, `frontend/`)

*Frontend*
- One vanilla JavaScript page with six views: Overview, Agents Hub, Knowledge Graph, Automation, Documents and AI Risk (`frontend/index.html:199-221`).
- The graph view uses D3 (`frontend/js/graph-viz.js`).

*Backend*
- One FastAPI app (`backend/main.py:103`) with about 70 REST endpoints.
- One WebSocket, `/ws/pipeline` (`main.py:211`).
- Two Server-Sent Events streams: `/api/agents/runs/{id}/stream` (`main.py:1074-1098`) and `/api/automation/stream` (`main.py:881-908`).
- Roles: admin, risk_owner, analyst and viewer (`backend/auth.py:57-66`).

*Agents*
- 18 domain agents are registered (`main.py:368-393`): TPRM, RCSA, Issue and Incident, KRI/KCI, Regulatory Horizon Scan, Policy Q&A, FinCrime/AML, ICAAP/ILAAP, COREP/FINREP, Model Risk, Internal Audit, Credit Risk, ESG, Operational Resilience (DORA), Cyber, DPIA, Regulatory Change and Contract Risk.
- Credit Risk, ICAAP and COREP are prudential or financial-risk agents rather than NFR.
- The README's "30+ LangGraph agents" (`README.md:5`) overstates this.

*Two execution paths*
1. **Direct runs** (`/api/nfr-agents/{x}/run`, `main.py:457-770`).
   - Linear LangGraph `StateGraph` chains (`backend/agents/graph.py:27-77`).
   - No branches, no interrupts, no write-back and no authentication dependency.
2. **Orchestrated runs** (`POST /api/agents/{id}/run`, `main.py:1024-1044`).
   - A custom asyncio engine (`backend/agents/orchestrator.py`) with a run store persisted to SQLite.
   - Scheduled hourly, daily or weekly runs (`:1134-1170`), a 5-minute watchdog (`:1254`) and a 24-hour outcome check (`backend/agents/outcome_tracker.py`).
   - Run states: running, waiting_human, completed, failed, cancelled.
   - Step kinds: fetch, working, analyze, decision, hitl, action, complete, error (`orchestrator.py:25-26`).
   - Agents share context through summaries of other agents' recent runs ("prior findings") (`:366-389`).

*Knowledge graph*
- A NetworkX `DiGraph` singleton (`backend/graph/knowledge_graph.py:68-69`, `466-479`).
- 16 node types and about 21 edge types (`:1-10`), for example GOVERNS, ENFORCES, MITIGATED_BY, VIOLATES and OUTSOURCED_TO, across 10 NFR domains.
- The committed snapshot holds 480 nodes and 796 edges (`backend/data/graph_snapshot.json`).
- It is enriched from ServiceNow every 5 minutes (`main.py:60-73`; `backend/automation/enricher.py`).
- Readers and writers:
  - the 7-stage record pipeline reads and writes it (`backend/agents/pipeline.py:19-27`, `99-130`);
  - the internal-control-system cockpit reads it (`backend/apis/ics.py:246-262`);
  - the automation endpoints add nodes (`main.py:827`, `857`).
- **The 18 orchestrated agents never query it.** The graph tools that would let them (`backend/agents/tools.py:103-149`) are never imported.

*Document intelligence*
- A watch-folder pipeline (`backend/doc_pipeline/pipeline.py`) with PDF, DOCX, XLSX and text extraction (`extractor.py:12-29`), LLM structuring into a JSON schema (`structurer.py:14-40`), and file tracking by SHA-256 in SQLite.
- All 10 committed outputs in `data/processed/` record `"Extraction failed"` / `"llm_unavailable"`.
- Nothing consumes the outputs. The Documents view is a static requirements list (`ics.py:413-444`).

*LLM routing (agents)*
- An ordered fallback, `gpt-4o-mini` then `gpt-4o`, through LangChain `with_fallbacks` (`backend/agents/base.py:18-23`, `76-109`), with OpenAI JSON mode for structured calls.
- An optional gateway via `GATEWAY_URL` (`:84`).
- Groq (`llama-3.3-70b-versatile`), Gemini (`gemini-2.0-flash-lite`), OpenRouter and n8n options are marked "Archived free-tier fallbacks" (`:93-94`).
- The document structurer uses OpenRouter `google/gemini-flash-1.5`, then Groq `llama3-70b-8192` (`structurer.py:77-122`).
- `n8n_llm_proxy_workflow.json` (o4-mini) is an unused exported workflow.

*Integrations*
- **ServiceNow:** real Table API calls.
  - Reads: incident, problem, change_request, sys_user and cmdb_ci (`backend/servicenow/client.py:21-78`).
  - Writes: work notes, state updates, change requests and incidents (`write_client.py:12-66`).
  - Target: a developer-instance placeholder in `.env.example`. There is no mock fallback.
- **Teams:** a one-way Adaptive Card posted to a Power Automate or incoming webhook when an approval step is reached (`orchestrator.py:263-363`). Its only action opens the local dashboard.
- **n8n:** an alert webhook to a hard-coded third-party sandbox host (`backend/apis/n8n_client.py:14-50`).
- **Public feeds:** EUR-Lex SPARQL, ECB, EBA, ESMA, BIS, NVD, MITRE ATT&CK, a GDPR enforcement tracker, OpenSanctions, FRED, Companies House and Open-Meteo (`backend/data_sources.py:106-216`).

*MCP*
- `backend/agents/mcp_client.py:12-48` builds a `MultiServerMCPClient` for an n8n MCP server, but nothing calls `get_mcp_tools()`.
- The ReAct agent builders (`graph.py:89-137`) are also never called.

*SQLite*
- Standard-library `sqlite3` in WAL mode (`backend/db.py:3`, `13-16`).
- Tables: runs, steps, agent configuration, outcomes, users, sessions, document sources and a data-source cache.

**B. Inference gateway** (`gateway/`, `mock_backend/`, `charts/`, `deploy/`)

*Gateway*
- An OpenAI-compatible FastAPI proxy with one upstream.
- Endpoints: `/v1/chat/completions` (streaming and non-streaming), `/v1/models`, `/healthz`, `/readyz` and `/metrics`.
- Retries on HTTP 503 and timeouts (`gateway/client.py:22-25`, `87-110`).
- Prometheus metrics, structured logging and optional OpenTelemetry.
- **No model routing.**

*Supporting pieces*
- A mock backend with failure injection.
- A Helm chart (HPA, PDB, NetworkPolicy, ServiceMonitor) and Docker Compose with Prometheus, Grafana and an OTel collector. These cover the gateway only: the `Dockerfile` copies `gateway/` alone, and `deploy/docker-compose.yml` has no NFR backend service.
- The ADRs, runbooks, SLOs, threat model and example postmortem are all about the gateway.

### 5.2 Approval and control mechanics

**The gate:**
- `_wait_hitl` sets the run to `waiting_human`, sends the Teams card and polls every 0.5 seconds (`orchestrator.py:173-186`).
- After 4 hours it records a timeout, which matches no approve option, so nothing is written.
- Decisions arrive via `POST /api/agents/runs/{id}/decide`, which only risk_owner or admin can call (`main.py:1101-1108`).

**Coverage:**
- Active gates exist in 5 of the 18 workflows: KRI (`orchestrator.py:453`), RCSA (`:562`), Issue (`:663`), Regulatory Scan (`:828`) and TPRM (`:956`).
- Each gate is conditional, for example only when a KRI is critical or a tier-1 vendor exists.
- In those five, every ServiceNow write waits for an exact-match approval option.
- The policy workflow's gate (`:714-786`) is dead code.
- The other 13 workflows only analyse and have no write-back.

**Writes that bypass a gate:**
- The Issue workflow sends an n8n escalation alert without approval (`orchestrator.py:685-698`).
- The record pipeline sends n8n alerts automatically for high or critical risk (`pipeline.py:133-141`).
- `POST /api/automation/resolve` is unauthenticated (`main.py:839-868`). Its self-resolver writes ServiceNow work notes and creates change requests, based on an LLM classification of items as resolvable "without human approval" (`backend/agents/resolver.py:12-23`, `116-166`). No UI calls it.

**Audit:**
- Every step is upserted to SQLite with its write-back payload and result (`orchestrator.py:150-170`).
- Automation events go to a JSON event log described as append-only (`backend/automation/store.py:1-43`). It is a rewritten file, not tamper-evident.
- Outcomes are re-checked after 24 hours.

**Audit gaps:**
- The approver's identity is not recorded.
- The decision is set only in memory, so the decided step stays with an empty decision in SQLite (`orchestrator.py:166`).
- `backend/seeder.py:27-60` inserts 30 days of invented run history.

### 5.3 Tests and CI

**Tests:** 48 test functions, all importing only `gateway.*` (`tests/conftest.py:18`).
- Unit: `test_config.py` 3, `test_metrics.py` 11, `test_schemas.py` 15.
- Integration: `test_completions.py` 4, `test_health.py` 5, `test_metrics_exposed.py` 5, `test_resilience.py` 3, `test_streaming.py` 2.
- Coverage is configured for the gateway and mock backend only (`pyproject.toml:77-79`).
- **The NFR backend has no tests:** none for the agents, orchestrator, approval gates, write-back, graph or authentication.

**CI:**
- `ci.yml` runs ruff, mypy (gateway), unit and integration tests, Docker builds, Helm lint, a benchmark smoke run and pip-audit. It failed on `e76a013`.
- `security.yml` succeeds.

### 5.4 Data

**Synthetic.**
- A fictional bank with 40 invented employees on a fictional domain (`backend/data/fake/employees.json`).
- Invented controls, risks, contracts, prudential figures, AML alerts and a model inventory (`backend/data/*.json`).
- Generated policy documents (`backend/scripts/seed_documents.py`).

**Realistic-looking content.**
- Real technology, data and professional-services vendor brands appear with invented contract values and risk ratings (`backend/data/fake/vendors.json`, `contracts.json`).
- The graph snapshot contains records pulled from a ServiceNow developer instance.

**No real client or financial-institution names** were found in the current tree, and no API keys are committed. The public history contains employer references that were removed from the current tree in `be8dd97`.

### 5.5 Limitations and production gaps

- Single-process design: an in-memory run cache of 200 runs, approval by polling, an in-process scheduler and a JSON-file event log.
- The NFR backend has no Docker or Helm packaging. Only the gateway is packaged.
- Authentication on `main` uses salted SHA-256 with seeded default passwords (`auth.py:12-24`; `seeder.py:17-21`).
- Many routes have no authentication: direct agent runs, `/ws/pipeline`, `/api/automation/*` and `/api/agent/chat`.
- ServiceNow is required and there is no offline mode.
- The MCP and ReAct code is never called.
- The document pipeline outputs are failed stubs.
- No backend tests.

### 5.6 Claim check (`content.json` entry `nfr-platform`)

| Claim (quoted) | Verdict | Evidence |
|---|---|---|
| title "Enterprise NFR Workflow Platform" (and proposed "Enterprise NFR Agent Platform") | PARTLY SUPPORTED: a multi-agent NFR demonstrator plus an inference gateway, run as a single-process prototype. "Agent Platform" fits the code better (agent registry, hub and orchestrator; the README calls it "AI Agent Hub"); adding "prototype" or "demonstrator" avoids implying a production system | `main.py:368-393`; `orchestrator.py` |
| repo link `.../RealAIInfrastrucure` | PARTLY SUPPORTED: resolves through a GitHub redirect; the spelling should be corrected | HTTP 301 |
| "multiple AI agent workflows share a knowledge graph" | PARTLY SUPPORTED: one graph is shared by the record pipeline, the internal-control-system cockpit and the automation endpoints; the 18 domain agents do not query it | `knowledge_graph.py:466`; `pipeline.py:43`; `tools.py` unused |
| "common infrastructure" | SUPPORTED: shared LLM client, orchestrator, run store and optional gateway | `base.py:76-109`; `orchestrator.py` |
| "consistent approval patterns" | PARTLY SUPPORTED: one gate primitive, active in 5 of 18 workflows | `orchestrator.py:173`, `453-956` |
| "multiple AI agent workflows for different NFR domains" | SUPPORTED: 18 agents, some prudential rather than NFR | `main.py:368-393` |
| "Each agent handles a specific NFR domain: RCSA, TPRM, regulatory change." | SUPPORTED, plus 15 more domains | `backend/agents/` |
| "A shared knowledge graph maintains the relationships between controls, policies, and regulatory obligations across domains." | PARTLY SUPPORTED: control, policy, regulation-reference, risk and domain nodes with GOVERNS / ENFORCES / VIOLATES / MITIGATED_BY edges exist; obligations are not modelled, only regulation references; agents do not use the graph | `knowledge_graph.py:1-10`, `104-122` |
| "document intelligence" / "Document intelligence processes unstructured content from multiple source types." | PARTLY SUPPORTED: PDF, DOCX, XLSX and text extraction plus LLM structuring exist; all committed outputs failed and none are consumed | `backend/doc_pipeline/`; `data/processed/` |
| "Every consequential output routes through a human approval gate before anything is written back to systems of record." | PARTLY SUPPORTED: true for the 5 gated workflows; an unauthenticated self-resolver writes to ServiceNow without approval, and n8n alerts are ungated | `resolver.py:116-166`; `orchestrator.py:685-698` |
| "ServiceNow for records" | SUPPORTED: real Table API reads and writes against a developer instance | `backend/servicenow/` |
| "Teams for approvals" / tech "Teams/Power Automate approval patterns" | PARTLY SUPPORTED: Teams receives a notification card; the decision is made in the dashboard | `orchestrator.py:263-363` |
| "Integration patterns are modelled on real enterprise environments" / tech "ServiceNow patterns" | SUPPORTED | ServiceNow client, Teams webhook, n8n, public regulatory APIs |
| tech and implementationNotes "MCP" | PARTLY SUPPORTED: an MCP client exists but is never invoked. Recommend removing it from the list | `backend/agents/mcp_client.py` |
| "LangChain" | SUPPORTED | `base.py:6-14` |
| "LangGraph" | SUPPORTED, but limited: linear StateGraphs on the direct-run path only; approval does not use LangGraph | `graph.py:27-77` |
| "Python", "FastAPI", "NetworkX", "SQLite", "HTML/CSS/JS" | SUPPORTED | `main.py:103`; `knowledge_graph.py:14`; `db.py:3`; `frontend/` |
| "built entirely on synthetic data without any client credentials" / scopeBoundary "Synthetic demonstration. No client data, no client credentials. Not a production deployment." | SUPPORTED, with caveats: a fictional bank; real vendor brands with invented ratings; live public feeds | `backend/data/fake/` |
| contribution "Platform concept, workflow architecture, knowledge graph design, approval pattern design, review and deployment." | PARTLY SUPPORTED: all commits are by Thomas; no deployed instance; deployment files cover the gateway only | `Dockerfile`; `deploy/` |
| demonstrates "Platform and workflow concept, shared data and control patterns, approval design, enterprise integration awareness." | SUPPORTED | as above |
| diagram "Systems of record → documents & data → knowledge graph → agent orchestration → human approval → enterprise write-back" | PARTLY SUPPORTED: the real flow is ServiceNow plus synthetic registers → agents → approval → ServiceNow write-back or n8n alert. The graph and documents are side branches, not upstream of orchestration | `main.py:1024-1044`; `orchestrator.py` |
| problem statement | SUPPORTED as framing | none needed |
| Omission | The inference gateway, the best-tested component (48 tests), is not mentioned | `gateway/`; `tests/` |

### 5.7 Proposed case-study content (verified facts only)

**Problem.** NFR work spans service-management records, control and policy registers, regulatory publications and analyst judgement, and is handled one domain at a time.

**Constraints.**
- Synthetic data only, with no client systems.
- Consequential writes to a system of record must wait for a named role.
- Must run locally.
- LLM calls should be observable.

**Key design decisions**
1. **One orchestrator for 18 domain agents.** All agents share one step taxonomy and run lifecycle, so the UI, audit and scheduling are built once (`orchestrator.py:25-26`, `1059-1080`).
2. **Approval as a blocking step** with role-restricted decisions and a fail-safe timeout. No decision, or a timeout, means no write-back (`orchestrator.py:173-186`; `main.py:1101-1103`).
3. **Write-back as typed actions recorded on the step**, each re-checked 24 hours later (`orchestrator.py:191-260`; `outcome_tracker.py`).
4. **A shared NetworkX graph fed continuously** from ServiceNow and the record pipeline (`knowledge_graph.py`; `enricher.py`).
5. **LLM access through one client** with ordered fallback and an optional OpenAI-compatible gateway for metrics and tracing (`base.py:76-109`; `gateway/`; `docs/adr/002-openai-compatible-api.md`).

**Architecture layers, in order**
1. Sources: ServiceNow developer instance, synthetic registers, public feeds.
2. Ingestion: ServiceNow enrichment and the document watch folder.
3. Knowledge graph.
4. Agent layer: 18 agents, run as direct chains or orchestrated runs.
5. Approval step plus Teams notification.
6. ServiceNow write-back and n8n alerts.
7. Run log, event log and outcome checks.
8. Optional inference gateway with Prometheus and Grafana.

**Value logic.** Domain agents share one run lifecycle, approval primitive, write-back path and audit record. Each additional NFR domain therefore mostly costs prompts and data, not new control plumbing.

**Limitations**
1. Approval is active in 5 of 18 workflows, and one self-resolve path writes without approval.
2. Approver identity and decisions are not stored durably.
3. The domain agents do not yet query the graph.
4. The backend is untested and not packaged for deployment.

**Technology patterns**

| Pattern | Implemented with |
|---|---|
| Role-gated human approval step with fail-safe timeout | custom asyncio plus FastAPI dependencies |
| Typed write-back with post-action outcome verification | httpx against the ServiceNow Table API, SQLite |
| Ordered model fallback behind one client | LangChain `with_fallbacks`, `langchain-openai` |
| Linear multi-step LLM chains with structured JSON output | LangGraph `StateGraph`, OpenAI JSON mode |
| Continuously enriched entity-relationship graph | NetworkX |
| Server-pushed run progress | FastAPI `StreamingResponse` (SSE) and WebSocket |
| OpenAI-compatible observability proxy with retries | FastAPI, httpx, prometheus-client, OpenTelemetry |
| Kubernetes packaging with autoscaling and network policy | Helm (gateway only) |

---

## 6. AIRLOCK: AWS Regulated AI Workload Foundry

**Evidence base:** GitHub `main` `ff0e25c`. The hardening branch is described separately in 6.8.

### 6.1 What exists (`main`)

**API (FastAPI).**
- 20 endpoints (`apps/api/main.py:6-25`, plus `GET /primary-markets/runs` at `apps/api/routers/primary_markets.py:411`).
- They cover use cases, value contracts, policy specs, architecture, primary-markets runs and trace, approvals, passports and evals.
- `POST /evals/run` is a stub (`main.py:202-210`).

**Frontend (React, Vite, TanStack Query).** 8 routes (`apps/web/src/App.tsx:15-23`): Overview, Use Case Intake, Architecture, Policy, Primary Markets, Approval Inbox, Workload Passport and Technical Trace.

**Shared packages** (`packages/`):
- `contracts` (Pydantic domain models);
- `finance_engine` (decimal bond maths);
- `policy_spec` (compiler, Python enforcer, Cedar candidate text);
- `model_adapters`;
- `evidence` (in-memory store);
- `evaluations` (`ReleaseGate`, suite);
- `telemetry`.

**Workloads: one implemented.**
- `workloads/primary_markets/` is implemented.
- `workloads/treaty_renewal/` is a placeholder: "Phase 2. Not yet implemented" (`workloads/treaty_renewal/PLACEHOLDER.md:3`; `__init__.py:4`).
- The approvals router imports `PrimaryMarketsWorkflow` directly (`apps/api/routers/approvals.py:21`).

**Workflow: two implementations of the same 12 stages** (`workloads/primary_markets/workflow.py`).
- A LangGraph `StateGraph` (`:1149-1202`), compiled with `interrupt_before=["human_approval_requested"]` and no checkpointer. **The API does not use it.**
- A plain-Python `PrimaryMarketsWorkflow` class (`:1238-1763`), **which the API does use** (`primary_markets.py:274-298`).
- Stages: use_case_registered, data_and_policy_classified, evidence_loaded, deterministic_calculations, model_analysis, output_validated, challenge, evaluations, release_gate, human_approval_requested, approval_processed, passport_updated.
- Run statuses: running, awaiting_approval, completed, rejected, failed.

**Data model (SQLAlchemy).**
- 10 tables (`apps/api/models/db.py:48-217`): use_cases, value_contracts, policy_specs, architecture_recommendations, workload_passports, evidence_records, releases, approvals, workflow_runs, eval_results.
- SQLite by default (`db.py:26`).
- Tables are created with `create_all()` (`main.py:65`); there are no migrations on `main`.

**Models: no live model is ever called.**
- The workflow always instantiates `LocalAdapter` (`workflow.py:592`, `1583`). It is described as "scripted, deterministic ... Makes NO real model API calls", with model version `local-scripted-v1` (`packages/model_adapters/local_adapter.py:1-20`).
- `BedrockAdapter` raises `NotImplementedError` (`bedrock_adapter.py:80`, `92`, `104`), and nothing calls it.
- Bedrock model IDs appear only as configuration:
  - approved: Claude 3.5 Sonnet v2 and Claude 3 Haiku;
  - prohibited: Claude 2 and Titan Text Express (`workloads/primary_markets/use_case_spec.py:139-147`);
  - Claude 3.5 Haiku as the Terraform default (`infra/terraform/modules/bedrock/variables.tf:20-21`).
- There is no routing logic.

**Evals.** The pytest cases in `evals/` test deterministic components: finance maths, policy denials, injection strings and release-gate blockers. They do not test model outputs.

### 6.2 Human approval and control mechanics

**The gate:**
1. Stage 10 sets `approval_required` (`workflow.py:1728-1741`).
2. The API marks the run `awaiting_approval` and writes a pending approval row (`primary_markets.py:244-267`, `315-317`).
3. `POST /approvals/{id}/decide` accepts approved, rejected or deferred, returns 409 if the row is already decided, and resumes stages 11 and 12 (`approvals.py:16-82`, `97-134`).
4. "Deferred" is mapped to rejected (`approvals.py:37-38`).

**Policy layer:**
- `external.send` is always denied (`packages/policy_spec/enforcer.py:67`).
- `decision.export` requires approval (`enforcer.py:159`).
- The export tool is only called in the unused LangGraph path (`workflow.py:1026`).

**Weaknesses:**
- There is no authentication. `decided_by` is optional and taken from the request body (`apps/api/schemas/domain.py:223`).
- The approval row is updated in place.
- The wired release gate never blocks:
  - the release-gate stage computes pass or fail but never stops the run (`workflow.py:1703-1726`, `1325-1345`);
  - the `policy_compliance` eval is hard-coded to passed (`:1680-1684`);
  - the full `ReleaseGate` class (`packages/evaluations/release_gate.py`) is exercised only by tests.
- "Passport updated" is a boolean flag (`workflow.py:1743-1753`). The passport shown in the UI is seeded (`scripts/seed_data.py:369-380`).

**Provenance actually persisted** in `workflow_runs.state_json`:
- stage list and timestamps;
- model version and prompt hash;
- evidence records;
- eval results;
- validation errors;
- approval rationale (`primary_markets.py:323-334`; `approvals.py:66-74`);
- for each finance result, a truncated SHA-256 of its inputs and result (`packages/finance_engine/bond.py:49-59`).

**Not persisted:**
- the policy-decision log and the adapter call log, both in memory only (`enforcer.py:71`, `220-229`);
- OpenTelemetry has no exporter without Docker.

There is no hash chaining on `main`.

### 6.3 Tests and CI

239 test functions on `main` (the README says "261 tests pass", which is plausible once parametrisation is counted).

| File | Test functions |
|---|---|
| `tests/test_domain_models.py` | 53 |
| `tests/test_policy_spec.py` | 43 |
| `tests/test_workflow.py` | 32 |
| `tests/test_release_gate.py` | 30 |
| `tests/test_finance_engine.py` | 21 |
| `evals/primary_markets/normal_cases.py` | 25 |
| `evals/primary_markets/edge_cases.py` | 10 |
| `evals/primary_markets/adversarial_cases.py` | 10 |
| `evals/primary_markets/reliability_cases.py` | 6 |
| `evals/reliability/failure_mode_tests.py` | 5 |
| `evals/security/prompt_injection_tests.py` | 4 (parametrised) |

**Not tested:**
- the API (no TestClient);
- the LangGraph graph (`tests/test_workflow.py:1-5` tests the plain-Python class);
- the frontend.

**CI:** five workflows (backend, frontend, infrastructure, security, AI quality), triggered on `main`. **All 70 runs concluded failure.** Job results on `ff0e25c`:

| Workflow | Failed | Passed |
|---|---|---|
| Backend | pytest with a 60% coverage floor, ruff, mypy | evaluation suite |
| Frontend | tsc, build, vitest, eslint | none |
| Infrastructure | `terraform fmt`, `terraform validate` | Checkov (configured with `soft_fail`) |
| Security | TruffleHog, npm audit | pip-audit |
| AI Quality | stopped at `pip install -e ".[dev]"` | none |

### 6.4 Data

**Synthetic.**
- A fictional issuer, labelled synthetic in the README, the workflow and the NOTICE fields of `synthetic_data/primary_markets/*.json`.
- Test emails use `.example` domains.
- Terraform uses placeholder account IDs.

**Realistic-looking content.**
- Real rating-agency names on synthetic ratings (`scripts/seed_data.py:317`).
- A real data-vendor name in UI hints (`apps/web/src/pages/UseCaseIntake.tsx:225`).
- `docs/adr/ADR-011-region-and-sovereignty.md:33` names [redacted client name] as the "target design partner profile". This is on both public branches.

**Employer branding.** The "remove employer refs" commit `ff0e25c` removed branding from `pyproject.toml`, `PRFAQ.md`, `PRODUCT_CONSTITUTION.md`, an ADR, `IP_AND_PROVENANCE.md` and an IAM module. The removed text remains in the public initial commit `e32f692`.

### 6.5 Implemented versus reference-only

**Runnable locally:**
- FastAPI with SQLite and the React UI;
- the plain-Python 12-stage workflow;
- the deterministic finance engine and the Python policy enforcer;
- the scripted adapter;
- the approval inbox with resume;
- the evidence store, loaded from JSON.

The local clone (not public) contains a local SQLite database and a built frontend, so local mode has been run.

**Reference-only Terraform** (`infra/terraform/`), as 10 modules and 3 roots:

| Module | Declares |
|---|---|
| `bootstrap` | S3 state bucket and DynamoDB lock table |
| `networking` | VPC, private subnets, VPC endpoints for Bedrock, Bedrock runtime, S3 and Secrets Manager |
| `kms` | customer-managed key plus a DR replica |
| `s3` | evidence bucket with Object Lock in COMPLIANCE mode for 2,555 days (`modules/s3/main.tf:210-217`) |
| `iam` | API, Bedrock and CI/CD roles, with GitHub OIDC |
| `bedrock` | guardrail and invocation logging |
| `observability` | CloudWatch logs, metric filters, alarms and dashboard |
| `budget` | budget |
| `database` | RDS PostgreSQL 15 (`modules/database/main.tf:6`, `107`). The README claims Aurora Serverless v2. |
| `step_functions` | Lambda tasks and a `waitForTaskToken` approval with a 72-hour timeout (`main.tf:422-454`); the Lambda ARN is a "PENDING" placeholder |

- The `regulated-reference` root adds CloudTrail, GuardDuty, Security Hub and Macie.
- The sandbox environment comments out the database and Step Functions modules (`environments/sandbox/main.tf:139`, `164`).
- No compute runtime (ECS or Lambda functions) is defined anywhere.

**Has the Terraform ever been applied? No evidence that it has, and direct evidence that it has not:**
- `docs/IMPLEMENTATION_STATUS.md:47` says "Terraform plan | Never run", and line 119 says no `terraform apply` has been run.
- `README.md:5` says "not deployed".
- No state, lock, `.terraform` or plan files exist in either branch or in the local clone.
- The backend bucket name is a placeholder (`regulated-reference/main.tf:42`).
- CI has no plan or apply job, and `terraform validate` fails.
- `docs/NEXT_SESSION.md:115` (hardening branch) says "Do NOT run `terraform apply`".

### 6.6 Limitations and production gaps

The repository's own `docs/HARDENING_PLAN.md:30-158` (hardening branch) confirms most of these.

**Missing:**
- a real model;
- authentication or authorisation;
- durable execution: run state is a volatile dictionary and work runs as background tasks, with no checkpointer;
- a wired release gate;
- a persistent evidence store;
- a signed passport;
- end-to-end tests.

**Inconsistent:**
- The `/alternatives` endpoint and the workflow use different funding alternatives (`primary_markets.py:36-70` versus `workflow.py:77-110`).
- The UI shows hard-coded token usage and cost on every trace (`TechnicalTrace.tsx:8-26`). On API errors it falls back to fabricated data (`ApprovalInbox.tsx:77` and other pages).
- The README is out of date: it says approval does not resume the workflow, which contradicts the code and `docs/IMPLEMENTATION_STATUS.md:18-25`.
- The ADRs describe intent rather than the build, for example dual approvers and KMS signing (ADR-006).

### 6.7 Claim check (`content.json` entry `airlock`)

| Claim (quoted) | Verdict | Evidence |
|---|---|---|
| title "AIRLOCK: AWS Regulated AI Workload Foundry"; evidenceType "Reference architecture and demonstrator" | SUPPORTED | `README.md:1-5` |
| "Reference implementation for building auditable, human-approved AI agent workflows on AWS for regulated industries." | PARTLY SUPPORTED: the pattern runs locally, with an approval gate and a persisted run record. Nothing runs on AWS, and no AI model runs (scripted adapter) | `README.md:5`; `local_adapter.py:1-10` |
| "Demo workload is a Primary Markets bond structuring assistant using synthetic data." | SUPPORTED: it screens three predefined funding alternatives and produces a scripted recommendation | `workflow.py:77-110` |
| "Includes a fully functional local-mode implementation" / "Local mode is fully functional and runnable without cloud infrastructure." | PARTLY SUPPORTED: it runs end to end with no cloud (run, approve, complete). The model is scripted, the release gate does not block, there is no authentication, LangGraph is not wired, the UI has stub fallbacks and frontend CI fails | `docs/IMPLEMENTATION_STATUS.md:56-102`; 6.2, 6.3 |
| "infrastructure modules for a compliant AWS deployment" / "the Terraform modules for a compliant AWS deployment" | PARTLY SUPPORTED: 10 modules and 3 roots declare the controls in 6.5. "Compliant" is unproven and disclaimed by the repository; validate fails; never applied; no compute | `docs/CLAIMS_LEDGER.md:150`; CI |
| "AWS/Terraform modules define the compliant deployment pattern with the necessary controls for a regulated environment." | PARTLY SUPPORTED: as above | `infra/terraform/` |
| "Every agent action is logged with full provenance." | PARTLY SUPPORTED: stage timestamps, model version, prompt hash, evidence, evals and calculation hashes are persisted. Policy decisions and adapter calls are held in memory only; approval rows are mutable and the actor is unauthenticated | `primary_markets.py:323-334`; `enforcer.py:71` |
| "Human approval gates are embedded at consequential steps." | PARTLY SUPPORTED: one gate, at stage 10, with resume; the claim's plural is not met, and identity is not verified | `approvals.py:97-134` |
| "a second workload reuses the same orchestration, approval, and audit infrastructure" | **NOT FOUND**: the second workload is a placeholder, and the approvals router is wired to the primary-markets workflow | `workloads/treaty_renewal/PLACEHOLDER.md:3`; `approvals.py:21` |
| "Structured as a reusable foundry pattern" / "structured as a reusable foundry rather than a one-off build" | PARTLY SUPPORTED: the shared packages are designed for reuse, but reuse is not demonstrated | `packages/`; `workloads/__init__.py:6-8` |
| "auditable agent orchestration" | PARTLY SUPPORTED: a sequential state machine around a scripted adapter | `workflow.py:1238` |
| "Bridges the gap between an AI proof-of-concept and a structured deployment for regulated environments." | PARTLY SUPPORTED: an aspiration; the deployment layer is not built | `docs/HARDENING_PLAN.md:6` |
| diagram "Workflow trigger → agent orchestration → human approval gate → audit record → AWS deployment layer" | PARTLY SUPPORTED: the first four steps exist locally; the AWS layer is reference only | 6.1, 6.5 |
| implementationNotes and tech "Python, FastAPI, SQLAlchemy, SQLite, Terraform, AWS architecture patterns" | SUPPORTED: omits React, TypeScript, Pydantic, pytest and LangGraph (defined, not wired) | `pyproject.toml:23-48`; `db.py:26` |
| scopeBoundary / limitations "Demo workload uses synthetic data only. AWS/Terraform mode is reference architecture, not a deployed production environment." | SUPPORTED: could say "never planned or applied" | `docs/IMPLEMENTATION_STATUS.md:47`, `119` |
| problem "...but no credible reference architecture exists for this combination." | NOT FOUND: an unsupported market assertion | none |
| contribution "Pattern design, workflow architecture, human approval gate design, review and deployment." | PARTLY SUPPORTED: published on GitHub; no hosted demo and no AWS deployment | GitHub homepage field empty |
| demonstrates "...regulated-environment deployment awareness" | SUPPORTED | ADR-007, ADR-011, ADR-012 |

### 6.8 Hardening branch (`hardening/production-foundation`, on GitHub, not default)

- A frozen Pydantic domain model (`workloads/primary_markets/domain.py`) and a single source of truth for the alternatives (`alternatives.py`). The router no longer performs bond maths.
- An Alembic baseline creating 14 tables, with PostgreSQL 16 in docker-compose.
- The audit-event table gains a `chain_hash` column, and the approvals table gains hash and idempotency columns (`apps/api/models/db.py:309-324`, `445-465`). **No code writes them yet.**
- 13 more tests (8 Hypothesis property tests, 5 migration tests).
- Milestones C to S remain open (`docs/HARDENING_PLAN.md:166-188`): LangGraph runtime, authentication, audit log, Bedrock.
- CI has never run on this branch.

### 6.9 Proposed case-study content (verified facts only)

**Problem.**
- Regulated firms need AI-assisted recommendations where every figure can be traced, tools are restricted by policy, and a named person approves before anything is released.
- Rebuilding those controls for every pilot is slow.

**Constraints.**
- Synthetic data only.
- No cloud credentials or spend.
- No claim of regulatory compliance (`docs/CLAIMS_LEDGER.md:150`).
- The model must never produce financial figures (ADR-005).
- EU data residency by default (eu-central-1, ADR-011).

**Key design decisions**
1. **A deterministic decimal finance engine; the model only narrates.** Each result is hashed (ADR-005; `bond.py:49-59`).
2. **A local mode with a scripted adapter**, so the full pattern runs offline at zero cost, behind an `AIRLOCK_MODE` switch to a Bedrock adapter (ADR-007; `bedrock_adapter.py:38-44`).
3. **Policy-gated tools:** a hard-coded deny on external sends, per-stage tool permissions, and export only after approval (`enforcer.py:67`, `159`).
4. **A modular monolith** with workload-agnostic packages (ADR-003).
5. **An explicit claims ledger and implementation-status matrix** that separate built from reference (`docs/CLAIMS_LEDGER.md`; `docs/IMPLEMENTATION_STATUS.md`).

**Architecture layers, in order**
1. React UI.
2. FastAPI routers with background runs.
3. A 12-stage workflow state machine.
4. Shared packages: policy, evidence, finance, adapter, evaluations.
5. SQLAlchemy run and approval records on SQLite.
6. Terraform AWS reference layer (not deployed).

**Value logic (illustrative).**
- The value contract assumes 4.5 hours of research plus 1.5 hours of drafting per transaction (`use_case_spec.py:79-122`). Its targets:
  - a 60% time reduction;
  - 100% audit completeness;
  - 20 transactions per analyst per month;
  - an annual cost ceiling of EUR 180,000.
- The platform case assumes governance is reused across 10 workloads over 3 years (`docs/value/VALUE_FRAMEWORK.md:87-110`):
  - built ad hoc: EUR 5.65m to 13m;
  - on the shared foundation: EUR 1.93m to 4.2m.

**Limitations**
1. Scripted model only; the Bedrock adapter is a stub.
2. A single unauthenticated approval step, mutable approval records, and a release gate that does not block.
3. One workload; the second is a placeholder.
4. The Terraform has never been planned or applied, and CI fails.

**Technology patterns**

| Pattern | Implemented with |
|---|---|
| Deterministic calculation engine with hashed results | Python `decimal`, `hashlib` |
| Policy-gated tool invocation with a hard deny list | custom `PolicyEnforcer`, with Cedar policy text generated as candidates |
| Staged state machine with human-approval pause and resume | plain Python (wired); LangGraph `interrupt_before` (defined only) |
| Provider-abstracted model adapter with a scripted local fallback | `LocalAdapter` / `BedrockAdapter` (boto3, stub) |
| Evidence-grounded output validation (citations, uncertainty flags) | Pydantic |
| Evaluation suite as a release gate | pytest, `ReleaseGate` |
| Persisted run state and approval records | SQLAlchemy with SQLite, FastAPI |
| Dual-mode infrastructure as code | Terraform AWS provider, `AIRLOCK_MODE` |

---

## 7. Archive items

### 7.1 AI Model Risk Dashboard (`ai-risk-dashboard`, `master` `eb09cef`)

**What exists.**
- A React 18 single-page app built with Vite and Tailwind, using a `HashRouter`.
- Routes (`src/App.jsx`): `/govern`, `/map`, `/measure` (default landing page), `/manage` and `/models/:id`.
- Panels:
  - model inventory (25 records);
  - shadow AI (12 incidents);
  - regulatory exposure heat map;
  - validation coverage gauges;
  - vendor risk (10 vendors);
  - audit trail (25 events).
- All data comes from `public/mock-api/*.json`, with simulated latency.
- Three client-side roles (CRO, MRM validator, SOC analyst) in `src/auth/AuthContext.jsx`. Only CRO can approve.
- A client-side access-code gate (`public/nfr-gate.js`) and a static sales narrative page (`public/client-story.html`).
- Live on GitHub Pages.

**Tests and CI.** No tests. CI is the Pages deploy workflow.

**Data.**
- Synthetic records.
- Invented European person names in the audit log.
- Real AI vendor brands as inventory vendors, including one fictional product carrying the employer's name.
- The README calls it "production-ready" "for managing AI model risk in a large European bank", and both it and the story page carry employer practice branding.

**Limitations.**
- No backend.
- Approve and reject mutate the mock audit event in place, client-side only (`src/hooks/useAuditLog.js`; "TODO: Replace with real API call").
- The "live" feel is a timer that refreshes a "last scan" stamp every 30 seconds over static data (`src/hooks/useLiveSimulation.js`).

**Claim check (`content.json` entry `ai-risk-dashboard`)**

| Claim (quoted) | Verdict | Evidence |
|---|---|---|
| "structured around the NIST AI RMF phases (Govern / Map / Measure / Manage)" | SUPPORTED | `src/App.jsx` |
| "model inventory" | SUPPORTED (25 mock records) | `public/mock-api/inventory.json` |
| "shadow AI detection" / "Shadow AI detection flags ungoverned model usage across the organisation." | PARTLY SUPPORTED: displays 12 seeded incidents, with one rule forcing Critical severity when customer or credit data is involved. There is no detection logic ("TODO: Replace with live CASB/SIEM API") | `src/hooks/useShadowAI.js` |
| "regulatory heat-mapping across multiple frameworks" | SUPPORTED: regulations by asset type | `src/brand.js:23`; `src/panels/RegulatoryExposure/HeatMap.jsx` |
| "Regulatory mapping covers DORA, SR 11-7, GDPR, and the EU AI Act." | PARTLY SUPPORTED: the heat map covers DORA, SR 11-7, GDPR, GLBA, ECOA/Reg B and PCI-DSS. The EU AI Act appears only on the static narrative page | `src/brand.js:23`; `public/client-story.html` |
| "vendor risk assessment" / "Vendor risk module covers third-party model dependencies." | SUPPORTED (10 mock vendors) | `src/panels/VendorRisk/` |
| "an immutable audit trail" / "Audit trail is append-only and timestamped" | PARTLY SUPPORTED: timestamped, and labelled "Immutable log" in the UI (`src/panels/AuditTrail/index.jsx:106`). Not append-only: approvals overwrite the event status in client state | `src/hooks/useAuditLog.js` |
| commercial "a manageable inventory with live risk signals" | PARTLY SUPPORTED: the signals are static mock data with a refresh timer | `src/hooks/useLiveSimulation.js` |
| tech "React 18, React Router, Recharts, TanStack Query, Radix UI, Tailwind CSS, Vite" | SUPPORTED: Radix is used for the tooltip only | `package.json` |
| "regulatory framework literacy (NIST AI RMF, DORA, SR 11-7)" | SUPPORTED | as above |
| "Demonstrator using synthetic data. No client models, credentials or production data." | SUPPORTED | `public/mock-api/` |
| contribution "...review and deployment" | SUPPORTED: deployed on Pages | `.github/workflows/deploy.yml` |

### 7.2 Autonomous Operations Control Center (no public code)

**The GitHub repository linked from the portfolio is empty.** Everything below describes the unpushed local clone (`777ae0d`) and is not visible to readers.

**What exists locally.**
- A pnpm monorepo: `apps/api` (Fastify, lowdb JSON file), `apps/web` (React 18, zustand, `@xyflow/react`) and `packages/shared` (types and schemas).
- A scripted 17-phase simulation (`packages/shared/src/types.ts:17-34`), from IDLE through APPROVAL_PENDING to COMPLETE, driven by `apps/api/src/services/stateMachine.ts`.
- Each phase change persists the current phase and broadcasts over SSE (`stateMachine.ts:30-40`; `apps/api/src/services/sse.ts`; `apps/web/src/hooks/useSSE.ts`).
- One approval gate before a configuration rollback step (`stateMachine.ts:211-260`).
  - On rejection the flow returns to PLAN_GENERATED.
  - The approver and a timestamp are stored on the incident (`:470-472`).
  - `?autopilot=1` auto-approves after 5 seconds (`apps/web/src/pages/DemoPage.tsx:87-96`).
- No AI model calls: the agents are scripted status updates.
- The audit events are a fixed seed list copied in at the LEARNING phase (`stateMachine.ts:396`; `apps/api/src/data/seed.ts:606`). They are not written per transition.

**Tests.** 33 cases: `apps/api/src/index.test.ts` 18, `packages/shared/src/index.test.ts` 12, `apps/web/src/components/shared/StatusBadge.test.tsx` 3. No CI.

**Data.** The data is synthetic. The local README names [redacted client name] and a client use-case number in its title.

**Claim check (`content.json` entry `autonomous-ops`)**

| Claim (quoted) | Verdict | Evidence |
|---|---|---|
| status "Published" / repo link | NOT FOUND: the GitHub repository is empty | GitHub API: size 0, no refs |
| "A 3-minute guided scenario runs a real backend state machine" | SUPPORTED locally only: a scripted, persisted phase machine | `stateMachine.ts` |
| "SSE-driven live UI updates" / "SSE pushes real-time state to the UI without polling" | SUPPORTED locally only | `sse.ts`; `useSSE.ts` |
| "a human-in-the-loop governance gate at consequential decision points" | PARTLY SUPPORTED: one gate; can be auto-approved in autopilot mode | `stateMachine.ts:211-260`; `DemoPage.tsx:87-96` |
| "Backend state machine tracks every transition with a full audit log." | NOT FOUND: transitions are broadcast, but the audit log is a pre-scripted seed | `stateMachine.ts:396`; `seed.ts:606` |
| "maintaining a clear record of what was approved, by whom, and when" | PARTLY SUPPORTED: approver and time are stored on the incident; the approver is self-asserted; the rejecter is not stored | `stateMachine.ts:470-490` |
| "autonomous AI-driven IT operations" | PARTLY SUPPORTED: a simulation with no AI calls | no model client in `apps/` or `packages/` |
| diagram "Event ingestion → autonomous triage → state machine → human approval gate → action execution → audit log" | PARTLY SUPPORTED: all stages are scripted | `stateMachine.ts` |
| tech "TypeScript, Node.js 20, pnpm monorepo" | SUPPORTED locally | `pnpm-workspace.yaml`; `package.json` |
| "Demonstrator using synthetic events. No production system credentials or client data." | PARTLY SUPPORTED: synthetic events; the local README names a client | `README.md:2` (local) |

### 7.3 Interactive Personal Story (`Selfcare`, `main` `256a041`)

**What exists.**
- One self-contained `index.html` (1,223 lines) plus 33 personal photos under `Images/`.
- Sections: an animated mood avatar, a life timeline, cycling and running stats, travel with a d3 globe and an offline fallback map, a 138 BPM audio loop generated in the browser, "good to know" cards and a colleague quiz.
- Accessibility features: 14 `aria-label`s, `aria-pressed` toggles, `role="img"`/`"dialog"`, an `aria-live` region, and `prefers-reduced-motion` handling.
- A client-side password gate (last commit). The README frames it as a link to share with colleagues at the end of a talk.
- No tests and no CI.

**Claim check (`content.json` entry `personal-story`)**

| Claim (quoted) | Verdict | Evidence |
|---|---|---|
| "An interactive single-page experience combining personal storytelling, data visualisation, accessibility, and lightweight product design." | SUPPORTED | `index.html` |
| "Built entirely in vanilla web technologies with attention to accessibility, motion, and visual hierarchy." | PARTLY SUPPORTED: no framework or build step, but it loads d3, topojson and flag-icons from CDNs | `index.html:10`, `843-844` |
| contribution "...accessibility, deployment" | PARTLY SUPPORTED: accessibility yes; the GitHub Pages URL returns 404 | HTTP check |
| commercial "the ability to work across the full stack independently" | NOT FOUND: front-end only, and 12 of 13 commits carry AI co-author trailers | git log |
| scopeBoundary "Personal project. No enterprise application." | SUPPORTED | `README.md` |

---

## 8. Summary of claims needing change

**NOT FOUND**
- AIRLOCK: "a second workload reuses the same orchestration, approval, and audit infrastructure".
- AIRLOCK: "no credible reference architecture exists for this combination".
- DORA: "The architecture reflects patterns from enterprise delivery experience" (not verifiable from code).
- Operations Control Center: "Published" (the repository is empty).
- Operations Control Center: "tracks every transition with a full audit log".
- Personal Story: "work across the full stack".

**PARTLY SUPPORTED, highest priority**

*DORA*
- "anonymised" (a real client is named).
- "human approval gates at every consequential step" (three gates, plus bypass routes).
- "Tests cover the full workflow including edge cases and human-override paths" (unit tests only, no CI).
- The model split: gpt-4o-mini output is not used for the committed document.

*NFR*
- "MCP" (never invoked).
- "shared knowledge graph" (the domain agents do not use it).
- "before anything is written back" (an ungated self-resolver).
- "Teams for approvals" (notification only).

*AIRLOCK*
- "fully functional local mode" (scripted model, non-blocking release gate).
- "Every agent action is logged with full provenance".
- "compliant AWS deployment" (never applied, validate fails).

*AI Economics Simulator*
- "public" (access-code gate).
- "Not a client tool" (the README targets client presentations).
- "governance overhead allocation" (not allocated).
- "proposal development" (its own disclaimer).

*Risk Dashboard*
- "EU AI Act" mapping.
- "append-only" audit trail.
- "shadow AI detection".

**Cross-cutting**
- "independently developed": employer and client context is visible in several repositories.
- "deployment": only two projects are deployed.
