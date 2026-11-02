/**
 * Claim register checks (brief section 21). Every headline claim is pinned to its exact public
 * wording, its evidence and a depth label. Changing visible wording without updating the
 * register fails `npm run qa:claims`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { ROOT, resolveLocator, type Issue, type LoadedPortfolio } from './build'

export const LEDGER_FILE = path.join(ROOT, 'CLAIM_LEDGER.md')

export function checkClaims({ site, claims }: Pick<LoadedPortfolio, 'site' | 'claims'>): Issue[] {
  const issues: Issue[] = []
  const evidence = new Set(site.evidence.map((e) => e.id))
  for (const c of claims) {
    const where = `claims.${c.id}`
    const value = resolveLocator(site, c.locator)
    if (typeof value !== 'string') issues.push({ where, message: `locator "${c.locator}" does not resolve to public text` })
    else if (value !== c.wording) issues.push({ where, message: `wording drifted. Register: "${c.wording}" Site: "${value}"` })
    for (const e of c.evidence) if (!evidence.has(e)) issues.push({ where, message: `evidence "${e}" is not published` })
    if (c.decision === 'remove') issues.push({ where, message: 'claim marked "remove" is still displayed' })
  }
  // Every headline string must be in the register.
  const required = [
    'profile.title',
    'profile.headline',
    'profile.supporting',
    'profile.targetRoles',
    'profile.thesis',
    'profile.conclusion',
    ...site.profile.proofLine.map((_, i) => `profile.proofLine[${i}]`),
    ...site.lenses.map((l) => `lenses[id=${l.id}].opening`),
    ...site.career.map((s) => `career[id=${s.id}].capabilityAdded`),
    ...site.cases.flatMap((c) => [`cases[slug=${c.slug}].subtitle`, `cases[slug=${c.slug}].scopeBoundary`]),
  ]
  const covered = new Set(claims.map((c) => c.locator))
  for (const r of required) if (!covered.has(r)) issues.push({ where: 'claims', message: `headline claim "${r}" is not in the register` })
  return issues
}

/** The internal ledger (gitignored) must mention every registered claim id when it exists locally. */
export function checkLedger(claims: LoadedPortfolio['claims']): Issue[] {
  if (!fs.existsSync(LEDGER_FILE)) return []
  const text = fs.readFileSync(LEDGER_FILE, 'utf8')
  return claims.filter((c) => !text.includes(`\`${c.id}\``)).map((c) => ({ where: 'CLAIM_LEDGER.md', message: `claim \`${c.id}\` has no ledger entry` }))
}
