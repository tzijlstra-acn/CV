# Market role map

Role-family model behind the seven lenses (brief sections 7 and 7A). It was validated on 2026-11-02 against four representative official job postings: an AI deployment strategist role, a customer success role, a strategic value engineer role and a risk and resilience consulting role. The posting-level notes and their URLs are kept privately; this file keeps what generalises: what each lens screens for, the evidence that answers it, the honest gaps and the phrases to avoid.

The lens copy on the site is in `portfolio-data/role-lenses.json`; it uses this map but is not a copy of it.

## 1. Evidence register used in this map

| ID | Evidence | Type | Level (per `CLAIM_LEDGER.md`) |
|---|---|---|---|
| X1 | Societe Generale, London: FIG debt capital markets, 2015 to 2018 | Professional | A |
| X2 | Single family office, London: investment and finance, 2018 to 2020 | Professional | A |
| X3 | Accenture: FINMA regulatory reporting and data adequacy on Databricks | Client delivery | A (scope pending confirmation) |
| X4 | Accenture: OeNB central-bank audit stream | Client delivery | A (scope pending confirmation) |
| X5 | Accenture: LIBOR transition | Client delivery | A |
| X6 | Accenture: enterprise AI strategy and workflow shaping for non-financial risk (RCSA, TPRM, regulatory change, DORA) | Client delivery | A (scope pending confirmation) |
| X7 | Accenture: lead of the Swiss NFR capabilities team and its DACH go-to-market | Internal leadership | A (team size and scope pending confirmation) |
| P1 | AI economics simulator | Independent public prototype, AI-assisted | B |
| P2 | DORA Article 12 AI control-line workflow | Independent public prototype, AI-assisted | B |
| P3 | NFR agent platform | Independent public prototype, AI-assisted | B |
| P4 | AIRLOCK, a regulated AI workload foundry on AWS | Independent public prototype, AI-assisted | B |
| C1 | CFA charter | Credential | A |

**Publication caveat:** several prototype repositories still await a publication audit (`NEEDS_CONFIRMATION.md`), including the AIRLOCK Terraform review. Link only repositories that have been audited.

## 2. Lens map

### 2.1 Consulting and transformation

**Typical targets:** financial-services practices at strategy and Big Four firms, transformation offices at banks and insurers, and deployment roles at AI model providers.

**(a) What reviewers screen for in the first 20 seconds**

- Firm, years and the regulated domain, all in the first line.
- Thomas's own role in each engagement (for example, stream lead), not only the client's programme.
- Regulator and framework names that signal depth: FINMA, OeNB, DORA, LIBOR.
- One outcome per case, stated as what was in place afterwards.
- A career logic: why capital-markets and investing experience strengthens transformation work.

**(b) Capabilities that matter most**

1. Problem structuring
2. Delivering regulated programmes
3. Senior stakeholder management
4. Regulatory and risk-data knowledge
5. Team leadership
6. Business case framing
7. Change and adoption
8. Clear written synthesis

**(c) Best evidence**

- **X3:** regulatory reporting and data adequacy on a modern data platform.
- **X4:** regulator-facing audit work at a central bank.
- **X5:** a market-wide reform programme.
- **X6:** the move into AI-era transformation.
- **X7:** team leadership.
- **X1 and X2:** financial grounding.

**(d) Gaps and honest framing**

- **Scope:** ownership of X3, X4 and X6 is pending confirmation. Use only the confirmed role noun. Do not write "led the programme" when the role was one stream among several.
- **Metrics:** the evidence summary contains no outcome metrics. Describe outcomes as a change in state, and add scope figures (reports, entities, workstreams) only once they are verified. Never invent percentages.
- **Client names:** describe clients by type and jurisdiction unless naming is approved. OeNB appears in the evidence summary, but confirm that publishing the name is permitted.
- **Title:** the formal Accenture title is unconfirmed. Do not imply Partner, Principal or Director level.

**(e) Opening proof statement**

> Since 2020 I have delivered regulated financial-services change at Accenture in Zurich, including FINMA regulatory reporting on Databricks, an OeNB audit stream and LIBOR transition.

**(f) Primary case:** FINMA regulatory reporting and data adequacy on Databricks (X3). It combines a regulator, a data platform and delivery, so it transfers best to transformation reviewers.

### 2.2 AI deployment and adoption

**Typical targets:** deployment strategist and customer success roles at model providers and AI platform vendors.

**(a) What reviewers screen for in the first 20 seconds**

- Evidence of taking AI from idea into a working enterprise workflow, not only strategy material.
- A working artefact the reviewer can open, as proof of hands-on fluency.
- Regulated-industry credibility, since these are the hardest customers to deploy into.
- Adoption thinking: whose work changes, and how value is tracked afterwards.
- DACH presence and German.

**(b) Capabilities that matter most**

1. Use-case discovery and prioritisation
2. Roadmaps with success metrics
3. Hands-on LLM and agent prototyping
4. Workflow and control design, including human approval points
5. Tracking value after launch
6. Change management and enablement
7. Executive communication
8. Turning engagements into playbooks

**(c) Best evidence**

- **X6 is the core:** AI strategy and workflow shaping for RCSA, TPRM, regulatory change and DORA.
- **P2 and P3:** make the workflow thinking inspectable.
- **X7:** shows repeatability, because a capabilities team is a playbook function.
- **P1:** links adoption to economics.

**(d) Gaps and honest framing**

- **No evidenced production deployment with usage metrics.** Describe client work as "shaped", "designed" or "piloted", matching the confirmed scope. Never "deployed at scale".
- **The prototypes are independent and built with AI coding assistance.** Say so in one line, and state what Thomas owned (problem framing, design, review, testing), once that is confirmed. Stated plainly, AI-assisted building is a strength for these roles.
- **No customer-success history.** There is no evidence of account ownership, consumption or seat expansion, QBRs or renewals, so do not claim customer-success metrics. Point instead to long-running stakeholder work on engagements.
- **No enablement programmes.** Train-the-trainer or centre-of-excellence work is not in the evidence summary. Include it only if it is real.
- **German level:** fluent (content.json languages); say so in the first screen for DACH roles.

**(e) Opening proof statement**

> I work out where AI belongs in non-financial risk workflows such as RCSA, third-party risk and DORA, and I build working prototypes to test those designs.

**(f) Primary case:** AI workflow shaping for non-financial risk (X6), with the DORA Article 12 AI control-line workflow (P2) as its inspectable companion.

### 2.3 Value engineering and presales

**Typical targets:** value engineering and solution consulting at AI, regtech and fintech software vendors.

**(a) What reviewers screen for in the first 20 seconds**

- Whether he can quantify value and the cost of doing nothing, in CFO language.
- A visible business case or value model.
- Demo and workshop ability.
- Process knowledge that matches the vendor's product.
- Experience working alongside a sales owner in a deal cycle.

**(b) Capabilities that matter most**

1. Discovery and problem reframing
2. Value and business-case modelling
3. Cost-of-inaction framing
4. Demo design
5. Workshop facilitation
6. Solution scoping (integration, security, rollout)
7. Handling objections from finance and IT buyers
8. Working within a deal team

**(c) Best evidence**

- **C1, X1 and X2:** financial analysis, capital allocation and investor-grade reasoning.
- **P1:** the economics of AI adoption, expressed as a model.
- **X7:** propositions and pursuits in the DACH go-to-market.
- **P2 to P4:** artefacts he can demo.
- **X6:** business and control requirements translated into workflow designs.

**(d) Gaps and honest framing**

- **No formal quota ownership, OTE or closed-deal record is evidenced.** Do not claim quota, win rates, pipeline figures or "closed" deals. If he contributed to pursuits, write "supported pursuits" and describe the confirmed scope.
- **No ERP, SAP or AP/P2P delivery evidence.** For ERP-automation vendors, state only the transferable part: controls and compliance in finance processes, and regulatory reporting data.
- **Family office confidentiality.** Describe the activity, not the family. Confidentiality is already an open item in `NEEDS_CONFIRMATION.md`.
- **Simulator framing.** Show the simulator's assumptions and their sources so that it reads as a model, not a sales calculator. Confirm that the statement below matches what it actually models.

**(e) Opening proof statement**

> I am a CFA charterholder with capital-markets and investing experience, and I have built a public AI economics simulator for weighing the cost and value of AI adoption.

**(f) Primary case:** the AI economics simulator (P1), presented as a value-engineering method: inputs, assumptions, sensitivities, and the questions a CFO would challenge.

### 2.4 Partnerships and ecosystem

**Typical targets:** alliance roles at model providers, hyperscalers and data platforms, partner leads at consultancies, and vendors building integrator channels in DACH.

**(a) What reviewers screen for in the first 20 seconds**

- An understanding of how model providers, cloud platforms, data platforms, integrators and regulators fit together.
- Hands-on credibility with at least one platform.
- Integrator-side experience, meaning knowledge of how partners actually sell and deliver.
- Any joint proposition or co-selling experience.
- Knowledge of entering regulated markets, which partners need.

**(b) Capabilities that matter most**

1. Ecosystem mapping
2. Joint proposition design
3. Platform fluency (AWS, Databricks, model APIs)
4. Partner enablement
5. Managing stakeholders across organisations
6. Commercial structuring
7. Regulatory positioning for regulated buyers

**(c) Best evidence**

- **X3:** integrator-side delivery on Databricks.
- **P4:** hands-on work with AWS building blocks.
- **X7:** integrator-side go-to-market.
- **X1:** debt capital markets work sits between issuers and investors, which is experience of an intermediated market.

**(d) Gaps and honest framing**

- **No formal alliance role is evidenced,** and neither is partner-sourced revenue or ownership of a joint offer. Present the experience as "integrator-side" and "built on". Never write "partnered with AWS" or "Databricks partner".
- **No vendor logos,** because they imply endorsement.
- **This is the thinnest lens.** Pair it with business building and GTM rather than presenting it as a stand-alone specialism.

**(e) Opening proof statement**

> I have delivered FINMA regulatory reporting on Databricks and built AIRLOCK, a regulated AI workload foundry on AWS, so I work from both the integrator and the platform side.

**(f) Primary case:** AIRLOCK (P4), with X3 as the delivery proof.

### 2.5 Business building and GTM

**Typical targets:** early go-to-market or country-launch roles at AI and regtech scale-ups in DACH, and practice building inside consultancies.

**(a) What reviewers screen for in the first 20 seconds**

- Something built from a starting point: a team, an offer or a market.
- DACH market knowledge.
- Commercial judgement and a grasp of the economics.
- The ability to operate without a large support structure.
- Reusable assets that make selling repeatable.

**(b) Capabilities that matter most**

1. Market and segment selection
2. Offer and proposition design
3. Team leadership
4. Pursuit and pipeline support
5. Pricing and unit economics
6. Reusable sales assets (demos, playbooks)
7. Prioritisation and operating cadence
8. A principal's view of investment decisions

**(c) Best evidence**

- **X7 is the core.**
- **X6:** supplies the offer content.
- **P1 to P4:** reusable conversation assets.
- **X2:** principal-side investment judgement.
- **C1:** underpins the unit economics.

**(d) Gaps and honest framing**

- **Team scope is unconfirmed.** Team size, reporting line and the meaning of "lead" are pending confirmation (`CLAIM_LEDGER.md`). Do not write "built a practice" or "founded" unless that is true.
- **No commercial ownership.** No P&L, revenue target or quota ownership is evidenced. Describe scope (segments, offer, markets), not revenue.
- **No venture founding.** The prototypes show initiative, but they are not companies. Do not describe them as products with users.

**(e) Opening proof statement**

> I lead the Swiss non-financial risk capabilities team at Accenture and shape its go-to-market across the DACH region.

**(f) Primary case:** the Swiss NFR capabilities team and its DACH go-to-market (X7), with the NFR agent platform (P3) shown as a reusable asset.

### 2.6 Risk and resilience

**Typical targets:** risk and resilience practices at strategy and Big Four firms, second-line roles at banks and insurers, and regtech.

**(a) What reviewers screen for in the first 20 seconds**

- Named frameworks and regulation in the first lines: RCSA, TPRM, DORA, FINMA, operational resilience.
- Which risk types and which line of defence.
- Whether AI is applied credibly in risk work, with controls and human oversight.
- Quantitative credentials.
- Banking or capital-markets grounding.

**(b) Capabilities that matter most**

1. Non-financial risk frameworks (RCSA, TPRM, controls)
2. Regulatory interpretation (DORA, FINMA)
3. Operational and ICT resilience
4. Risk data and regulatory reporting
5. AI agents in risk workflows, with human oversight
6. Quantitative analysis
7. Governance design
8. Leading an independent workstream

**(c) Best evidence**

- **X6:** RCSA, TPRM, regulatory change and DORA.
- **P2:** DORA Article 12, which covers backup, restoration and recovery.
- **X3:** FINMA reporting and data adequacy.
- **X4:** a central-bank audit stream.
- **X5:** LIBOR transition.
- **P3:** the NFR agent platform.
- **C1 and X1:** quantitative and markets grounding.

**(d) Gaps and honest framing**

- **Degree.** The posting requires a master's degree, ideally quantitative. Thomas holds an MSc in Finance and Investments (cum laude, Rotterdam School of Management); state it plainly.
- **Programming and model lifecycle.** Hands-on model work and Python or R programming are evidenced only through AI-assisted prototypes (Level B). Call this "prototype-level fluency", and do not claim model development or validation.
- **Risk types.** No credit or market risk modelling is evidenced, so keep this lens on non-financial risk and resilience.
- **DORA prototype status.** State that it is an independent prototype, not a client tool, and not a compliance attestation.

**(e) Opening proof statement**

> I work on non-financial risk in regulated financial services, across RCSA, third-party risk, regulatory change and DORA, and I prototype AI agents for these workflows in public.

**(f) Primary case:** the DORA Article 12 AI control-line workflow (P2), introduced with the client NFR context from X6.

### 2.7 Applied AI solution design

**Typical targets:** business-facing solution architect roles, AI solution leads, technical presales, and forward-deployed roles at AI vendors.

**(a) What reviewers screen for in the first 20 seconds**

- Working artefacts: a repository, an architecture diagram and a short demo.
- Control and security design suited to regulated data.
- A clear statement of what he built personally, and with which tools.
- Testing and evaluation evidence.
- An honest maturity label.

**(b) Capabilities that matter most**

1. Moving from problem framing to architecture
2. LLM and agent workflow design
3. Human-in-the-loop control design
4. Evaluation and testing
5. Cloud architecture on AWS
6. Data platform fluency (Databricks)
7. Security and compliance by design
8. Documenting limits

**(c) Best evidence**

- **P4:** AIRLOCK.
- **P3:** the NFR agent platform.
- **P2:** the DORA control-line workflow. The claim ledger notes model routing in this prototype.
- **P1:** the AI economics simulator.
- **X3:** client data platform delivery.

**(d) Gaps and honest framing**

- **All four prototypes are independent, AI-assisted and not production systems.** Label each one "prototype", with its date, scope, tests and what is not covered.
- **No production users, operations or on-call responsibility is evidenced.**
- **No cloud certifications appear in the evidence summary.** Do not imply any.
- **The AIRLOCK publication audit is still open** (account IDs and ARNs in Terraform). Resolve it before linking.

**(e) Opening proof statement**

> I design AI workflows for regulated financial services and build them as public prototypes, including AIRLOCK, a regulated AI workload foundry on AWS.

**(f) Primary case:** AIRLOCK (P4).

### 2.8 Summary of openings

| Lens | Opening proof statement (short form) | Primary case |
|---|---|---|
| Consulting and transformation | Regulated FS change at Accenture since 2020: FINMA on Databricks, OeNB audit stream, LIBOR | X3 FINMA reporting on Databricks |
| AI deployment and adoption | Where AI belongs in NFR workflows, tested through working prototypes | X6 NFR AI workflow shaping, with P2 |
| Value engineering and presales | CFA with capital-markets and investing experience, plus a public AI economics simulator | P1 AI economics simulator |
| Partnerships and ecosystem | Integrator side (Databricks) and platform side (AWS) | P4 AIRLOCK, with X3 |
| Business building and GTM | Leads the Swiss NFR capabilities team and its DACH go-to-market | X7 NFR team and GTM, with P3 |
| Risk and resilience | NFR across RCSA, TPRM, regulatory change and DORA, with public AI agent prototypes | P2 DORA Article 12 workflow, with X6 |
| Applied AI solution design | AI workflows for regulated FS, built as public prototypes | P4 AIRLOCK |

## 3. Cross-lens matrix

**Legend:**

- **C:** core screen for the lens.
- **S:** supporting.
- **.:** rarely screened.

The last column rates how strong Thomas's evidence is, based only on the evidence summary.

| Capability | Consulting | AI deployment | Value eng. | Partnerships | GTM | Risk | Applied AI | Thomas's evidence |
|---|---|---|---|---|---|---|---|---|
| Executive stakeholder engagement | C | C | C | C | C | S | S | Strong (X3 to X7); personal scope pending |
| Problem structuring | C | C | C | S | C | C | C | Strong |
| Regulated FS domain knowledge | C | C | S | S | S | C | C | Strong |
| Non-financial risk and resilience | S | S | . | . | S | C | S | Strong (X6, P2) |
| Regulatory reporting and risk data | C | . | . | . | . | C | S | Strong (X3, X4) |
| Value and business-case modelling | S | C | C | S | C | S | S | Partial (C1, X1, X2, P1); client business cases pending |
| Discovery and workshop facilitation | C | C | C | S | S | S | S | Partial: implied by X6, not separately evidenced |
| Demos of working software | . | C | C | S | S | . | C | Prototype (P1 to P4) |
| Hands-on LLM and agent prototyping | . | C | S | S | . | C | C | Prototype, AI-assisted (P2 to P4) |
| Cloud and data platforms | S | S | S | C | . | . | C | Partial (X3 Databricks, P4 AWS) |
| AI control and governance design | S | C | S | . | . | C | C | Strong to prototype (X6, P2, P4) |
| Adoption and change management | C | C | . | . | . | S | . | Partial: implied by X5 and X6; no enablement programme evidenced |
| Team leadership and coaching | C | C | . | . | C | S | . | Strong (X7); size pending |
| Go-to-market and proposition design | . | S | S | C | C | . | . | Strong (X7) |
| Partner and alliance management | . | . | . | C | S | . | . | Not evidenced |
| Commercial ownership (quota, P&L, expansion) | . | C | C | S | C | . | . | Not evidenced |
| Quantitative and financial analysis | S | . | C | . | S | C | S | Strong (C1, X1, X2) |
| Programming and model lifecycle | . | S | . | . | . | C | C | Prototype only |
| German for DACH clients | S | C | C | S | C | S | S | Fluent (content.json) |

**Reading the matrix:**

- **Strongest lenses:** risk and resilience, and consulting and transformation. Most of their core cells carry Level A evidence.
- **Depends on prototypes:** AI deployment and applied AI design rely on Level B evidence, so they need visible honesty labels.
- **Biggest commercial gaps:** value engineering and business building, where commercial ownership is not evidenced.
- **Thinnest lens:** partnerships.

## 4. Phrases to avoid

These read as inflated, or as copied vendor marketing. Some postings use similar language. Mirroring it back makes a portfolio read as a copy.

| Avoid | Why | Use instead |
|---|---|---|
| "AI-powered", "AI-driven" | Says nothing about what the AI does | Name the task and the human step, for example "drafts control descriptions for reviewer approval" (only if true) |
| "revolutionary", "game-changing", "disruptive" | Unprovable | Describe what changed, for whom |
| "cutting-edge", "state-of-the-art", "next-generation" | Implies a comparison you cannot support | Name the technique and the date |
| "transformative", "transformational impact" | Vague | State the before and after |
| "frontier", "frontier AI" | Vendor marketing | "large language models", or the model class used |
| "world-class", "best-in-class", "industry-leading" | Self-assessment | Remove, or cite an external benchmark |
| "seamless", "effortless" | Reviewers know integration is never seamless | State the integration pattern |
| "unlock", "unleash", "supercharge" | Hype verbs | "reduce", "replace", "enable", with the object named |
| "leverage" (as a verb) | Filler | "use" |
| "end-to-end" | Usually overstates scope | List the stages actually covered |
| "enterprise-grade", "production-ready", "production-grade" | The prototypes are not production systems | "prototype", "reference implementation" |
| "autonomous", "fully automated" | Misstates designs that include human approval | "with human approval at [step]" |
| "agentic" used as praise | Becomes a buzzword | Use it only as a technical description, naming the pattern |
| "thought leader", "visionary", "passionate about" | Self-labels | Show the work |
| "proven track record", "deep expertise" | Assertion without evidence | Cite the case |
| "trusted advisor" | A judgement only clients can make | Describe the relationship factually |
| "spearheaded", "orchestrated", "drove" | Inflated verbs | "led", "designed", "built", "contributed to", matched to the actual scope |
| "10x", "dramatically", "significantly" | Numbers or intensifiers without a method | A measured figure with its source, or nothing |

### Honest-language ladders

- **Role:** contributed to, then delivered, then led a stream, then led the programme, then owned. Use the highest rung that is confirmed, never the next one up.
- **Maturity:** concept, then prototype, then pilot, then production. Every prototype case is labelled.
- **Commercial:** supported a pursuit, then shaped a proposal, then co-owned a deal, then owned a quota. Only the first two rungs are plausible from the current evidence, and both need confirmation.
