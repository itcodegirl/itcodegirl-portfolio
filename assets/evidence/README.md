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

Nothing in this folder is captured yet. The table below is the plan, not a set of
results. The repo README's **Evidence Capture Checklist** is the single source of
truth for what still needs capturing.

| Surface | Lighthouse (mobile) | Lighthouse (desktop) | axe | Screenshots |
| --- | --- | --- | --- | --- |
| Homepage | planned | planned | planned | planned |
| Work index | planned | — | planned | planned |
| CodeHerWay case study | planned | — | planned | planned |
| CEO OS case study | planned | — | planned | planned |
| Aura Weather case study | planned | — | planned | planned |

The manual **Lighthouse evidence** GitHub workflow can produce the Lighthouse JSON
against a deployed URL; export it here with the date in the filename.
