/**
 * npm run qa:data: validates every portfolio data file, the joins with content.json, link gating,
 * writing rules, confidential terms and the claim register. Exit 1 on any issue.
 *
 *   --release   also fail while anything shown is still awaiting Thomas's confirmation. The Pages
 *               deployment runs with this flag, so nothing unconfirmed can go live.
 */
import { loadPortfolio } from '../portfolio-data/build'
import { checkClaims } from '../portfolio-data/claims'

const { result, issues } = loadPortfolio()
if (result) issues.push(...checkClaims(result))
if (result && process.argv.includes('--release')) {
  const site = result.site
  for (const e of site.evidence) if (e.status !== 'approved') issues.push({ where: `evidence.${e.id}`, message: 'awaiting confirmation (release gate)' })
  for (const c of site.cases) if (c.status !== 'approved') issues.push({ where: `cases.${c.slug}`, message: 'awaiting confirmation (release gate)' })
  for (const c of result.claims) if (c.publication !== 'approved') issues.push({ where: `claims.${c.id}`, message: 'awaiting confirmation (release gate)' })
}
if (issues.length) {
  console.error(`[qa:data] FAIL: ${issues.length} issue(s)`)
  for (const i of issues) console.error(`  - ${i.where}: ${i.message}`)
  process.exit(1)
}
const s = result!.site.stats
console.log(`[qa:data] OK: ${s.evidence} evidence items, ${s.capabilities} capabilities (${s.headlineCapabilities} headline), ${s.patterns} patterns, ${s.cases} cases, ${result!.claims.length} claims, ${result!.withheld.length} withheld`)
