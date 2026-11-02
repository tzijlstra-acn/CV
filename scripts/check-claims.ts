/**
 * npm run qa:claims: the public claim register must match the site word for word, cite published
 * evidence, cover every headline string, and (locally) every claim needs a CLAIM_LEDGER.md entry.
 */
import { loadPortfolio } from '../portfolio-data/build'
import { checkClaims, checkLedger, LEDGER_FILE } from '../portfolio-data/claims'
import fs from 'node:fs'

const { result, issues } = loadPortfolio()
if (!result) {
  console.error('[qa:claims] data does not validate; run npm run qa:data')
  for (const i of issues) console.error(`  - ${i.where}: ${i.message}`)
  process.exit(1)
}
const found = [...checkClaims(result), ...checkLedger(result.claims)]
if (found.length) {
  console.error(`[qa:claims] FAIL: ${found.length} issue(s)`)
  for (const i of found) console.error(`  - ${i.where}: ${i.message}`)
  process.exit(1)
}
const pending = result.claims.filter((c) => c.publication === 'needs-confirmation').length
console.log(`[qa:claims] OK: ${result.claims.length} claims match the site (${pending} awaiting Thomas's confirmation). Ledger: ${fs.existsSync(LEDGER_FILE) ? 'checked' : 'not present locally, skipped'}`)
