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
├── assets/
│   ├── images/             # portrait + project images
│   ├── headshot.{png,webp}
│   ├── favicon.svg
│   └── JennaZawaski-Resume.pdf
└── CNAME                   # GitHub Pages custom domain
```

## Running locally

The site is fully static. Serve it with any static server, for example:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

A local server is recommended because the WebGL portrait loads a texture
asynchronously and the `file://` protocol blocks it.

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

## Roadmap

- Add real screenshots / short loops to each selected work card.
- Add dedicated case study pages (problem, decisions, outcome, next).
- Add a short engineering writeup explaining the vanilla-first stack choice.
- Continue tightening LCP image weight and font loading.
