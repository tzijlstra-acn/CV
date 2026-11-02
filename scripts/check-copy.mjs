/**
 * check-copy.mjs — lint user-visible strings for U+2014 em dashes.
 *
 * Checks source files and generated HTML. Skips pure comment lines and
 * CSS comment blocks. Exits 1 if any match is found, 0 if clean.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const SOURCE_FILES = [
  'content.json',
  'scripts/build.mjs',
  'scripts/generate-cv-pdf.mjs',
  'script.js',
  'styles.css',
];

const GENERATED_FILES = [
  'cv.html',
  'dist/index.html',
];

const EM_DASH = '—';

function checkFile(relPath) {
  const absPath = resolve(root, relPath);
  if (!existsSync(absPath)) {
    console.warn(`  SKIP  ${relPath} (not found)`);
    return [];
  }

  const lines = readFileSync(absPath, 'utf8').split('\n');
  const findings = [];
  let inBlockComment = false;

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];

    // Track CSS/JS block comments
    if (raw.includes('/*')) inBlockComment = true;
    if (raw.includes('*/')) { inBlockComment = false; continue; }
    if (inBlockComment) continue;

    // Skip pure line comments (JS // and HTML <!--)
    const trimmed = raw.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('<!--')) continue;

    if (raw.includes(EM_DASH)) {
      findings.push({ line: i + 1, text: raw.trimEnd() });
    }
  }

  return findings;
}

let totalFindings = 0;

for (const relPath of [...SOURCE_FILES, ...GENERATED_FILES]) {
  const findings = checkFile(relPath);
  if (findings.length > 0) {
    console.error(`\n${relPath}:`);
    for (const { line, text } of findings) {
      console.error(`  line ${line}: ${text}`);
      totalFindings++;
    }
  }
}

if (totalFindings === 0) {
  console.log('check:copy — no em dashes found in source or generated files.');
  process.exit(0);
} else {
  console.error(`\ncheck:copy — ${totalFindings} em dash(es) found. Fix before building.`);
  process.exit(1);
}
