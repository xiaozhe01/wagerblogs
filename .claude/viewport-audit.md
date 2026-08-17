# Viewport / Responsive Audit — WagerBlogs Front End

Living document. Read-only findings as of the pass below — no code was
touched to produce this beyond what's already landed on `develop` (the
homepage component fixes earlier in this session). Re-scanned on request;
see "Change log" at the bottom for what's added/resolved on each pass.

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

## High severity — real visual breakage, not yet fixed

- [ ] **VP-1 — Both review templates: 6-column score grid crams at 1024px**
  - **Location:** `app/reviews/[slug]/page.tsx:231`, `app/reviews/[slug]/full-review/page.tsx:228` — both `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-legacy-4 md:gap-3`.
  - **What's broken:** the ODDS/APP/PAYOUTS/MARKETS/SUPPORT/TRUST score-breakdown row switches to 6 columns at `lg:` (1024px), exactly where the page shell's `SideNav` + rail squeeze the content column down to ~350-460px. Measured 18-24 elements with `scrollWidth > clientWidth` on this page at 1024px (e.g. a label box measured 18px wide needing 42px). Same root cause as the homepage bugs fixed this session (`RankedList`, `FeaturedBonusesCard`, `MarketCard`) — a dense multi-column grid switching on the raw `lg:` viewport breakpoint instead of on actual available content-column width.
  - **Suggested fix:** same pattern already proven on the homepage — `grid-cols-2 md:grid-cols-3 lg:grid-cols-3 wide:grid-cols-6!` (or similar; needs a measured pass to pick the right intermediate column count) using the existing `--breakpoint-wide: 1370px` token, with `!` since it competes with `lg:` on the same property (see the Tailwind v4 custom-breakpoint cascade-order note in VP-3 below).

- [ ] **VP-2 — `full-review/page.tsx` has its own independent, still-broken comparison table**
  - **Location:** `app/reviews/[slug]/full-review/page.tsx:271,282,292` — three `grid grid-cols-[132px_repeat(3,minmax(0,1fr))]` rows (header/compareRows/LINK), same shape as `components/section/ComparisonCard.tsx` had before this session's fix.
  - **What's broken:** identical bug class to the already-fixed `ComparisonCard`: `minmax(0,1fr)` columns can shrink to near-zero, and `.btn-primary`'s `white-space:nowrap` CTA text doesn't fit, producing clipped/overlapping text at squeezed lg widths.
  - **Why it's a problem:** this is DRY-9 / DRY-1 from `.claude/dry-audit.md` in its purest form — the fix already exists and works (`components/section/ComparisonCard.tsx`), but this file never imports it; it has its own hand-rolled copy that never got the fix.
  - **Suggested fix (needs a decision, not just a patch):** either (a) replace this inline block with `<ComparisonCard />` outright, or (b) apply the same `min-w-150` + `overflow-x-auto` + `minmax(110px,1fr)` treatment locally if the content genuinely needs to differ from the homepage's comparison table. (a) is the DRY-correct fix but touches the review-template-consolidation question `.claude/dry-audit.md` DRY-8 already flagged as "needs your call."

- [ ] **VP-3 — `categories/[slug]/page.tsx` Editor's Lead card breaks starting at 768px, not just 1024px**
  - **Location:** `app/categories/[slug]/page.tsx:179-196` — `<Link className="flex flex-col md:flex-row ...">` wrapping a `<div className="w-full md:w-[320px] h-45 md:h-50 shrink-0 ...">` image and a `<div className="min-w-0 flex flex-col gap-2">` text block.
  - **What's broken:** the image is a fixed 320px + `shrink-0` from `md:` (768px) onward and never gives space back. At 768px tablet width the content column is only ~444px, so text gets squeezed to ~84px; at 1024px (content column ~350-460px) it drops to ~24px — heading/excerpt/meta wrap into an almost-unreadable single-word-per-line column that visually overlaps the rail. This is worse than VP-1/VP-2 and starts one breakpoint earlier (768px, not 1024px) since the fixed-width image is already too large a fraction of the tablet content column before the sidebar even enters the picture.
  - **Suggested fix:** defer the row layout from `md:flex-row`/`md:w-[320px]` to `wide:flex-row`/`wide:w-[320px]` (1370px) — below that, keep the mobile-style stacked layout (image full-width on top, text below), which already renders correctly today. Needs the same `!`-important treatment if `md:` and `wide:` end up competing on the same property (verify against the cascade-order quirk noted in VP-1).

## Low severity — cosmetic, not urgent

- [ ] **VP-4 — Homepage 320px: CTA buttons overflow their card by 8-23px.** `.btn-primary`'s `white-space: nowrap` on "Visit ExampleBet" / "Visit Crownline Coins" at the narrowest phone width. `components/RankedList.tsx`.
- [ ] **VP-5 — Homepage 768px: `MarketCard`'s tablet 4-column grid is itself slightly tight (~11-27px overflow).** Separate from the already-fixed 1024-1369px squeeze (`lg:grid-cols-2 wide:grid-cols-4!`) — this is the `md:grid-cols-4` tier itself, at the 768px minimum. `components/section/MarketCard.tsx`.
- [ ] **VP-6 — Homepage 1440px: `RankedList`'s dense row shows a 3px overflow.** Likely gap/rounding noise, not a real visual defect — worth a quick look but probably not worth chasing on its own.
- [ ] **VP-7 — `responsible-gambling/help-directory` 1024px: one "Support line — Nordics / SE / NO / DK" row overflows ~23px.** Single instance, not yet localized to an exact line.

---

## Not flagged — checked, no issue found

- Page-level horizontal scroll on any route/width combination.
- HTTP status correctness on the 404 route (genuine 404, not soft-404) across all five breakpoints.
- Every homepage component fixed earlier this session (`RankedList`, `ComparisonCard`, `FeaturedBonusesCard`, `MarketCard`) — reconfirmed clean at 1024-1439px as part of this same sweep, no regressions.

---

## Change log

- **2026-08-06 — initial pass.** Automated sweep across 10 routes × 5 breakpoints (320/425/768/1024/1440px) using Playwright, following up on the homepage-only fixes made earlier in this session. 7 findings added (VP-1 through VP-7): 3 high severity (review templates' 6-col score grid, full-review's un-migrated duplicate comparison table, categories Editor's Lead fixed-width image), 4 low severity/cosmetic. Nothing fixed yet — this pass is documentation only, queued for after the current commit-sequence lands.
