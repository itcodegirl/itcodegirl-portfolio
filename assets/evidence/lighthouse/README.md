# Lighthouse reports

Store captured Lighthouse reports here as JSON (and optional HTML), one file per
surface + viewport + date.

## What to capture

- `home-mobile-<date>.json` — homepage, mobile preset
- `home-desktop-<date>.json` — homepage, desktop preset
- `work-index-mobile-<date>.json` — `/work/`
- `codeherway-mobile-<date>.json` — `/work/codeherway/`
- `ceo-os-mobile-<date>.json` — `/work/ceo-os/`
- `aura-weather-mobile-<date>.json` — `/work/aura-weather/`

## How to capture

1. Run the manual **Lighthouse evidence** GitHub workflow against the deployed URL,
   or run Lighthouse locally:
   `npx lighthouse https://itcodegirl.com/ --preset=desktop --output=json --output-path=...`
2. Save the JSON here with the dated filename.
3. Optionally validate against the budget:
   `node scripts/check-lighthouse-result.mjs --report=assets/evidence/lighthouse/<file>.json`

Only after a report exists here should a page reference its scores. Until then,
performance copy stays framed as *considerations*, not measured outcomes.
