/**
 * Confidential-term scanner (brief section 4).
 *
 * Client and internal names must never appear in this public repository, not even in a denylist.
 * The repository therefore stores only salted SHA-256 hashes of the normalised terms in
 * qa/confidential-term-hashes.json. Plain terms live in private/confidential-terms.local.txt,
 * which is gitignored; `npm run qa:hash-terms` regenerates the hash file from it.
 *
 * Text is normalised (lower case, accents removed, punctuation to spaces) and every 1 to 4 word
 * window is hashed and compared, so "the ACME-Bank team" matches the term "acme bank" while
 * "subscribe" never matches a three-letter term.
 */
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

export const ROOT = path.resolve(import.meta.dirname, '..', '..')
export const HASH_FILE = path.join(ROOT, 'qa', 'confidential-term-hashes.json')
export const LOCAL_TERMS_FILE = path.join(ROOT, 'private', 'confidential-terms.local.txt')
const SALT = 'tz-portfolio-confidential-v1:'
const MAX_WORDS = 4
/** Unicode combining diacritical marks (U+0300 to U+036F), built from code points. */
const COMBINING_MARKS = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36f) + ']', 'g')

export function normalise(text: string): string {
  return text
    .normalize('NFKD')
    .replace(COMBINING_MARKS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export const hashTerm = (term: string) => createHash('sha256').update(SALT + normalise(term)).digest('hex')

export interface HashFile {
  $comment: string
  version: 1
  count: number
  hashes: string[]
}

export function loadLocalTerms(): string[] {
  if (!fs.existsSync(LOCAL_TERMS_FILE)) return []
  return fs
    .readFileSync(LOCAL_TERMS_FILE, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
}

export function loadHashes(): Set<string> {
  const set = new Set<string>()
  if (fs.existsSync(HASH_FILE)) for (const h of (JSON.parse(fs.readFileSync(HASH_FILE, 'utf8')) as HashFile).hashes) set.add(h)
  for (const t of loadLocalTerms()) set.add(hashTerm(t))
  return set
}

export interface ConfidentialHit {
  hash: string
  /** Only available when the private term list is present locally. */
  term?: string
  window: number
}

export function scanConfidential(text: string, hashes: Set<string>, localTerms: string[] = []): ConfidentialHit[] {
  if (!hashes.size) return []
  const byHash = new Map(localTerms.map((t) => [hashTerm(t), t]))
  const words = normalise(text).split(' ').filter(Boolean)
  const hits: ConfidentialHit[] = []
  for (let i = 0; i < words.length; i++) {
    for (let n = 1; n <= MAX_WORDS && i + n <= words.length; n++) {
      const h = createHash('sha256').update(SALT + words.slice(i, i + n).join(' ')).digest('hex')
      if (hashes.has(h)) hits.push({ hash: h, term: byHash.get(h), window: i })
    }
  }
  return hits
}
