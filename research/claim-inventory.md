# Claim inventory

The public claim register is `portfolio-data/claims.json` (35 headline claims). `npm run qa:claims` fails if any displayed headline differs from its registered wording, cites unpublished evidence, or is missing from the register. Interview preparation for each claim is in the local, gitignored `CLAIM_LEDGER.md`.

## Coverage

| Group | Claims | Locator |
|---|---|---|
| Profile | title, headline, supporting line, four proof-line items, target roles, thesis, conclusion | `profile.*` |
| Lens openings | 7 | `lenses[id=...].opening` |
| Career stages | 6 | `career[id=...].capabilityAdded` |
| Case subtitles and boundaries | 12 | `cases[slug=...].subtitle`, `.scopeBoundary` |

## Changes from the previous portfolio

| Previous claim | Verdict | Now |
|---|---|---|
| "Enterprise AI Commercialisation & Value Engineering" | Qualify | "Enterprise AI Strategy, Deployment & Commercialisation" (portfolio only; CV unchanged) |
| "Financial Services to frontier AI" (brief proof line) | Remove "frontier" | "Financial Services to enterprise AI" |
| DORA control line "fully functional", "synthetic and anonymised", "no confidential information" | Partly supported; the repository names a client | Working prototype on synthetic fixtures; integrations simulated; client context excluded; not linked |
| "11-state machine", "human approval gates at every consequential step" | Partly supported | Explicit transition table with reject paths and three human gates; some routes bypass them (stated) |
| NFR platform "shared knowledge graph", "MCP", document intelligence | Partly supported or not found | 18 agents on one orchestrator; the agents do not yet query the graph (stated); MCP and document intelligence dropped |
| AIRLOCK "compliant AWS deployment", "second workload reuses the foundry" | Not supported | Local prototype with a scripted model; Terraform never applied; second workload a placeholder (stated) |
| Simulator "proposal development", "cloud vs sovereign vs on-premise" | Partly supported | Hosting as a cost shape (kept); proposal wording dropped; banking risk division only (stated) |
| Autonomous operations "Published" | Not found (empty repository) | Withheld |
| "Independently developed" (all prototypes) | Unconfirmed (employer provenance) | "Public prototype", AI-assisted, ownership awaiting confirmation |

Depth labels are attached per evidence item and per contribution; see `portfolio-data/evidence.json` and the case files.
