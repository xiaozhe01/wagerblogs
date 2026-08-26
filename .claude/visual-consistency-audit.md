# Visual Consistency Audit — WagerBlogs Front End

Living document, same convention as `.claude/dry-audit.md` and
`.claude/viewport-audit.md`. Read-only findings as of the pass below — no
code touched to produce this. Scope: text size, line-height, gap, padding,
margin, border-radius, and divider/border color, across every file in
`app/` and `components/`, checked against the token system documented in
`app/globals.css`'s `@theme` block.

**Why this document exists:** the 2026-08-17 DRY-fix pass (see
`.claude/dry-audit.md`) extracted 13 shared components under a strict
"preserve exact visual output" rule — every call-site override, even
visibly inconsistent ones, was carried over unchanged on purpose, so the
refactor was safe to do blind. This pass is the deliberate reversal of that
rule: normalize the inconsistencies the DRY pass found and explicitly chose
not to touch (`EditorialSection`'s `gap-3`/`gap-4` outliers, `PostRow`'s
`py-4`/`py-4.5` and `text-xl`/`text-2xl` split, `ChipList`'s
`rounded-lg`/`rounded-full` split, `TeaserCardGrid`'s title-size split),
plus a full independent sweep that surfaced ~20 more instances the DRY
pass's duplication-only lens never had reason to look for.

**Method:** two parallel full-repo reads (one scoped to `app/`, one to
`components/`, cross-referencing each other's call sites), each producing
a read-only inventory grouped by _visual role_ (what the element visually
is/does) rather than by raw class name — the point is catching cases where
the same kind of thing is styled differently in different places. Findings
below are the merged, deduplicated result, spot-verified against the
actual source for every item where the two independent passes disagreed
or where severity needed confirming (one factual correction made:
`responsible-gambling/page.tsx:76` uses `leading-lead`, not `leading-copy`
as one pass initially reported — confirmed via direct read).

**Token system reference** (`app/globals.css`, full detail there).
⚠ **The type-scale figures below are as-of 2026-08-17 and are now stale** —
`--text-h2-serif` was renamed `--text-h2` during the font-unification pass,
and the 2026-08-25 type migration re-mapped every size token (`--text-2xs`
is 12px now, `--text-h2` 28px). Read `globals.css` for current values; the
spacing/radius/divider notes below are still accurate.
Type scale `--text-2xs`(10px)…`--text-h2-serif`(25px); spacing clean scale
`--spacing-1..8` (4/8/16/24/32/40/48/60px, used as `p-N`/`gap-N`/etc. —
NOTE these override Tailwind's stock numeric spacing, so e.g. `p-3` here
is 16px, not Tailwind's default 12px); spacing legacy scale
`--spacing-legacy-1..7` (2/6/10/12/14/20/28px, the file's own comment says
"prefer the clean scale in new work, treat legacy as exceptions"); radius
`--radius-sm`(6px, compact tiles/chips/inputs) / `--radius-md`(8px,
cards/sections/CTAs/avatars); divider colors `--color-border-divider`
(#e4e4e4) / `-divider-alt` (#e5e5e5, **confirmed unused anywhere** in
`app/`+`components/`) / `--color-border-hairline` (#f0f0f0) /
`-hairline-alt` (#f2f2f2).

**Confirmed intentional, not re-flagged below:** `AnchorList`'s plain-list
`py-3` (user-confirmed final value, see `feedback_anchorlist_py3_spacing`
memory); `ReviewSectionHeading`'s `items-center` trust-block row (already
fixed, unrelated to spacing).

---

## Foundational question this whole pass turns on

Several findings below have no clean majority, or pit the _clean_ spacing
scale against a _legacy_ value that is nonetheless the dominant pattern
in practice (e.g. `gap-legacy-4 md:gap-3` is used at 16+ sites — far too
consistently to be "drift," even though `globals.css`'s own comment calls
the legacy scale an exception-case). Before working through individual
items, this needs a default rule:

- **(a) Majority-wins from current usage** — whichever value already
  appears most often for a given role becomes canonical, regardless of
  which named scale (clean/legacy) it belongs to. Lowest-risk, fastest,
  treats the token system as already-settled and this pass as pure
  usage-consistency cleanup.
- **(b) Prefer the clean `--spacing-*`/`--text-*` scale** wherever a role's
  current majority is a legacy value, even if that means changing more
  call sites than (a) would. Matches `globals.css`'s own stated intent
  more literally, but is a bigger diff and starts to look like a token
  migration, not a consistency pass.

Findings below propose (a)-style majority targets by default; anywhere
the choice materially matters this is called out explicitly.

**Methodology rule, established during the Group B fix pass (applies
going forward to every remaining group):** where a section/component has
exactly one gap role between its children (e.g. "heading, then one
content block"), prefer a parent `flex flex-col gap-*` wrapper with no
child-side margin over hand-rolling that margin on the child. This is
strictly more robust — no margin-collapse fragility, matches the one
already-correct example in the codebase (`categories/page.tsx`'s "All
categories" section) — and is the standing target pattern, not just a
one-off fix. It does NOT mean forcing every gap inside a section to the
same value: where a section has multiple _different_ gap roles between
different sibling pairs (e.g. heading→intro-paragraph vs.
paragraph→content-box), a single `gap-*` can't represent more than one
value, so those keep explicit per-child margins — each one individually
consistent with wherever else that same role appears sitewide, per the
findings below.

---

## Summary table

All 58 findings with the decision actually taken. **The per-finding detail
sections (Groups A–K, ~990 lines) were removed on 2026-08-26** to stop this
document growing: every outcome they recorded is in this table, the two
standing rules they produced are in "Foundational question" above, the
pass-by-pass narrative is in the change log below, and the one finding that
is still open was migrated out. Nothing else in the repo referenced them.

Dates in the outcome column are when the decision landed, not when it was
first flagged.

| #     | Finding                                                | Type                       | Decision / outcome                                                                                                                                                 |
| ----- | ------------------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| VC-1  | Hero H1 scale/leading/`text-pretty`                    | cross-component-divergence | **Fixed** — both outliers → the majority 3-step scale (08-17)                                                                                                        |
| VC-2  | Standfirst responsive step + leading                   | cross-component-divergence | **Fixed** — all 8 → static `text-xl leading-copy`; the `md:text-2xl` step dropped (08-17)                                                                            |
| VC-3  | Page header wrapper gap                                | cross-component-divergence | **Fixed** — `gap-3` everywhere (08-17)                                                                                                                               |
| VC-4  | H2 section heading margin                              | cross-component-divergence | **Fixed** — 5 sections → parent `gap-3` with no child margin; 2 kept explicit `mb-3` (two gap roles); 1 already correct; 2 reclassified as VC-30 (08-17)             |
| VC-5  | In-document H2 (blog vs legal)                         | cross-component-divergence | **Left as-is** — confirmed an intentional dense-legal vs. editorial register split, not drift (08-18)                                                                |
| VC-6  | Rail card title margin                                 | cross-component-divergence | **Fixed** — `InfoCard` default `mb-2`→`mb-2.5` plus 5 outliers (08-17). One instance was missed and caught on 08-18: `HelpLineCard.tsx:7`                            |
| VC-7  | Rail card title font-size outlier                      | cross-component-divergence | **Fixed** — called as drift, not emphasis: `text-md`→`text-sm` (08-18)                                                                                               |
| VC-8  | Card/rail body copy size+leading                       | cross-component-divergence | **Fixed** — no majority existed, so anchored to `InfoCard`'s own default `text-xs leading-loose`; 4 sites (08-18)                                                    |
| VC-9  | Card/tile inner title combo                            | cross-component-divergence | **Fixed** — 5 combinations → `text-md font-semibold mb-1.5` across 5 sites; extended by VC-35, reconfirmed by VC-56 (08-18)                                          |
| VC-10 | `EditorialSection` wrapper gap                         | cross-component-divergence | **Fixed** — the `gap-4`/`gap-3` overrides removed outright rather than rewritten, so both fall through to the component default; verified live at 32px (08-18)       |
| VC-11 | `PostRow` padding + title size                         | cross-component-divergence | **Fixed** — `authors/[slug]`'s `py-4.5`/`text-2xl` → `py-4`/`text-xl` (08-17)                                                                                        |
| VC-12 | `TeaserCardGrid` title size/weight                     | cross-component-divergence | **Fixed — settled twice.** → `text-sm font-bold` (08-18), then reversed by VC-56 to `text-md font-semibold` (08-19). The "2 files" were two templates of one page    |
| VC-13 | `ChipList` radius                                      | radius-split               | **Fixed — corrected once.** First `rounded-full` (ChipList's internal majority), then the override removed from all 4 sites so chips inherit `.btn-*`'s radius (08-17) |
| VC-14 | `ArrowLink` missing `gap-1`                            | **real bug**               | **Fixed** — `gap-1` at all 6 call sites (08-17)                                                                                                                      |
| VC-15 | Arrow-link / `InfoCard` CTA text size                  | cross-component-divergence | **Fixed** — no "InfoCard cta slot" rule held on inspection; all CTAs → `text-md` (08-19)                                                                             |
| VC-16 | Boxed-container padding                                | cross-component-divergence | **Resolved** — `RankedList`'s 24px documented as an intentional register difference; the padding step standardized `lg:`→`md:` so it stops growing at the squeeze (08-19) |
| VC-17 | Card-grid gap outlier                                  | legacy-drift               | **Fixed** — 2 outliers → `gap-legacy-4 md:gap-3` (08-19)                                                                                                             |
| VC-18 | Meta-info row gap                                      | cross-component-divergence | **Fixed** — `gap-4` (08-19)                                                                                                                                          |
| VC-19 | `meta-label-caps` margin                               | cross-component-divergence | **Fixed** — `mb-1.5` (08-19)                                                                                                                                         |
| VC-20 | Eyebrow/badge pill padding                             | cross-component-divergence | **Fixed** — `px-2 py-1`, matching the reusable component (08-19)                                                                                                     |
| VC-21 | Row-divider color (rail vs main)                       | divider-color              | **Fixed** — the two-token split kept deliberately as a register signal; only the one outlier → `-hairline` (08-19)                                                   |
| VC-22 | Top-rule divider color                                 | divider-color              | **Fixed** — `-hairline`, matching VC-21's main-content convention (08-19)                                                                                            |
| VC-23 | `placeholder-asset` radius                             | radius-split               | **Fixed** via VC-38 — `rounded-md` (08-18)                                                                                                                           |
| VC-24 | Hero/trust-block border color                          | cross-component-divergence | **Fixed** — called as drift, not register: divider gray on both templates, black outline removed (08-19)                                                             |
| VC-25 | TRUST BLOCK gap (same file)                            | cross-component-divergence | **Fixed** — `gap-4` on both (08-19)                                                                                                                                  |
| VC-26 | `SiteFooter` fine-print leading                        | cross-component-divergence | **Fixed** — `leading-lead` on the disclaimer block too (08-19)                                                                                                       |
| VC-27 | Rail row-list line-height                              | cross-component-divergence | **Fixed** — `leading-snug` (08-19)                                                                                                                                   |
| VC-28 | `button.tsx` arbitrary text-size value                 | arbitrary-value            | **Fixed** — `text-[0.625rem]` → the `text-2xs` token (08-19). Its original "dormant, zero call sites" framing had stopped being true once `TopicsCard` passed `size="xs"` |
| VC-29 | `-divider-alt` dead token                              | n/a                        | **MIGRATED** — note-only, never actionable. Still defined, still zero references; now tracked in `visual-consistency-audit-2026-08-26.md` § Carried over, joined there by `--breakpoint-cards-wide` |
| VC-30 | Heading+trailing-element row margin                    | cross-component-divergence | **Fixed** — `mb-3` on both instances (08-17)                                                                                                                         |
| VC-31 | Comparison-register heading missing `.heading`         | cross-component-divergence | **Fixed** — `.heading` added to all 4; the now-redundant `tracking-tight`/`text-text-primary` dropped. Fourth recurrence of a bug the type-scale pass believed closed (08-18) |
| VC-32 | `TopHeader` icon-button radius mismatch                | cross-component-divergence | **Fixed** — `rounded-md`, matching every other button sitewide (08-18)                                                                                               |
| VC-33 | `TopHeroSection` standfirst leading + `max-w` outlier  | cross-component-divergence | **Fixed** — `leading-copy`, `max-w-prose` (08-18)                                                                                                                    |
| VC-34 | Rail-card CTA affordance/height (4-way split)          | cross-component-divergence | **MIGRATED — STILL OPEN.** Re-measured live 08-26: 32px shadcn `size="xs"` above 44px `.btn-primary` in one rail, on different token layers. Now tracked in `visual-consistency-audit-2026-08-26.md` § Carried over; blocked on the `docs/01` link-slot policy **and** on TS-2 |
| VC-35 | VC-9 pattern recurs in `components/`                   | cross-component-divergence | **Fixed** — all 3 → `text-md font-semibold mb-1.5`, extending VC-9's target (08-18)                                                                                  |
| VC-36 | `.editorial-link-card` touch-target class              | cross-component-divergence | **Fixed** — class added to the 3 interactive usages; the non-interactive `div` in `categories/[slug]` deliberately left (08-18)                                      |
| VC-37 | RG-help-directory Regions filter — fake-interactive    | **real bug**               | **Fixed** — `cursor-pointer` dropped until real filtering exists (08-18)                                                                                             |
| VC-38 | Operator/brand logo radius (extends VC-23)             | radius-split               | **Fixed** — both instances → `rounded-md`; closes VC-23 (08-18)                                                                                                      |
| VC-39 | `NewsCard` meta line missing `font-medium`             | cross-component-divergence | **Fixed** — `font-medium` added (08-18)                                                                                                                              |
| VC-40 | `ArrowLink` missing `items-center` (extends VC-14)     | cross-component-divergence | **Fixed** — `items-center` on both (08-18)                                                                                                                           |
| VC-41 | `ReviewCard` arbitrary `w-[20px] h-[20px]`             | arbitrary-value            | **Fixed** — → `w-legacy-6 h-legacy-6` (08-18)                                                                                                                        |
| VC-42 | `Comments.tsx` avatar size mismatch                    | cross-component-divergence | **Fixed** — both → `w-6`, no emphasis intent confirmed. **The pixel math in the original entry was wrong:** `w-6` renders **40px** in this theme, not 24px (see VC-58) |
| VC-43 | Inline-link hover color-shift direction                | cross-component-divergence | **Fixed** — blog inline links aligned to darken-toward-primary (08-18)                                                                                               |
| VC-44 | Stray invalid `center` class token                     | hygiene                    | **Fixed** — removed from all 3 (08-18)                                                                                                                               |
| VC-45 | `NavigationMenuTrigger` chevron missing `shrink-0`     | hygiene                    | **Fixed** — `shrink-0` added (08-18)                                                                                                                                 |
| VC-46 | `SiteFooter` dark-block padding scale split            | cross-component-divergence | **Fixed** — decided `p-4` (08-18)                                                                                                                                    |
| VC-47 | Stale code comment in `TeaserCardGrid.tsx`             | hygiene, no visual effect  | **Fixed** — comment updated so a future pass doesn't reason from stale documentation (08-18)                                                                          |
| VC-48 | `lg:min-h-8` = 60px token trap, all row lists          | **real bug** / token-trap  | **Fixed** — `--spacing-8` is 60px, so the `min-h-11 lg:min-h-8` row convention rendered 60px desktop rows sitewide; 7 sites → `lg:min-h-9.5` (08-18)                 |
| VC-49 | `PageShell` 40/60px section gaps + SideNav misalign    | **real bug** / token-trap  | **Fixed** — same trap at shell level; uniform `gap-5` (32px, user choice) + `items-start` (08-18)                                                                    |
| VC-50 | Fabricated trust signals ×5                            | **policy** (rule #3)       | **Fixed** — all 5 removed (08-18)                                                                                                                                    |
| VC-51 | Squeeze-zone grids ×9 (VP-9 class)                     | responsive                 | **Fixed** (08-18)                                                                                                                                                    |
| VC-52 | Remaining spacing token traps (~10)                    | token-trap                 | **Fixed**; `button.tsx` documented rather than remapped (08-18)                                                                                                      |
| VC-53 | Rendering/behavior bugs ×6                             | **real bug**               | **Fixed**; the compact-CTA floor is the user's `min-h-5` (08-18)                                                                                                     |
| VC-54 | Raw `<a>` → `next/link` sweep                          | hygiene (user-directed)    | **Fixed** (08-18)                                                                                                                                                    |
| VC-55 | Drift/hygiene tier (~25)                               | cross-component-divergence | **Fixed** (08-18)                                                                                                                                                    |
| VC-56 | Four open design questions                             | needs decision             | **Resolved** — teaser titles → `text-md font-semibold`; legal binding text → `text-md`; blog in-body H3 → `text-2xl`; `CopyCodeChip`'s dashed border **kept** as an intentional coupon convention (08-19) |
| VC-57 | Contested findings ×4                                  | n/a                        | **No change, by decision** — see the note below                                                                                                                      |
| VC-58 | Corrections + standing notes                           | bookkeeping                | **Recorded** — see the note below                                                                                                                                    |

### Notes carried out of the removed sections

**VC-57 — contested, deliberately unchanged (4).** Blog "More in Guides"
`py-3` block-link list (confirmed Convention B; rows ≥44px); the nav
`rounded-md` override (measured winning, and moot after VC-55's base
change); `ArticleByline`'s name-link hover-underline (an author-name link
is arguably its own role, not VC-43's inline-text role); `BlogPostCard`'s
`text-md` excerpt (original teaser design, not drift).

**VC-58 — corrections and standing notes.** These outlive the findings
they came from:

- **`w-6` renders 40px and `w-7` 48px in this theme**, not 24/28px. VC-42's
  "both `w-6`" decision stands (they are equal), but at 40px. VC-34's
  record of `TopicsCard`'s button as 20px was also wrong — it renders 32px.
- **`SiteFooter`'s mobile footer links are a deliberate exception.**
  User-designed 17px rows at 25px pitch; passes WCAG 2.2 AA 2.5.8 via the
  spacing exception with 1px of headroom. **Do not "fix" this to 44px.**
- **`min-h-5` = 32px is the compact-CTA floor sitewide** (user design).
- Pre-existing and unassessed: `ComparisonCard` renders its "Visit
  PeakWager" link twice (responsive variants — fine for rule #5, just
  duplicative markup); the reviews Trustpilot "Read Reviews" `href="#"`
  is a stub pending real data.

**Cross-reference — viewport/responsive.** VP-1 (both review templates'
6-column score grid cramming at 1024px), VP-2 (`full-review`'s own
un-migrated comparison table) and VP-3 (`categories/[slug]`'s Editor's Lead
card breaking at 768px) were fixed as part of this same pass — full detail
in `.claude/viewport-audit.md`, not re-derived here. VC-16's `lg:`-vs-`md:`
padding-step question touched the same reviews templates, which is why they
landed together.

58 findings tracked. **As re-verified 2026-08-26: 57 closed, 1 open, and
the open one has been migrated out.** VC-34 was the single unresolved
finding; it now lives in `visual-consistency-audit-2026-08-26.md` under
"Carried over", together with VC-29's note-only dead token. Everything else
is fixed or resolved per the table above, with VC-5 confirmed intentional,
VC-57's four contested items left unchanged and VC-58 bookkeeping.
**This document is closed as a worklist** and stands as the record of how
each call was made; the live list is the 2026-08-26 file.

**Correction, kept on the record:** the 2026-08-17 change-log's closing
line, "All 30 numbered findings now resolved — 0 open," was incorrect and
contradicted this document's own summary table (which already listed
VC-15–29 correctly as Proposed/Needs-decision, not Fixed) — see the
2026-08-18 change-log entry.

---

## Change log

Condensed 2026-08-26 from 674 lines to this summary — one entry per pass,
recording what was **decided** and what was **verified**, with the
blow-by-blow narration dropped. Nothing was lost that isn't recoverable:
every outcome is written into the finding body it belongs to, and the
per-finding reasoning in Groups A–K is untouched. Where a pass produced a
standing rule or a correction, it is kept in full below, because those are
the parts later passes actually depend on.

- **2026-08-17 — initial pass.** Two parallel full-repo reads (`app/`,
  `components/`), merged and deduplicated, one factual correction applied
  after direct verification (`responsible-gambling/page.tsx:76`'s
  `leading-*` value). 29 findings. Read-only — no code touched.
- **2026-08-17 — VC-14 + Group A.** VC-14 fixed first, in isolation, as a
  confirmed rendering defect rather than a style preference. Then Group A:
  VC-1 (both H1 outliers → the majority 3-step scale), VC-2 (all 8
  standfirsts → static `text-xl leading-copy`, `md:text-2xl` step
  dropped), VC-3 (`gap-3.5` → `gap-3`). **Standing posture established
  here:** majority-wins as the default, and normalize ambiguous
  register-split items unless flagged otherwise when reached — checked
  first that no genuine either-way tie exists in this dataset.
- **2026-08-17 — breadcrumb coverage check** (adjacent to this audit's
  scope). `Breadcrumbs.tsx` itself can't drift — it hardcodes its styling
  with no `className` override. Two real gaps fixed: `/responsible-gambling`
  had no `Breadcrumbs` call at all despite every structural peer having
  one; `authors/[slug]`'s trail pointed "About" and "Authors" at the same
  href, collapsed to a 2-level trail rather than inventing an out-of-scope
  index route.
- **2026-08-17 — Group B.** VC-4 needed per-section judgement rather than
  a mechanical `mb-3` swap: 1 instance was already correct, 2 were
  reclassified as a different role entirely and logged as **VC-30** rather
  than force-fit. VC-5 read directly and left unfixed on purpose — a
  genuine dense-legal vs. editorial register difference. **Standing
  methodology rule established here** (see "Foundational question"):
  prefer parent-`gap`-with-no-child-margin where a section has one uniform
  gap need; keep explicit per-child margins only where multiple distinct
  gap roles coexist in the same flex container.
- **2026-08-17 — reference comparison + font unification.** Raised
  directly: the site's type felt off against rg.org. Measured both sites
  live via Playwright rather than assumed. Found wagerblogs running **3
  font families**, h1 at weight-**500**, and comparison-register h2 at
  **18px/weight-400 — completely unstyled**, a pre-existing bug.
  **Decision (direct instruction): unify to one family sitewide, dropping
  the serif/sans two-register split entirely — this supersedes `docs/02`'s
  "Tier register split" direction as it pertains to font family
  specifically.** Executed: `Newsreader` loader removed; `--font-serif`
  deleted outright rather than repointed (a silent fallback to generic
  serif on a missed call site would be worse than a hard failure);
  `.heading-serif`/`.heading-sans` merged into `.heading`;
  `--text-h2-serif` → `--text-h2`. Verified live across all 9 routes:
  exactly 2 families render — Inter and the mono stack, the latter kept
  deliberately for meta-label/eyebrow text.
- **2026-08-17 — type-scale pass.** `.heading` 500 → **700** (chosen over
  rg.org's 800, which would hit every h3 label too). The four
  comparison-register headings with no heading class at all —
  `RankedListSection`, `MarketCard`, `ComparisonCard`,
  `FeaturedBonusesCard` — fixed in the same change. Body copy 16px → 18px
  with an explicit `font-medium`, after confirming rg.org's own lead
  paragraph is weight-500. Selected via the `leading-*` suffix as a
  discriminator so heading-reuse instances were correctly skipped with no
  manual exclusion list. Verified live at every step.
- **2026-08-17 — hover/active layer.** Centralized in `globals.css` for
  `.btn-primary`, `.btn-secondary`, `.editorial-link-card` (covers
  `PrimaryDomainLink` for free); component-level for `PostRow`,
  `ChipList`, `TopHeader`'s icon buttons, and the blog inline links.
  `PostRow`'s row highlight uses `-mx-3 px-3 rounded-md` so the fill
  extends past the content while the content stays pixel-identical.
  **Lesson kept for the record:** an edit temporarily orphaned
  `white-space: nowrap` into a `:active` block — caught by re-reading the
  file, not by tsc/eslint, which is why "read back before assuming an edit
  landed as intended" applies even to edits that report success.
- **2026-08-17 — icon-squeeze bug, `shrink-0` sweep.** Root cause: an SVG
  has no content-based minimum width the way `nowrap` text does, so in a
  squeezed `inline-flex` row it is always the first thing to give. Fixed
  in `PrimaryDomainLink`, then swept: `ArrowLink`'s trailing arrow (~30
  call sites, the highest-value of the three) and `SideNav`'s submenu
  chevron. `SideNav`'s main nav icon checked and deliberately left alone —
  already structurally protected by a fixed-size wrapper. Verified live:
  every icon renders as a true 16×16 square.
- **2026-08-17 — Group C (VC-6 → VC-13).** All 8 resolved, 19 edits across
  12 files, per the majority-target posture. Outcomes are recorded in each
  finding body. Verified live: all 12 routes returned correct status
  (including the 404 staying a genuine 404), and both `EditorialSection`
  consumers confirmed at 32px.
- **2026-08-17 — VC-13 revisited, plus 4 items raised directly.**
  **VC-13 corrected:** the original fix matched `ChipList`'s own internal
  majority, which was too narrow a frame — `rounded-full` on top of
  `.btn-*` made chips read as pills against every other button on the
  site. The override was removed from all 4 call sites so chips inherit
  the buttons' natural radius. Also: a hand-typed dashed "[state search
  input]" box replaced with the real `SearchInput`; **`Breadcrumbs` was
  navigating via raw `<a>` sitewide**, losing client-side routing and
  prefetching — swapped to `next/link`; `PostRow`'s `as="div"` call site
  made a real link like its two peers. VC-30 completed.
  **This entry's original closing line, "All 30 numbered findings now
  resolved — 0 open," was wrong** and contradicted the summary table above
  it — corrected in the 2026-08-18 entry.
- **2026-08-17 — header top-border removal, hover sweep round 2,
  `BlogPostCard` redesign.** Removed a `border-t` from 4 page headers that
  no other header carried. Hover round 2 caught the hand-rolled cards that
  duplicate `PostRow`/`.editorial-link-card` shapes without reusing them.
  **`BlogPostCard` took five attempts and the sequence is worth keeping:**
  a padded row highlight was tried, then rejected because this is a
  *grid* — adjacent tiles' hover boxes painted into each other's gap;
  hover-only expansion was rejected because animating margin/padding
  reflows the grid; an absolutely-positioned fill layer still overreached
  half the 16px gap. **The correct fix was to give each tile a real
  `.card` border and padding, so the hover fill occupies space the box
  already owns — no expansion, no negative margins, no reflow, no
  collision, by construction.** Grid also reduced `lg:grid-cols-3` →
  `md:grid-cols-2` after measuring 229px cards. `font-medium` propagated
  to `PostRow`/`NewsCard` meta lines. `RecentPublishedSection` was
  deliberately kept a different register, not unified.
- **2026-08-17 — button cursor + 2 fake-button `ChipList` sites.**
  `.btn-primary`/`.btn-secondary` had **no `cursor` property at all**, so
  every real `<button>` using them looked non-interactive. Found while
  investigating: two `ChipList` calls omitted `as`, silently falling back
  to `as="div"` — chips styled exactly like buttons but with no handler,
  no href and no keyboard focusability. One had been patched with a manual
  `cursor-pointer`, **making it look clickable while doing nothing, which
  is worse than the unpatched version.** Both fixed with `as="button"`.
  Focus outlines checked before assuming a fix was needed — nothing was
  suppressing them.
- **2026-08-17 — `RankedList`, refactored then rebuilt to spec.** First
  against rg.org's live structure (column headers, rank separate from
  score, a "Last Verified" stamp — the last already existed in the
  `Operator` type and had simply never been wired up), deliberately
  *simplified* rather than copying columns whose data doesn't exist, since
  adding them would mean fabricating data. Then superseded by a precise
  "1b Compact scan row" spec provided directly. Notable resolutions:
  `truncate` + `text-wrap` was a real CSS conflict, settled in favour of
  `text-wrap` (losing text to an ellipsis is worse than a taller row); the
  CTA pair became `PrimaryDomainLink` + `.btn-secondary` at a shared
  `md:w-28`/`md:w-full`, matching the sitewide button-pair convention.
  Confirmed and deliberately **not** changed: the compact scoped sizing
  here is a contextual adaptation for a dense row, not drift to reconcile.
  See `.claude/viewport-audit.md`'s 2026-08-17 entry for the responsive
  sweep that followed — including this rebuild collapsing at 320px, which
  it had never been checked against.
- **2026-08-17 — `PrimaryDomainLink` compacted sitewide (scoped), plus a
  link-policy fix on `FeaturedBonusesCard`.** Compaction baked into
  `PrimaryDomainLink`'s own base class and extended to every dense-context
  button — but **deliberately scoped rather than applied to the shared
  `.btn-*` base classes, to preserve the documented 44px WCAG touch target
  on standalone hero/nav CTAs.** Caught a real 44px-vs-26px mismatch on
  what was meant to be a matched pair, measured rather than eyeballed.
  **The link-policy half is the consequential part, and two wrong
  approaches were caught before landing:** giving competitors
  `isPrimaryDomain: true` would directly violate `CLAUDE.md` rule #5 — the
  structural mechanism the whole link policy rests on; and handing them a
  `primaryDomainLink`-shaped object was dishonest data modelling, since
  naming a competitor's field that falsely claims it is the site's own
  monetized link. Settled design: a separate `OperatorLinkData`
  (`{anchorText, url}`, **no** `relAttribute` field, because nofollow is
  never a choice here), stored under an honestly-named `operatorLink`,
  with `rel="nofollow"` hardcoded in the JSX rather than stored as data —
  mirroring how the UGC-link rule is enforced. A discriminated-union
  `BonusOffer` makes TypeScript narrow correctly. Verified from the
  rendered DOM, not the source: exactly one `sponsored` link and three
  `nofollow`.
- **2026-08-17 — two smaller fixes.** A `"View All →"` string was mixed
  into the array of real state names and rendered through the same pill
  loop — a literal arrow character standing in for the sitewide
  `ArrowLink`. Removed from the data and rendered properly; then the whole
  "Browse by state" card was removed from `categories/[slug]` (US states
  aren't a relevant filter on a worldwide-resource page), along with the
  now-dead `categoryFinderStates` export.
- **2026-08-18 — strict re-sweep, 17 new findings (VC-31–47).** Re-ran the
  full methodology per direct instruction, broadened beyond the original 6
  properties to also cover font-weight, color-token usage, CTA sizing,
  hover/focus, icon `shrink-0` guarding and arbitrary-bracket values.
  **Correction to this document's own record:** VC-1–14 and VC-30 verified
  genuinely fixed and unregressed, but **VC-15–29 had never been applied**
  — exactly as the summary table already said. The 2026-08-17 closing line
  claiming 0 open was wrong. The historical entry was left standing and
  the table/summary corrected instead. Also found while re-verifying:
  VC-6's pass missed `HelpLineCard.tsx:7`, and VC-28's "dormant, zero call
  sites" framing had stopped being true. Read-only pass — flagged, not
  fixed, per instruction. Highest-severity was VC-31, a fourth recurrence
  of the missing-`.heading`-class bug the type-scale pass believed closed.
- **2026-08-18 (later) — second re-sweep + same-day implementation.**
  Group K: 61 findings from two agent sweeps plus a viewport sweep;
  policy, grid, token-trap, bug and hygiene tiers all implemented at
  user-approved scope. VC-56's four questions left open, VC-57's four
  contested items left unchanged, VC-34 held. Same session: Group J
  implementation, VP-8/VP-9, the blog template rework, `BonusOfferCard` +
  `CopyCodeChip`, landmark structure (`<main>` in `PageShell`), VC-48 and
  VC-49. Verified at close: tsc/eslint clean under pipefail, axe clean on
  9 route/width combos, a 12-route × 6-width sweep identical to the
  known-safe baseline, and rendered rel/tier accounting correct.
- **2026-08-19 — backlog + VC-56 decisions.** All remaining
  Proposed/Needs-decision findings resolved with the user: VC-15, VC-16
  (RankedList's 24px documented as intentional; the reviews panels' padding
  step moved `lg:` → `md:` so it no longer grows at the 1024px squeeze),
  VC-17–22, VC-24 (divider gray on both templates, black outline removed),
  VC-25–28, and VC-56.1–3 fixed with VC-56.4 closed as an intentional
  coupon convention. A `sed` mishap truncated a className mid-pass, caught
  by the disk-state diff and repaired before the gates ran. Verified:
  tsc/eslint clean, 9 routes × 4 widths zero overflow, computed spot-checks,
  axe clean on legal and 404.
- **2026-08-19 (later) — structural close-out.** Template consolidation
  resolved by user decision: `full-review`'s unique sections merged into
  `/reviews/[slug]` and the route **deleted** — ending the
  two-pages-per-operator keyword-cannibalization risk and resolving
  DRY-8. `ComparisonCard`'s duplicated responsive link markup closed as
  no-change (both branches route through the same `PrimaryDomainLink`, so
  href and rel are identical by construction). Author-name links wired to
  `/authors/[slug]`; teaser byline meta stays plain text until the CMS
  provides structured author data. a11y suite re-run: 27 passed / 1
  skipped, identical to baseline.
- **2026-08-19 (later still) — tablet-squeeze round (user-driven).**
  **Measurement overturned the premise:** at 768px the shell already
  reserved a 260px rail, leaving a ~392–444px content column — *narrower
  than mobile*. VP-9's "tablet has no sidebar" assumption was wrong, and
  tablet had been the worst squeeze all along. `RankedList`'s breakpoint
  zigzag removed; `FeaturedBonusesCard`, `BlogSection` and the blog
  related grid dropped their `md:grid-cols-2` step. Light text-tile grids
  deliberately KEEP tablet 2-up per user decision ("content cards only").
  Each call decided from side-by-side prototypes and screenshots in
  `.claude/screenshots/`, not from reasoning. All verified: 0 overflow at
  6 widths, gates clean.
- **2026-08-26 — re-verification, stale-marker sweep, and close-out.** Full
  entry in the section below; this document is closed as a worklist.

---

## 2026-08-26 — re-verification, stale-marker sweep, and close-out

Every finding still *claiming* to be open was re-checked against running
code; the markers that were lying were removed; the one item that turned
out to be genuinely open was migrated out; and the per-finding sections
were collapsed into the summary table. **No source files were touched.**

**The contradiction that prompted it.** Fourteen findings still carried an
inline `NEEDS DECISION` marker in Groups A–I while the summary table
recorded them as Fixed or Resolved — the 08-18/08-19 passes updated the
table but never the finding bodies. Read top-to-bottom, the document
claimed thirteen open questions that had been answered days earlier. Note
this file has now been wrong about its own status twice, in opposite
directions: the 2026-08-17 "0 open" line was the other one.

**Verified against running code, not re-read** (per the project rule to
validate against real behavior):

| item | method | result |
| ---- | ------ | ------ |
| VC-34 rail CTA split | Playwright computed styles, 1440px | **still open** |
| VC-29 `--color-border-divider-alt` | `rg` over `app/` + `components/` | still defined, zero references |
| `--breakpoint-cards-wide` | same | **newly dead** — orphaned by the 08-21 shell refactor |
| the other 13 marked findings | source read against each recorded outcome | closed, no contradicting code |

**What changed in this file.** The 13 stale markers were replaced by the
decision actually taken, then Groups A–K (~990 lines) were removed
entirely and their outcomes folded into the summary table, which now
carries the target value for every finding. The change log was condensed
674 → 227 lines. Net: **1953 → ~560 lines**, with the standing rules,
corrections and contested-item reasoning all preserved.

**One caveat on the older text:** every pixel figure written before
2026-08-25 is pre-migration. Class names and relative relationships still
hold; absolute px values should be re-measured before being relied on.

**Status: 57 of 58 closed, 1 open and migrated.** VC-34 and VC-29 now live
in `visual-consistency-audit-2026-08-26.md` § "Carried over", which is the
live worklist. VC-34 is coupled to TS-2 there — the control line-height
fix changes what "compact CTA" means, so TS-2 settles first.
