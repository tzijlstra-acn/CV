# Visual inspiration audit

**What this is:** design and information-architecture research for the portfolio rebuild of Thomas Zijlstra, CFA. All references were inspected on 2026-11-02.

## Method

- **GitHub repositories:**
  - READMEs were read through WebFetch of raw.githubusercontent.com.
  - File trees came from the GitHub REST API.
  - Key source files were read raw: data types, schemas, CSS tokens, QA scripts and documentation.
- **Sites:** fetched with WebFetch, then the HTML and CSS were checked directly for fonts, structure and motion queries.
- **Anti-references:** found by web search. The HTML shell and entry scripts of each site were then inspected.
- **Reuse rule:** patterns are described in our own terms. Do not copy code, assets, colour values or exact styling from any reference, including the MIT-licensed ones.

## Summary

| # | Reference | What it is | Licence | Main lesson |
|---|---|---|---|---|
| 1 | BartoszJarocki/cv | Print-first one-page CV driven by one data file | MIT | One typed source, many outputs (HTML, print, text, markdown, llms.txt) |
| 2 | bchiang7/v4 | Developer personal site (Gatsby) | MIT, but the author asks for attribution and asks people not to claim the design | Accessible tabs and reduced-motion gating; also what a recognisable template looks like |
| 3 | hmeclazcke/hmeclazcke-portfolio | Spec-driven static portfolio with a technology graph tied to evidence | None stated (default copyright) | Claims linked to contexts through typed relationships |
| 4 | berendsshalai/berendsshalai-project-systemtoportfolio | Case study about turning working systems into portfolio evidence | MIT | Redaction boundary, accuracy labels, decision ledger, viewport QA |
| 5 | thedatamorph.com, "This Website" | Case study of the portfolio site itself | Source repo shows no licence file | Meta block for each case; a stated motion principle; reproducible walkthrough videos |
| 6 | JasonStys/portfolio-case-study-site | Evidence-first case-study site (Astro) | MIT for code; content attributed to author | Validated case schema ending in limitations; faceted explorer; QA depth |
| 7 | xsaia.ai/portfolio | Advisory firm portfolio of confidential work | Not applicable (website) | Four-part confidential case, with personal role separated |
| 8 | Bruno Simon; Henry Heffernan | Cinematic 3D WebGL portfolios | Not applicable (anti-reference) | Why 3D fails this audience |

## 1. BartoszJarocki/cv

- **URL:** https://github.com/BartoszJarocki/cv (live: https://cv.jarocki.me)
- **What it is:**
  - A minimalist one-page CV built with Next.js App Router, TypeScript and Tailwind.
  - All content lives in one typed data file (`src/data/resume-data.ts`, typed by `src/lib/types.ts`).
  - Around 9,700 stars; last push 2026-10-28.

**Patterns to adopt**

- **Information architecture:**
  - Header (name, one-line about, location, contacts), then summary, work, education, skills and projects.
  - Section order follows the keys of a section-titles object, and empty sections are skipped automatically.
  - Useful for lens views: one data source, different section orders.
- **Case-study schema fields:**
  - There are no case studies.
  - The work entry is a sound base for the CV layer: company, link, badges, title, start, end (null when current), description and optional highlights.
- **Evidence and limitations framing:** not addressed.
- **Confidential work:** not addressed.
- **Data and schema-driven content:**
  - The same data renders to HTML, an 80-column terminal text view, markdown (via the Accept header, `/index.md` and `/llms.txt`) and plain text.
  - It also generates JSON-LD, a sitemap and an Open Graph image.
  - A markdown or llms.txt rendering is worth having, because profiles are increasingly pasted into AI screening tools.
- **QA approach:**
  - A verify script checks the prerendered HTML, text and markdown against the data file (headings, links, metadata, JSON-LD).
  - CI runs format and lint checks, the build and the verify step.
  - Adopt the idea of a content parity test: what is rendered must match the data.
- **Motion:** a 400 ms fade-and-rise per section, staggered by 75 ms. It runs only under `prefers-reduced-motion: no-preference` and is switched off in print. This is a sensible ceiling for any entrance motion.
- **Typography and layout rhythm:**
  - Six colour roles with light and dark sets: background, ink, body, faint, rule, wash.
  - A single reading column of about 42 rem.
  - Small, muted, lower-case section labels.
  - An A4 `@page` rule with 10 mm margins.
  - Adopt the role-based token naming and the print stylesheet, not the values.

**Do not copy**

- **Monospace body text.** It reads as "developer" and tires an executive reader.
- **Skills as a flat tag list, and technology badges on every role.** Badges are not evidence.
- **An avatar-led header,** and a CV that has no case-study depth.
- **A command menu as a main route.** It opens with Ctrl or Cmd + J, and its hint shows only on wide screens. Treat keyboard shortcuts as extras, never as the only route to content.

**Licence:** MIT.

## 2. bchiang7/v4

- **URL:** https://github.com/bchiang7/v4 (live: https://v4.brittanychiang.com/)
- **What it is:**
  - Brittany Chiang's Gatsby site; last push 2024-07.
  - Content lives in markdown with frontmatter (`content/jobs`, `content/featured`, `content/projects`, `content/posts`).
  - Sections: hero, about, experience, featured projects, other projects and contact, plus an `/archive` table of every project.

**Patterns to adopt**

- **Information architecture:**
  - A curated "featured" list sits separately from a complete archive table.
  - This is the guided narrative plus evidence explorer split in miniature.
  - Numbered section headings, generated by CSS counters, give wayfinding when the numbers mean chapter order.
- **Case-study schema fields:** project frontmatter holds date, title, cover, repository link, external link and technology list. It is thin; useful only as the "artefact links" part of a case.
- **Evidence and limitations framing:** not addressed.
- **Confidential work:** not addressed.
- **Data and schema-driven content:** content files are cleanly separated from components.
- **QA approach:** a pre-commit hook and linting only.
- **Motion:**
  - Scroll reveals are configured in one place.
  - A `usePrefersReducedMotion` hook skips every reveal when the user asks for less motion.
  - Experience tabs use `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` and arrow-key handling.
- **Typography and layout rhythm:** one accent colour, reserved for interactive and highlight states.

**Do not copy**

- **The signature look:** the dark navy and mint palette, the fixed side rails with vertical social links and email, and the "Hi, my name is" hero. They are among the most imitated portfolio patterns, and reviewers recognise them as a template. The author also asks people not to pass the design off as their own.
- **The heading order:** the greeting is the `h1` and the name is an `h2` (see `src/components/sections/hero.js`). Make the name or proposition the `h1`.
- **The project card grid with "Show More".** It is a card wall.
- **Technology lists as the main project evidence.**
- **Scroll reveals on every section.** Content stays hidden until it is scrolled into view, which hurts screenshots, quick scanning and slow devices.

**Licence:** MIT (`LICENSE`, copyright 2018 Brittany Chiang). The README asks for attribution with a link back, and asks people not to claim the design or code. The site is not intended as a starter theme.

## 3. hmeclazcke/hmeclazcke-portfolio

- **URL:** https://github.com/hmeclazcke/hmeclazcke-portfolio
- **What it is:**
  - A static React and TypeScript single-page portfolio (Vite, D3).
  - Built through spec-driven development, with an AI coding agent working under owner approval.
  - Sections: home, story (a career and learning chronology), technology graph, contact footer. The project is marked complete.

**Patterns to adopt**

- **Information architecture:**
  - Four destinations: home, story, technology graph, contact.
  - The written product principles say the site is not a résumé clone, and LinkedIn keeps the full employment history.
  - Adopt an explicit non-goals list.
- **Case-study schema fields:** no cases, but the evidence model is the point (next item).
- **Evidence and limitations framing:**
  - Canonical JSON sits in `data/` with JSON Schemas for three record types:
    - **Technologies:** id, name, category, and relevance (current or historical).
    - **Contexts:** id, name, a type (professional, portfolio, personal project or learning), and a flag marking whether the context may create visible graph links.
    - **Relationships:** a technology tied to a context, with the meaning "learned" or "used".
  - Translated for Thomas: capability to context (client engagement, prototype, credential, role), with relation types such as delivered, led, prototyped and studied, plus a current or historical flag.
  - The weak-context flag stops thin evidence from inflating a capability.
- **Confidential work:** detailed employment history is deliberately left to LinkedIn.
- **Data and schema-driven content:**
  - Ajv schema validation plus cross-file checks for valid references and duplicate associations run before the build.
  - A build-time adapter feeds the UI, so components never hard-code facts.
- **QA approach:**
  - One active spec at a time (spec, plan, tasks), with an adversarial review before work advances.
  - Gates: tests, format, lint, typecheck, data validation and build.
  - Any skipped gate must be reported with its reason.
  - Owner browser review is part of acceptance, and axe-core runs in component tests.
- **Motion:** floating section navigation; motion sits mainly in the graph.
- **Typography and layout rhythm:**
  - A raw palette layer is mapped onto semantic tokens (canvas, surface, primary and muted text, subtle and strong borders, accent, focus).
  - Readable and wide content widths are tokenised.
  - Variable fonts are self-hosted, with no third-party font requests.
  - Adopt the two-layer token structure.

**Do not copy**

- **A force-directed technology graph as the centrepiece.** It is a skills map in another form: hard to read, motion-heavy, and it needed a separate mobile explorer. For Thomas, relationships belong in a table or a static diagram.
- **The dark graphite and luminous green palette,** the decorative illustration, and the technology-centred framing.

**Licence:** there is no licence file, and GitHub reports none. Default copyright applies: take ideas only, no code or assets.

## 4. berendsshalai/berendsshalai-project-systemtoportfolio

- **URL:** https://github.com/berendsshalai/berendsshalai-project-systemtoportfolio (live: https://berendsshalai.github.io/berendsshalai-project-systemtoportfolio/)
- **What it is:**
  - A one-page interactive case study (React, TypeScript, Vite). Its opening claim: "A working system is not the end of the project. It is evidence."
  - It ships an engineering dossier in `docs/`: build log, design decision ledger, measurement atlas, motion system, redaction and source boundary, SEO strategy, and a JSON implementation manifest.

**Patterns to adopt**

- **Information architecture:**
  - Hero, then the problem ("what most portfolios miss"), then a method of four numbered moves: find the tension, expose the logic, prove the change, build the surface.
  - Then an interactive schematic, the evidence structure, a repository kit and a closing call to action.
  - The four moves make a good spine for each of Thomas's cases.
- **Case-study schema fields:** five layers: narrative (pressure, intervention, result), architecture, evidence, interface, and discovery (search and social).
- **Evidence and limitations framing:**
  - Every claim in the dossier is labelled Measured, Reconstructed or Recommended.
  - Adapted for Thomas: Delivered, Prototype, Reconstructed (from memory or notes, not records) and Recommended.
  - The decision ledger tabulates each decision, its status (selected or rejected), its exact treatment and why it worked or failed. That shows judgement better than a feature list.
- **Confidential work:** a dedicated redaction and source boundary document:
  - lists what is deliberately public and what is deliberately excluded (original source, generated imagery, credentials, applicant records);
  - explains that private files are named but not reproduced;
  - sets out a credential-incident procedure.

  This is the most transferable pattern for Accenture client work.
- **Data and schema-driven content:** profile links come from one configuration file, and measurements live in a machine-readable manifest.
- **QA approach:**
  - `npm run check` chains lint, typecheck, tests, a documentation check, an SEO check, the build and a browser check.
  - The documentation check fails on secret formats, private key blocks, em dashes and binaries in `docs`.
  - The browser check:
    - renders at 1440, 1024, 390 and 320 px widths;
    - asserts that the `h1` is visible;
    - measures horizontal overflow;
    - records page errors and failed responses;
    - exercises one interaction;
    - tests reduced motion.
- **Motion:**
  - The schematic uses buttons with `aria-pressed` and a detail panel with `aria-live="polite"`. This is a good model for an "explain this node" connector diagram.
  - Both `prefers-reduced-motion` and `prefers-contrast: more` are handled; the contrast mode thickens borders and strengthens line colour.
- **Typography and layout rhythm:**
  - A light, cool canvas with a white surface, navy ink and one blue accent.
  - Hairline borders and dashed SVG route lines.
  - Large, tightly tracked headings, with monospace labels carrying numbered prefixes.
  - This is close to the "architectural canvas" direction.

**Do not copy**

- **Effects from the original recruiting project:** the cursor-driven reveal, the eight-frame canvas image sequence and the generated people imagery. Also the slow orbit animation.
- **Label text at 8 to 10 px.** It is too small; keep labels at 12 px or larger.
- **Decoration that reads as a gimmick to executives,** such as pseudo-code notes ("trust += 1").
- **The shell and layout:** the large rounded outer shell with a heavy shadow, evidence laid out as a card grid, and fonts loaded from Google's CDN.

**Licence:** MIT.

## 5. thedatamorph.com, "This Website" case study

- **URL:** https://thedatamorph.com/projects/this-site/ (source: https://github.com/RamiroRivas2/portfolio)
- **What it is:**
  - Ramiro Rivas's case study of his own portfolio site (Astro 5, React islands, Tailwind 4, GSAP ScrollTrigger, Lenis, Playwright, Cloudflare Pages).
  - He presents the site as proof of judgement, because most of his client work sits in private repositories.

**Patterns to adopt**

- **Information architecture:**
  - A case meta block opens the page: category, year, status ("Live, open source"), role, stack and source link.
  - Sections follow: brief, architecture, motion system, video pipeline, why it counts, call to action.
  - A "next project" link closes the page.
- **Case-study schema fields:** fixed meta fields, including a status value, on every case.
- **Evidence and limitations framing:** the brief sets a rule that every technique shown must be one he would defend in production. That is a useful test for Thomas's prototypes. There is no limitations section (see below).
- **Confidential work:** private client work is acknowledged, and the public site stands in as the inspectable proof.
- **Data and schema-driven content:**
  - Each project is one MDX file with validated frontmatter (title, stack, links, accent, video path).
  - The home grid, the routes and the next-project links are all generated from those files.
  - Adopt data-generated "next case" links for the guided narrative.
- **QA approach:**
  - Playwright scripts record product walkthroughs, and ffmpeg transcodes them, so a demo can be re-recorded with one command when the product changes.
  - This suits Thomas's prototypes: short, captioned, reproducible recordings instead of live embeds.
- **Motion:**
  - The stated principle: "Motion communicates hierarchy; nothing animates just to animate."
  - Elements opt in to motion through data attributes.
  - Reduced motion disables the hero simulation.
- **Typography and layout rhythm:** pages are static by default, with JavaScript only where it earns its place.

**Do not copy**

- **Scroll and cursor effects:** Lenis smooth scrolling (it replaces native scrolling), letter-by-letter headline reveals, the cursor-repelling canvas dot grid and the magnetic buttons.
- **The visual style:** dark ink with a lime accent, and a Space Grotesk plus Inter pairing (checked in the site CSS). The pairing is now very common in developer portfolios.
- **The missing limitations section.** Thomas's cases should each end with limitations.

**Licence:** the source repository shows no licence file (checked on github.com). Treat it as all rights reserved.

## 6. JasonStys/portfolio-case-study-site

- **URL:** https://github.com/JasonStys/portfolio-case-study-site (live: https://jasonstys.github.io/portfolio-case-study-site/)
- **What it is:**
  - A static Astro portfolio cataloguing 67 repositories, led by six featured case studies, with search and facets.
  - Extensive documentation: architecture, limitations, testing, content guide, ADRs and reports.

**Patterns to adopt**

- **Information architecture:**
  - The home page runs from a hero, to featured cases, to collections, to a section called "How to evaluate this work" ("Start with the evidence, not the adjectives."), then the site architecture, then a filtered project index.
  - Adopt a short "how to read this portfolio" note.
- **Case-study schema fields** (validated with Zod; the build fails on any violation):
  - title, 3 to 90 characters;
  - a repository URL restricted to the owner's account;
  - summary, 40 to 240 characters;
  - role and languages;
  - an evidence list of 3 to 6 items, each 3 to 100 characters;
  - an optional featured order from 1 to 6.

  The length limits force concision.
- **Fixed case narrative:** problem, constraints, design, verification, measured result, limitations.
- **Evidence and limitations framing:**
  - Measured results are presented as citations of linked historical reports, with a note that the portfolio did not rerun them.
  - Synthetic data is labelled as synthetic.
  - The README states that the case studies do not claim commercial production use.
  - Maturity labels: validated, reference, experimental.
  - Ordering follows integration depth, reproducible evidence and role breadth, not stars. It is described as an editorial choice, not a skill rating.
- **Confidential work:** the content guide forbids identifying customers, employers, private repositories or interview details, and requires examples that are safe to publish.
- **Data and schema-driven content:**
  - A search index is built at build time.
  - Facets cover role, domain, language and maturity.
  - Filter state is restored from the URL, and results keep the curated order.
  - Every card remains readable without JavaScript.
  - The metric rail is a definition list computed from data, not typed numbers.
- **QA approach:**
  - axe checks against WCAG A and AA.
  - A Playwright recruiter journey covering filtering, URL restoration, keyboard flow and mobile layout.
  - Three-run Lighthouse, compressed asset budgets and coverage thresholds.
  - CodeQL and dependency review.
  - Build validators; GitHub Pages publishes only after every job passes.
  - A limitations document with explicit non-goals: no analytics, no tracking, no runtime API calls, no automated skill ranking.
- **Motion:** minimal; reduced motion and forced colours are supported.
- **Typography and layout rhythm:**
  - Serif display headings, a sans body and monospace labels on a warm paper ground.
  - The architecture diagram is an SVG with `role="img"`, a title and a description, alongside visible text.
  - This confirms that the editorial direction works for evidence-led content.

**Do not copy**

- **The volume:** 67 projects plus side collections dilute an executive story. Thomas needs 5 to 7 cases.
- **Card grids for collections,** and vanity counts (languages, repositories) in the metric rail.
- **Engineering jargon density,** and the "available for opportunities" badge.
- **The visual details:** the coral, aqua and lime accents, and a background grid behind body text.

**Licence:** MIT for the source. Project descriptions and profile content remain attributed to the author.

## 7. xsaia.ai/portfolio

- **URL:** https://www.xsaia.ai/portfolio/
- **What it is:**
  - The portfolio page of XSAIA Ltd, a UK advisory firm for AI strategy, governance and commercialisation, led by Dr Layla Dillon. It presents confidential work at portfolio level.
  - Built on a hosted site builder (the page carries an IONOS MyWebsite Now generator tag and uses Montserrat).

**Patterns to adopt**

- **Information architecture:**
  - Three capability sections: roadmapping; governance and assurance; commercialisation and adoption.
  - Each has a "from X to Y" subtitle, for example "From principle and policy to accountable practice".
- **Case-study schema fields:** four fixed parts per item: the challenge, what Layla led, the impact, and what this means for clients.
  - The "what I led" part separates personal role from team outcome.
  - The "what this means for you" part turns the case into the reader's own problem.
  - Both suit an executive audience.
- **Evidence and limitations framing:** figures are flagged as "estimated" ranges, which is better than unqualified numbers. Verification is still missing (see below).
- **Confidential work:**
  - The page states up front that much of the work was done inside organisations or for confidential clients.
  - It names employers and ecosystem firms, but never clients, and lists sectors instead.
- **Data and schema-driven content:** not addressed (a hand-built site-builder page).
- **QA approach:** not addressed.
- **Motion:** none of note.
- **Typography and layout rhythm:** one long vertical document with headings and bullet lists.

**Do not copy**

- **Large aggregate figures with no method, date or route to verification,** and items with no dates or roles.
- **A text-only presentation with no artefacts,** a long mega-menu, template styling and heavy consent banners.
- **Self-descriptive taglines,** such as "Leadership for Complexity".

**Licence:** not applicable (a website; all rights reserved).

## 8. Anti-references: cinematic and 3D WebGL portfolios

### 8.1 Bruno Simon

- **URL:** https://bruno-simon.com/ (coverage: https://www.creativebloq.com/news/3d-car-portfolio)
- **What it is:**
  - A Three.js portfolio in which the visitor drives a car through a 3D world.
  - One of the most celebrated creative-developer sites; it has since been rebuilt with WebGPU support.
- **Observed on 2026-11-02:**
  - The page has a single canvas element.
  - The entry JavaScript module is about 4.9 MB uncompressed (served gzip-compressed), before any 3D models load.
  - Images in the HTML carry empty alt text.
  - No ARIA attributes and no `prefers-reduced-motion` query were found in the HTML or the entry module.
  - Menu panels cover controls (keyboard, mouse, touch, gamepad), audio, achievements and a racing circuit.

### 8.2 Henry Heffernan

- **URL:** https://henryheffernan.com/
- **What it is:** "Portfolio 2022", a 3D room scene in which the content appears on a simulated computer screen.
- **Observed on 2026-11-02:**
  - The HTML body contains no readable content beyond the page title and inline CSS.
  - A script bundle of about 0.9 MB uncompressed builds the scene and loads `.glb` 3D models.
  - Content is reachable only after the scene has loaded.

### Why they hurt navigation, performance and accessibility

- **Navigation:**
  - Content is reached by exploring a space, not by scanning a page.
  - There is no direct link to a case.
  - A reviewer with 20 seconds sees a loading state or a game.
- **Performance:**
  - Multiple megabytes of JavaScript, plus models and GPU work.
  - Slow on managed corporate laptops, over VPN and on mobile data.
  - Locked-down corporate browsers may restrict WebGL.
- **Accessibility:**
  - Canvas content without a text equivalent fails WCAG 1.1.1 (Non-text Content).
  - Continuous motion without a reduced-motion route conflicts with 2.2.2 (Pause, Stop, Hide) and 2.3.3 (Animation from Interactions, Level AAA).
  - Game controls do not map onto screen readers or standard keyboard navigation.
- **Machine readability:** print, search engines and AI screening tools read little or nothing.
- **Signal:** these sites prove WebGL craft. That is the hiring criterion for creative developers, and irrelevant to the seven role lenses in `market-role-map.md`.

## 9. Synthesis: design and IA rules for an executive systems studio

Specific values below are starting recommendations, not values taken from any reference.

1. **A light architectural canvas.**
   - Warm off-white ground, near-black ink, and one muted accent reserved for connectors and active evidence states.
   - 1 px hairline rules.
   - A faint drafting grid only inside diagrams, never behind body text.
   - No gradients, glass, glow or deep shadows.
2. **Editorial typography.**
   - A serif display face for headings and a neutral sans for body text at 17 to 19 px, with a line height of about 1.55 and lines of 60 to 72 characters.
   - Monospace or small caps only for evidence labels and metadata, never below 12 px.
   - At most two families plus a mono, all self-hosted.
3. **A margin rail layout.**
   - A narrow left rail carries dates, evidence labels and lens tags beside a single reading column.
   - Vertical rhythm on an 8 px base.
   - Each section opens with a numbered label and a one-sentence claim.
4. **Two modes, one data source.**
   - **Guided narrative:** a 20-second header, then the career through-line, then 4 primary cases, then "how I work", then contact, with a "next case" link at the end of each case.
   - **Evidence explorer:** a single table of every evidence item, filterable by lens, capability, evidence type, maturity and disclosure level.
   - Filters are reflected in the URL, and the explorer reads as a plain table without JavaScript.
5. **Lens views change emphasis, not facts.**
   - Seven stable lens URLs (for example `/lens/risk-resilience`) reorder the narrative and swap the opening proof statement and primary case.
   - Every view is generated from the same records.
   - The lens switcher is a plain list of links.
6. **A fixed case schema with length limits.** Each case has:
   - title, lenses, period, organisation type and jurisdiction;
   - disclosure level;
   - my role (one sentence, personal);
   - team context;
   - problem, constraints, approach and what changed;
   - 3 to 6 evidence items, each labelled;
   - "what this does not show";
   - artefacts and capability tags.
7. **An evidence label on every claim.**
   - Source labels: Client delivery (confidential), Client delivery (public reference), Public prototype (AI-assisted), Credential or Reconstructed.
   - Figures are marked Measured or Estimated.
   - Prototypes carry a maturity label: concept, prototype, pilot or production.
   - Labels sit in the margin rail.
8. **A published confidentiality boundary.**
   - One page states what is public, what is withheld and why.
   - Clients are described by sector, size band and jurisdiction.
   - No client logos, and no figures without approval.
   - Each case shows its disclosure level.
9. **Precise connectors.**
   - SVG diagrams with orthogonal lines, 1 to 1.5 px strokes, labelled arrowheads, and text nodes rather than icons.
   - Every diagram has a title, a description and an adjacent ordered-list equivalent.
   - The signature diagram is the career through-line: capital markets, then principal investing, then regulated transformation, then AI for risk.
10. **No card walls, skill meters, logo clouds or technology badges.**
    - Collections are lists or tables.
    - Capabilities are sentences linked to evidence records, counted by evidence type, never shown as bars or percentages.
11. **Motion only for state.**
    - 150 to 250 ms for filtering, expanding and highlighting a connector, plus at most one connector draw per diagram. All of it is off under `prefers-reduced-motion`.
    - No scroll hijacking, smooth-scroll libraries, parallax, cursor effects, letter-by-letter reveals, autoplay video, WebGL or 3D.
    - Content is fully visible without JavaScript.
12. **One source, three outputs.**
    - Typed content files, validated against a schema at build time, produce the HTML site, an A4 print CV and a markdown or llms.txt version.
    - The build fails on:
      - missing fields;
      - phrases from the banned list;
      - em or en dashes;
      - a list of US spellings;
      - unlabelled claims;
      - broken links.
13. **QA gates before publishing.**
    - axe against WCAG 2.2 AA, plus a keyboard-only journey through the narrative and the explorer.
    - Screenshots at 1440, 1024, 390 and 320 px with no horizontal overflow.
    - A JavaScript budget, for example under 100 KB on narrative pages, and no third-party requests.
    - Checks for print, `prefers-contrast` and forced colours.
    - A parity test between the data and the rendered pages.
14. **Visible judgement.**
    - Each prototype case carries a short decision ledger (chosen, rejected, why) and a limitations block.
    - An "about this site" page states how the site was built, including the AI assistance, and what it does not claim.
15. **A 20-second test for each lens.** At 1280 x 720, the first screen of each lens view must show:
    - name, CFA, Zurich;
    - level and domain;
    - one proof statement;
    - one artefact link;
    - contact.

    Test it with three reviewers from outside the field before launch.

## Sources

- https://github.com/BartoszJarocki/cv and https://cv.jarocki.me
- https://github.com/bchiang7/v4 and https://v4.brittanychiang.com/
- https://github.com/hmeclazcke/hmeclazcke-portfolio
- https://github.com/berendsshalai/berendsshalai-project-systemtoportfolio and https://berendsshalai.github.io/berendsshalai-project-systemtoportfolio/
- https://thedatamorph.com/projects/this-site/ and https://github.com/RamiroRivas2/portfolio
- https://github.com/JasonStys/portfolio-case-study-site and https://jasonstys.github.io/portfolio-case-study-site/
- https://www.xsaia.ai/portfolio/
- https://bruno-simon.com/ and https://www.creativebloq.com/news/3d-car-portfolio
- https://henryheffernan.com/
- WCAG 2.2 success criteria referenced: https://www.w3.org/TR/WCAG22/
