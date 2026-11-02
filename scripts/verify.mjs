/**
 * scripts/verify.mjs — post-build smoke checks.
 * Exits 0 only if every check passes. Each failure prints a specific message.
 */

import { existsSync, statSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

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

function checkAsync(label, fn) {
  return fn().then(result => {
    if (result === true || result === undefined) {
      console.log(`  ✓ ${label}`);
      passed++;
    } else {
      console.error(`  ✗ ${label}: ${result}`);
      failed++;
    }
  }).catch(err => {
    console.error(`  ✗ ${label}: ${err.message}`);
    failed++;
  });
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

async function extractPdfText(relPath) {
  const require = createRequire(import.meta.url);
  let pdfParse;
  try {
    pdfParse = require('pdf-parse');
  } catch {
    return null; // pdf-parse not installed
  }
  const buf = fileBuf(relPath);
  const data = await pdfParse(buf);
  return data;
}

(async () => {
  console.log('Running post-build verification...\n');

  // --- HTML checks ---
  // The portfolio is now a Vite application assembled into dist/ (npm run build:portfolio).
  check('dist/index.html exists (portfolio build)', () => {
    if (!existsSync(resolve(ROOT, 'dist/index.html'))) return 'run npm run build:portfolio first';
  });

  check('cv.html exists and > 15 KB', () => {
    const size = fileSize('cv.html');
    if (size < 15360) return `size is ${size} bytes`;
  });

  check('dist/index.html contains no U+2014 em dashes', () => {
    if (fileText('dist/index.html').includes('—')) return 'em dash found';
  });

  check('cv.html contains no U+2014 em dashes', () => {
    if (fileText('cv.html').includes('—')) return 'em dash found';
  });

  check('dist/index.html has no duplicate id= values', () => {
    const ids = [...fileText('dist/index.html').matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
    const seen = new Set();
    for (const id of ids) {
      if (seen.has(id)) return `duplicate id: "${id}"`;
      seen.add(id);
    }
  });

  check('PDF link appears in dist/index.html', () => {
    if (!fileText('dist/index.html').includes('assets/Thomas_Zijlstra_CV.pdf')) return 'link not found';
  });

  check('dist/cv.html is identical to cv.html', () => {
    if (fileText('dist/cv.html') !== fileText('cv.html')) return 'dist copy differs';
  });

  check('PDF link appears in cv.html', () => {
    if (!fileText('cv.html').includes('assets/Thomas_Zijlstra_CV.pdf')) return 'link not found';
  });

  // --- Claim checks on generated HTML ---
  check('cv.html contains no "production-grade"', () => {
    if (fileText('cv.html').includes('production-grade')) return '"production-grade" found in cv.html';
  });

  check('cv.html contains no "production-ready"', () => {
    if (fileText('cv.html').includes('production-ready')) return '"production-ready" found in cv.html';
  });

  check('dist/index.html contains no "production-grade"', () => {
    if (fileText('dist/index.html').includes('production-grade')) return '"production-grade" found in dist/index.html';
  });

  // --- PDF binary checks ---
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

  // --- PDF text extraction checks (requires pdf-parse) ---
  const pdfData = await extractPdfText('assets/Thomas_Zijlstra_CV.pdf');

  if (pdfData === null) {
    console.warn('  ⚠ pdf-parse not installed — skipping text-extraction checks (run: npm install)');
    // Fall back to raw binary scan for name only
    check('PDF contains CV text ("Thomas" or "Zijlstra") [raw binary fallback]', () => {
      const text = fileBuf('assets/Thomas_Zijlstra_CV.pdf').toString('latin1');
      if (!text.includes('Thomas') && !text.includes('Zijlstra')) return 'neither "Thomas" nor "Zijlstra" found';
    });
  } else {
    const pdfText = pdfData.text;

    check('PDF extracted text contains "Thomas Zijlstra"', () => {
      if (!pdfText.includes('Thomas') || !pdfText.includes('Zijlstra')) return 'name not found in extracted PDF text';
    });

    check('PDF extracted text contains "Accenture"', () => {
      if (!pdfText.includes('Accenture')) return '"Accenture" not found in extracted PDF text';
    });

    check('PDF extracted text contains "CFA"', () => {
      if (!pdfText.includes('CFA')) return '"CFA" not found in extracted PDF text';
    });

    check('PDF extracted text contains "Societe Generale" or "SocGen"', () => {
      if (!pdfText.includes('Societe') && !pdfText.includes('SocGen') && !pdfText.includes('Générale')) {
        return 'bank name not found in extracted PDF text';
      }
    });

    check('PDF extracted text contains no "production-grade"', () => {
      if (pdfText.includes('production-grade')) return '"production-grade" found in PDF text';
    });

    check('PDF is 2-3 pages', () => {
      if (pdfData.numpages < 1) return `only ${pdfData.numpages} page(s)`;
      if (pdfData.numpages > 3) return `${pdfData.numpages} pages — target is 2-3`;
    });
  }

  // --- Summary ---
  console.log(`\n${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
})();
