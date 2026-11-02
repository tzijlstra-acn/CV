/**
 * Writing rules for every public string (brief section 23).
 * Characters are built from code points so this file never contains them literally.
 */
const EN_DASH = String.fromCharCode(0x2013)
const EM_DASH = String.fromCharCode(0x2014)

export const DASH_PATTERN = new RegExp(`[${EN_DASH}${EM_DASH}]`)

/** Inflated or generic language that must not appear in visible copy. */
export const BANNED_PHRASES: { pattern: RegExp; reason: string }[] = [
  { pattern: /\bAI[- ]powered\b/i, reason: 'generic AI claim' },
  { pattern: /\brevolutionar(y|ise|ize)\b/i, reason: 'inflated language' },
  { pattern: /\bcutting[- ]edge\b/i, reason: 'inflated language' },
  { pattern: /\btransformative\b/i, reason: 'inflated language' },
  { pattern: /\bgame[- ]chang(er|ing)\b/i, reason: 'inflated language' },
  { pattern: /\bbest[- ]in[- ]class\b/i, reason: 'inflated language' },
  { pattern: /\bworld[- ]class\b/i, reason: 'inflated language' },
  { pattern: /\bsynerg(y|ies|istic)\b/i, reason: 'consultant filler' },
  { pattern: /\bleverag(e|ed|es|ing)\b/i, reason: 'consultant filler' },
  { pattern: /\bproduction[- ](grade|ready)\b/i, reason: 'unsupported production claim' },
  { pattern: /\bfrontier AI\b/i, reason: 'implies frontier-lab work' },
  { pattern: /\bexpert in\b/i, reason: 'self-rating' },
  { pattern: /\bguru|ninja|rockstar\b/i, reason: 'self-rating' },
]

export interface TextViolation {
  path: string
  rule: string
  excerpt: string
}

/** Checks one visible string against the dash and phrase rules. */
export function checkText(path: string, text: string): TextViolation[] {
  const out: TextViolation[] = []
  if (DASH_PATTERN.test(text)) out.push({ path, rule: 'no en or em dash', excerpt: excerpt(text, DASH_PATTERN) })
  for (const { pattern, reason } of BANNED_PHRASES) {
    if (pattern.test(text)) out.push({ path, rule: `banned phrase (${reason})`, excerpt: excerpt(text, pattern) })
  }
  return out
}

function excerpt(text: string, pattern: RegExp): string {
  const m = pattern.exec(text)
  if (!m) return text.slice(0, 80)
  const start = Math.max(0, m.index - 30)
  return text.slice(start, m.index + m[0].length + 30)
}

/** Walks any JSON-like value and yields every string with a dotted path. */
export function* walkStrings(value: unknown, path = ''): Generator<[string, string]> {
  if (typeof value === 'string') {
    yield [path, value]
  } else if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) yield* walkStrings(value[i], `${path}[${i}]`)
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) yield* walkStrings(v, path ? `${path}.${k}` : k)
  }
}

/** Visible word count, used for scene word budgets. */
export const wordCount = (text: string) => text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length
