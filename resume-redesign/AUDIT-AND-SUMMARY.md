# Résumé audit & redesign — Jenna Zawaski

Date: 2026-11-04. Original preserved untouched at `assets/JennaZawaski-Resume.pdf`
(Canva, 1 page). Nothing was deployed, replaced, or sent.

Note on skills: the named skills "Design Partner", "Design Arc", and
"Frontend Design Premium" are not installed in this environment, so they could
not be loaded. The review/redesign followed their stated intent (structured
design review, clear direction, premium frontend craft) using PDF/DOCX tooling
directly. No universal ATS compatibility or accessibility certification is claimed.

## Prioritized findings (verified against the actual PDF, visually + text layer)

### Critical
1. **Bachelor's degree line is 2 pt type** — a real visible defect, not an
   extraction artifact. "Bachelor's Degree – Information System Security" is set
   at 2.0 pt (measured in the PDF text layer) and renders as an unreadable
   smudge above "American Public University | Sept. 2014". Its school/date line
   below it is 9 pt, so the degree itself is the smallest text on the page.
2. **Broken/wrong link targets** (visible text often looks right; targets differ):
   - LinkedIn target is `linkedin.com/in/jennazawask` — missing the final "i"
     (correct: `jennazawaski`, confirmed by the portfolio's own structured data).
   - GitHub target is `github.com/itcodegirl.com` — not her profile
     (correct: `github.com/itcodegirl`); returns an error on request.
   - Portfolio target is an old `itcodegirl.github.io/itcodegirlportfolio.com`
     URL — returns 404 (correct: `itcodegirl.com`).
   - Project links are cross-wired: CodeHerWay's [Live Demo]/[View Code]/[Case Study]
     point to Aura Weather / CEO OS URLs, and every project's links reuse the
     same wrong destinations. CodeHerWay code is a private repo, so a public
     "View Code" link for it should not exist at all.
3. **Reading order is scrambled for parsers.** The two-column Canva layout
   extracts in this order: name → CONTACT → SKILLS → EDUCATION → PROJECTS →
   WORK EXPERIENCE → PROFILE → freelance bullets → contact details → skills →
   education → projects. An ATS/screen reader gets sections out of order and
   contact details buried mid-document. Letter-spaced text also extracts with
   spaces between letters ("i t c o d e g i r l @ g m a i l . c o m").

### High
4. **"Crambridge College Global"** — spelled exactly that way in both the visible
   page and the text layer (9 pt), so it is a content spelling, not an extraction
   error. **Not changed** in the redesign; needs Jenna's confirmation (see below).
5. **Freelance role has no dates** — confirmed: "FREELANCE WEB DEVELOPER /
   Self-Employed | Chicago, IL" with no date range, visibly or in the text layer.
   No dates were invented; the redesign omits them and flags this below.
6. **Body text is 9–10 pt throughout**, below comfortable print size, and the
   sidebar forces narrow lines with frequent hyphen breaks ("hands-on",
   "condition-based", "performance-conscious" split across lines).

### Medium
7. Inconsistent typography: at least five font families (Poppins, Glacial
   Indifference, Montserrat, Canva Sans), mixed 9/10/12 pt body sizes even
   within one project entry, and gray body text (#D9D9D9-ish on white in the
   freelance block extracts as light gray) with weak contrast.
8. Vague project bullets ("Built a React-based platform…") undersell verified
   work documented on the portfolio (see below); no role/ownership stated.
9. Missing skills the portfolio substantiates: TypeScript, Playwright, Vercel.
   CodeHerWay course counts differ between portfolio pages (22/170/922 vs
   26/184/1,035), so no counts were used on the résumé.
10. Education order puts a 2022 certificate above graduate degrees with no
    labels distinguishing credential types; "FullStack" capitalization as printed.

### What worked in the original
Clear name/title header, complete contact set, familiar section names, strong
project selection, one-page discipline, and honest, un-inflated claims.

## What changed (before → after)
- Two-column Canva sidebar → **single column**, standard headings
  (Summary, Technical Skills, Experience, Selected Projects,
  Education & Certification), selectable text in reading order.
- Body type 9–10 pt in five fonts → **10.5 pt Helvetica/Calibri, one family**,
  headings 11.5–22 pt, dark text (#1B1B1B) on white, one restrained teal accent.
- All link targets corrected (list above); CodeHerWay "View Code" replaced with
  "Code walkthrough on request (private repository)" per the portfolio.
- Project bullets rewritten from portfolio-verified work, with role stated
  (Founder/sole frontend engineer; sole designer and engineer) and specifics:
  deduplicated retry-safe progress system (CodeHerWay); repository-pattern data
  layer across 8 domains, versioned storage, optimistic concurrency, corruption
  recovery, offline queue (CEO OS); three-API composition, nullish-rejection
  contracts, offline restore, PWA shell, Playwright/axe tests (Aura Weather).
  AI features (Ada companion) deliberately not claimed as frontend bullets.
- Education fully legible at 10.5 pt; school name and all dates reproduced
  exactly as printed in the original — nothing silently "fixed".
- Fits **one page** comfortably (verified visually at 150 dpi), with white
  space at the foot rather than shrunk type.

## Checks performed
- Original: rendered at 150 dpi and inspected visually; full text-layer
  extraction with per-line font/size/color; all 11 embedded link targets listed.
- New PDF: 1 page; re-rendered and inspected visually (no clipping, no tiny
  text — minimum 9.5 pt is the contact line only, body 10.5 pt); text extraction
  confirms complete content in logical order; all 13 link annotations listed.
- Link liveness: every new URL requested — all return 200 except LinkedIn
  (returns 999 to automated requests, LinkedIn's bot response, not a 404; the
  URL matches the portfolio's published profile). Old portfolio URL confirmed
  404; old GitHub URL confirmed erroring.
- DOCX: re-opened and text-extracted; 12 working hyperlinks; same content.
- Original file untouched (unmodified, still in place); no deploy, no sending.

## Facts Jenna still needs to confirm (grouped — redesign worked around all of them)
1. **Freelance dates**: start/end (or "Present") for Freelance Web Developer.
   The redesign omits dates; add them as soon as confirmed — recruiters expect them.
2. **School name**: is "Crambridge College Global" correct as printed, or should
   it read "Cambridge College Global"? Kept verbatim until you confirm.
3. **Master's institution/title**: confirm the exact degree name
   ("Engineering & Management Systems") and conferral month/year (May 2020).
4. **Phone on résumé**: (708) 541-3339 kept from the original — confirm you want
   a phone number on a publicly posted PDF (many people use email/LinkedIn only).
5. **Skill claims kept from the original**: GSAP/ScrollTrigger and PostgreSQL —
   confirm current proficiency level; TypeScript/Playwright/Vercel were added
   from your portfolio case studies — confirm you're comfortable being
   interviewed on them.
6. **CodeHerWay counts**: portfolio pages disagree (22 courses/922 lessons vs
   26/1,035). Résumé omits counts; reconcile the portfolio pages when you can.

## Tailoring advice for a specific posting
With no target posting, this is a general frontend résumé. For a specific role:
mirror the posting's exact keywords in Technical Skills (e.g. "React Testing
Library", "Next.js") only where truthful; reorder Selected Projects so the most
relevant leads; swap one bullet per project for the posting's top requirement
you can evidence; keep it to one page by cutting the least relevant project
first, never by shrinking type.

## Update — 2026-11-04 (Jenna's answers applied)
- Freelance role now marked "Present". Start date still unknown — not invented.
- Master's corrected per Jenna: Risk Management, Cambridge College Global,
  December 2020 (replaces "Engineering & Management Systems / Crambridge / May 2020").
- Per Jenna's "No" on Q5: removed GSAP/ScrollTrigger, PostgreSQL, TypeScript,
  Playwright, and Vercel skill/test claims everywhere (skills, project stacks,
  Aura test bullet, PDF metadata).
- Phone: application version keeps (708) 541-3339; a separate Public version
  (PDF + DOCX, "-Public" suffix) omits it for website posting.
- Re-verified: both PDFs 1 page, visually inspected, text extraction clean,
  phone present/absent as intended, no removed-skill strings remain.
- Freelance dates completed per Jenna: January 2021 – Present. No open facts remain.
