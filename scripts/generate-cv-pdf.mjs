/**
 * scripts/generate-cv-pdf.mjs
 * Generates assets/Thomas_Zijlstra_CV.pdf from cv.html
 * Tries playwright first, falls back to puppeteer.
 */

import { existsSync, statSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const CV_HTML = resolve(ROOT, 'cv.html');
const PDF_OUT = resolve(ROOT, 'assets', 'Thomas_Zijlstra_CV.pdf');

const PDF_META = {
  title: 'Thomas Zijlstra, CFA | CV',
  author: 'Thomas Zijlstra',
  subject: 'AI Commercialization, Enterprise AI, Financial Services',
  keywords: 'AI commercialization, enterprise AI, business builder, ecosystem, solution architecture, financial services, agentic AI, CFA',
};

// --- Local HTTP server to serve static files ----------------
function startServer(root, port) {
  const MIME = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.svg': 'image/svg+xml',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.ico': 'image/x-icon',
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

// --- Try playwright -----------------------------------------
async function tryPlaywright(url, outPath) {
  let pw;
  try {
    pw = await import('playwright');
  } catch {
    return false;
  }

  console.log('  Using playwright...');
  const browser = await pw.chromium.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });

  // Hide toolbar and action buttons; keep dark background
  await page.addStyleTag({ content: `
    .cv-toolbar { display: none !important; }
    .cv-bottom-actions { display: none !important; }
  ` });

  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '1.2cm', bottom: '1.2cm', left: '1.8cm', right: '1.8cm' },
    displayHeaderFooter: false,
  });

  await browser.close();
  return true;
}

// --- Try puppeteer ------------------------------------------
async function tryPuppeteer(url, outPath) {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
    puppeteer = puppeteer.default || puppeteer;
  } catch {
    try {
      puppeteer = await import('puppeteer-core');
      puppeteer = puppeteer.default || puppeteer;
    } catch {
      return false;
    }
  }

  console.log('  Using puppeteer...');
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Hide toolbar and action buttons; keep dark background
  await page.addStyleTag({ content: `
    .cv-toolbar { display: none !important; }
    .cv-bottom-actions { display: none !important; }
  ` });

  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '1.2cm', bottom: '1.2cm', left: '1.8cm', right: '1.8cm' },
    displayHeaderFooter: false,
  });

  await browser.close();
  return true;
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

  // Start a local server to serve the files so CSS loads correctly
  const PORT = 18080;
  const server = await startServer(ROOT, PORT);
  const cvUrl = `http://127.0.0.1:${PORT}/cv.html`;

  let success = false;
  try {
    success = await tryPlaywright(cvUrl, PDF_OUT);
    if (!success) {
      console.log('  playwright not available, trying puppeteer...');
      success = await tryPuppeteer(cvUrl, PDF_OUT);
    }
  } finally {
    server.close();
  }

  if (!success) {
    console.warn(`
  WARNING: Neither playwright nor puppeteer is installed.
  PDF could not be generated automatically.
  To generate the PDF:
    npm install playwright
    npx playwright install chromium
    npm run build:pdf
  Or open cv.html in a browser and use File > Print > Save as PDF.
  Creating a placeholder PDF...`);

    // Create a placeholder so the build doesn't fail
    const { writeFileSync } = await import('fs');
    writeFileSync(PDF_OUT, `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Resources<<>>>>endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000058 00000 n
0000000115 00000 n
trailer<</Size 4/Root 1 0 R>>
startxref
190
%%EOF`);
    console.log('  Placeholder PDF created. Replace with real PDF before publishing.');
    process.exit(0);
  }

  // Verify
  if (existsSync(PDF_OUT)) {
    const stat = statSync(PDF_OUT);
    console.log(`  PDF generated: ${(stat.size / 1024).toFixed(1)} KB`);
    if (stat.size < 10240) {
      console.warn('  WARNING: PDF is very small; check cv.html renders correctly.');
    } else {
      console.log('  PDF size check passed (>10 KB).');
    }
  } else {
    console.error('  ERROR: PDF not found after generation.');
    process.exit(1);
  }

  console.log('Done.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
