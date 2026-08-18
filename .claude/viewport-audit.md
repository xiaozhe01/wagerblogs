# Viewport / Responsive Audit — WagerBlogs Front End

Living document. Re-scanned on request; see "Change log" at the bottom for
what's added/resolved on each pass.

**Status: all 7 findings from the initial pass resolved, plus 3 more found
and fixed during the fix pass itself.** See the 2026-08-17 change-log
entry for the full account. A 2026-08-18 strict re-sweep reconfirmed zero
regressions on all 10 and found 2 new open items (VP-8, VP-9 — flagged
not fixed per direct instruction) — see those entries below.

**Method:** automated Playwright sweep of every route × five breakpoints
(320px, 425px, 768px, 1024px, 1440px) checking for (a) non-200/404 HTTP
status, (b) page-level horizontal overflow, (c) per-element `scrollWidth >
clientWidth` as a proxy for "content doesn't fit its box." Flagged
combinations were then screenshotted and read to confirm real visual
breakage vs. false positives.

**Confirmed clean, not re-checking unless something regresses:**
- `/this-route-does-not-exist` returns genuine HTTP 404 (not a soft-404) at
  all five breakpoints — CLAUDE.md rule #6 compliance verified.
- No route has page-level (`document.body`) horizontal scroll at any tested
  width.

---

## High severity — real visual breakage, RESOLVED 2026-08-17

- [x] **VP-1 — Both review templates: 6-column score grid crams at 1024px**
  - **Location:** `app/reviews/[slug]/page.tsx:231`, `app/reviews/[slug]/full-review/page.tsx:228` — both `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-legacy-4 md:gap-3`.
  - **What's broken:** the ODDS/APP/PAYOUTS/MARKETS/SUPPORT/TRUST score-breakdown row switches to 6 columns at `lg:` (1024px), exactly where the page shell's `SideNav` + rail squeeze the content column down to ~350-460px. Measured 18-24 elements with `scrollWidth > clientWidth` on this page at 1024px (e.g. a label box measured 18px wide needing 42px). Same root cause as the homepage bugs fixed this session (`RankedList`, `FeaturedBonusesCard`, `MarketCard`) — a dense multi-column grid switching on the raw `lg:` viewport breakpoint instead of on actual available content-column width.
  - **Suggested fix:** same pattern already proven on the homepage — `grid-cols-2 md:grid-cols-3 lg:grid-cols-3 wide:grid-cols-6!` (or similar; needs a measured pass to pick the right intermediate column count) using the existing `--breakpoint-wide: 1370px` token, with `!` since it competes with `lg:` on the same property (see the Tailwind v4 custom-breakpoint cascade-order note in VP-3 below).

- [x] **VP-2 — `full-review/page.tsx` has its own independent, still-broken comparison table**
  - **Location:** `app/reviews/[slug]/full-review/page.tsx:271,282,292` — three `grid grid-cols-[132px_repeat(3,minmax(0,1fr))]` rows (header/compareRows/LINK), same shape as `components/section/ComparisonCard.tsx` had before this session's fix.
  - **What's broken:** identical bug class to the already-fixed `ComparisonCard`: `minmax(0,1fr)` columns can shrink to near-zero, and `.btn-primary`'s `white-space:nowrap` CTA text doesn't fit, producing clipped/overlapping text at squeezed lg widths.
  - **Why it's a problem:** this is DRY-9 / DRY-1 from `.claude/dry-audit.md` in its purest form — the fix already exists and works (`components/section/ComparisonCard.tsx`), but this file never imports it; it has its own hand-rolled copy that never got the fix.
  - **Suggested fix (needs a decision, not just a patch):** either (a) replace this inline block with `<ComparisonCard />` outright, or (b) apply the same `min-w-150` + `overflow-x-auto` + `minmax(110px,1fr)` treatment locally if the content genuinely needs to differ from the homepage's comparison table. (a) is the DRY-correct fix but touches the review-template-consolidation question `.claude/dry-audit.md` DRY-8 already flagged as "needs your call."

- [x] **VP-3 — `categories/[slug]/page.tsx` Editor's Lead card breaks starting at 768px, not just 1024px**
  - **Location:** `app/categories/[slug]/page.tsx:179-196` — `<Link className="flex flex-col md:flex-row ...">` wrapping a `<div className="w-full md:w-[320px] h-45 md:h-50 shrink-0 ...">` image and a `<div className="min-w-0 flex flex-col gap-2">` text block.
  - **What's broken:** the image is a fixed 320px + `shrink-0` from `md:` (768px) onward and never gives space back. At 768px tablet width the content column is only ~444px, so text gets squeezed to ~84px; at 1024px (content column ~350-460px) it drops to ~24px — heading/excerpt/meta wrap into an almost-unreadable single-word-per-line column that visually overlaps the rail. This is worse than VP-1/VP-2 and starts one breakpoint earlier (768px, not 1024px) since the fixed-width image is already too large a fraction of the tablet content column before the sidebar even enters the picture.
  - **Suggested fix:** defer the row layout from `md:flex-row`/`md:w-[320px]` to `wide:flex-row`/`wide:w-[320px]` (1370px) — below that, keep the mobile-style stacked layout (image full-width on top, text below), which already renders correctly today. Needs the same `!`-important treatment if `md:` and `wide:` end up competing on the same property (verify against the cascade-order quirk noted in VP-1).

## Low severity — cosmetic, RESOLVED 2026-08-17

- [x] **VP-4 — Homepage 320px: CTA buttons overflow their card by 8-23px.** `components/RankedList.tsx` was completely rebuilt in the same session this fix pass happened in (multiple iterations — see `.claude/visual-consistency-audit.md`'s change log); the "Visit ExampleBet" full-text button this finding named no longer exists in that form. Confirmed no longer applicable via the comprehensive final sweep (below) at 320px — 0 flagged elements.
- [x] **VP-5 — Homepage 768px: `MarketCard`'s tablet 4-column grid is itself slightly tight.** Confirmed clean via the same final sweep.
- [x] **VP-6 — Homepage 1440px: `RankedList`'s dense row shows a 3px overflow.** Same — component was rebuilt since this finding, confirmed clean.
- [x] **VP-7 — `responsible-gambling/help-directory` 1024px: one entry row overflows.** Root cause fully diagnosed (not just patched): the grid item lacked `min-w-0` (CSS Grid items default to `min-width: auto`, not 0), AND separately the 2-column grid jumped in at `md:` (768px) and never backed off when the sidebar appears at `lg:` (1024px) — the same root cause class as VP-1/VP-3, just not recognized as such in the original pass. Fixed both: added `min-w-0` to the grid item, and `lg:grid-cols-1 wide:grid-cols-2!` to defer the second column past the squeeze zone. Verified clean at 768/1024/1370/1440px after the fix.

## Low severity — cosmetic, found 2026-08-18 (open, not fixed)

- [ ] **VP-8 — `RankedList` operator-name column tight-wraps at 1024px on `/` and `/reviews`.**
  - **Location:** `components/RankedList.tsx:17` — `<div className="min-w-0 flex-1 flex flex-col gap-2">` (the text column).
  - **What's broken:** at 1024px the sidebar squeezes the content column (same root-cause family as VP-1/VP-3/VP-7 — a component that only defers layout changes to the `wide:` 1370px breakpoint, not `lg:`), so long operator names (e.g. "Northline Sports (placeholder competitor)") wrap into 3-4 short lines instead of the intended 1-2. Measured ~7px `scrollWidth` overflow on ~6 rows per affected page. Confirmed via cropped screenshots, not just the heuristic: text wraps but is NOT clipped, NOT overlapping, and rank/logo/CTA all stay correctly positioned — readable, just visually cramped. Doesn't meet the bar for real visual breakage the way VP-1/VP-3/VP-7 did, hence low severity.
  - **Why it's new:** the 2026-08-17 fix pass's own closing note said "only the known-safe 16px `-mx-3` pattern remains anywhere" — `RankedList` has evidently been rebuilt/adjusted again since that final sweep (it went through several rebuild rounds that session; see `.claude/visual-consistency-audit.md`'s change log).
  - **Suggested fix:** same pattern as VP-1/VP-7 — defer the row's CTA-column width or overall layout to `wide:` instead of applying part of it at `md:`/default, so the text column doesn't get squeezed to its narrowest point in the 768-1369px zone. Not fixed in this pass — flagged per direct instruction.

- [ ] **VP-9 — Homepage `BlogPostCard` grid crams at 1024px, same root-cause class as VP-1/VP-3/VP-7/VP-8, raised directly.**
  - **Location:** `components/cards/BlogPostCard.tsx:6` — `grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3`.
  - **What's broken:** switches to 2 columns at `md:` (768px) and never backs off when the sidebar appears at `lg:` (1024px) — never defers to either of the project's own wider-breakpoint tokens the way the other VP-1-class fixes do. Measured on the live homepage via Playwright: at 1024px each card renders at **~184px wide**, headline text wrapping onto 3 short lines ("[Placeholder] How moneylines actually work" → 3 lines) — readable but visibly cramped, not the intended ~352px/card the original `BlogPostCard` rebuild targeted. Confirmed via screenshot at 1024px (cramped) vs. a simulated single-column preview at the same width (comfortable, titles on 1-2 lines) before proposing anything.
  - **Suggested fix — reuses an already-live pattern, not a new one:** `components/section/FeaturedBonusesCard.tsx:8` already solves this exact "2-up card grid squeezed by the sidebar" case with `grid-cols-1 md:grid-cols-2 lg:grid-cols-1 cards-wide:grid-cols-2!`, using the project's own `--breakpoint-cards-wide: 1250px` token (`globals.css:133`, documented specifically as "the earlier threshold for 2-up card grids, which need less room than a dense per-row layout to look right again" — as opposed to `--breakpoint-wide: 1370px`, reserved for denser per-row layouts like the reviews score grid). Applying the identical class list to `BlogPostCard.tsx:6` (`grid-cols-1 md:grid-cols-2 lg:grid-cols-1 cards-wide:grid-cols-2! gap-legacy-4 md:gap-3`) gives: <768px unchanged (single column); 768-1023px unchanged (2 columns, no squeeze there — tablet has no sidebar); 1024-1249px reverts to full-width single column; ≥1250px back to 2 columns at ~255-310px/card, matching `FeaturedBonusesCard`'s already-proven width at the same threshold. Confirmed via direct instruction to use the existing 1250px `cards-wide` convention rather than holding single-column out to 1440px. Not fixed in this pass — flagged per direct instruction, held here for a future implementation pass.

---

## Not flagged — checked, no issue found

- Page-level horizontal scroll on any route/width combination.
- HTTP status correctness on the 404 route (genuine 404, not soft-404) across all five breakpoints.
- Every homepage component fixed earlier this session (`RankedList`, `ComparisonCard`, `FeaturedBonusesCard`, `MarketCard`) — reconfirmed clean at 1024-1439px as part of this same sweep, no regressions.

---

## Change log

- **2026-08-06 — initial pass.** Automated sweep across 10 routes × 5 breakpoints (320/425/768/1024/1440px) using Playwright, following up on the homepage-only fixes made earlier in this session. 7 findings added (VP-1 through VP-7): 3 high severity (review templates' 6-col score grid, full-review's un-migrated duplicate comparison table, categories Editor's Lead fixed-width image), 4 low severity/cosmetic. Nothing fixed yet — this pass is documentation only, queued for after the current commit-sequence lands.
- **2026-08-17 — full fix pass, all findings resolved, 3 new ones caught.**
  Raised directly, asked point-blank whether a full responsive sweep had
  actually been run across everything changed in the (very long) session
  up to that point — it hadn't; verification had been reactive spot-checks
  at 1-2 desktop widths per change, not systematic. Ran the same method as
  the original audit (automated overflow-detection sweep, 12 routes × 6
  breakpoints — added 1370px for the `wide:` breakpoint threshold, kept
  320/425/768/1024/1440), then screenshotted every flag to confirm real
  breakage vs. false positive.
  **VP-1 fixed:** both reviews templates' hero header row (`lg:flex-row`)
  and score grid (`lg:grid-cols-6`) switched to `wide:` variants, matching
  the exact pattern already proven on the homepage components.
  **VP-2 confirmed already resolved** — `full-review/page.tsx` now
  imports and uses `<ComparisonCard id="scores" />` directly (no
  hand-rolled duplicate remains), a side effect of the DRY-9 fix in
  `.claude/dry-audit.md` that landed after this doc's initial pass but
  was never cross-referenced back here.
  **VP-3 fixed:** `categories/[slug]`'s Editor's Lead card image/row
  deferred from `md:flex-row`/`md:w-[320px]` to `wide:`, exactly per the
  original suggested fix. Overflow dropped from 155px (1024px) / 95px
  (768px) to 0.
  **VP-7 fixed** — see above, root cause was actually two stacked bugs
  (missing grid-item `min-w-0` + the same VP-1-class breakpoint issue),
  not the vague "single instance" the original pass left it as.
  **3 new findings caught by the same sweep, not in the original 7:**
  (1) `RankedList` collapsed completely at 320px — CTA buttons overlapping
  the summary text, rank/logo pushed out of position — because the
  component (rebuilt from scratch earlier in this same session into a
  dense single-row "compact scan row" layout) had zero responsive
  fallback for narrow phones at all. Fixed by stacking the row
  (`flex-col` below `md:`, grouping rank+logo as their own inner row so
  they don't scatter). (2) `authors/[slug]`'s avatar+name header switched
  to `md:flex-row` and clipped the H1 at 1024px — same VP-1-class root
  cause, not previously documented since this page wasn't touched in the
  original pass's route list at the time. Fixed with the same
  `md:`→`wide:` deferral. (3) A false-positive class identified and
  excluded from the sweep's heuristic going forward: `ComparisonCard`'s
  `overflow-x-auto` table wrapper intentionally scrolls within its own
  bounded box when its `min-w-150` content exceeds available width — this
  is the designed-safe fallback (same category as the `PostRow`/`NewsCard`
  negative-margin hover technique, confirmed via direct measurement
  earlier in the same session to never cause real page-level scroll) —
  not a bug, but it was tripping the raw `scrollWidth > clientWidth`
  per-element check at up to 268px "overflow" before being excluded.
  `tsc --noEmit`/`eslint` clean after every fix. Final re-sweep after all
  fixes: only the known-safe 16px `-mx-3` pattern remains anywhere,
  confirmed unchanged from before this pass (not a regression).
- **2026-08-18 — strict re-sweep, 0 regressions, 1 new low-severity
  finding.** Per direct instruction to re-run the full audit rather than
  spot-check, re-swept all 15 real routes (14 real paths + the synthetic
  404 path — `find app -name page.tsx` confirmed no new routes since the
  last pass) × the same 6 breakpoints (320/425/768/1024/1370/1440),
  screenshotting every heuristic flag before treating it as a real
  finding, same discipline as the original pass. **All 10 previously-fixed
  items (VP-1 through VP-7, plus the 3 unnumbered ones from the
  2026-08-17 fix-pass changelog) reconfirmed correct, zero regressions.**
  Page-level horizontal overflow: 0 across all 90 route×breakpoint
  combinations. 404 route (CLAUDE.md rule #6): genuine HTTP 404 at all 6
  breakpoints, reconfirmed. **New finding:** VP-8 (see above) —
  `RankedList` text column tight-wraps at 1024px on `/` and `/reviews`;
  not clipped or overlapping, so kept at low severity rather than treated
  as a VP-1-class break. **Methodology refinement, worth carrying into
  future sweeps:** most of this pass's raw heuristic flags (on 6 of 15
  routes) turned out to be 16px of harmless ancestor `scrollWidth`
  bubbling from the already-known-safe `-mx-3 px-3` hover-fill technique
  — the technique itself is unchanged and correctly excluded when
  checking the flagged element directly, but the sweep also walks
  ancestors, and a bled row's bounding box legitimately extends into its
  parent's padding gutter with zero visual effect. Recommend the
  exclusion also walk descendants for the known-safe classes (not just
  check the flagged element itself) so future sweeps don't have to
  re-diagnose the same non-issue. One more flag
  (`components/ui/pagination.tsx:105`'s `sr-only` ellipsis label, on
  `/categories/esports-betting` only) traced to a standard
  accessibility-hidden element with `clientWidth: 1` — no visual
  footprint, not a bug. Scripts and full screenshot set left in the
  session scratchpad for reproducibility (`viewport-sweep.mjs`,
  `viewport-sweep-results.json`, `diagnose*.mjs`, plus per-route/breakpoint
  PNGs) — not committed to the repo. Read-only pass, no fixes applied,
  per direct instruction to flag rather than fix this time.
- **2026-08-18 — VP-9, `BlogPostCard` homepage grid squeeze, raised
  directly** (same root-cause class as VP-1/VP-3/VP-7/VP-8, not caught by
  either the original audit or the same-day re-sweep above — `BlogSection`
  wasn't in either pass's specific problem list until pointed out
  directly). Measured live via Playwright before proposing anything (per
  this project's standing "measure before refactor" discipline): current
  `grid-cols-1 md:grid-cols-2` renders each card at ~184px wide at
  1024px. Simulated the proposed fix in the live page via a CSS override
  (not yet applied to source) and screenshotted both states side by side
  for direct comparison before getting sign-off. Confirmed the exact fix
  by finding it already solved and live for the same problem shape on
  `FeaturedBonusesCard.tsx:8`, using the project's own
  `--breakpoint-cards-wide: 1250px` token — reused verbatim rather than
  inventing a new threshold. Directly confirmed to use that existing
  1250px convention over a proposed alternative (holding single-column
  out to 1440px). Logged as VP-9 above — not implemented yet, held in
  this document per direct instruction ("hold that onto the audit md
  files") for a future pass.
