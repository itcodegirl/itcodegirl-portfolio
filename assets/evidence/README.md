# Portfolio Evidence

This folder holds **verified** project evidence — Lighthouse reports, axe scans,
responsive screenshots, repo-structure captures, and key user-flow captures.

Evidence must be dated and tied to a specific project. **Do not add placeholder
scores or fabricated screenshots.** A claim is only linked from a page once the
capture for it actually exists here.

## Folder layout

```text
assets/evidence/
|-- lighthouse/      # Lighthouse JSON/HTML reports (homepage, work index, case studies)
|-- accessibility/   # axe scan exports + short markdown summaries
`-- screenshots/     # responsive + per-flow screenshots (project-prefixed)
```

Each subfolder has its own README describing exactly what belongs there, the
naming convention, and the capture method.

## Naming convention

`<surface>-<viewport>-<YYYY-MM-DD>.<ext>`

Examples:

- `home-mobile-2026-06-26.json`
- `codeherway-learner-flow-mobile-2026-06-26.png`
- `work-index-axe-2026-06-26.md`

## Capture status

axe scans are captured for every portfolio surface (see `accessibility/`);
Lighthouse and screenshots are still planned, not results. The repo README's
**Evidence Capture Checklist** is the single source of truth for what still
needs capturing.

| Surface | Lighthouse (mobile) | Lighthouse (desktop) | axe | Screenshots |
| --- | --- | --- | --- | --- |
| Homepage | planned | planned | 2026-08-16 | planned |
| Work index | planned | — | 2026-08-16 | planned |
| CodeHerWay case study | planned | — | 2026-08-16 | planned |
| CEO OS case study | planned | — | 2026-08-16 | planned |
| Aura Weather case study | planned | — | 2026-08-16 | planned |

The Aura Weather product app also has one exported axe run of its CI gate
(`accessibility/aura-weather-app-axe-2026-08-16.md`).

The manual **Lighthouse evidence** GitHub workflow can produce the Lighthouse JSON
against a deployed URL; export it here with the date in the filename.
