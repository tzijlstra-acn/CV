/**
 * scripts/build.mjs
 * Reads content.json and generates index.html + cv.html
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

function chips(arr) {
  return arr.map(c => `<span class="chip">${esc(c)}</span>`).join('');
}

function tags(arr) {
  return arr.map(t => `<span class="tag">${esc(t)}</span>`).join('');
}

function techTags(arr) {
  return arr.map(t => `<span class="tech-tag">${esc(t)}</span>`).join('');
}

// --- COMPONENTS --------------------------------------------

function buildNav() {
  const links = [
    ['#evidence','Evidence'],
    ['#thesis','Thesis'],
    ['#projects','Work'],
    ['#delivery','Enterprise Delivery'],
    ['#commercialization','Commercialization'],
    ['#experience','Experience'],
    ['cv.html','CV'],
    ['#contact','Contact'],
  ];
  return `
<a class="skip-link" href="#main">Skip to content</a>

<div id="moonshot-banner" class="moonshot-banner" hidden>
  <span>Application focus: Business Builder &amp; Ecosystem</span>
</div>

<nav class="site-nav" aria-label="Main navigation">
  <div class="container nav-inner">
    <a href="/" class="nav-logo" aria-label="${esc(d.personal.name)} — home">
      <img src="${esc(d.personal.photo)}" alt="" class="nav-photo" aria-hidden="true">
      <span>${esc(d.personal.nameShort)}</span>
    </a>

    <ul class="nav-links" role="list">
      ${links.map(([href, label]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`).join('\n      ')}
    </ul>

    <div class="nav-controls">
      <button id="view-toggle" class="view-toggle btn-icon" aria-label="Switch to technical view" type="button">TECH VIEW</button>
      <button id="theme-toggle" class="btn-icon" aria-label="Switch to dark mode" type="button">☾</button>
      <button
        id="hamburger"
        class="hamburger"
        aria-controls="nav-mobile-menu"
        aria-expanded="false"
        aria-label="Open navigation menu"
        type="button"
      >
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>

  <div id="nav-mobile-menu" class="nav-mobile-menu" role="region" aria-label="Mobile navigation">
    <ul role="list">
      ${links.map(([href, label]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`).join('\n      ')}
    </ul>
  </div>
</nav>`;
}

function buildHero() {
  const h = d.hero;
  return `
<section id="hero" aria-labelledby="hero-heading">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-content">
        <p class="hero-eyebrow">${esc(d.personal.title)}</p>

        <!-- Hidden moonshot overrides (used by JS) -->
        <span id="moonshot-headline" hidden>${esc(d.moonshot.headline)}</span>
        <span id="moonshot-sub" hidden>${esc(d.moonshot.sub)}</span>

        <h1 id="hero-heading" class="hero-headline" id="hero-headline">${esc(h.headline)}</h1>
        <p class="hero-sub" id="hero-sub">${esc(h.sub)}</p>
        <div class="hero-process" aria-label="Process overview">${esc(h.processLine)}</div>

        <div class="hero-ctas" role="group" aria-label="Primary actions">
          <a href="${esc(h.ctas.primary.href)}" class="btn-primary">${esc(h.ctas.primary.label)}</a>
          <a href="${esc(h.ctas.secondary.href)}" class="btn-secondary" download>&#8595; ${esc(h.ctas.secondary.label)}</a>
          ${h.ctas.tertiary.map(cta => {
            const ext = cta.external ? ' target="_blank" rel="noopener noreferrer"' : '';
            return `<a href="${esc(cta.href)}" class="btn-ghost"${ext}>${esc(cta.label)}</a>`;
          }).join('\n          ')}
        </div>

        <div class="hero-chips" aria-label="Context">${chips(h.chips)}</div>

        <div id="moonshot-statement" class="moonshot-statement" hidden>
          <strong>${esc(d.moonshot.statement)}</strong>
        </div>
      </div>
      <div class="hero-photo-wrap">
        <img src="${esc(d.personal.photo)}" alt="Portrait of ${esc(d.personal.name)}" class="hero-photo" loading="eager">
      </div>
    </div>
  </div>
</section>`;
}

function buildEvidence() {
  return `
<section id="evidence" aria-labelledby="evidence-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Evidence</span>
      <h2 id="evidence-heading">Evidence in 60 seconds</h2>
    </div>

    <div class="evidence-grid">
      ${d.evidence.map((card, i) => `
      <div class="evidence-card reveal">
        <span class="evidence-num" aria-hidden="true">0${i + 1}</span>
        <h3>${esc(card.title)}</h3>
        <p>${esc(card.body)}</p>
      </div>`).join('')}
    </div>

    <p class="evidence-footnote">${esc(d.evidenceLabel)}</p>
  </div>
</section>`;
}

function buildThesis() {
  const t = d.thesis;
  return `
<section id="thesis" aria-labelledby="thesis-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Operator Thesis</span>
      <h2 id="thesis-heading">${esc(t.title)}</h2>
    </div>

    <div class="thesis-stages" role="list">
      ${t.stages.map((s, i) => `
      <div class="thesis-stage" role="listitem">
        <button
          class="thesis-stage-header"
          aria-expanded="false"
          aria-controls="thesis-body-${i}"
          type="button"
        >
          <span class="stage-number" aria-hidden="true">${s.number}</span>
          <span class="stage-title">${esc(s.title)}</span>
          <span class="stage-question">"${esc(s.question)}"</span>
          <span class="stage-arrow" aria-hidden="true">&#8964;</span>
        </button>
        <div class="thesis-stage-body" id="thesis-body-${i}" hidden>
          <div class="stage-details">
            <div class="stage-detail-item">
              <h5>Key question</h5>
              <p>${esc(s.question)}</p>
            </div>
            <div class="stage-detail-item">
              <h5>Working method</h5>
              <p>${esc(s.method)}</p>
            </div>
            <div class="stage-detail-item">
              <h5>Output</h5>
              <p>${esc(s.output)}</p>
            </div>
            <div class="stage-detail-item">
              <h5>Relevant example</h5>
              <p>${esc(s.example)}</p>
            </div>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

function buildProjects() {
  const allTags = [...new Set(d.projects.flatMap(p => p.tags))].sort();
  return `
<section id="projects" aria-labelledby="projects-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Selected Public Work</span>
      <h2 id="projects-heading">Public builds — working implementations, not slide concepts</h2>
      <p>Every project uses synthetic, mock, anonymized, or illustrative data.</p>
    </div>

    <div class="filter-tabs" role="tablist" aria-label="Filter projects by tag">
      <button class="filter-tab active" data-filter="all" role="tab" aria-selected="true" type="button">All</button>
      ${allTags.map(tag => `<button class="filter-tab" data-filter="${esc(tag)}" role="tab" aria-selected="false" type="button">${esc(tag)}</button>`).join('')}
    </div>

    <div class="projects-grid">
      ${d.projects.map(p => `
      <article
        class="project-card reveal"
        data-tags="${esc(p.tags.join(', '))}"
        aria-labelledby="proj-title-${p.id}"
      >
        <div class="project-card-header">
          <h3 id="proj-title-${p.id}">${esc(p.title)}</h3>
          <span class="badge badge-status">${esc(p.status)}</span>
        </div>

        <div class="project-tags">${tags(p.tags)}</div>

        <div class="badge badge-type">${esc(p.evidenceType)}</div>

        <p class="project-problem"><em>Problem:</em> ${esc(p.problem)}</p>

        <p class="project-summary">${esc(p.summary)}</p>

        <div class="project-diagram" aria-label="Architecture flow">
          ${esc(p.diagram)}
        </div>

        <div class="technical-only">
          <div class="tech-tags">${techTags(p.tech)}</div>
        </div>

        <p class="project-limitations">&#9432; ${esc(p.limitations)}</p>

        <div class="project-card-footer">
          <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
            <a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer" class="btn-ghost">GitHub &rarr;</a>
            <button class="btn-secondary" data-dialog-open="proj-${p.id}" type="button">Case study &rarr;</button>
          </div>
        </div>
      </article>`).join('')}
    </div>
  </div>
</section>

<!-- Project dialogs -->
${d.projects.map(p => `
<div id="proj-${p.id}-backdrop" class="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="dialog-title-${p.id}" aria-hidden="true">
  <div class="dialog">
    <div class="dialog-header">
      <h2 id="dialog-title-${p.id}">${esc(p.title)}</h2>
      <button class="dialog-close" data-dialog-close aria-label="Close dialog" type="button">&times;</button>
    </div>
    <div class="dialog-body">
      <div>
        <h3>Evidence type</h3>
        <p>${esc(p.evidenceType)}</p>
      </div>
      <div>
        <h3>Problem</h3>
        <p>${esc(p.problem)}</p>
      </div>
      <div>
        <h3>Summary</h3>
        <p>${esc(p.summary)}</p>
      </div>
      <div>
        <h3>Architecture</h3>
        <p style="font-family:monospace;font-size:0.875rem;color:var(--secondary)">${esc(p.diagram)}</p>
      </div>
      <div>
        <h3>Commercial relevance</h3>
        <p>${esc(p.commercial)}</p>
      </div>
      <div>
        <h3>Case study</h3>
        <p>${esc(p.caseStudy)}</p>
      </div>
      <div>
        <h3>Technology</h3>
        <p>${p.tech.map(t => esc(t)).join(' · ')}</p>
      </div>
      <div class="dialog-notice">${esc(p.limitations)}</div>
      <div>
        <a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer" class="btn-primary">View on GitHub &rarr;</a>
      </div>
    </div>
  </div>
</div>`).join('')}`;
}

function buildDelivery() {
  const del = d.delivery;
  return `
<section id="delivery" aria-labelledby="delivery-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Enterprise Delivery</span>
      <h2 id="delivery-heading">${esc(del.title)}</h2>
      <p>Client and employer details are anonymized. This section covers regulated-environment delivery work that is not publicly documented.</p>
    </div>

    <div class="delivery-grid">
      ${del.items.map(item => `
      <div class="delivery-card reveal">
        <h3>${esc(item.title)}</h3>
        <p class="delivery-client">${esc(item.client)}</p>
        <p>${esc(item.body)}</p>
        <span class="badge badge-anon">${esc(item.badge)}</span>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

function buildCommercialization() {
  const c = d.commercialization;
  return `
<section id="commercialization" aria-labelledby="comm-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">${esc(c.label)}</span>
      <h2 id="comm-heading">${esc(c.title)}</h2>
    </div>

    <div class="comm-grid">
      <div class="comm-block">
        <h3>Ideal customer profile</h3>
        <p>${esc(c.icp)}</p>
      </div>
      <div class="comm-block">
        <h3>Initial wedge</h3>
        <p>${esc(c.wedge)}</p>
      </div>
      <div class="comm-block">
        <h3>First offer</h3>
        <p>${esc(c.offer)}</p>
      </div>
      <div class="comm-block">
        <h3>Commercial structures</h3>
        <ul>${c.structures.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
      </div>

      <div class="comm-block comm-path" style="grid-column: 1 / -1;">
        <h3>10-step commercial path</h3>
        <ol class="path-steps">
          ${c.path.map((step, i) => `
          <li>
            <span class="step-num" aria-hidden="true">${i + 1}</span>
            <span>${esc(step)}</span>
          </li>`).join('')}
        </ol>
      </div>

      <div class="comm-block" style="grid-column: 1 / -1;">
        <h3>${esc(c.metricsLabel)}</h3>
        <div class="metrics-grid">
          ${c.metrics.map(m => `
          <div class="metric-item">
            <strong>${esc(m.name)}</strong>
            <span>${esc(m.note)}</span>
          </div>`).join('')}
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function buildNinetyDays() {
  const n = d.ninetyDays;
  return `
<section id="ninety-days" aria-labelledby="ninety-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Execution plan</span>
      <h2 id="ninety-heading">${esc(n.title)}</h2>
    </div>

    <div class="days-grid">
      ${n.periods.map(period => `
      <div class="days-card reveal">
        <span class="days-label">${esc(period.label)}</span>
        <h3>${esc(period.heading)}</h3>
        <ul>
          ${period.items.map(item => `<li>${esc(item)}</li>`).join('')}
        </ul>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

function buildRoleFit() {
  const r = d.roleFit;
  return `
<section id="role-fit" aria-labelledby="role-fit-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Evidence matrix</span>
      <h2 id="role-fit-heading">${esc(r.title)}</h2>
    </div>

    <div style="overflow-x:auto;">
      <table class="role-table">
        <thead>
          <tr>
            <th scope="col">Requirement</th>
            <th scope="col">Evidence</th>
          </tr>
        </thead>
        <tbody>
          ${r.rows.map(row => `
          <tr>
            <td>${esc(row.requirement)}</td>
            <td>${esc(row.evidence)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>
</section>`;
}

function buildExperience() {
  return `
<section id="experience" aria-labelledby="experience-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Career</span>
      <h2 id="experience-heading">Experience</h2>
    </div>

    <div class="experience-list">
      ${d.experience.map(job => `
      <div class="exp-item reveal">
        <div class="exp-meta">
          <div class="company">${esc(job.company)}</div>
          <div class="location">${esc(job.location)}</div>
          <div class="dates">${esc(job.start)} – ${esc(job.end)}</div>
          ${job.coverage ? `<div class="coverage">${esc(job.coverage)}</div>` : ''}
        </div>
        <div class="exp-content">
          <div class="role">${esc(job.role)}</div>
          <ul>
            ${job.items.map(item => `<li>${esc(item)}</li>`).join('')}
          </ul>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

function buildEducation() {
  return `
<section id="education" aria-labelledby="education-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Credentials</span>
      <h2 id="education-heading">Education &amp; Credentials</h2>
    </div>

    <div class="edu-list">
      ${d.education.map(edu => `
      <div class="edu-item reveal">
        <div class="edu-dates">
          ${edu.year ? esc(edu.year) : (edu.start && edu.end ? `${esc(edu.start)} – ${esc(edu.end)}` : '')}
        </div>
        <div>
          <div class="edu-credential">${esc(edu.credential)}</div>
          <div class="edu-institution">${esc(edu.institution)}</div>
          ${edu.distinction || edu.gpa ? `<div class="edu-details">${[edu.distinction, edu.gpa].filter(Boolean).map(esc).join(' · ')}</div>` : ''}
          ${edu.thesis ? `<div class="edu-thesis">Thesis: "${esc(edu.thesis)}"</div>` : ''}
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

function buildCapabilities() {
  return `
<section id="capabilities" aria-labelledby="capabilities-heading">
  <div class="container">
    <div class="section-header">
      <span class="section-label">Skills</span>
      <h2 id="capabilities-heading">Capabilities</h2>
      <p>No ratings or bars — capabilities are demonstrated through the work above.</p>
    </div>

    <div class="cap-grid">
      ${d.capabilities.map(cat => `
      <div class="cap-card reveal">
        <h3>${esc(cat.category)}</h3>
        <div class="cap-items">
          ${cat.items.map(item => `<span class="cap-item">${esc(item)}</span>`).join('')}
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>`;
}

function buildContact() {
  const c = d.contact;
  const p = d.personal;
  return `
<section id="contact" aria-labelledby="contact-heading">
  <div class="container">
    <div class="contact-wrapper">
      <span class="section-label">Contact</span>
      <h2 id="contact-heading">${esc(c.headline)}</h2>
      <p>${esc(c.copy)}</p>

      <div class="contact-actions" role="group" aria-label="Contact options">
        <div class="copy-email-wrapper">
          <button
            id="copy-email"
            class="btn-primary"
            data-email="${esc(p.email)}"
            type="button"
          >${esc(p.email)}</button>
          <span id="copy-confirmation" class="copy-confirmation" aria-hidden="true">Copied</span>
        </div>

        <a href="mailto:${esc(p.email)}" class="btn-secondary">Send email</a>

        <a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer" class="btn-ghost">GitHub &rarr;</a>

        <a href="cv.html" class="btn-ghost">Web CV</a>

        <a href="assets/Thomas_Zijlstra_CV.pdf" class="btn-ghost" download>Download CV (PDF)</a>
      </div>

      <div aria-live="polite" aria-atomic="true" id="copy-live" class="sr-only"></div>
    </div>
  </div>
</section>`;
}

function buildFooter() {
  const p = d.personal;
  return `
<footer>
  <div class="container">
    <div class="footer-inner">
      <p class="footer-disclaimer">${esc(d.footer.text)}</p>
      <div class="footer-links">
        <a href="${esc(p.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="cv.html">CV</a>
        <a href="mailto:${esc(p.email)}">Email</a>
      </div>
    </div>
  </div>
</footer>`;
}

// --- JSON-LD Schema --------------------------------------

function buildJsonLd() {
  const p = d.personal;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": p.name,
    "jobTitle": p.title,
    "url": d.meta.canonicalUrl,
    "email": p.email,
    "sameAs": [p.github],
    "knowsLanguage": p.languages.map(l => l.name),
    "address": { "@type": "PostalAddress", "addressLocality": p.location }
  };
  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
}

// --- HTML Wrapper -----------------------------------------

function buildIndexHtml() {
  return `<!DOCTYPE html>
<html lang="en" class="">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(d.meta.description)}">
  <meta name="keywords" content="${esc(d.meta.keywords)}">
  <meta name="author" content="${esc(d.personal.name)}">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(d.meta.title)}">
  <meta property="og:description" content="${esc(d.meta.description)}">
  <meta property="og:url" content="${esc(d.meta.canonicalUrl)}">
  <meta property="og:image" content="${esc(d.meta.canonicalUrl)}${esc(d.meta.ogImage)}">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(d.meta.title)}">
  <meta name="twitter:description" content="${esc(d.meta.description)}">
  <meta name="twitter:image" content="${esc(d.meta.canonicalUrl)}${esc(d.meta.ogImage)}">

  <link rel="canonical" href="${esc(d.meta.canonicalUrl)}">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">

  <title>${esc(d.meta.title)}</title>
  ${buildJsonLd()}
</head>
<body>
${buildNav()}
<main id="main">
${buildHero()}
${buildEvidence()}
${buildThesis()}
${buildProjects()}
${buildDelivery()}
${buildCommercialization()}
${buildNinetyDays()}
${buildRoleFit()}
${buildExperience()}
${buildEducation()}
${buildCapabilities()}
${buildContact()}
</main>
${buildFooter()}
<script src="script.js"></script>
</body>
</html>`;
}

// --- CV HTML -------------------------------------------

function buildCvHtml() {
  const p = d.personal;
  const cv = d.cv;

  const expHtml = d.experience.map(job => `
    <div class="cv-exp-item">
      <div class="cv-exp-header">
        <span class="cv-exp-company">${esc(job.company)}${job.location ? `, ${esc(job.location)}` : ''}</span>
        <span class="cv-exp-dates">${esc(job.start)} – ${esc(job.end)}</span>
      </div>
      <div class="cv-exp-role">${esc(job.role)}${job.coverage ? ` — ${esc(job.coverage)}` : ''}</div>
      <ul class="cv-exp-items">
        ${job.items.map(item => `<li>${esc(item)}</li>`).join('')}
      </ul>
    </div>`).join('');

  const projHtml = d.projects.slice(0, 3).map(proj => `
    <div class="cv-proj-item">
      <div class="cv-proj-title">${esc(proj.title)}</div>
      <div class="cv-proj-meta">${esc(proj.evidenceType)} · <a href="${esc(proj.repo)}">${esc(proj.repo)}</a></div>
      <ul class="cv-proj-items">
        <li>${esc(proj.summary)}</li>
        <li>Commercial relevance: ${esc(proj.commercial)}</li>
        <li>Note: ${esc(proj.limitations)}</li>
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
<html lang="en" class="">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="CV for ${esc(d.personal.name)} — ${esc(d.personal.title)}">
  <meta name="author" content="${esc(d.personal.name)}">
  <meta name="robots" content="index, follow">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="styles.css">
  <title>${esc(d.personal.name)} — CV</title>
</head>
<body class="cv-page">

<div class="cv-toolbar">
  <h1>${esc(d.personal.name)} — CV</h1>
  <a href="assets/Thomas_Zijlstra_CV.pdf" class="btn-primary" download>&#8595; Download PDF</a>
  <button class="btn-secondary" onclick="window.print()" type="button">Print / Save as PDF</button>
  <a href="index.html" class="btn-ghost">&larr; Back to portfolio</a>
  <button id="theme-toggle" class="btn-icon" aria-label="Switch to dark mode" type="button">☾</button>
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
    <div class="cv-section-title">Selected Public Projects</div>
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

  <div class="cv-section">
    <div class="cv-section-title">Languages</div>
    <p style="font-size:0.9rem;color:var(--text-muted)">${d.personal.languages.map(l => `${esc(l.name)} (${esc(l.level)})`).join(' · ')}</p>
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
write('index.html', buildIndexHtml());
write('cv.html', buildCvHtml());
console.log('Done.');
