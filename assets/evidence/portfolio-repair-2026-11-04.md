# Portfolio repair verification - November 4, 2026

Scope: repair broken image references and resume destinations; add two case
studies using public source evidence. No production deployment is part of this
change.

## Images

The baseline link checker reported 20 missing references across the learner-trust
page and work directory. The four absent screenshot families were:

- `codeherway-lesson-workspace`
- `codeherway-progress-snapshot`
- `codeherway-learning-transcript`
- `codeherway-code-editor`

Each family was referenced at 640, 960, and 1200 pixels. None of those files was
tracked in any fetched portfolio branch or found by exact-name searches in the
local user project folders or on Zeus. The original page-addition commit says
the captures were intended to land separately; the fetched image history does
not contain them.

The repair uses the existing, visually inspected `codeherway-dashboard` family
for the directory card, page hero, and social metadata. It shows the landing and
account-creation screen. The new caption identifies that screen accurately and
says it is product context, not before-and-after proof. The other three broken
figures and their unavailable-capture captions were removed. Signed-in flow
captures are still needed; no replacement screenshots or results were fabricated.

## Resume

The one-page PDF was rendered before and after the change. Its layout and body
copy were preserved. All 11 URI annotations were inspected and corrected:

- Portfolio: `https://itcodegirl.com/`
- GitHub: `https://github.com/itcodegirl` (visible address corrected too)
- LinkedIn: `https://www.linkedin.com/in/jennazawaski`
- CodeHerWay: its public website, the portfolio's code-access evidence section,
  and its platform case study. The misleading `View Code` label now says
  `Code access` because the platform repository is private.
- CEO OS: its own live demo, public repository, and portfolio case study.
- Aura Weather: its own live demo and public repository.

The old PDF incorrectly sent the CodeHerWay and CEO OS demo/code links to Aura
Weather. Its portfolio, GitHub, and LinkedIn destinations were malformed.

## New case studies

- Study Journal: reviewed public source at
  `237abe2421bb63836208e80ef39c824620fa1ac7`. The page covers deliberate study-object
  creation, source linkage, serialized autosave, and recovery. Typecheck, lint,
  all 76 unit/component tests, and the production build passed locally. The
  emitted entry JavaScript was 820.69 kB (258.61 kB gzip). The page does not claim
  hosted CI, production deployment, account sync, or measured learner outcomes.
- Cinova: reviewed public source at
  `c3fa5952a0bb8fa4e01d33c1aa293e9ba66f9ae6`. The page covers request timeouts,
  bounded retries, caching, and recoverable UI states. Static checks,
  JavaScript typecheck, and four encoding-helper unit tests passed locally.
  Browser-test source uses TMDB fixtures. The accessibility spec disables
  color-contrast and gates only serious/critical findings; the page explicitly
  avoids a comprehensive accessibility or WCAG-conformance claim.

Both pages link directly to pinned source revisions, describe AI-assisted
development, and state the current product limits. They reuse the existing
portfolio styles and appear in the work directory and sitemap. Static and route
checks now include both pages and the previously omitted learner-trust page.

## Checks

- JavaScript syntax checks passed.
- Static site budgets and structure passed.
- Internal links, fragments, image paths, and responsive image references passed.
- Route readiness passed for the existing and new pages.
- External URL health passed for all 28 inventoried URLs, with LinkedIn returning
  its anti-bot status 999 rather than a normal response.
- Desktop and 390 px phone previews of both new pages were inspected.
- The repaired learner-trust image was confirmed loaded in the browser.
- The repaired PDF was visually inspected after rendering, and all 11 link
  destinations were re-extracted from the written file.

No Lighthouse or field-performance result is claimed by this repair.
