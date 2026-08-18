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

**Token system reference** (`app/globals.css`, full detail there):
type scale `--text-2xs`(10px)…`--text-h2-serif`(25px); spacing clean scale
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
same value: where a section has multiple *different* gap roles between
different sibling pairs (e.g. heading→intro-paragraph vs.
paragraph→content-box), a single `gap-*` can't represent more than one
value, so those keep explicit per-child margins — each one individually
consistent with wherever else that same role appears sitewide, per the
findings below.

---

## Group A — Page header block (H1 / standfirst / header wrapper)

### VC-1 — Editorial hero H1: scale, leading, `text-pretty` presence

**Role:** the page-level `<h1 className="heading-serif ...">` under
`PageShell`, shared by 9 routes.

- **Majority (7 instances):** `text-5xl-mobile md:text-5xl-tablet
lg:text-5xl-desktop leading-snug text-pretty` — `not-found.tsx:67`,
  `blog/[slug]/page.tsx:78`, `categories/page.tsx:48`,
  `categories/[slug]/page.tsx:90`, `responsible-gambling/page.tsx:73`,
  `responsible-gambling/help-directory/page.tsx:72`, `reviews/page.tsx:32`,
  plus `components/section/TopHeroSection.tsx:6`.
- **Outlier 1:** `authors/[slug]/page.tsx:68` —
  `text-4xl md:text-5xl-tablet leading-heading` (caps at 38px, no `lg:`
  step; `leading-heading` not `leading-snug`; no `text-pretty`).
- **Outlier 2:** `legal/[doc]/page.tsx:83` — `text-4xl md:text-5xl-tablet
leading-snug text-pretty` (caps at 38px, no `lg:` step).

**Proposed:** normalize both outliers to the majority pattern. High
confidence — no apparent register reason authors/legal pages should cap
below the desktop H1 size every other Tier-1 page reaches.

### VC-2 — Standfirst paragraph (intro copy directly under H1)

**Role:** `<p className="font-serif text-xl ...">` immediately following
the H1.

- **Majority (5, static, no responsive step):** `text-xl leading-copy
text-text-body text-pretty` — `categories/page.tsx:51`,
  `categories/[slug]/page.tsx:93`, `legal/[doc]/page.tsx:86`,
  `responsible-gambling/help-directory/page.tsx:75`, `reviews/page.tsx:35`.
- `text-xl md:text-2xl leading-copy` — `blog/[slug]/page.tsx:81`.
- `text-xl md:text-2xl leading-relaxed` — `not-found.tsx:70`.
- `text-xl leading-lead` (static, no `md:` step) —
  `responsible-gambling/page.tsx:76` (verified directly; leading value
  differs from every other instance).

**Proposed:** two independent axes to resolve — (1) whether to add the
`md:text-2xl` responsive step everywhere or drop it from blog/not-found to
match the majority's static size; (2) which `leading-*` value is
canonical (`leading-copy` is the majority at 6/8 once blog is counted, vs.
one `leading-relaxed` and one `leading-lead` outlier each).
**NEEDS DECISION** on (1) — see questions below.

### VC-3 — Page header wrapper gap (`<header className="flex flex-col gap-X">`)

- **Majority (7):** `gap-3` — `not-found.tsx:66`, `categories/page.tsx:47`,
  `categories/[slug]/page.tsx:89`, `legal/[doc]/page.tsx:82`,
  `responsible-gambling/help-directory/page.tsx:71`, `reviews/page.tsx:31`,
  `responsible-gambling/page.tsx:72`.
- **Outlier:** `gap-3.5` — `blog/[slug]/page.tsx:76`.

**Proposed:** `gap-3` everywhere. High confidence, sole outlier.

---

## Group B — Section H2 headings

### VC-4 — H2 section heading bottom margin

**Role:** `heading-serif text-h2-serif leading-heading` section headings.

- **No own margin** (relies on parent spacing) —
  `categories/[slug]/page.tsx:139`, `categories/page.tsx:58`,
  `responsible-gambling/help-directory/page.tsx:94`.
- **`mb-1`** — `authors/[slug]/page.tsx:92`, `blog/[slug]/page.tsx:203`,
  `responsible-gambling/page.tsx:134,182`.
- **`mb-3`** (largest bucket, 8) — `authors/[slug]/page.tsx:81,108`,
  `categories/[slug]/page.tsx:189,203,216`,
  `responsible-gambling/help-directory/page.tsx:135`,
  `responsible-gambling/page.tsx:162,172`.
- **`mb-3.5`** — `responsible-gambling/page.tsx:84,100,120`.

Notably `responsible-gambling/page.tsx` alone uses `mb-1`, `mb-3`, and
`mb-3.5` across its own 7 H2s (verified directly) with no visible pattern.

**RESOLVED (2026-08-17):** the 3 "no own margin" cases turned out to be
two different situations, not one — checked directly rather than assumed:
`categories/page.tsx:58` is a genuinely bare H2 already governed by its
parent's `flex flex-col gap-3` (16px), which already equals the `mb-3`
target — no change needed, it was never actually inconsistent. The other
two (`categories/[slug]/page.tsx:139`, `responsible-gambling/help-directory/page.tsx:93`)
turned out to be a different visual role entirely — see VC-30 below.

For the real `mb-1`/`mb-3.5` outliers: per the methodology rule above,
5 of the 7 sections had exactly one gap role (H2 → one content block) and
were converted to the parent-`flex flex-col gap-3`-with-no-child-margin
pattern (`authors/[slug]/page.tsx` "Recent work", `blog/[slug]/page.tsx`
"Related reading", `responsible-gambling/page.tsx`'s "Warning signs",
"Tools that actually limit play", and "What we do on our side" —
the last of these also had a redundant competing `mt-3`/`mt-2` on the
next sibling in two cases, removed as part of the same edit since it's
no longer needed once the parent carries the gap). The remaining 2
(`responsible-gambling/page.tsx`'s "A quick self-check" and "Where to get
help") have a *second*, differently-valued gap role later in the same
section (intro-paragraph→content-box, list→arrow-link) that a single
parent `gap-*` can't represent — kept their own explicit `mb-3` instead,
which still correctly matches the sitewide heading-margin target without
disturbing those other roles. `tsc --noEmit`/`eslint` clean.

### VC-30 — Heading-plus-trailing-element row: bottom margin *(new,
found while fixing VC-4)*

Two sections use a `flex items-baseline justify-between` row (H2 +
trailing link/count) where the *row* carries the margin, not the H2 —
a different role from VC-4's bare-H2 case, since the H2 has no margin
of its own in either instance:

- `categories/[slug]/page.tsx:139` — row uses `mb-1` (4px).
- `responsible-gambling/help-directory/page.tsx:93` — row uses `mb-3.5`
  (14px).

**Proposed:** not yet fixed — flagged for a future checkpoint. Only 2
instances, so worth confirming there isn't a third example elsewhere
before picking a target.

### VC-5 — In-document H2 subsection heading (mid-body, inside long-form content)

- `blog/[slug]/page.tsx:124,153,179` — `text-3xl leading-heading mt-4 mb-3`
  (3 consistent instances, editorial article body).
- `legal/[doc]/page.tsx:125` — `text-xl leading-heading mb-2.5`, no `mt-*`
  (numbered legal section heading).

**NEEDS DECISION** — plausibly an intentional register split (dense legal
reference vs. editorial article prose), not documented anywhere as such.
Default-to-bug would mean picking one size for both; default-to-register
would mean leaving as-is and documenting the split explicitly instead.

---

## Group C — Card / rail titles & body copy

### VC-6 — Rail/inline card title bottom margin

**Role:** `font-bold text-sm text-text-primary` heading at the top of a
`.card`/`InfoCard` block.

- `mb-1` — `components/rail/TopicsCard.tsx:6`.
- `mb-1.5` — `components/rail/HelpLineCard.tsx:7`.
- `mb-2` (4) — `components/rail/InfoCard.tsx:17` **(the component's own
  default)**, `components/rail/EditorsCard.tsx:6`,
  `responsible-gambling/help-directory/page.tsx:35`,
  `legal/[doc]/page.tsx:65`.
- `mb-2.5` (majority, 9) — `components/rail/AnchorList.tsx:58`,
  `components/rail/AtAGlanceCard.tsx:14`,
  `components/rail/TrendingCard.tsx:13`,
  `components/rail/OtherBooksCard.tsx:15`, `not-found.tsx:28`,
  `authors/[slug]/page.tsx:26` (an `InfoCard titleClassName` override),
  `responsible-gambling/help-directory/page.tsx:23`,
  `categories/[slug]/page.tsx:41`, `reviews/[slug]/page.tsx:41`.

**Proposed:** change `InfoCard`'s own default from `mb-2` to `mb-2.5` (its
own call sites already override to `mb-2.5` more often than not), then fix
the 2 remaining standalone `mb-2` outliers to match. High confidence —
this is a case where fixing the shared component's default fixes most of
the drift in one place.

### VC-7 — Rail card title font-size outlier

`responsible-gambling/help-directory/page.tsx:16` — `font-bold text-md
mb-2` ("In immediate danger?", inside `card-dark p-5`) vs. every VC-6
instance above using `text-sm`. **NEEDS DECISION** — could be deliberate
emphasis (urgent dark card) rather than drift; low stakes either way.

### VC-8 — Card/rail body copy (size + leading)

**Role:** supporting paragraph under a card title.

- `text-xs leading-loose` — `components/rail/InfoCard.tsx:18` (default),
  `responsible-gambling/help-directory/page.tsx:36`.
- `text-xs leading-relaxed` — `components/rail/HelpLineCard.tsx:8`,
  `components/rail/EditorsCard.tsx:8`.
- `text-sm`, no leading utility — `components/rail/TopicsCard.tsx:7`.
- `text-sm leading-relaxed` — `responsible-gambling/help-directory/page.tsx:17`.

**NEEDS DECISION** — no clear majority (2/2/1/1 split).

### VC-9 — Card/tile inner title (weight + size + margin combo)

**Role:** bold label above a body line inside a `.card` or bordered tile
(excludes the review hero operator-name block, which is already
consistent between both templates).

- `text-md font-semibold mb-1.5` — `authors/[slug]/page.tsx:112`,
  `responsible-gambling/page.tsx:126`, `reviews/[slug]/page.tsx:158`.
- `text-md font-semibold mb-1` — `responsible-gambling/page.tsx:142`,
  `categories/[slug]/page.tsx:195`.
- `text-md font-bold mb-1.5` — `legal/[doc]/page.tsx:138`.
- `text-md font-bold mb-1` — `reviews/[slug]/full-review/page.tsx:122`.
- `text-sm font-bold mb-1.5` — `reviews/[slug]/full-review/page.tsx:159`.

**NEEDS DECISION** — 5 combinations, no majority. Proposed default if a
single pick is wanted: `text-md font-semibold mb-1.5` (largest subgroup,
3 instances).

---

## Group D — Shared-component prop overrides (the DRY pass's preserved divergences)

These are named explicitly in the components themselves (code comments
noting "call sites vary, kept as-is") — exactly what this pass exists to
resolve.

### VC-10 — `EditorialSection` wrapper gap

- Default `gap-5` (32px), used unmodified by `BettingToolboxSection`,
  `BlogSection`, `LatestNewsSection` — `components/section/EditorialSection.tsx:15`.
- `gap-4` override — `components/section/ExploreSection.tsx:6`.
- `gap-3` override — `components/section/RecentPublishedSection.tsx:7`.

**NEEDS DECISION** — `RecentPublishedSection`'s tighter gap may be a
deliberate density choice for a denser post-list; defaulting all three to
`gap-5` is the majority-wins answer but would visibly loosen 2 of 5
consumers.

### VC-11 — `PostRow` wrapper padding + title size

- `py-4` / `text-xl` (majority, 2 call sites) —
  `components/section/RecentPublishedSection.tsx:13-14`,
  `categories/[slug]/page.tsx:155-156`.
- `py-4.5` / `text-2xl` (outlier) — `authors/[slug]/page.tsx:99-100`.

**Proposed:** normalize the authors page's override to `py-4`/`text-xl`.
Medium-high confidence.

### VC-12 — `TeaserCardGrid` title size/weight

- `text-sm font-bold` — `reviews/[slug]/page.tsx:229`,
  `reviews/[slug]/full-review/page.tsx:170` (both reviews templates).
- `text-md font-semibold` — `categories/[slug]/page.tsx:208`.

**NEEDS DECISION** — low priority; 2-vs-1 by file but the "2" are two
templates for the same underlying page.

### VC-13 — `ChipList` active-chip radius

- `rounded-full` (majority, 3) —
  `responsible-gambling/help-directory/page.tsx:85-86`,
  `legal/[doc]/page.tsx:103-104`, `categories/[slug]/page.tsx:108-109`.
- `rounded-lg` (outlier) — `components/cards/LatestNewsCategory.tsx:10-11`.

**Proposed:** `rounded-full`. High confidence — matches majority AND
`globals.css`'s own guidance to use Tailwind's built-in `rounded-full` for
every pill shape in the system.

_(Not in scope for this visual pass: `ChipList` also has 3 different
active-item-detection strategies (index/string/slug-match) across call
sites — a logic inconsistency, not visual, left untouched here.)_

---

## Group E — CTA / `ArrowLink`

### VC-14 — `ArrowLink` missing icon gap — confirmed real rendering defect

`ArrowLink` (`components/ui/ArrowLink.tsx`) takes a required `className`
with no default gap baked in; the icon renders as a sibling immediately
after the text with no whitespace in the JSX, so it needs `gap-1` in the
passed className for any visible spacing. **Verified via direct grep**:
6 call sites render `inline-flex items-center` but omit `gap-1`, so the
arrow icon sits flush against the label text with zero gap:

- `responsible-gambling/page.tsx:34`, `:46`, `:153`
- `legal/[doc]/page.tsx:146`
- `reviews/[slug]/page.tsx:188`
- `categories/[slug]/page.tsx:224`

**Proposed:** add `gap-1` to all 6. This is a defect, not a style
preference — recommend fixing it as its own small commit ahead of the
rest of the normalization pass, independent of any of the open decisions
below.

### VC-15 — Arrow-link / `InfoCard` CTA text size

- `text-md` (majority, ~13 instances) — `authors/[slug]/page.tsx` (×4),
  `blog/[slug]/page.tsx:55`, `categories/page.tsx:32`,
  `categories/[slug]/page.tsx:69,144,224`, `legal/[doc]/page.tsx:146`,
  `responsible-gambling/page.tsx:153`, `components/section/ComparisonCard.tsx:88`,
  `components/section/LatestNewsSection.tsx:18`,
  `components/cards/ExploreCategoryCard.tsx:23`,
  `components/section/TopHeroSection.tsx:16`.
- `text-xs` (7) — `not-found.tsx:45,97`, `responsible-gambling/page.tsx:34,46`,
  `responsible-gambling/help-directory/page.tsx:41,52,144`.
- `text-sm` (3) — `reviews/[slug]/page.tsx:188`,
  `components/section/ReviewCard.tsx:11`, `components/section/BylineCard.tsx:28`.

**NEEDS DECISION** — checked whether `text-xs` correlates with "inside an
`InfoCard` cta slot specifically" (a legitimate two-role split, not
drift): doesn't hold cleanly — `authors/[slug].tsx:31,43` are also
`InfoCard` cta slots but use `text-md`. No clean rule found; proposed
default is `text-md` (clear majority) if a single value is wanted.

---

## Group F — Container & grid spacing

### VC-16 — Boxed-container padding

The centralized `.card`/`.card-dark` utility is `padding: var(--spacing-3)`
(16px) and covers the large majority of card-shaped elements site-wide.
Outliers that bypass it or use different padding:

- `components/RankedList.tsx:11` — hand-rolls `rounded-md p-4 bg-bg-card`
  instead of using `.card` at all (24px padding vs. the utility's 16px).
- `p-4 lg:p-5` — `reviews/[slug]/page.tsx:88,152,157,204`,
  `reviews/[slug]/full-review/page.tsx:78`.
- `p-4 md:p-5` — `legal/[doc]/page.tsx:108`, `responsible-gambling/page.tsx:106`.
- `p-5` flat — `responsible-gambling/page.tsx:58`,
  `responsible-gambling/help-directory/page.tsx:15`.

**NEEDS DECISION** — two sub-questions: (1) is `RankedList`'s roomier
24px padding an intentional register difference (operator row vs. rail
card) or should it adopt `.card`'s 16px; (2) the reviews templates step up
padding at `lg:` (1024px — exactly where `VP-1`/`VP-2` show the sidebar
squeeze already breaking these same pages) while legal/RG step up at
`md:` (768px, before any squeeze) — recommend standardizing on `md:` since
growing padding right at the squeeze breakpoint compounds VP-1/VP-2's
existing problem, but flagging for confirmation since it touches the same
files as those viewport fixes.

### VC-17 — Card-grid responsive gap

- **Majority (16 instances):** `gap-legacy-4 md:gap-3` (12px→16px) —
  used across `BlogPostCard`, `ToolboxCard`, `TeaserCardGrid` (default),
  `FeaturedBonusesCard`, `MarketCard`, `ProsConsSection`, `ReviewCard`,
  `SiteFooter`, and 8 route files.
- **Outlier:** flat `gap-4` (24px, no responsive step) —
  `components/cards/ExploreCategoryCard.tsx:10`, `categories/page.tsx:59`.

**Proposed:** normalize the 2 outliers to `gap-legacy-4 md:gap-3` to match
the overwhelming majority. This is the clearest case of the "foundational
question" above — the majority pattern uses a legacy-scale value very
consistently, so per the (a) majority-wins default this is a
straightforward fix; per (b) it would instead mean changing 16 sites to a
clean-scale equivalent. Recommend (a) here specifically.

### VC-18 — Meta-info row gap (published/updated/read-time rows)

- `gap-4` — `blog/[slug]/page.tsx:98`, `categories/[slug]/page.tsx:98`,
  `legal/[doc]/page.tsx:87`.
- `gap-3.5` — `reviews/[slug]/full-review/page.tsx:71`.

**Proposed:** `gap-4`. High confidence, sole outlier.

### VC-19 — `meta-label-caps` trailing margin

- `mb-1.5` — `components/cards/TeaserCardGrid.tsx:25`,
  `components/cards/PostRow.tsx:28` (both shared-component defaults).
- `mb-2` — `blog/[slug]/page.tsx:207`.
- `mb-2.5` — `not-found.tsx:77`, `legal/[doc]/page.tsx:109`.
- `mb-3` — `blog/[slug]/page.tsx:189`.
- **No margin** (correct — parent `flex flex-col gap-*` already manages
  spacing) — `blog/[slug]/page.tsx:77`, `categories/[slug]/page.tsx:122`
  — not a bug, excluded from the count.

**Proposed:** `mb-1.5`, matching both shared-component defaults (which
already reach the most pages). Medium confidence.

### VC-20 — Eyebrow/badge pill padding

- `px-2 py-1` — `components/section/ReviewSectionHeading.tsx:15`.
- `px-2.5 py-1` — `not-found.tsx:58` (a hand-rolled duplicate of the same
  badge shape, not going through the shared component).

**Proposed:** `px-2 py-1`, matching the reusable component. Low priority.

---

## Group G — Divider/border color & radius

### VC-21 — Row-divider color: rail-card rows vs. main-content rows

This is the split `globals.css`'s own comment flags as possibly
unintentional ("check whether a single divider color was intended") —
but on inspection it correlates cleanly with register across ~20
instances: rail-card internal rows and `AnchorList` items consistently
use `border-border-hairline-alt` (#f2f2f2); main-content article/resource
lists (`PostRow`, `NewsCard`, resource rows) consistently use
`border-border-hairline` (#f0f0f0). One clean outlier breaks its own
register: `reviews/[slug]/full-review/page.tsx:135` (bonus-terms
key/value row, structurally main-content) uses `-hairline-alt` instead of
matching its own page's other main-content rows.

**Proposed:** treat the two-token split as intentional (a real register
signal, not drift) and fix only the one outlier to `-hairline`. Flagging
as a secondary, larger option: collapse to a single divider token
entirely, per `globals.css`'s own open question — bigger change, not
recommended unless you want to revisit the token system itself.

### VC-22 — Repeated-item top-rule divider color

- `border-t border-border-divider` (#e4e4e4) —
  `authors/[slug]/page.tsx:111`.
- `border-t border-border-hairline` (#f0f0f0) — `legal/[doc]/page.tsx:123`.

**Proposed:** `-hairline`, matching VC-21's main-content convention.
Sample size of 2, low stakes.

### VC-23 — `placeholder-asset` radius

- `rounded-md` (majority, 5) — operator logos (both reviews templates),
  blog hero image, blog diagram, categories lead image.
- `rounded-sm` (outlier) — Trustpilot logo box, `reviews/[slug]/page.tsx:206`.

**Proposed:** `rounded-md`, matching majority and `globals.css`'s own role
definition ("cards, sections, CTA buttons, avatars/logo squares"). High
confidence.

### VC-24 — Hero/trust-block border color (reviews templates)

- `reviews/[slug]/page.tsx:88` — `border border-text-primary` (TRUST
  BLOCK 1/3 wrapper).
- `reviews/[slug]/full-review/page.tsx:78` — `border border-border-divider`
  (the analogous score-panel wrapper).

**NEEDS DECISION** — the two reviews templates are an intentionally
separate product per `.claude/dry-audit.md` DRY-8, so this could be a
deliberate emphasis difference between the "quick review" and "deep-dive"
registers, or it could be plain drift. Worth a direct call either way
since it's a visible color difference, not just spacing.

---

## Group H — Single-file internal inconsistencies

### VC-25 — TRUST BLOCK wrapper gap within `reviews/[slug]/page.tsx`

Two structurally identical "TRUST BLOCK N/3" wrapper `div`s (same
padding, same border/radius) in the same file:

- Block 1/3 (`:88`) — `gap-4`.
- Block 2/3 (`:152`) — `gap-3.5`.

**Proposed:** `gap-4` for both. High confidence, low risk, same file.

### VC-26 — `SiteFooter` fine-print leading

Four `text-xs` legal/fine-print blocks in one file:

- `leading-loose` (1.6) — `:43` (dark-block disclaimer).
- `leading-lead` (1.7, majority within file, 3/4) — `:62`, `:67`, `:73`.

**Proposed:** `leading-lead` for the disclaimer block too. Medium
confidence.

### VC-27 — Rail row-list item line-height

- `leading-snug` (majority, 7) — `blog/[slug]/page.tsx:26`,
  `categories/[slug]/page.tsx:46`, `legal/[doc]/page.tsx:12,61`,
  `responsible-gambling/page.tsx:26`,
  `responsible-gambling/help-directory/page.tsx:28`,
  `reviews/[slug]/full-review/page.tsx:45`.
- `leading-relaxed` (outlier) — `not-found.tsx:33` ("Popular right now").

**Proposed:** `leading-snug`. High confidence. _(Related, not fixed here
since it's outside this audit's property scope: the same `not-found.tsx`
row also uses `lg:min-h-9.5` where the other 7 use `lg:min-h-8` — worth a
look in the same pass since it's the same element.)_

---

## Group I — Low priority / hygiene

### VC-28 — `button.tsx` dormant arbitrary text-size value

`components/ui/button.tsx:25` — the `xs` size variant uses `text-[0.625rem]`
(=10px, exactly `--text-2xs`) as a raw bracket value instead of the token.
Currently unused anywhere (`size="xs"` has zero call sites). Safe,
zero-visual-risk fix: swap to `text-2xs`.

### VC-29 — `--color-border-divider-alt` — dead token

Defined in `globals.css` but has zero references anywhere in `app/` or
`components/`. Not a bug, just noting for awareness — no action proposed.

---

## Group J — 2026-08-18 strict re-sweep

Two parallel full-repo reads (`app/`, `components/`) plus a fresh
Playwright viewport sweep (folded into `.claude/viewport-audit.md`'s own
2026-08-18 entry), run per direct instruction to re-run the full audit
methodology rather than spot-check. Scope broadened beyond the original 6
properties (text size, line-height, gap, padding, margin, radius, divider
color) to also cover font-weight, general color-token usage, button/CTA
sizing, hover/focus consistency, icon `shrink-0` guarding, and
arbitrary-bracket-value usage. Read-only pass — no fixes applied, per
direct instruction to flag rather than fix this time.

### VC-31 — Comparison-register heading missing `.heading` class (recurrence)

**Role:** the exact bug class the 2026-08-17 type-scale pass fixed on
`RankedListSection`, `MarketCard`, `ComparisonCard`, `FeaturedBonusesCard`
(no heading class at all → renders at browser-default weight 400 instead
of `.heading`'s 700) — that pass missed 4 more instances:

- `components/section/ReviewSectionHeading.tsx:19` — `text-2xl
text-text-primary tracking-tight` (badge/note variant).
- `components/section/ReviewSectionHeading.tsx:25` — same, plus `mb-3`
  (plain variant).
- `app/reviews/[slug]/page.tsx:72` — page H1, `text-3xl leading-snug
tracking-tight text-text-primary text-pretty`.
- `app/reviews/[slug]/full-review/page.tsx:64` — identical pattern.

`ReviewSectionHeading` alone backs every "TRUST BLOCK," "Bonus detail,"
"Questions readers ask," and "Compare further" heading across both
reviews templates (8 render call sites) — the highest-reach instance of
this bug class found in either pass. `tracking-tight` also diverges from
`.heading`'s `-0.015em` (Tailwind's own `tracking-tight` is `-0.025em`).

**Proposed:** add `heading` to all 4, drop the now-redundant
`tracking-tight`/`text-text-primary` (both already supplied by
`.heading`). High confidence — same fix already proven correct on 4
sibling components.

### VC-32 — `TopHeader` icon-button radius mismatch

**Role:** `components/layout/TopHeader.tsx`'s two icon buttons, same row,
same `w-11 h-11 border border-border-default ... hover:bg-bg-subtle
hover:border-text-primary` shape.

- `:18` (Search) — `rounded-full`.
- `:24` (Menu) — `rounded-md`.

Renders below 1024px on every route. The two independent re-audits split
on confidence here: one read it as likely-unintentional drift (no doc
supports a circle-vs-square split, and every other button sitewide uses
`radius-md`); the other flagged it as plausibly a deliberate
search-vs-menu differentiation and recommended confirming rather than
fixing outright.

**NEEDS DECISION** — flagging per the doc's own convention for genuine
either-way calls. If normalized, `rounded-md` (matching every other
button sitewide) is the more consistent target.

### VC-33 — `TopHeroSection` standfirst: leading outlier + arbitrary max-width

**Role:** homepage hero standfirst paragraph,
`components/section/TopHeroSection.tsx:9` — `text-2xl font-medium
leading-lead text-text-body max-w-[62ch] text-pretty`. This component was
never in VC-2's original file list (that pass only checked the H1 here) —
a fresh gap, not a missed fix.

- **Leading:** of 21 sitewide `text-2xl font-medium leading-*`
  standfirst/body instances, this is the only `leading-lead` — the other
  20 (every route-header standfirst, all `blog/[slug]` and
  `responsible-gambling` body paragraphs) use `leading-copy`.
- **Max-width:** `max-w-[62ch]` is a raw arbitrary value; every other
  header standfirst uses the `max-w-160` token or Tailwind's built-in
  `max-w-prose` (65ch).

This is the homepage's own hero paragraph — the single highest-visibility
instance of this role on the site.

**Proposed:** `leading-copy`, `max-w-prose`. High confidence on
`leading-copy` (matches 20/21 majority); medium-high on `max-w-prose`
(closest built-in equivalent, avoids inventing a third max-width
convention).

### VC-34 — Rail-card CTA affordance/height: four treatments in one column

**Role:** `components/rail/HomeRail.tsx` renders `TopicsCard →
TrendingCard → EditorsCard → HelpLineCard` in sequence; each card's CTA
is a different shape/height with no register logic distinguishing them:

- `HelpLineCard.tsx:9-14` — plain `ArrowLink`, no button chrome.
- `AtAGlanceCard.tsx:24` — `PrimaryDomainLink` (compact convention,
  ~26px).
- `EditorsCard.tsx:11` — plain `Link className="btn-primary"`, full 44px
  WCAG-minimum height, no compaction override.
- `TopicsCard.tsx:10` — shadcn `Button variant="outline" size="xs"`,
  `h-5` (20px), using shadcn's own oklch tokens rather than this
  project's `.btn-secondary`.

`docs/01-wireframe-component-audit.md` independently flags `EditorsCard`'s
"Editor's Pick" as "a disguised Tier 2/3 slot... decide now whether this
is intended as a link slot or genuinely editorial" — an open policy
question this pass didn't resolve. But the *visual* inconsistency (a 44px
full button sandwiched between a 20px button above and a plain link
below, same rail) holds regardless of which way that policy question
goes.

**NEEDS DECISION** on the policy question first (per `docs/01`); once
resolved, route `EditorsCard`'s CTA through compact `PrimaryDomainLink`
(if it's a real link slot) or downsize it to match `HelpLineCard`'s
plain-link convention (if it stays editorial).

### VC-35 — VC-9 pattern recurs in `components/`

**Role:** the "bold label above body text inside a `.card`" role VC-9
normalized to `text-md font-semibold ... mb-1.5` across 5 `app/` files —
3 more instances in `components/` were outside that pass's file list and
remain unfixed:

- `components/rail/EditorsCard.tsx:7` — `font-bold text-md
text-text-primary mb-1.5` (bold, not semibold).
- `components/section/FeaturedBonusesCard.tsx:11` — `font-bold text-sm
text-text-primary mb-1.5` (bold + wrong size).
- `components/section/ComparisonCard.tsx:70` — `font-bold text-md
text-text-primary mb-2` (bold, wrong margin).

**Proposed:** normalize all three to `text-md font-semibold
text-text-primary mb-1.5`, extending VC-9's already-established target.
High confidence — same target, same role.

### VC-36 — `.editorial-link-card` touch-target class on 1 of 5 usages

**Role:** `globals.css`'s own comment names `.editorial-link-card` as
covering "category tiles, toolbox items, related-reading cards." Of 5
real sitewide usages, only 1 carries the `min-h-11 lg:min-h-0` mobile
touch-target class:

- `components/cards/ExploreCategoryCard.tsx:15` — has it.
- `components/cards/ToolboxCard.tsx:9`, `app/blog/[slug]/page.tsx:207`,
  `app/categories/page.tsx:61`, `app/categories/[slug]/page.tsx:180` —
  lack it (the last of these also applies the class to a non-interactive
  `div`, a separate structural issue worth a look).

A real mobile tap-target delta between components sharing an explicitly
documented shared role, not just a spacing nit.

**Proposed:** since the 4-without is the majority, either drop the class
from `ExploreCategoryCard` or — better, given it exists specifically for
WCAG touch-target compliance — add it to the other 4. Needs a quick check
of which is true before picking a side.

### VC-37 — RG-help-directory "Regions" filter: fake-interactive divs — confirmed real bug

**Role:** `app/responsible-gambling/help-directory/page.tsx:26-32` renders
each region filter as a `div` carrying `cursor-pointer` with no
`onClick`/`href`/keyboard focusability at all — styled to look clickable,
does nothing. Same anti-pattern the project's own change log already
caught and fixed twice for `ChipList` ("worse than the unpatched
version," per the 2026-08-17 entry). A `// TODO: static display only`
comment sits directly above the offending line, contradicting its own
`cursor-pointer`.

**Proposed:** drop `cursor-pointer` until real filtering exists, or route
through `ChipList as="button"` matching the sitewide filter-chip
convention. Real bug, not a style preference — recommend treating it like
VC-14 was, as its own small isolated fix.

### VC-38 — Operator/brand logo radius (extends VC-23)

**Role:** `globals.css` defines `radius-md` as covering "cards, sections,
CTA buttons, avatars/logo squares." VC-23's original outlier (Trustpilot
logo, `reviews/[slug]/page.tsx:206`, `rounded-sm`) is still unfixed, and a
second instance not counted in the original tally now exists:

- `components/RankedList.tsx:15` — operator-logo placeholder, `w-6 h-6
shrink-0 placeholder-asset rounded-sm`. `RankedList` was rebuilt multiple
  times after VC-23 was written, so this is a fresh occurrence, not a
  duplicate.

**Proposed:** `rounded-md` for both. High confidence, same target VC-23
already established.

### VC-39 — `NewsCard` meta line missing `font-medium`

**Role:** the "byline/meta, mono, text-subtle" line shared by `PostRow`,
`BlogPostCard`, `NewsCard`. The 2026-08-17 change log states outright:
*"PostRow's and NewsCard's meta lines also gained `font-medium`."*
Current source shows this was never actually applied to `NewsCard`:

- `components/cards/PostRow.tsx:30` — `text-xs font-medium
text-text-subtle font-mono` (has it).
- `components/cards/BlogPostCard.tsx:18` — same shape, has it.
- `components/cards/NewsCard.tsx:20` — `text-xs text-text-subtle
font-mono` (missing `font-medium`).

**Proposed:** add `font-medium` to `NewsCard.tsx:20`. High confidence —
the doc already committed to this exact target for this exact role, it
just didn't land on all three.

### VC-40 — `ArrowLink` missing `items-center` (extends VC-14)

**Role:** VC-14's original fix only checked for missing `gap-1`; a
separate risk on the same component wasn't checked — `ArrowLink` renders
text and a 12px trailing SVG as flex siblings with no shared line-box, so
omitting `items-center` risks cross-axis misalignment under
`inline-flex`'s default `align-items: stretch`. 6 of 8 call sites include
it (5 directly, 1 — `SiteFooter.tsx:17` — for free via `.btn-primary`'s
own `align-items: center`); 2 omit it:

- `components/section/ReviewCard.tsx:11` — `inline-flex gap-1 text-sm
text-text-primary font-semibold group`.
- `components/section/BylineCard.tsx:28` — identical omission.

**Proposed:** add `items-center` to both. Medium-high confidence —
matches the 6/8 majority and closes a real alignment risk.

### VC-41 — `ReviewCard` arbitrary pixel value with an exact token match

`components/section/ReviewCard.tsx:19` — numbered step badge, `w-[20px]
h-[20px]`. `--spacing-legacy-6: 20px` already exists in the theme, unused
for this element.

**Proposed:** `w-legacy-6 h-legacy-6`. Same category as VC-28 — trivial,
zero visual risk.

### VC-42 — `Comments.tsx` avatar size mismatch within one file

`:14` — composer's own avatar, `w-7 h-7` (28px). `:32` — each listed
comment's avatar, `w-6 h-6` (24px). Same "user avatar placeholder" role,
two sizes, no comment explaining the split.

**NEEDS DECISION** — plausibly an intentional "your own avatar is
slightly emphasized" choice, but unconfirmed either way; low stakes.

### VC-43 — Inline-link hover color-shift direction inconsistency

**Role:** permanent-underline inline text link, hover color-shift.

- `app/blog/[slug]/page.tsx:131,135` — `text-text-primary ...
hover:text-text-body` (lightens #111→#555 on hover).
- `components/Comments.tsx:44` — `text-text-subtle ...
hover:text-text-primary` (darkens #727→#111 on hover).

Every other hover treatment sitewide (`.btn-secondary`,
`.editorial-link-card`) shifts *toward* `--color-text-primary` —
suggesting darken-toward-primary is the established convention, and the
blog inline links are the outlier.

**Proposed:** align the blog inline links to darken-toward-primary
instead. Medium confidence — small sample (2 instances) but a clear
directional convention exists elsewhere to match.

### VC-44 — Stray invalid `center` class token

`app/not-found.tsx:97`, `app/responsible-gambling/help-directory/page.tsx:41,145`
all carry `"inline-flex items-center center gap-1 ..."` — `center` isn't
a valid Tailwind utility (no-op), a copy/paste artifact repeated across 3
files.

**Proposed:** remove `center` from all 3. Trivial, zero visual risk (it
does nothing today).

### VC-45 — `NavigationMenuTrigger` chevron missing `shrink-0`

`components/ui/navigation-menu.tsx:114-117` — `ChevronRightIcon` as a
flex sibling of label text, same structural shape as
`ArrowLink`/`PrimaryDomainLink`/`SideNav`'s submenu chevron, all now
`shrink-0`-guarded after the icon-squeeze bug fix. Lower risk here since
the sibling label isn't `whitespace-nowrap` (text wraps before the icon
would be squeezed), but the same defensive class would make this
consistent with the 3 already-fixed instances.

**Proposed:** add `shrink-0`. Hygiene-level, not a confirmed live bug.

### VC-46 — `SiteFooter` dark-block padding scale split

`components/layout/SiteFooter.tsx:11` — RG helpline banner, `p-legacy-6`
(20px). `:24` — footer-links block, `p-4` (24px). Both `rounded-md`, dark
background, light text — same visual weight/role, no documented register
reason for legacy vs. clean scale here.

**Proposed:** pick one — flagging only, the single-file sample here isn't
enough on its own to call a sitewide majority.

### VC-47 — Stale code comment in `TeaserCardGrid.tsx` (hygiene, no visual effect)

`components/cards/TeaserCardGrid.tsx:14-15` still documents "the two
reviews templates use text-sm/font-bold while categories uses
text-md/font-semibold" as the reason `titleClassName` must stay a
required prop — but VC-12's fix already normalized
`categories/[slug]/page.tsx:192` to `text-sm font-bold`, so the split the
comment describes no longer exists.

**Proposed:** update the comment so a future pass doesn't reason from
stale documentation. No visual/code change.

### Checked, not a bug (ruled out during this pass)

- `not-found.tsx:80`'s `.btn-primary min-h-12 px-5` "Search" button —
  looked like unexplained size inflation vs. every other CTA, but
  `min-h-12` (48px) exactly matches the adjacent `SearchInput`'s rendered
  height (`InputGroup`'s `h-7` → `--spacing-7` = 48px in this theme) —
  intentional inline visual alignment with the paired input, not drift.
- `components/ui/button.tsx`'s `sm` variant using `text-lg` —
  pre-confirmed intentional shadcn-registry divergence (existing project
  convention); reconfirmed, not re-flagged.

---

## Cross-reference: viewport/responsive bugs in scope for the same pass

Per direct instruction, `.claude/viewport-audit.md`'s VP-1 (both review
templates' 6-column score grid crams at 1024px), VP-2 (`full-review`'s own
un-migrated comparison table), and VP-3 (`categories/[slug]`'s Editor's
Lead card breaks at 768px) are being fixed as part of this same pass. Not
re-derived here — see that document for full detail. Worth noting: VC-16's
`lg:`-vs-`md:` padding-step question above touches the exact same reviews
templates VP-1/VP-2 are about, so those should probably land together.

---

## Summary table

| #     | Finding                              | Type                       | Status                               |
| ----- | ------------------------------------ | -------------------------- | ------------------------------------ |
| VC-1  | Hero H1 scale/leading/text-pretty    | cross-component-divergence | **Fixed**                            |
| VC-2  | Standfirst responsive step + leading | cross-component-divergence | **Fixed**                            |
| VC-3  | Page header wrapper gap              | cross-component-divergence | **Fixed**                            |
| VC-4  | H2 section heading margin            | cross-component-divergence | **Fixed**                            |
| VC-5  | In-document H2 (blog vs legal)       | cross-component-divergence | Left as-is — confirmed intentional   |
| VC-6  | Rail card title margin               | cross-component-divergence | **Fixed**                            |
| VC-7  | Rail card title font-size outlier    | cross-component-divergence | **Fixed**                            |
| VC-8  | Card/rail body copy size+leading     | cross-component-divergence | **Fixed**                            |
| VC-9  | Card/tile inner title combo          | cross-component-divergence | **Fixed**                            |
| VC-10 | `EditorialSection` wrapper gap       | cross-component-divergence | **Fixed**                            |
| VC-11 | `PostRow` padding + title size       | cross-component-divergence | **Fixed**                            |
| VC-12 | `TeaserCardGrid` title size/weight   | cross-component-divergence | **Fixed**                            |
| VC-13 | `ChipList` radius                    | radius-split               | **Fixed**                            |
| VC-14 | `ArrowLink` missing gap-1            | **real bug**               | **Fixed**                            |
| VC-15 | Arrow-link CTA text size             | cross-component-divergence | **Needs decision**                   |
| VC-16 | Boxed-container padding              | cross-component-divergence | **Needs decision**                   |
| VC-17 | Card-grid gap outlier                | legacy-drift               | Proposed                             |
| VC-18 | Meta-info row gap                    | cross-component-divergence | Proposed                             |
| VC-19 | `meta-label-caps` margin             | cross-component-divergence | Proposed                             |
| VC-20 | Eyebrow/badge pill padding           | cross-component-divergence | Proposed                             |
| VC-21 | Row-divider color (rail vs main)     | divider-color              | Proposed (keep split, fix 1 outlier) |
| VC-22 | Top-rule divider color               | divider-color              | Proposed                             |
| VC-23 | `placeholder-asset` radius           | radius-split               | Proposed                             |
| VC-24 | Hero/trust-block border color        | cross-component-divergence | **Needs decision**                   |
| VC-25 | TRUST BLOCK gap (same file)          | cross-component-divergence | Proposed                             |
| VC-26 | `SiteFooter` fine-print leading      | cross-component-divergence | Proposed                             |
| VC-27 | Rail row-list line-height            | cross-component-divergence | Proposed                             |
| VC-28 | `button.tsx` dormant arbitrary value | arbitrary-value            | Proposed (trivial)                   |
| VC-29 | `-divider-alt` dead token            | n/a                        | Note only                            |
| VC-30 | Heading+trailing-element row margin  | cross-component-divergence | Fixed                                |
| VC-31 | Comparison-register heading missing `.heading` class (recurrence) | cross-component-divergence | Flagged (2026-08-18) |
| VC-32 | `TopHeader` icon-button radius mismatch | cross-component-divergence | Needs decision (2026-08-18) |
| VC-33 | `TopHeroSection` standfirst leading + max-w outlier | cross-component-divergence | Flagged (2026-08-18) |
| VC-34 | Rail-card CTA affordance/height (4-way split) | cross-component-divergence | Needs decision (2026-08-18) |
| VC-35 | VC-9 pattern recurs in `components/` | cross-component-divergence | Flagged (extends VC-9) |
| VC-36 | `.editorial-link-card` touch-target class on 1 of 5 usages | cross-component-divergence | Flagged (2026-08-18) |
| VC-37 | RG-help-directory Regions filter — fake-interactive divs | real bug | Flagged (2026-08-18) |
| VC-38 | Operator/brand logo radius (extends VC-23) | radius-split | Flagged (extends VC-23) |
| VC-39 | `NewsCard` meta line missing `font-medium` | cross-component-divergence | Flagged — changelog claimed done |
| VC-40 | `ArrowLink` missing `items-center` (extends VC-14) | cross-component-divergence | Flagged (extends VC-14) |
| VC-41 | `ReviewCard` arbitrary `w-[20px] h-[20px]` | arbitrary-value | Flagged (trivial) |
| VC-42 | `Comments.tsx` avatar size mismatch | cross-component-divergence | Needs decision (2026-08-18) |
| VC-43 | Inline-link hover color-shift direction | cross-component-divergence | Flagged (2026-08-18) |
| VC-44 | Stray invalid `center` class token | hygiene | Flagged (trivial) |
| VC-45 | `NavigationMenuTrigger` chevron missing `shrink-0` | hygiene | Flagged (trivial) |
| VC-46 | `SiteFooter` dark-block padding scale split | cross-component-divergence | Flagged (2026-08-18) |
| VC-47 | Stale code comment in `TeaserCardGrid.tsx` | hygiene, no visual effect | Flagged (trivial) |

47 findings tracked as of the 2026-08-18 re-sweep (30 original + 17 new,
VC-31–VC-47): 14 fixed (VC-1–4, 6–14, 30 — VC-14 the one confirmed real
rendering bug among them; VC-6 has one instance the fix pass missed, see
the 2026-08-18 change-log entry), 1 confirmed intentional and left as-is
(VC-5), 1 note-only/no-action (VC-29), 14 from the original pass still
open at Proposed/Needs-decision status, and 17 new findings from the
strict re-sweep — full detail in Group J below. **Correction:** the
2026-08-17 change-log's closing line, "All 30 numbered findings now
resolved — 0 open," was incorrect and contradicted this document's own
summary table (which already listed VC-15–29 correctly as
Proposed/Needs-decision, not Fixed) — see the 2026-08-18 change-log
entry.

---

## Change log

- **2026-08-17 — initial pass.** Two parallel full-repo reads (`app/`,
  `components/`), merged and deduplicated, one factual correction applied
  after direct verification (`responsible-gambling/page.tsx:76`'s
  `leading-*` value). 29 findings. Read-only — no code touched.
- **2026-08-17 — fix pass, VC-14 + Group A.** Per direct instruction:
  fixed VC-14 (`ArrowLink` missing `gap-1` at 6 call sites — confirmed via
  grep as a real rendering defect, not a style preference) as its own
  isolated change first. Then fixed Group A in full: VC-1 (both H1
  outliers normalized to the majority 3-step scale), VC-2 (all 8
  standfirst instances normalized to static `text-xl leading-copy`, no
  `md:text-2xl` step), VC-3 (`blog/[slug]`'s `gap-3.5` → `gap-3`).
  `tsc --noEmit`/`eslint` clean after each. Governing rule for the "needs
  decision" items established directly: majority-wins as the default
  posture (checked — no genuine either-way tie exists anywhere in this
  dataset between the clean/legacy spacing scales, so this collapses to
  simple majority-wins in practice); default to normalizing ambiguous
  register-split items unless flagged otherwise when reached.
- **2026-08-17 — breadcrumb coverage check** (adjacent to this audit's
  scope, not one of the 29 numbered findings — raised directly by the
  user, not spacing/sizing). `components/layout/Breadcrumbs.tsx` itself is
  fully consistent (hardcodes its own styling, no `className` override
  prop, so no drift is possible at call sites; `PageShell`'s
  `flex flex-col gap-6 lg:gap-8` content wrapper governs surrounding
  spacing uniformly). Found and fixed two real gaps: (1)
  `app/responsible-gambling/page.tsx` was the only real content route with
  no `Breadcrumbs` call at all, despite every structural peer (`/reviews`,
  `/categories`) having one and its own child route
  (`/responsible-gambling/help-directory`) linking back to it — added
  `<Breadcrumbs items={[{ label: "Responsible Gambling" }]} />` matching
  the peer pattern. (2) `authors/[slug]/page.tsx`'s crumb trail had "About"
  and "Authors" both pointing at the identical `/about` href (no
  `/authors` index route exists in the resolved Phase 0 route scope, so
  there was nothing distinct for "Authors" to link to) — collapsed to a
  2-level trail, `About → {author name}`, rather than inventing a new
  index route outside scope. `app/page.tsx` (home) and `not-found.tsx`
  confirmed to correctly have no breadcrumbs (root page / no meaningful
  path on a 404). No stray hand-rolled breadcrumb markup found outside the
  shared component. `tsc --noEmit`/`eslint` clean.
- **2026-08-17 — Group B fix pass.** VC-4 turned out to need more care
  than a mechanical `mb-3` swap once checked directly against each
  section's actual sibling structure (per direct user feedback mid-pass):
  1 of the 3 "no own margin" instances was already correct as-is
  (`categories/page.tsx`'s parent `gap-3` already equals the target, no
  change needed); the other 2 were reclassified as a different role
  entirely, logged as new finding VC-30 rather than force-fit into VC-4.
  Of the real `mb-1`/`mb-3.5` outliers, 5 sections had exactly one gap
  role and were converted to a parent `flex flex-col gap-3` wrapper with
  no child margin (also removing 2 now-redundant competing `mt-3`/`mt-2`
  utilities on the sibling below, which were only masking the same target
  value via margin-collapse); 2 sections had a second, differently-valued
  gap role later in the same section that a single parent `gap-*` can't
  represent, so kept explicit `mb-3` on the H2 only. Established a
  standing methodology rule from this (see "Foundational question"
  section above): prefer parent-`gap`-with-no-child-margin wherever a
  section has one uniform gap need; keep explicit per-child margins only
  where multiple distinct gap roles coexist in the same flex container.
  VC-5 investigated directly (read `legal/[doc]/page.tsx`'s actual
  numbered-clause markup) and left unfixed on purpose — it has a numbered
  prefix span and its own per-section `border-t pt-5 pb-1` wrapper that
  `blog/[slug]/page.tsx`'s pattern doesn't share at all, which reads as a
  genuine dense-legal-reference vs. editorial-prose register difference,
  not drift. `tsc --noEmit`/`eslint` clean throughout.
- **2026-08-17 — reference-site comparison, font unification.** User
  raised a concern that the site's text sizes/spacing feel off compared
  to rg.org (the project's own documented reference, `docs/02`) —
  specifically 2+ font faces mixed, and missing hover/active feedback.
  Verified directly with live Playwright computed-style pulls against
  both `https://www.rg.org/` and the local dev server (not assumption —
  same "measure before refactor" discipline as the rest of this audit):
  rg.org uses exactly one font family (`system-ui`/`SF Pro Display`)
  everywhere, h1 at 40px/weight-800, h2 at 24-32px/weight-700+, body text
  at 18px; wagerblogs was running 3 font families (Newsreader serif for
  editorial headings, Inter sans for comparison headings/body, mono for
  labels), h1 at 44px/weight-**500**, comparison-register h2 at
  **18px/weight-400** (found to be completely unstyled — `RankedListSection`
  never applied `.heading-serif` or `.heading-sans` at all, a pre-existing
  bug unrelated to font-family, left for the type-scale pass), body text
  at 16px. Also grepped every `hover:` usage sitewide: only 5 files have
  any, all shadcn scaffolding or isolated icon-nudges — `.btn-primary`,
  `.btn-secondary`, `.card`, `.editorial-link-card` (the classes actually
  used everywhere) have zero `:hover` rules; `.btn-primary` even carries
  `transition: all` with nothing behind it to transition.
  **Decision (direct instruction):** unify to one font family sitewide,
  dropping the serif/sans two-register split entirely (rather than fixing
  execution while keeping 2 fonts) — supersedes `docs/02`'s "Tier register
  split" direction as it pertains to font family specifically. Type-scale
  weight/size work and the hover/active layer both still open, to be
  tackled next per direct instruction (type-scale prioritized first,
  ahead of resuming Group C).
  **Executed:** `app/layout.tsx` — removed the `Newsreader` font loader,
  kept only `Inter`. `app/globals.css` — removed the `--font-serif` token
  entirely (rather than repointing it to the sans stack, since a silent
  fallback to the browser's generic serif on any missed call site would
  be worse than a hard failure); merged `.heading-serif`/`.heading-sans`
  (the latter had zero call sites anywhere) into one `.heading` class,
  keeping `.heading-serif`'s former weight/letter-spacing values since
  that was the one actually establishing the site's heading hierarchy —
  weight/size itself is explicitly the next pass, not touched here. Bulk
  mechanical rename via `sed` (verified zero collisions first): `heading-serif`
  → `heading` (42 instances, 14 files) and stripped the raw `font-serif`
  utility from 26 body/standfirst-paragraph call sites across 10 files.
  Also renamed the now-misleadingly-named `--text-h2-serif` token (a size
  value, unrelated to family, but the name referenced Newsreader in its
  own comment) → `--text-h2` (19 call sites, 7 files). `tsc --noEmit`/
  `eslint` clean after every step. **Verified live**, not just
  type-checked: Playwright pull across all 9 routes (including the 404)
  confirms exactly 2 font families render anywhere on the site now —
  `Inter` (all reading text) and the mono stack (deliberately kept for
  meta-label/timestamp/eyebrow text — a distinct micro-utility role, not
  a reading font, out of scope for this change) — with correct HTTP
  status on every route, no regressions.
- **2026-08-17 — type-scale pass (weight + body-copy size).** Direct
  follow-up to the font-unification work above, prioritized ahead of
  resuming Group C per direct instruction. Two changes, both confirmed
  with target values before applying rather than guessed:
  **(1) Heading weight:** `.heading` bumped from `font-weight-medium`
  (500) to `font-weight-bold` (700) sitewide — chosen over matching
  rg.org's H1 weight exactly (800, would apply to every heading size
  including small h3 labels) or a smaller step (600). Also fixed, as part
  of the same change: `RankedListSection`, `MarketCard`, `ComparisonCard`,
  `FeaturedBonusesCard` — the four comparison-register headings flagged
  during the rg.org comparison as pre-existing bugs (no heading class
  applied at all, rendering at browser-default 400 weight) — now all use
  `.heading text-2xl`, replacing their ad hoc `text-text-primary
  tracking-tight` (redundant with/inconsistent against `.heading`'s own
  color and letter-spacing). **(2) Body-copy size:** the ~21 standfirst/
  body-paragraph instances using `text-xl leading-copy`/`leading-lead`
  (16px) bumped to `text-2xl font-medium leading-copy`/`leading-lead`
  (18px) — verified directly that rg.org's own 18px lead paragraph is
  weight-500, not 400, so `font-medium` was added alongside the size
  bump rather than left at the ambient regular weight (confirmed via a
  second live Playwright pull specifically checking body-text weight on
  both sites, prompted directly). Selected via the `leading-*` suffix as
  a clean discriminator — `leading-copy`/`leading-lead` (body copy) vs.
  `leading-heading`/`leading-snug` (headings that happen to reuse the
  same `text-xl` size token) — confirmed via grep that all 21 targeted
  instances matched and all 3 heading-reuse instances were correctly
  left untouched, no manual exclusion list needed. `tsc --noEmit`/
  `eslint` clean. **Verified live:** homepage h1 now 44px/700 (was
  44px/500); `RankedListSection`'s h2 now 18px/700 (was 18px/400 —
  the exact bug caught during the reference comparison); editorial h2
  now 25px/700 (was 25px/500); standfirst now 18px/500 (was 16px/400),
  matching rg.org's own lead-paragraph treatment. Hover/active states
  (also raised during the reference-site comparison, approved as its own
  fix) and Group C both still open, to be picked up next.
- **2026-08-17 — hover/active state layer.** Direct follow-up, approved
  earlier as its own fix. Confirmed scope first: grepped every `<button>`
  in the codebase (only 4 exist — `Comments.tsx`'s `.btn-primary`,
  `ChipList`'s button variant, `TopHeader`'s 2 icon buttons) and every
  interactive pattern lacking hover feedback, per direct instruction to
  check both plain-text and icon-bearing buttons specifically.
  **Centralized in `globals.css`** (`@layer components`, covers
  `PrimaryDomainLink` for free since it already renders via `.btn-primary`):
  `.btn-primary` (background `#111111` → `#2a2a2a` hover → `#000000`
  active, `transition: background-color`), `.btn-secondary` (transparent →
  `--color-bg-subtle` fill + border-color shift to `--color-text-primary`
  on hover, `--color-border-hairline` on active), `.editorial-link-card`
  (top-border color shift to `--color-text-primary` on hover). One bug
  introduced and caught during this edit: a `.btn-secondary` edit
  temporarily orphaned its own `white-space: nowrap` declaration inside
  the new `:active` block instead of the base rule — caught by re-reading
  the file immediately after, not by tsc/eslint (a plain CSS ruleset
  misplacement, no type error) — fixed before moving on, underscores why
  this project's "read back before assuming an edit landed as intended"
  habit matters even for edits that report success.
  **Component-level** (no shared default className exists for these —
  full pass-through by design — so the baseline hover affordance lives
  inside the component itself, appended after the caller's own classes,
  rather than expecting every call site to remember it): `PostRow`'s
  `Link` variant, `ChipList`'s `button`/`Link` variants (opacity-based,
  since callers fully control background/text color and opacity works
  regardless of the chosen palette), `TopHeader`'s 2 icon buttons
  (background + border shift, since there's no label text to recolor —
  raised directly as a distinct case from plain buttons), and the 2
  inline prose links in `blog/[slug]/page.tsx`.
  **`PostRow` refinement (caught directly, mid-review):** the first pass's
  `hover:bg-bg-subtle` had no horizontal padding to give the fill room,
  so it read as clipped flush against the row's own text/thumbnail —
  fixed with the standard row-highlight technique, `-mx-3 px-3 rounded-md`
  (negative margin canceling the added padding), so the fill extends
  ~16px past the visible content on hover while the content itself stays
  pixel-identical to its unhovered position. Verified directly: the link's
  padded box left edge sits 16px left of the "Recent work" heading above
  it, and the actual text inside (after its own 16px inner padding) lands
  at the exact same x-position as the heading — confirmed via bounding-box
  measurement plus a before/after screenshot, not just computed-style
  values, since this was specifically a layout/visual complaint. `tsc
  --noEmit`/`eslint` clean throughout. **Verified live** (computed-style
  before/after diffs, not assumed): `.btn-primary`, `.btn-secondary`,
  `.editorial-link-card`, `PostRow`, and both `TopHeader` icon buttons all
  confirmed to actually change a real CSS property on hover. Group C is
  the only item left open from this session.
- **2026-08-17 — icon-squeeze bug, `shrink-0` sweep.** Raised directly via
  an IDE selection on `ComparisonCard.tsx`'s `ComparisonLinkOrNote`: the
  trailing icon on `PrimaryDomainLink`'s button (`SquareArrowOutUpRight`)
  visibly compressed/distorted for long anchor text (e.g. "Visit
  PeakWager") inside the comparison table's `minmax(110px, 1fr)` grid
  cell. Root cause: the icon is a flex sibling of the button's own text
  node inside a `display: inline-flex` link, `white-space: nowrap` keeps
  the text from wrapping, and with no `shrink-0` on the icon, flexbox's
  default `flex-shrink: 1` let the SVG absorb the overflow instead —
  SVGs have no content-based minimum width the way nowrap text does, so
  they're always the first thing to give when a flex row of this shape
  is squeezed. Fixed in `PrimaryDomainLink.tsx`. Then checked whether the
  same pattern existed elsewhere rather than treating it as a one-off:
  grepped every icon usage sitewide and found 2 more real instances of
  the identical bug — `ArrowLink.tsx`'s trailing arrow (used at ~30+ call
  sites across the site, the highest-value fix of the three) and
  `SideNav.tsx`'s submenu `ChevronRight` (same text+icon flex shape,
  `min-w-40` gives some cushion but isn't unlimited). Also checked
  `SideNav.tsx`'s main nav-item icon and confirmed it's NOT the same bug
  — it's nested inside a `w-6.5 h-6.5 shrink-0` fixed-size span one level
  deeper, so it's structurally protected already; left untouched rather
  than adding a redundant class. `tsc --noEmit`/`eslint` clean. **Verified
  live**: measured every rendered `PrimaryDomainLink` icon's bounding box
  on the homepage — all render as perfect 16×16 squares now (previously
  would compress non-uniformly under the exact grid-cell width that
  flagged this).
- **2026-08-17 — Group C fix pass (VC-6 through VC-13).** All 8 findings
  resolved, applying the majority-target/default-to-normalize posture
  established earlier in this session. 19 edits across 12 files:
  **VC-6** (rail card title margin → `mb-2.5`): fixed `InfoCard`'s own
  default (`mb-2` → `mb-2.5`, the component-level fix that cascades to
  every call site not overriding it), plus 4 standalone outliers
  (`EditorsCard`, `legal/[doc]`'s "Change log" card, both cards in
  `responsible-gambling/help-directory`) and one not originally listed
  under VC-6 but caught mid-edit — `TopicsCard`'s title was still `mb-1`.
  **VC-7** (RG-help-directory "In immediate danger?" font-size outlier):
  normalized `text-md` → `text-sm`, folded into the same edit as its
  `mb-2` → `mb-2.5` fix since both touch the same line. **VC-8** (body
  copy size+leading, no clean majority): resolved by anchoring to
  `InfoCard`'s own default (`text-xs leading-loose`) as the reference
  point, fixing `HelpLineCard`/`EditorsCard` (`leading-relaxed` →
  `leading-loose`, size already correct), `TopicsCard` (`text-sm` →
  `text-xs`, added `leading-loose`), and the "In immediate danger?" body
  text in RG-help-directory (same swap). **VC-9** (card/tile inner title,
  5 combos): normalized to the largest subgroup, `text-md font-semibold
  mb-1.5` — fixed 5 sites (`responsible-gambling` resource name,
  `categories/[slug]` subcategory name, `legal/[doc]`'s "Questions about
  this document", and both `full-review` titles). Caught and corrected an
  inconsistent edit of my own mid-pass: the FAQ question title in
  `full-review` had its size bumped but was left at `font-bold` instead
  of matching the target `font-semibold` — fixed before moving on.
  **VC-10** (`EditorialSection` wrapper gap): removed the `gap-4`/`gap-3`
  overrides from `ExploreSection`/`RecentPublishedSection` entirely
  rather than setting them to a literal `gap-5` string, letting both fall
  through to the component's own default — verified live, both now
  compute to 32px. **VC-11** (`PostRow` padding/title-size, the one
  remaining outlier): `authors/[slug]`'s `py-4.5`/`text-2xl` → `py-4`/
  `text-xl`, matching the other 2 call sites. **VC-12** (`TeaserCardGrid`
  title): `categories/[slug]`'s `text-md font-semibold` → `text-sm
  font-bold`, matching both reviews templates. **VC-13** (`ChipList`
  radius): `LatestNewsCategory`'s `rounded-lg` → `rounded-full` on both
  active/inactive classNames. `tsc --noEmit`/`eslint` clean. **Verified
  live**: every route still returns its correct HTTP status (11 routes
  200, the 404 route still a genuine 404) after this many file touches;
  spot-checked `rounded-full`'s computed value (Tailwind v4 resolves it
  via `calc(infinity * 1px)`, confirmed present) and both `EditorialSection`
  consumers' gap (32px on both, confirmed on the homepage and
  `/categories`, since `RecentPublishedSection` isn't rendered on the
  homepage). All 30 tracked findings in this document are now either
  fixed, confirmed-already-correct, or deliberately left as an
  intentional register difference (VC-5) — VC-30 (heading+trailing-row
  margin, found mid-Group-B) is the only finding still open.
- **2026-08-17 — VC-13 revisited, plus 4 items raised directly, outside
  the numbered findings.** **VC-13 corrected:** the original fix matched
  `ChipList`'s *own* internal majority (3 `rounded-full` vs 1 `rounded-lg`),
  but that was too narrow — raised directly that `.btn-primary`/
  `.btn-secondary` already define `border-radius: var(--radius-md)` and
  render that way as normal buttons everywhere else in the site; `rounded-full`
  on top of them made chips look like pills against every other button's
  subtly-rounded-rectangle shape. Removed the `rounded-full` override from
  all 4 `ChipList` call sites entirely, letting them inherit the buttons'
  natural radius. **Fake search-input placeholder:** `categories/[slug]`'s
  "Browse by state" card had a hand-typed dashed-border box reading
  "[state search input]" instead of the real `SearchInput` component,
  which the same page already uses correctly once above it — swapped in
  a second real `SearchInput`. **`<a>` vs. `Link` audit** (raised
  directly, not part of the original 29/30 findings): grepped every raw
  `<a>` in `app/`+`components/`. `AnchorList`'s default `as="a"` is by
  design (same-page hash anchors) — verified directly against `rgToc`/
  `blogToc`'s actual data that every default-`as` call site truly points
  to a `#hash`, and every `as="Link"` call site truly points to a real
  route; no bug there. `responsible-gambling/page.tsx`'s lone `<a href="#get-help">`
  is also a legitimate same-page anchor. `Breadcrumbs.tsx` was the real
  bug: every breadcrumb trail on every route navigates via a plain `<a>`
  inside `BreadcrumbLink`'s `render` prop instead of `next/link`, losing
  client-side routing/prefetching sitewide — fixed by swapping in `Link`
  (confirmed `BreadcrumbLink`'s Base-UI `render` prop is shape-agnostic,
  just needs a component accepting standard anchor props). **`PostRow`
  `as="div"` inconsistency:** raised directly — `categories/[slug]`'s
  "Latest in {category}" list was the only one of 3 `PostRow` consumers
  rendering as a non-interactive `div` instead of a `Link`, so it got no
  hover state and wasn't clickable at all, while `RecentPublishedSection`
  and `authors/[slug]` both render real, hoverable links from the same
  kind of placeholder data (no real per-item `href` yet either way).
  Removed `as="div"`, added the matching `no-underline` the other two
  call sites already carry. **VC-30 completed:** the heading+trailing-row
  margin split — `categories/[slug]` fixed directly by the user
  (`mb-1` → `mb-3`) while I was mid-check; matched
  `responsible-gambling/help-directory`'s sibling instance to the same
  target (`mb-3.5` → `mb-3`). `tsc --noEmit`/`eslint` clean throughout.
  **Verified live**: breadcrumb links confirmed rendering as real `<a>`
  tags with correct hrefs (Next's `Link` renders to `<a>`, so this is
  expected — the fix is in the routing behavior, not the DOM shape);
  the "Latest in category" row confirmed now an `<a>` tag; zero console
  errors on the page. All 30 numbered findings now resolved — 0 open.
- **2026-08-17 — header top-border removal, full hover-state sweep, and
  BlogPostCard redesign** (all raised directly, outside the numbered
  findings). **Header top-border:** 4 page headers (`legal/[doc]`,
  `responsible-gambling/help-directory`, `categories/[slug]`,
  `reviews/page.tsx`) carried a `border-t border-text-primary pt-4 lg:pt-5`
  rule not present on any other header sitewide and serving no clear
  hierarchy purpose — removed from all 4, normalizing to the plain
  `flex flex-col gap-3 max-w-160` pattern every other header uses.
  **Hover-state sweep, round 2:** the original hover pass (button/card/
  link primitives) missed several hand-rolled "card" components that
  duplicate `PostRow`'s row shape or `.editorial-link-card`'s tile shape
  without reusing those components — found by systematically checking
  every `<Link>` wrapping substantial content sitewide. Fixed: `NewsCard`
  (row, `-mx-3 px-3 rounded-md hover:bg-bg-subtle`, safe here since it's
  single-column with no side neighbor), `OtherBooksCard`'s per-row links
  (same treatment, safe inside its `.card` parent since `-mx-3`/`px-3`
  exactly cancels that parent's own `spacing-3` padding), `TeaserCardGrid`
  (already `.card`-shaped, just added `hover:bg-bg-subtle`), and
  `Comments.tsx`'s small "comment policy" inline link (color-shift hover,
  matching the 2 blog inline links from the original hover pass).
  `ToolboxCard` confirmed already covered (routes through
  `.editorial-link-card`). `WriterQuoteCard`/`MarketCard`/`AtAGlanceCard`/
  `FeaturedBonusesCard` confirmed NOT to need card-level hover — none of
  their `.card` wrappers are themselves links, only an inner CTA is
  (already covered by `.btn-primary`'s hover).
  **`BlogPostCard` — multi-step correction, kept for the record since
  each attempt taught something:** (1) initial hover fill had no
  padding, so it read as clipped against the text — attempted the same
  `-mx-3 px-3` row technique already proven on `PostRow`; (2) caught
  directly that this is a **grid** (3 columns), not a single-column row —
  the always-on negative-margin expansion let adjacent tiles' hover
  boxes overlap in the 12-16px gap between them, painting into each
  other's space; (3) tried making the expansion hover-only
  (`hover:-m-3 hover:p-3`) so it wouldn't be always-on — still wrong,
  since animating margin/padding is a real layout property change and
  reflowed the grid (text rewrapping, siblings shifting) on every
  hover; (4) tried a purely-visual absolutely-positioned fill layer
  with `-inset-3` so real layout would never change — closer, but the
  16px inset still exceeded half the 16px grid gap, so the fill still
  visually reached into the neighboring tile; (5) **final, correct fix,
  proposed directly**: give each tile a real `.card` border + padding
  (matching `TeaserCardGrid`'s already-proven pattern) so the hover fill
  simply occupies space the box already owns — no expansion, no
  negative margins, no reflow, no collision, by construction. Also
  addressed directly in the same pass: the grid was `lg:grid-cols-3`
  at only 720px content-column width (measured: 229px per card,
  confirmed too narrow via a live screenshot) — reduced to
  `md:grid-cols-2` (352px per card); excerpt bumped `text-sm` → `text-md`
  with an explicit `font-medium` (500) added (previously inheriting
  ambient regular weight); byline given the same explicit `font-medium`.
  Since the byline change would otherwise sit alone against every other
  meta-row's regular weight sitewide, asked directly whether to scope it
  or propagate — answer was to propagate, so `PostRow`'s and `NewsCard`'s
  meta lines also gained `font-medium` (`TeaserCardGrid`'s equivalent
  line already goes through this same propagation). Separately asked
  whether `RecentPublishedSection` (a plain `PostRow` list, used on
  `/not-found` and `/categories`) should be redesigned to match
  `BlogPostCard`'s new card-grid look, since they serve the same
  "post preview" role but now look very different — answer was to keep
  them deliberately different registers (homepage feature grid vs.
  compact utility-page list), not a bug. `tsc --noEmit`/`eslint` clean
  after every step in this sequence. **Verified live** at each stage,
  not just at the end — computed hover background-color diffs, a
  before/after title-position check confirming zero layout shift on the
  final version, and screenshots at 3 points in the `BlogPostCard`
  iteration to actually see what each attempt produced rather than
  reasoning about it in the abstract.
- **2026-08-17 — button cursor + 2 fake-button `ChipList` sites** (raised
  directly, outside the numbered findings). `.btn-primary`/`.btn-secondary`
  had no `cursor` property at all — real `<button>` elements default to
  `cursor: default` in browsers (unlike `<a>`, which gets `pointer`
  automatically), so every button using these classes sitewide looked
  non-interactive on hover. Added `cursor: pointer` to both. Also found,
  while investigating: `responsible-gambling/help-directory` and
  `categories/[slug]`'s `ChipList` calls both omitted the `as` prop,
  silently falling back to `ChipList`'s default `as="div"` — meaning
  their filter chips were plain `<div>`s with no click handler, no href,
  and no keyboard focusability at all, despite being styled with
  `.btn-primary`/`.btn-secondary` to look exactly like real buttons. One
  of the two had even been patched with a manually-added `cursor-pointer`
  class at some point — making it look clickable while doing nothing,
  which is worse than the unpatched version. Fixed both with `as="button"`
  (removed the now-redundant manual `cursor-pointer` on the one that had
  it, since `.btn-primary`/`.btn-secondary` carry it centrally now).
  `TopHeader`'s 2 icon buttons don't use `.btn-primary`/`.btn-secondary`
  (custom bordered circle/square buttons) so needed their own explicit
  `cursor-pointer`, added directly. Checked for anything disabling focus
  outlines (`outline-none`) before assuming focus needed a fix — every
  instance found is in shadcn/Base-UI primitives and each correctly pairs
  it with an explicit `focus-visible:ring-2` replacement; nothing was
  suppressing focus on `.btn-primary`/`.btn-secondary`, so once these
  were real interactive elements the existing global `outline-ring/50`
  base rule was already sufficient — confirmed live rather than assumed.
  `tsc --noEmit`/`eslint` clean. **Verified live**: both previously-fake
  chips now render as real `<BUTTON>` elements with `cursor: pointer`;
  `.btn-primary` confirmed `cursor: pointer`; keyboard-focusing a
  `.btn-primary` link produces a real visible outline (`outlineStyle:
  "auto"`, colored from the ring token) — not assumed from reading CSS,
  actually measured post-focus.
- **2026-08-17 — `RankedList` layout refactor** (raised directly, outside
  the numbered findings — a readability complaint against the project's
  own reference site, not a consistency finding). Fetched rg.org's actual
  `/sportsbooks` ranked-list page live (not from memory) and compared its
  structure directly against `RankedList.tsx`: rg.org has an explicit
  column-header row, a rank number visually separate from a distinct
  colored score badge, and a "Last Verified" date stamp per row; wagerblogs
  had none of the three — no headers at all, the rank number stuffed
  inside the same placeholder-asset box meant for a future logo, and no
  verified-date despite `Operator.lastVerified` already existing in the
  type with real mock values (`docs/02`'s own reference material calls
  for this exact stamp, per its rg.org analysis — it just was never wired
  up). Per direct instruction, built a **simplified** adaptation of the
  same structural pattern rather than copying rg.org's fuller column set
  (Bonus/Reviews/Redemption) — those columns don't exist in the `Operator`
  type and adding them would mean fabricating data, not a layout fix.
  Went through 2 rounds shown to the user before landing: (1) first pass
  tried keeping rank+score both in the narrow left column, with the rank
  number absolute-positioned as a badge overlapping the corner of the
  logo placeholder — reviewed via screenshot and correctly rejected as
  cluttered, the placeholder became barely visible under the overlap;
  (2) simplified to the version now in place — rank as plain `#{i+1}`
  text (an ordinal position doesn't need its own colored badge), logo
  placeholder box unchanged and un-overlapped, score moved out to sit as
  a colored circular badge directly beside the operator name in the
  content column where there's real room for it. Added the `Last
  Verified — {operator.lastVerified}` line using data that already
  existed. Added a column-header row (`RANK / OPERATOR / VISIT`),
  shown only at the existing `wide:` (1370px) breakpoint where the row
  actually renders as a grid — hidden below that, where the existing
  responsive design (predating this change, tied to `VP-1`'s
  sidebar-squeeze fix) already stacks everything into a single column
  and column headers wouldn't map to anything. `tsc --noEmit`/`eslint`
  clean. **Verified live at both breakpoints**, not just the wide one —
  screenshotted the stacked state (1200px, below `wide:`) to confirm the
  rank/logo/score/CTA sequence still reads cleanly top-to-bottom without
  the header row attempting to render. Confirmed the mapping against the
  reference screenshot directly with the user before finalizing, per
  explicit process feedback mid-task: ground each step in the actual
  reference image, not a memory of having looked at it earlier.
- **2026-08-17 — `RankedList` rebuilt again against a precise "1b Compact
  scan row" spec, then refined through several more rounds.** The
  rg.org-matched version above was superseded by a much more specific
  spec provided directly (single shared container instead of per-row
  cards, plain-text rank, small logo, inline name+score, one-line
  advantage summary, stacked CTA). Built it exactly to spec including
  reusing existing tokens for the literal pixel values given (`gap-legacy-4`
  =12px, `w-3`=16px, `w-5`=32px all already existed in the theme — no
  arbitrary values needed). Then iterated through direct feedback:
  **(1)** `truncate`+`text-wrap` combined on the summary line — a real
  CSS conflict (`text-overflow: ellipsis` needs `white-space: nowrap` to
  do anything; `text-wrap` sets `white-space: normal`, so the two
  fought) — resolved in favor of `text-wrap` alone, per direct
  clarification that losing text to an ellipsis was worse than a taller
  row. **(2)** logo bumped `w-5`→`w-6` (32px→40px) — 32px isn't legible
  for a real vendor logo once real brand art replaces the placeholder.
  **(3)** "Read review"'s hover-only sliding-underline animation replaced
  with the sitewide-standard persistent-underline link style, then
  replaced again with a proper `.btn-secondary` outline button — matching
  the established sitewide convention of pairing `PrimaryDomainLink`
  with an outline secondary button (`reviews/[slug]`'s "How we score",
  `full-review`'s "See full scores"), not a plain link, once it was
  pointed out the button/plain-link pairing read as inconsistent.
  **(4)** Once both were buttons, they had different widths (sized to
  their own text) — fixed with a shared `md:w-28` on the CTA column and
  `md:w-full` on both. **(5)** Confirmed directly, not changed: whether
  `PrimaryDomainLink`'s compact scoped-down sizing here (`min-h-0 py-1.5
  px-3 text-xs`) should match the full default size used everywhere else
  it appears sitewide (`FeaturedBonusesCard`'s "Claim Offer",
  `AtAGlanceCard`, both reviews templates) — kept as an intentional,
  contextual adaptation for this specifically dense row, not
  reconciled to match. `tsc --noEmit`/`eslint` clean after every step;
  visually confirmed via screenshot after each round rather than assumed.
  See `.claude/viewport-audit.md`'s 2026-08-17 entry for the separate
  full responsive-sweep pass (VP-1 through VP-7 all resolved, plus 3 new
  findings caught) that followed this — including `RankedList` itself
  collapsing completely at 320px, which this rebuild had never been
  checked against until that pass.
- **2026-08-17 — `PrimaryDomainLink` compacted sitewide (scoped), plus a
  real link-policy fix on `FeaturedBonusesCard`.** Raised directly:
  `RankedList`'s scoped-down `PrimaryDomainLink` (from the compact-row
  rebuild above) was the size wanted generally, and `FeaturedBonusesCard`'s
  full-size button looked oversized and out of place in its card.
  **Sizing:** baked `min-h-0 py-1.5 px-3 text-xs` into `PrimaryDomainLink`'s
  own base className (previously only `RankedList` had this as a local
  override) — automatically compacts every usage sitewide. Checked the
  accessibility tradeoff before applying broadly: `.btn-primary`/
  `.btn-secondary`'s 44px height is documented in `globals.css` as the
  WCAG touch-target minimum, so asked directly whether to shrink the
  *shared base classes* (affecting standalone hero/nav CTAs too) or keep
  it scoped to buttons already sitting in dense contexts — answer was to
  scope it. Extended the same scoped treatment to every other
  dense-context button-shaped element found sitewide: the two TRUST BLOCK
  secondary buttons that pair with `PrimaryDomainLink` in both reviews
  templates (caught a real mismatch here — 44px vs 26px on what's meant
  to be a matched pair, measured directly rather than assumed from the
  screenshot), `ChipList`'s button/Link variants (covers 4 call sites at
  once), `authors/[slug]`'s "Coverage areas" pills, `categories/[slug]`'s
  state pills, `reviews/[slug]`'s "Read Reviews" Trustpilot-card button,
  and `TopicsCard`'s shadcn `<Button>` (found its "default" size resolves
  to 48px via this project's custom `--spacing-7` token — bigger than
  `.btn-primary` itself — given an explicit `size="xs"` instead of
  touching the shared default, since the other two `Button` consumers
  each already pass their own explicit size and don't rely on it).
  **Link policy (the more consequential fix):** `FeaturedBonusesCard`
  originally showed a real button only for the primary-domain entry and
  plain "text-only" copy for the other three, which read as visually
  broken/inconsistent — raised directly. First instinct (give every
  competitor `isPrimaryDomain: true`) was caught before implementing:
  that directly violates `CLAUDE.md` rule #5 ("only one operator per
  list may be the primary domain, and only that entry carries an
  equity-passing link"), which isn't just a style rule — it's the
  structural mechanism the whole site's link-policy enforcement is built
  on. Checked `docs/01-wireframe-component-audit.md` before deciding:
  competitor rows are allowed "either no link or nofollow'd links" — a
  real outbound button is fine, it just must never pass equity. First
  implementation attempt (give competitors a `primaryDomainLink`-shaped
  object with `relAttribute: "nofollow"`) was also caught before landing
  — correctly identified as dishonest data modeling: naming a field
  `primaryDomainLink` on a competitor entry falsely claims it's the
  site's own monetized link, which is exactly the kind of confusion that
  causes real mistakes later. Settled design: a new `OperatorLinkData`
  type (`{anchorText, url}`, deliberately no `relAttribute` field, since
  nofollow is never a choice for these), stored under an honestly-named
  `operatorLink` field, with `rel="nofollow"` hardcoded as a literal in
  the JSX at the call site — not stored as data — mirroring how the
  UGC-link rule is enforced elsewhere. `PrimaryDomainLink` itself needed
  no changes; it already didn't care what `relAttribute` it was handed.
  Added a discriminated-union `BonusOffer` type (`isPrimaryDomain: true`
  branch requires `primaryDomainLink`, `false` branch requires
  `operatorLink`) so TypeScript narrows correctly at the call site
  instead of both fields being ambiguously optional on every entry.
  `tsc --noEmit`/`eslint` clean throughout. **Verified live**: all 4
  "Claim Offer" buttons now render identically, but a live DOM check of
  every link's actual `rel` attribute confirmed exactly one
  `"sponsored noopener"` (PeakWager) and three `"nofollow noopener"`
  (competitors) — not assumed from the code, read back from the
  rendered page.
- **2026-08-17 — two smaller fixes raised directly while reviewing the
  above.** `categoryFinderStates` mock data had a `"View All →"` string
  mixed into an array of real state names, rendered through the same
  pill-button loop as the actual states — a literal arrow character
  standing in for the sitewide `ArrowLink` component (no icon, no hover
  animation, inconsistent with ~30 other arrow-links sitewide). Removed
  it from the data (it isn't a state) and rendered it as a proper
  `ArrowLink` alongside the pills instead. Then, raised directly: the
  entire "Browse by state" rail card on `categories/[slug]` doesn't
  belong on a worldwide-resource page — US states aren't a relevant
  filter there. Removed the whole card (search input, state pills, and
  the just-added `ArrowLink`), plus the now-fully-dead
  `categoryFinderStates` export from `lib/mock-data.ts` (confirmed zero
  remaining consumers before deleting). `tsc --noEmit`/`eslint` clean;
  all touched routes reconfirmed 200 (404 route still genuine 404).
- **2026-08-18 — strict re-sweep, 17 new findings (VC-31–VC-47), one
  factual correction to this document's own record.** Per direct
  instruction to re-run the full audit methodology (not just
  spot-check), broadened beyond the original 6 properties (text size,
  line-height, gap, padding, margin, radius, divider color) to also
  cover font-weight, general color-token usage, button/CTA sizing,
  hover/focus consistency, icon `shrink-0` guarding, and
  arbitrary-bracket-value usage. Two parallel full-repo reads (`app/`,
  `components/`) plus a fresh Playwright viewport sweep (folded into
  `.claude/viewport-audit.md`'s own 2026-08-18 entry). **Correction:**
  re-verified all 30 original findings directly against current source —
  VC-1–4, 6–14, and 30 are genuinely fixed and unregressed; VC-15–29 were
  never actually applied, exactly as this document's own summary table
  already recorded (Proposed/Needs decision/Note only) — but the closing
  line of the 2026-08-17 change log ("All 30 numbered findings now
  resolved — 0 open") was wrong and contradicted the table it sits below.
  Not editing that historical entry directly; corrected the summary-table
  row instead (VC-30 was in fact completed later that same day, per its
  own "VC-30 completed" change-log entry, so its table status is
  corrected from "Proposed" to "Fixed") and the stale summary paragraph
  beneath the table, which hadn't been updated since early in the
  original session and undercounted the fix total even before this pass.
  **Also found while re-verifying, not new findings of their own:** VC-6's
  fix pass missed one instance — `components/rail/HelpLineCard.tsx:7` is
  still `mb-1.5`, the exact pre-fix outlier value, simply absent from the
  Group-C change log's list of touched files. VC-28's own framing
  ("dormant... zero call sites") no longer holds —
  `components/rail/TopicsCard.tsx:10` now passes `size="xs"`, added
  during the later `PrimaryDomainLink` compaction pass, so the arbitrary
  `text-[0.625rem]` value it flagged is now live in production on every
  route rendering `HomeRail`, not dormant. **17 new findings**, VC-31
  through VC-47 (see Group J above): highest-severity is VC-31, a
  fourth-and-largest-reach recurrence of the exact missing-`.heading`-class
  bug the type-scale pass believed it had fully closed — it backs 8
  heading instances across both reviews templates. Read-only pass — no
  fixes applied, per direct instruction to flag rather than fix this
  time.
