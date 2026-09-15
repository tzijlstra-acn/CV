/**
 * scripts/generate-cv-pdf.mjs
 * Generates assets/Thomas_Zijlstra_CV.pdf from cv.html via Playwright.
 *
 * Atomic: writes to a .tmp file, validates it, then renames to final path.
 * If validation fails the original PDF is untouched and the script exits 1.
 * No placeholder fallback — if Playwright is unavailable, the script exits
 * non-zero with a clear message so the last good committed PDF is preserved.
 */

import { existsSync, statSync, readFileSync, renameSync, unlinkSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CV_HTML = resolve(ROOT, 'cv.html');
const PDF_OUT = resolve(ROOT, 'assets', 'Thomas_Zijlstra_CV.pdf');
const PDF_TMP = PDF_OUT + '.tmp';

// --- Local HTTP server --------------------------------------
function startServer(root, port) {
  const MIME = {
    '.html': 'text/html',
    '.css':  'text/css',
    '.js':   'application/javascript',
    '.svg':  'image/svg+xml',
    '.json': 'application/json',
    '.pdf':  'application/pdf',
    '.png':  'image/png',
    '.ico':  'image/x-icon',
  };

  const server = createServer((req, res) => {
    let url = req.url === '/' ? '/cv.html' : req.url;
    url = url.split('?')[0];
    const filePath = resolve(root, '.' + url);
    const ext = extname(filePath);
    const mime = MIME[ext] || 'application/octet-stream';
    try {
      const data = readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': mime });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve_) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`  Server listening on http://127.0.0.1:${port}`);
      resolve_(server);
    });
  });
}

// --- Validate the generated PDF -----------------------------
function validatePdf(path) {
  const errors = [];

  if (!existsSync(path)) {
    errors.push('File does not exist after generation');
    return errors;
  }

  const stat = statSync(path);
  if (stat.size < 50000) {
    errors.push(`PDF too small: ${stat.size} bytes (expected > 50 000)`);
  }

  const buf = readFileSync(path);
  const header = buf.slice(0, 4).toString('ascii');
  if (header !== '%PDF') {
    errors.push(`Missing PDF signature (got: ${JSON.stringify(header)})`);
  }

  const text = buf.toString('latin1');
  if (!text.includes('Thomas') && !text.includes('Zijlstra')) {
    errors.push('PDF content does not appear to contain CV text (neither "Thomas" nor "Zijlstra" found)');
  }

  return errors;
}

// --- Generate via Playwright --------------------------------
async function generateWithPlaywright(url) {
  let pw;
  try {
    pw = await import('playwright');
  } catch {
    console.error(`
  ERROR: Playwright is not installed.
  The PDF cannot be generated automatically.
  To install: npm install playwright && npx playwright install chromium
  The last committed PDF at assets/Thomas_Zijlstra_CV.pdf is untouched.`);
    process.exit(1);
  }

  console.log('  Using Playwright (Chromium)...');
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.waitForFunction(() => document.fonts.ready);

  await page.pdf({
    path: PDF_TMP,
    format: 'A4',
    printBackground: false,
    preferCSSPageSize: true,
    displayHeaderFooter: false,
  });

  await browser.close();
}

// --- Main ---------------------------------------------------
async function main() {
  if (!existsSync(CV_HTML)) {
    console.error('  ERROR: cv.html not found. Run npm run build:html first.');
    process.exit(1);
  }

  console.log('Generating PDF...');
  console.log(`  Input:  ${CV_HTML}`);
  console.log(`  Output: ${PDF_OUT}`);

  const PORT = 18080;
  const server = await startServer(ROOT, PORT);
  const cvUrl = `http://127.0.0.1:${PORT}/cv.html`;

  try {
    await generateWithPlaywright(cvUrl);
  } finally {
    server.close();
  }

  console.log('  Validating PDF...');
  const errors = validatePdf(PDF_TMP);

  if (errors.length > 0) {
    try { unlinkSync(PDF_TMP); } catch { /* ignore */ }
    console.error('  PDF validation failed:');
    for (const e of errors) console.error(`    - ${e}`);
    console.error('  The original PDF at assets/Thomas_Zijlstra_CV.pdf is untouched.');
    process.exit(1);
  }

  renameSync(PDF_TMP, PDF_OUT);

  const stat = statSync(PDF_OUT);
  console.log(`  PDF validated and written: ${(stat.size / 1024).toFixed(1)} KB`);
  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
