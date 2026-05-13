# itcodegirl-portfolio

Personal portfolio for Jenna Zawaski, a Chicago-based frontend developer focused
on building polished, accessible, product-minded web experiences.

Live site: https://itcodegirl.com

## What this repo is

A small, intentionally lightweight portfolio site written in vanilla HTML, CSS,
and JavaScript. There is no build step, no bundler, and no framework.

The portfolio demonstrates frontend craft through the site itself
(layout, accessibility, motion safety, performance discipline) and points
visitors to the real product work it represents.

## Stack

- HTML5 (semantic landmarks, accessible form patterns)
- CSS3 (custom properties, responsive design, `prefers-reduced-motion` and
  `forced-colors` support)
- JavaScript (vanilla, modular by file)
- Google Fonts (Inter, Playfair Display)
- [Formspree](https://formspree.io/) for contact form delivery

Decorative motion is treated as a progressive enhancement. It is not the
primary skill story of the portfolio; the primary story is UX-focused frontend
product work with clear evidence.

## Project structure

```text
.
|-- index.html                  # main page
|-- 404.html                    # 404 page
|-- css/
|   |-- styles.css              # base, layout, components, responsive
|   |-- hero.css                # hero section + portrait enhancement styles
|   `-- projects.css            # selected work cards
|-- js/
|   |-- app.js                  # page bootstrapping, scroll, contact form
|   `-- projects.js             # selected work data + rendering
|-- scripts/
|   `-- check-static-site.mjs   # static performance/accessibility guardrails
|-- notes/
|   |-- index.html              # engineering notes index
|   |-- site-performance.html   # performance notes and budget decisions
|   |-- why-vanilla.html        # rationale for keeping the site framework-free
|   `-- notes.css               # shared notes styling
|-- work/
|   |-- index.html              # case study directory
|   |-- codeherway/             # flagship product case study
|   |-- ceo-os/                 # founder workflow case study
|   |-- aura-weather/           # weather app case study
|   `-- work.css                # work and case study styling
|-- assets/
|   |-- images/                 # portrait + project images
|   |-- evidence/               # dated reports and screenshots, when captured
|   |-- headshot.{png,webp}
|   |-- favicon.svg
|   `-- JennaZawaski-Resume.pdf
`-- CNAME                       # GitHub Pages custom domain
```

Project screenshots used by the Selected Work cards are stored in
`assets/images/projects/`.

## Evidence Layer

The portfolio is designed to show proof, not only claims. Project cards
summarize ownership, product value, implementation work, challenge areas, and
proof currently available. Case studies include Evidence Snapshots so reviewers
can quickly see what was built, what was hard, what changed because of product
and engineering decisions, and what can be verified in a short review.

Quality checks are documented honestly. If a report, screenshot, accessibility
scan, or user-flow capture does not exist yet, it should be marked as planned
evidence or needs capture instead of being presented as completed proof.

Future evidence includes Lighthouse reports, axe accessibility scans,
responsive screenshots, key user-flow captures, repo structure screenshots, and
dated QA checks.

## Evidence Capture Checklist

- [ ] Capture Lighthouse mobile and desktop reports
- [ ] Capture axe accessibility scan
- [ ] Capture responsive screenshots for mobile/tablet/desktop
- [ ] Capture key flow screenshots for CodeHerWay
- [ ] Capture repo structure screenshot
- [ ] Add short interaction clip for flagship flow
- [ ] Add dates for last verified QA checks

## Running locally

The site is fully static. Serve it with any static server.

One simple option:

```bash
npx serve .
```

Then open the local URL that `serve` prints.

A local server is recommended because some browser APIs and asynchronous assets
are more reliable over `http://` than the `file://` protocol.

## Quality checks

There is no build step, but the repo does include lightweight checks that fit a
static site:

```bash
node --check js/app.js
node --check js/projects.js
node --check scripts/check-static-site.mjs
node scripts/check-static-site.mjs
node scripts/check-links.mjs
node scripts/check-route-readiness.mjs
node scripts/check-external-links.mjs
node scripts/check-lighthouse-result.mjs --help
```

The static check protects JavaScript/CSS budgets, asset weight, image attributes,
lazy motion loading, scroll safety, contact-form accessibility, and local link
integrity.
The link check verifies internal page links, fragments, static assets, CSS
references, and project-card links before changes reach GitHub Pages.
The route-readiness check protects critical page structure: one H1, skip-link
wiring, canonical metadata, duplicate IDs, case-study sections, and accessible
link-name alignment.
The external-link check inventories off-site URLs locally. Run
`node scripts/check-external-links.mjs --live` or the manual `External URL health`
workflow when you want network-backed status checks.

Deploy-preview evidence should be captured separately with the real preview URL,
date, viewport mode, and tool used. Do not publish Lighthouse or performance
claims unless the result has actually been captured.

The manual `Lighthouse evidence` GitHub workflow accepts a deployed URL, captures
a JSON report, checks it against `lighthouse-budget.json`, and stores the report
as an artifact for review. Netlify deploy previews are allowed a lower SEO
threshold because preview responses include `x-robots-tag: noindex`; production
URLs should still meet the normal SEO budget.

## Deployment

Deployed via GitHub Pages from `main`. The `CNAME` file maps the site to
`itcodegirl.com`.

## Accessibility and motion

- All interactive elements have visible focus states.
- A skip link is the first focusable element.
- `prefers-reduced-motion` disables decorative portrait behavior and
  reveal-on-scroll transitions.
- `forced-colors` is respected.
- Form fields are labeled and the form status is announced via `aria-live`.

## Engineering notes

Short writeups live under `/notes/`. Linked from the homepage footer.

- `/notes/why-vanilla.html` explains why this site stays vanilla JS instead of
  moving to React.
- `/notes/site-performance.html` covers performance guardrails and budget
  choices for the site.

## Case study structure

The live per-project case study pages under `/work/` follow this structure.
Sections are omitted only when truthful information is not available; labels are
not filled with marketing copy.

1. **Problem** - what was broken or missing.
2. **Users** - who the product is for.
3. **Goals** - what success looked like.
4. **Constraints** - time, scope, stack, or product constraints.
5. **My role** - what I owned, what I did not.
6. **Key decisions** - the choices that shaped the product.
7. **UX decisions** - interaction, hierarchy, copy, and flow choices.
8. **Engineering decisions** - architecture, data, and stack tradeoffs.
9. **Accessibility considerations** - what was checked, what is still open.
10. **Performance considerations** - what was checked, what was tuned, and what still needs fresh evidence.
11. **Current status** - what is shipped, what is in progress.
12. **What I would improve next** - the honest next iteration.

Where metrics are not yet known, sections use neutral labels
(`Current status`, `Engineering focus`, `Next iteration`) instead of
invented numbers.

## Roadmap

- Keep tightening recruiter trust cues and case study proof on the same domain.
- Refresh product screenshots and supporting media as newer captures become
  available.
- Continue tightening LCP image weight and font loading.
