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

**Proposed:** `mb-3` (majority). **NEEDS DECISION** on the 3 "no own
margin" cases — confirm their parent wrapper already produces equivalent
visual spacing before adding an explicit margin (risk of doubling the
gap), rather than assuming they're bugs.

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
| VC-1  | Hero H1 scale/leading/text-pretty    | cross-component-divergence | Proposed                             |
| VC-2  | Standfirst responsive step + leading | cross-component-divergence | **Needs decision**                   |
| VC-3  | Page header wrapper gap              | cross-component-divergence | Proposed                             |
| VC-4  | H2 section heading margin            | cross-component-divergence | **Needs decision**                   |
| VC-5  | In-document H2 (blog vs legal)       | cross-component-divergence | **Needs decision**                   |
| VC-6  | Rail card title margin               | cross-component-divergence | Proposed                             |
| VC-7  | Rail card title font-size outlier    | cross-component-divergence | **Needs decision** (low stakes)      |
| VC-8  | Card/rail body copy size+leading     | cross-component-divergence | **Needs decision**                   |
| VC-9  | Card/tile inner title combo          | cross-component-divergence | **Needs decision**                   |
| VC-10 | `EditorialSection` wrapper gap       | cross-component-divergence | **Needs decision**                   |
| VC-11 | `PostRow` padding + title size       | cross-component-divergence | Proposed                             |
| VC-12 | `TeaserCardGrid` title size/weight   | cross-component-divergence | **Needs decision** (low priority)    |
| VC-13 | `ChipList` radius                    | radius-split               | Proposed                             |
| VC-14 | `ArrowLink` missing gap-1            | **real bug**               | Proposed — fix first                 |
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

29 findings: 1 real bug (VC-14), 16 with a confident proposed fix, 12
flagged as needing an explicit decision before touching.

---

## Change log

- **2026-08-17 — initial pass.** Two parallel full-repo reads (`app/`,
  `components/`), merged and deduplicated, one factual correction applied
  after direct verification (`responsible-gambling/page.tsx:76`'s
  `leading-*` value). 29 findings. Read-only — no code touched.
