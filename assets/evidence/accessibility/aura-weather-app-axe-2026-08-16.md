# Aura Weather app (product) — axe scan 2026-08-16

- Tool: axe-core 4.11.3 (@axe-core/playwright, Chromium)
- URL/viewport: `/?mock=missing` @ 1280px — the app's portfolio demo state,
  which renders the missing-data trust contract without querying live providers
- Source: `itcodegirl/aura-weather` @ `52913cf08916481db83ab9f2c167a88a64c410ff`,
  production Vite build served with `vite preview`
- Method: a local run of the same axe check Aura gates in CI
  (`e2e/missing-data.spec.js`, rule tags WCAG 2.0 A + AA); the full spec passed
  3/3 in the same session
- Violations: 0 (critical: 0, serious: 0, moderate: 0, minor: 0) — 26 rule passes
- Notable items: 106 color-contrast nodes are marked "incomplete" (axe cannot
  auto-judge text over the app's gradient weather backdrops); these need manual
  review and are not recorded as passes.
- Notes: this is one captured state, not a whole-app audit. Aura's CI runs this
  gate on every push; CEO OS's axe CI gate is not exported here yet. Raw
  export: [`aura-weather-app-axe-2026-08-16.json`](./aura-weather-app-axe-2026-08-16.json).
