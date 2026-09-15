/**
 * scripts/verify.mjs — post-build smoke checks.
 * Exits 0 only if every check passes. Each failure prints a specific message.
 */

import { existsSync, statSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

let passed = 0;
let failed = 0;

function check(label, fn) {
  try {
    const result = fn();
    if (result === true || result === undefined) {
      console.log(`  ✓ ${label}`);
      passed++;
    } else {
      console.error(`  ✗ ${label}: ${result}`);
      failed++;
    }
  } catch (err) {
    console.error(`  ✗ ${label}: ${err.message}`);
    failed++;
  }
}

function fileSize(relPath) {
  const abs = resolve(ROOT, relPath);
  if (!existsSync(abs)) throw new Error(`${relPath} not found`);
  return statSync(abs).size;
}

function fileText(relPath) {
  return readFileSync(resolve(ROOT, relPath), 'utf8');
}

function fileBuf(relPath) {
  return readFileSync(resolve(ROOT, relPath));
}

console.log('Running post-build verification...\n');

// --- HTML checks ---
check('index.html exists and > 60 KB', () => {
  const size = fileSize('index.html');
  if (size < 61440) return `size is ${size} bytes`;
});

check('cv.html exists and > 15 KB', () => {
  const size = fileSize('cv.html');
  if (size < 15360) return `size is ${size} bytes`;
});

check('index.html contains no U+2014 em dashes', () => {
  if (fileText('index.html').includes('—')) return 'em dash found';
});

check('cv.html contains no U+2014 em dashes', () => {
  if (fileText('cv.html').includes('—')) return 'em dash found';
});

check('index.html has no duplicate id= values', () => {
  const ids = [...fileText('index.html').matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  const seen = new Set();
  for (const id of ids) {
    if (seen.has(id)) return `duplicate id: "${id}"`;
    seen.add(id);
  }
});

check('PDF link appears in index.html', () => {
  if (!fileText('index.html').includes('assets/Thomas_Zijlstra_CV.pdf')) return 'link not found';
});

check('PDF link appears in cv.html', () => {
  if (!fileText('cv.html').includes('assets/Thomas_Zijlstra_CV.pdf')) return 'link not found';
});

// --- PDF checks ---
check('assets/Thomas_Zijlstra_CV.pdf exists', () => {
  if (!existsSync(resolve(ROOT, 'assets/Thomas_Zijlstra_CV.pdf'))) return 'file not found';
});

check('PDF starts with %PDF signature', () => {
  const buf = fileBuf('assets/Thomas_Zijlstra_CV.pdf');
  const sig = buf.slice(0, 4).toString('ascii');
  if (sig !== '%PDF') return `got "${sig}"`;
});

check('PDF size > 50 KB', () => {
  const size = fileSize('assets/Thomas_Zijlstra_CV.pdf');
  if (size < 50000) return `size is ${size} bytes`;
});

check('PDF contains CV text ("Thomas" or "Zijlstra")', () => {
  const text = fileBuf('assets/Thomas_Zijlstra_CV.pdf').toString('latin1');
  if (!text.includes('Thomas') && !text.includes('Zijlstra')) return 'neither "Thomas" nor "Zijlstra" found';
});

// --- Summary ---
console.log(`\n${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
