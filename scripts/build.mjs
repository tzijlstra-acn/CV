/**
 * scripts/build.mjs
 * Reads content.json and generates cv.html (the web CV, also the source of the PDF).
 * The portfolio at / is a separate Vite application (portfolio-app/); see README.md.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function read(file) {
  return readFileSync(resolve(ROOT, file), 'utf8');
}

function write(file, content) {
  const p = resolve(ROOT, file);
  writeFileSync(p, content, 'utf8');
  console.log(`  ✓ ${file}`);
}

const d = JSON.parse(read('content.json'));

// --- Helpers -----------------------------------------------

function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// --- Company badges and location flags ---------------------

function flagImg(code, w = 20, h = 15) {
  return `<img src="assets/flags/${code}.svg" alt="" class="loc-flag" aria-hidden="true" width="${w}" height="${h}">`;
}

function companyBadge(company) {
  const badges = {
    'Accenture':           `<span class="co-badge co-badge--acn" title="Accenture" aria-hidden="true">&#62;</span>`,
    'Single Family Office': `<span class="co-badge co-badge--sfo" title="Single Family Office" aria-hidden="true">&#9679;</span>`,
    'Société Générale':    `<span class="co-badge co-badge--sg" title="Société Générale" aria-hidden="true">&#9632;</span>`,
    'Catalina':            `<span class="co-badge co-badge--cat" title="Catalina" aria-hidden="true">&#9679;</span>`,
  };
  return badges[company] || '';
}

function locationFlag(location) {
  const codes = { 'Zurich': 'ch', 'London': 'gb', 'Paris': 'fr' };
  const code = codes[location];
  if (!code) return esc(location);
  return `${flagImg(code)} ${esc(location)}`;
}

// --- Shared company-badge styles (used by both pages) ----

const COMPANY_BADGE_CSS = `
/* --- Company badges & location flags (shared) ---------- */
.co-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 0.7rem;
  font-weight: 900;
  vertical-align: middle;
  margin-right: 0.3rem;
  flex-shrink: 0;
  line-height: 1;
}
.co-badge--acn { color: #A100FF; font-size: 1rem; width: auto; }
.co-badge--sfo { color: #8b949e; }
.co-badge--sg  { color: #e60028; }
.co-badge--cat { color: #79c0ff; }
img.loc-flag {
  display: inline-block;
  width: 20px;
  height: 15px;
  max-width: none;
  object-fit: cover;
  vertical-align: middle;
  margin-right: 0.3rem;
  border-radius: 2px;
}
.hero-footprint { margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.55rem; }
.fp-row { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.fp-label { font-size: 0.6rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6e7681; min-width: 9.5rem; flex-shrink: 0; }
.fp-cities { display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; font-size: 0.8rem; color: #8b949e; }
.fp-item { display: inline-flex; align-items: center; gap: 0.3rem; }
.fp-period { font-size: 0.72rem; opacity: 0.7; }
.fp-dot { opacity: 0.35; }
.fp-flags { display: flex; align-items: center; gap: 0.1rem; flex-wrap: wrap; }
.fp-group { display: inline-flex; align-items: center; gap: 0.1rem; }
.fp-sep { opacity: 0.2; margin: 0 0.4rem; font-size: 0.9rem; }
`;

// --- CV HTML -------------------------------------------

function buildCvHtml() {
  const p = d.personal;
  const cv = d.cv;

  const expHtml = d.experience.map(job => `
    <div class="cv-exp-item">
      <div class="cv-exp-header">
        <span class="cv-exp-company">${companyBadge(job.company)}${esc(job.company)}${job.location ? `, ${locationFlag(job.location)}` : ''}</span>
        <span class="cv-exp-dates">${esc(job.start)} – ${esc(job.end)}</span>
      </div>
      <div class="cv-exp-role">${esc(job.role)}${job.coverage ? ` | ${esc(job.coverage)}` : ''}</div>
      <ul class="cv-exp-items">
        ${job.items.map(item => `<li>${esc(item)}</li>`).join('')}
      </ul>
    </div>`).join('');

  const projHtml = d.projects.filter(p => p.featured).slice(0, 3).map(proj => `
    <div class="cv-proj-item">
      <div class="cv-proj-title">${esc(proj.title)}${proj.caseUrl ? ` <span class="cv-proj-link">| <a href="${esc(proj.caseUrl)}" target="_blank" rel="noopener noreferrer">Case study</a></span>` : ''}</div>
      <div class="cv-proj-meta">${esc(proj.evidenceType)}</div>
      <ul class="cv-proj-items">
        <li>${esc(proj.summary)}</li>
        <li>Commercial relevance: ${esc(proj.commercial)}</li>
        <li>${esc(proj.scopeBoundary)}</li>
      </ul>
    </div>`).join('');

  const eduHtml = d.education.map(edu => `
    <div class="cv-edu-item">
      <div class="cv-edu-header">
        <span class="cv-edu-credential">${esc(edu.credential)}</span>
        <span class="cv-edu-dates">${edu.year ? esc(edu.year) : (edu.start && edu.end ? `${esc(edu.start)} – ${esc(edu.end)}` : '')}</span>
      </div>
      <div class="cv-edu-institution">${esc(edu.institution)}</div>
      ${edu.distinction || edu.gpa ? `<div class="cv-edu-detail">${[edu.distinction, edu.gpa].filter(Boolean).map(esc).join(' · ')}</div>` : ''}
      ${edu.thesis ? `<div class="cv-edu-detail" style="font-style:italic;">Thesis: "${esc(edu.thesis)}"</div>` : ''}
    </div>`).join('');

  const capsHtml = d.capabilities.map(cat => `
    <div class="cv-cap-row">
      <span class="cv-cap-category">${esc(cat.category)}</span>
      <span class="cv-cap-items">${cat.items.map(esc).join(' · ')}</span>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CV for ${esc(d.personal.name)} | ${esc(d.personal.title)}">
  <meta name="author" content="${esc(d.personal.name)}">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <title>${esc(d.personal.name)} | CV</title>
  <style>
/* CV PAGE: Light executive document.
   Inline :root intentionally overrides external .dark tokens;
   cv.html is always rendered light for print consistency. */
:root {
  --bg:        #ffffff;
  --bg-alt:    #f2ede7;
  --surface:   #f8f6f3;
  --border:    #d4cdc4;
  --text:      #1a1a18;
  --text-muted:#5a5450;
  --accent:    #7a4d1e;
  --secondary: #4a6fa5;
}

body.cv-page { background: var(--bg-alt); }
.cv-document {
  background: #fff;
  max-width: 860px;
  margin: 0 auto;
  padding: 2rem 2.5rem;
  box-shadow: 0 0 0 1px var(--border);
}

/* Company badges */
${COMPANY_BADGE_CSS}

@media print {
  @page { size: A4; margin: 1.5cm 1.8cm; }
  body.cv-page { background: #fff; }
  .cv-document { box-shadow: none; padding: 0; max-width: none; }
  .cv-toolbar, .cv-bottom-actions { display: none !important; }
  body { font-size: 0.8125rem; orphans: 3; widows: 3; }
  .cv-section      { break-inside: auto; page-break-inside: auto; }
  .cv-section-title { break-after: avoid; page-break-after: avoid; color: #7a4d1e !important; border-bottom-color: #7a4d1e !important; }
  .cv-header       { break-inside: avoid; page-break-inside: avoid; }
  .cv-exp-item     { break-inside: auto; page-break-inside: auto; }
  .cv-edu-item     { break-inside: avoid; page-break-inside: avoid; }
  .cv-proj-item    { break-inside: avoid; page-break-inside: avoid; }
  a { color: #1a3a6e !important; text-decoration: underline; }
}
  </style>
</head>
<body class="cv-page">

<div class="cv-toolbar">
  <h1>${esc(d.personal.name)} | CV</h1>
  <a href="assets/Thomas_Zijlstra_CV.pdf" class="btn-primary" download>&#8595; Download PDF</a>
  <button class="btn-secondary" onclick="window.print()" type="button">Print / Save as PDF</button>
  <a href="index.html" class="btn-ghost">&larr; Back to portfolio</a>
</div>

<main id="main" class="cv-document">

  <div class="cv-header">
    <div class="cv-header-photo">
      <img src="${esc(d.personal.photo)}" alt="Portrait of ${esc(d.personal.name)}" class="cv-photo">
    </div>
    <div class="cv-header-text">
      <h1 class="cv-name">${esc(d.personal.name)}</h1>
      <p class="cv-title">${esc(d.personal.title)}</p>
      <div class="cv-contact">
        <span>${esc(d.personal.location)}</span>
        <span class="cv-sep">·</span>
        <a href="tel:${esc(d.personal.phone)}">${esc(d.personal.phone)}</a>
        <span class="cv-sep">·</span>
        <a href="mailto:${esc(d.personal.email)}">${esc(d.personal.email)}</a>
        <span class="cv-sep">·</span>
        <a href="${esc(d.personal.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
        <span class="cv-sep">·</span>
        <a href="${esc(d.personal.portfolio)}" target="_blank" rel="noopener noreferrer">Portfolio</a>
      </div>
      <div class="cv-contact cv-contact-meta">
        <span>Work permit: ${esc(d.personal.workPermit)}</span>
        <span class="cv-sep">·</span>
        <span>${d.personal.languages.map(l => `${esc(l.name)} (${esc(l.level)})`).join(' · ')}</span>
      </div>
      <div class="cv-contact cv-contact-intl">
        ${(p.internationalExperience || []).map((loc, i) =>
          (i > 0 ? '<span class="cv-sep">·</span>' : '') +
          `${flagImg(loc.code)} <span>${esc(loc.city)} (${esc(loc.period)})</span>`
        ).join('')}
      </div>
    </div>
  </div>

  <div class="cv-section">
    <div class="cv-section-title">Professional Summary</div>
    <p class="cv-summary">${esc(cv.summary)}</p>
  </div>

  <div class="cv-section">
    <div class="cv-section-title">Experience</div>
    ${expHtml}
  </div>

  <div class="cv-section">
    <div class="cv-section-title">Selected Projects</div>
    ${projHtml}
  </div>

  <div class="cv-section">
    <div class="cv-section-title">Education &amp; Credentials</div>
    ${eduHtml}
  </div>

  <div class="cv-section">
    <div class="cv-section-title">Capabilities</div>
    <div class="cv-caps-grid">
      ${capsHtml}
    </div>
  </div>

  <div class="cv-bottom-actions">
    <a href="assets/Thomas_Zijlstra_CV.pdf" class="btn-primary" download>&#8595; Download PDF</a>
    <button class="btn-secondary" onclick="window.print()" type="button">Print / Save as PDF</button>
    <a href="index.html" class="btn-ghost">&larr; Back to portfolio</a>
  </div>

</main>

<script src="script.js"></script>
</body>
</html>`;
}

// --- Run ---------------------------------------------------

console.log('Building HTML files...');
write('cv.html', buildCvHtml());
console.log('Done.');
