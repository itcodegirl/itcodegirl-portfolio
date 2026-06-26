# Accessibility scans

Store axe (or equivalent) scan exports here, plus a short markdown summary per
surface so a reviewer can read the result without opening raw JSON.

## What to capture

- `home-axe-<date>.json` + `home-axe-<date>.md`
- `work-index-axe-<date>.json` + `.md`
- `codeherway-axe-<date>.json` + `.md`
- `ceo-os-axe-<date>.json` + `.md`
- `aura-weather-axe-<date>.json` + `.md`

## Summary template

```markdown
# <surface> — axe scan <date>

- Tool: axe-core <version> (browser extension / @axe-core/playwright)
- URL/viewport: <url> @ <width>px
- Violations: <n> (critical: <n>, serious: <n>, moderate: <n>, minor: <n>)
- Notable items: <short list or "none">
- Notes: <what was checked, what was out of scope>
```

## Context

`@axe-core/playwright` already runs in CI for the CodeHerWay smoke suite, CEO OS,
and Aura. This folder is for **exported, dated** evidence of those runs against the
deployed portfolio pages — not a substitute for the CI gate. Do not record a clean
result that has not actually been run.
