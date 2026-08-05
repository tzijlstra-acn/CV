# Thomas Zijlstra, CFA — Portfolio & CV

Personal portfolio site and CV for Thomas Zijlstra, CFA.

**Live site:** https://tzijlstra-acn.github.io/CV/
**Moonshot URL:** https://tzijlstra-acn.github.io/CV/?target=moonshot

## Getting started

```bash
# Install dependencies (only needed for PDF generation)
npm install

# Generate index.html + cv.html from content.json
npm run build:html

# Generate the PDF (requires playwright or puppeteer)
npm run build:pdf

# Or do both at once
npm run build

# Local dev server (http://localhost:8080)
npm run serve
```

## File structure

```
/
├── index.html           ← generated from content.json
├── cv.html              ← ATS-friendly CV (generated)
├── content.json         ← single source of truth for all content
├── styles.css           ← design system
├── script.js            ← interactivity
├── 404.html
├── package.json
├── .nojekyll            ← prevents Jekyll processing on GitHub Pages
├── scripts/
│   ├── build.mjs        ← generates index.html + cv.html
│   ├── generate-cv-pdf.mjs
│   └── serve.mjs
└── assets/
    ├── Thomas_Zijlstra_CV.pdf
    ├── favicon.svg
    ├── monogram.svg
    └── og-card.svg
```

## Updating content

Edit `content.json` then run `npm run build:html` to regenerate the HTML files.

## Deploying to GitHub Pages

1. Push to the `main` branch of `git@github.com:tzijlstra-acn/CV.git`
2. In the repository Settings → Pages → Deploy from branch → `main` → root `/`
3. The site will be live at https://tzijlstra-acn.github.io/CV/

## PDF generation

The build script tries playwright first, then puppeteer. If neither is available, a placeholder PDF is created.

```bash
npm install playwright
npx playwright install chromium
npm run build:pdf
```

## Moonshot mode

Append `?target=moonshot` to the URL to show role-specific content for Business Builder & Ecosystem roles.

## Notes

- See `NEEDS_CONFIRMATION.md` for items requiring confirmation before publication.
- See `PUBLICATION_AUDIT.md` for repository publication checklist.
