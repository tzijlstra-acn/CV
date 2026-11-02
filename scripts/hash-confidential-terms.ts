/**
 * npm run qa:hash-terms: regenerates qa/confidential-term-hashes.json from the private,
 * gitignored list in private/confidential-terms.local.txt. Only salted hashes are committed.
 */
import fs from 'node:fs'
import path from 'node:path'
import { HASH_FILE, LOCAL_TERMS_FILE, hashTerm, loadLocalTerms, type HashFile } from '../portfolio-data/lib/confidential'

const terms = loadLocalTerms()
if (!terms.length) {
  console.error(`[qa:hash-terms] no terms found in ${path.relative(process.cwd(), LOCAL_TERMS_FILE)}; nothing written`)
  process.exit(1)
}
const existing: string[] = fs.existsSync(HASH_FILE) ? (JSON.parse(fs.readFileSync(HASH_FILE, 'utf8')) as HashFile).hashes : []
const hashes = [...new Set([...existing, ...terms.map(hashTerm)])].sort()
const out: HashFile = {
  $comment: 'Salted SHA-256 hashes of confidential client and internal names. Plain terms are never committed. Regenerate with npm run qa:hash-terms.',
  version: 1,
  count: hashes.length,
  hashes,
}
fs.mkdirSync(path.dirname(HASH_FILE), { recursive: true })
fs.writeFileSync(HASH_FILE, JSON.stringify(out, null, 2) + '\n')
console.log(`[qa:hash-terms] ${hashes.length} hashes written (${hashes.length - existing.length} new)`)
