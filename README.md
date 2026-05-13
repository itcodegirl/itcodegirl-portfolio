# itcodegirl-portfolio

Personal portfolio for Jenna Zawaski — a Chicago-based frontend developer focused
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
- [Three.js](https://threejs.org/) — single hero portrait shader
- [GSAP](https://gsap.com/) — one entry animation on the hero card
- Google Fonts (Inter, Playfair Display)
- [Formspree](https://formspree.io/) — contact form delivery

External libraries are loaded from a CDN and used only where they are needed.

## Project structure

```
.
├── index.html              # main page
├── 404.html                # 404 page
├── css/
│   ├── styles.css          # base, layout, components, responsive
│   ├── hero.css            # hero section + WebGL canvas styles
│   └── projects.css        # selected work cards
├── js/
│   ├── app.js              # page bootstrapping, scroll, WebGL, contact form
│   └── projects.js         # selected work data + rendering
├── scripts/
│   └── check-static-site.mjs # static performance/accessibility guardrails
├── assets/
│   ├── images/             # portrait + project images
│   ├── headshot.{png,webp}
│   ├── favicon.svg
│   └── JennaZawaski-Resume.pdf
└── CNAME                   # GitHub Pages custom domain
```

Project screenshots used by the Selected Work cards are stored in
`assets/images/projects/`.

## Running locally

The site is fully static. Serve it with any static server, such as VS Code
Live Server, and visit the local URL it provides. A local server is recommended
because the WebGL portrait loads a texture asynchronously and the `file://`
protocol blocks it.

## Quality checks

There is no build step, but the repo does include lightweight checks that fit a
static site:

```bash
node --check js/app.js
node --check js/projects.js
node scripts/check-static-site.mjs
node scripts/check-links.mjs
node scripts/check-lighthouse-result.mjs --help
```

The static check protects JavaScript/CSS budgets, asset weight, image attributes,
lazy motion loading, scroll safety, contact-form accessibility, and local link integrity.
The link check verifies internal page links, fragments, static assets, CSS
references, and project-card links before changes reach GitHub Pages.

Deploy-preview evidence should be captured separately with the real preview URL,
date, viewport mode, and tool used. Do not publish Lighthouse or performance
claims unless the result has actually been captured.

The manual `Lighthouse evidence` GitHub workflow accepts a deployed URL, captures
a JSON report, checks it against `lighthouse-budget.json`, and stores the report
as an artifact for review.

## Deployment

Deployed via GitHub Pages from `main`. The `CNAME` file maps the site to
`itcodegirl.com`.

## Accessibility and motion

- All interactive elements have visible focus states.
- A skip link is the first focusable element.
- `prefers-reduced-motion` disables the WebGL portrait, decorative animations,
  and reveal-on-scroll transitions.
- `forced-colors` is respected.
- Form fields are labeled and the form status is announced via `aria-live`.

## Engineering notes

Short writeups live under `/notes/`. Linked from the homepage footer.

- `/notes/why-vanilla.html` — why this site is vanilla JS instead of React.
- `/notes/site-performance.html` — how the portfolio keeps performance honest.

## Case study structure

Future per-project case study pages follow this structure. Sections may be
omitted only when truthful information is not available — labels are not
filled with marketing copy.

1. **Problem** — what was broken or missing.
2. **Users** — who the product is for.
3. **Goals** — what success looked like.
4. **Constraints** — time, scope, stack, or product constraints.
5. **My role** — what I owned, what I did not.
6. **Key decisions** — the choices that shaped the product.
7. **UX decisions** — interaction, hierarchy, copy, and flow choices.
8. **Engineering decisions** — architecture, data, and stack tradeoffs.
9. **Accessibility considerations** — what was checked, what is still open.
10. **Performance considerations** — what was measured, what was tuned.
11. **Current status** — what is shipped, what is in progress.
12. **What I would improve next** — the honest next iteration.

Where metrics are not yet known, sections use neutral labels
(`Current status`, `Engineering focus`, `Next iteration`) instead of
invented numbers.

## Roadmap

- Add real screenshots / short loops to each selected work card.
- Add dedicated case study pages on this domain following the structure above.
- Continue tightening LCP image weight and font loading.
