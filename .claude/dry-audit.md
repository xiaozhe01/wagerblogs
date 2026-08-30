# DRY Audit — WagerBlogs Front End

Living document. Read-only findings as of the pass below — no code was
touched to produce this. Re-scanned on request; see "Change log" at the
bottom for what was added/removed on each pass.

**Last full pass: 2026-08-17.** Every finding in this document is now
resolved except DRY-8, which was never a duplication finding to begin with
— it's a settled product decision (both reviews templates stay separate
by design). That's 28 of 29 numbered findings checked off: DRY-1 through
DRY-7, -9, -13, -14 (resolved in earlier passes) plus DRY-2, -4, -10
through -12, -15 through -29 (resolved in the 2026-08-17 fix pass). See
the 2026-08-17 change-log entry for the full account.

**Docs reviewed first (in order):** `docs/00-six-layer-map.md`,
`docs/01-wireframe-component-audit.md`, `docs/02-design-language-reference.md`,
`docs/03-claude-design-handoff-prompt.md`, `docs/04-claude-code-implementation-brief.md`,
`docs/architecture-gaps-solo-dev.md`, plus `.claude/frontend-component-plan.md`
(the pre-existing spec for the components this audit found missing).

Grouped by which `architecture-gaps-solo-dev.md` principle is violated:
**§2** CMS-owned vs. code-owned truth, **§3** single data-access layer,
**§7** component contract convention. A fourth section lists things that
looked like duplication but aren't real problems, so they're excluded from
the checklist on purpose.

**Not a DRY finding — resolved:** the malformed Tailwind class previously
flagged at `app/reviews/[slug]/full-review/page.tsx:219`
(`lg:w-[37.5 shrink-0"`) was fixed prior to the 2026-08-12 pass — both
`app/reviews/[slug]/page.tsx` and `full-review/page.tsx` now read
`lg:w-37.5 shrink-0` (valid). No action needed.

**Not a DRY finding — fixed 2026-08-12:** `app/legal/[doc]/page.tsx` used a
synchronous `params: { doc: string }` signature in both `generateMetadata`
and the page component. Next.js 16's App Router requires dynamic-route
`params` to be a `Promise` that's awaited — reading `.doc` directly off the
Promise silently resolved to `undefined`, which tripped the `notFound()`
guard. Every `/legal/*` route was 404ing. Fixed by making both functions
`async` and awaiting `params`. Confirmed via live `curl` against all 4
legal docs (all now 200) — this was a real, pre-existing runtime bug,
unrelated to the DRY work, caught while validating that work's routes.

---

## Group A — §2: Code-owned truth re-implemented instead of centralized

Per §2, `PrimaryDomainLink` render/null logic and RG copy are explicitly
**code-owned** ("fixed behavior, not editable per post"). The pattern below
is each page re-deriving that fixed behavior locally instead of there being
one place it lives — which is exactly the failure mode §2 warns about.

- [x] **DRY-1 — `PrimaryDomainLink` component now exists and is correct, but 2 of 3 call sites still hand-roll their own link logic**
  - **Status note (2026-08-12, RESOLVED):** both `app/reviews/[slug]/page.tsx` and `full-review/page.tsx` now render every outbound CTA through `<PrimaryDomainLink linkTier="tier3" primaryDomainLink={mockPeakWagerReview.primaryDomainLink} />` — all 7 original hand-rolled `<Link href={primaryLink.url} rel={primaryLink.rel}>` sites replaced (2 in `[slug]/page.tsx`, 5 in `full-review/page.tsx`, including the two comparison-table LINK cells, which now come for free via `<ComparisonCard />`, see DRY-9). `PrimaryDomainLink` picked up one small API extension to support this: an optional `className` prop (appended to the base `btn-primary gap-1.5`, used once for the rail card's `mt-3` spacing) — the tier-gating/`null`-guard/`rel`-mapping logic itself is untouched. All 3 original call sites (`RankedList`, `ComparisonCard`, both reviews templates) now go through the one component. Checking off.

- [x] **DRY-2 — Shared helpline constant is now fully dead code; hardcoded copies still everywhere, plus one more than previously counted**
  - **Status note (2026-08-17, RESOLVED):** the three differently-worded instances genuinely differ in surrounding copy (confirmed — not safe to collapse into one shared sentence), so rather than force one wording everywhere, extracted just the atomic fact both wordings depend on: `helplineNumber = "1-800-XXX-XXXX"` in `lib/mock-data.ts` (moved there as part of DRY-4's split, see below), with `helplineText` now derived from it (`` `Helpline: [${helplineNumber}]` ``). `HelpLineCard.tsx` imports `helplineText` directly (its copy was already an exact match). `SiteFooter.tsx` and `app/responsible-gambling/page.tsx` interpolate `{helplineNumber}` into their own distinct sentences, unchanged otherwise. Zero visible copy change at any of the 3 sites; the number itself now has one source of truth.

- [x] **DRY-3 — "How We Review" methodology copy: centralized on 1 of 3 pages, still duplicated as independent literals on the other 2**
  - **Status note (2026-08-12, RESOLVED — retroactive checkbox):** resolved prior to this pass (not by this session), caught by the 2026-08-12 fresh re-scan and never checked off. `components/section/ReviewCard.tsx` correctly imports `methodSteps` from `lib/site-data.ts` and is now used consistently in 3 places: `app/page.tsx`, `app/reviews/[slug]/page.tsx`, and `full-review/page.tsx`. The one remnant found during the fresh scan — `full-review/page.tsx` still had its own local, entirely-unused `methodSteps` array (superseded by `<ReviewCard />` but never deleted) — was removed as part of this session's edits to that file. Checking off.

---

## Group B — §3: Missing single data-access layer

- [x] **DRY-4 — `lib/mock-data.ts` now substantially wired up; the site-data.ts ↔ mock-data.ts split still needs a real rule**
  - **Status note (2026-08-17, RESOLVED):** applied the structure-vs-content rule in full. Moved `bonusOffers`, `methodSteps`, `operators`, `compareRows`, `newsFeed`, `blogPosts`, `toolboxItems`, `marketStats`, `recentPosts`, `popular`, `helplineNumber`, `helplineText` out of `lib/site-data.ts` into `lib/mock-data.ts` (the last two per DRY-2 above; `methodSteps`/`recentPosts`/`popular` weren't in the originally-proposed list but are unambiguously content, so moved for consistency rather than left as an inconsistent half-measure). `lib/site-data.ts` now holds only `navGroups`/`NavGroup`, `footerCols`, `legalLinks`, `legalParagraphs`, `categories`, `categoryFilters`, `regions`, `newsCategories` — genuine structure/taxonomy, nothing else. Updated every import site (12 files) to pull from the new location; `git grep` confirms zero remaining `site-data` imports of any moved symbol. `tsc`/`eslint` clean, and every route spot-checked live via `curl` (all 200, 404 route still a genuine 404).

- [x] **DRY-5 — Category-vertical list: centralized on 1 of 3 pages, still duplicated on the other 2**
  - **Status note (2026-08-12, RESOLVED):** `app/not-found.tsx` was already fixed before this pass (renders `<ExploreSection />`, sourced from `lib/site-data.ts`'s `categories`). `app/categories/[slug]/page.tsx`'s `allCategories` (previously a standalone name-only array) now maps `categories` from `lib/site-data.ts` directly. All 3 consumers now share one source. Checking off.

- [x] **DRY-6 — Competitor operator name+score list (`otherBooks`) duplicated with identical hardcoded values**
  - **Status note (2026-08-12, RESOLVED):** extracted to `otherBooksCompared` in `lib/mock-data.ts`, imported directly (no local rebind) by both `app/reviews/[slug]/page.tsx` and `full-review/page.tsx`. Checking off.

---

## Group C — §7: Inconsistent component contracts

- [x] **DRY-7 — Down to two incompatible data shapes for "ranked operator" content (was three); still no standalone shared component**
  - **Status note (2026-08-12, RESOLVED for the data-shape split):** `lib/types.ts`'s `Operator` type was extended with optional `pros?: string[]` / `cons?: string[]`. Both `reviews/[slug]` templates now derive `scoreBreakdown` from `mockPeakWagerReview.categoryScores` (reusing the existing `OperatorCategoryScore` shape, previously populated but unused anywhere) and `pros`/`cons` directly from the same record, instead of five independently-typed parallel arrays. `RankedList`, `ComparisonCard`, and both reviews templates now all key off `Operator`/`ComparisonOperator` (new minimal type added for the comparison-table shape, see DRY-13). Not done: `RankedOperatorRow` was never extracted as its own component file (the plan doc's original ask) — the shape unification happened without a new shared component, since `RankedList` already encapsulates that rendering. Checking off on the shape-consistency question this finding was actually about; the component-extraction suggestion is superseded.

- [ ] **DRY-8 — Two near-duplicate full-page operator-review templates — product decision made, not a duplication finding anymore**
  - **Status note (2026-08-12, decision recorded):** asked directly — answer was to keep both templates as an intentional two-tier product (quick review vs. deep-dive), _not_ merge them, but fix the underlying data/link-policy duplication that made them risky (DRY-1, -6, -7, -9, all now resolved above). That's done: both templates now read from the same `mockPeakWagerReview` record and the same `PrimaryDomainLink`/`ComparisonCard` components; the JSX layouts remain intentionally distinct (trust-blocks + `<Comments />` vs. FAQ + bonus-detail). Leaving this item unchecked since the file-level duplication still exists by design — but it's no longer an _unresolved_ finding, it's a settled architectural decision. Any future audit pass should stop flagging the JSX split itself and only flag if the two templates' _shared_ data drifts apart again.

- [x] **DRY-9 — Comparison-table JSX still duplicated near-verbatim; data centralized on one side only, which doesn't touch this finding**
  - **Status note (2026-08-12, RESOLVED):** `full-review/page.tsx`'s entire local comparison-table section (~70 lines: local `operators`/`compareRows`, positional `i === 0` link gating, duplicate desktop-grid/mobile-card JSX) was deleted and replaced with `<ComparisonCard id="scores" />` — the same component `app/page.tsx` uses. `ComparisonCard` picked up one small API extension: an optional `id` prop on its outer `<section>`, needed to preserve the `#scores` in-page anchor that the page's "Jump to" rail and hero "See full scores" button both target. One visible content change from this: the old local `compareRows` had a "Live betting"-style row set that slightly differed from the homepage's (an extra "Overall score" row, no "Welcome Bonus" row) — collapsing onto the shared component means `full-review` now shows the exact same feature rows as the homepage's comparison table, which was judged to be organic copy drift rather than an intentional difference. Checking off.

- [x] **DRY-10 — Breadcrumb nav JSX duplicated verbatim across 7 route files**
  - **Status note (2026-08-17, RESOLVED — and extended):** installed the real shadcn `breadcrumb` registry component via `npx shadcn add breadcrumb` (rather than hand-rolling one) at `components/ui/breadcrumb.tsx`, then customized its default `text-muted-foreground`/`text-foreground` shadcn theme tokens to this project's actual `text-text-subtle`/`text-text-primary` tokens and typography (`text-xs font-mono`, matching every existing breadcrumb). Built `components/layout/Breadcrumbs.tsx` on top of it (auto-prepends "Home"), wired into all 7 original files plus the 2 new index pages below. Along the way: found and fixed a genuine HTML-nesting/hydration bug (`<li>` `BreadcrumbSeparator` nested inside `<li>` `BreadcrumbItem>` — fixed by making them siblings via `Fragment`); replaced literal bracket-placeholder crumbs (`"[author slug]"`, `"[post slug]"`, `"[operator slug]"`) with real page data already in scope (`mockAuthor.name`, an extracted `postTitle` const, `operatorName`) rather than deriving crumbs from the URL client-side (asked directly — URL-derived labels can't produce text like "Sportsbooks" that isn't a literal path segment anyway); discovered `/reviews` and `/categories` had no index routes at all (even the "Reviews"/"Categories" crumbs were dead links) and built minimal ones (see below). Also paired `Breadcrumbs` with `BreadcrumbList` JSON-LD (`lib/schema.tsx`'s `JsonLd`/`breadcrumbJsonLd`) per `docs/00-six-layer-map.md` Layer 4 ("standard on every route") — not part of the original finding, added on request while already in this component.

- [x] **DRY-11 — "[search input]" placeholder box duplicated verbatim across rail sidebars**
  - **Status note (2026-08-17, RESOLVED):** `components/rail/SearchInput.tsx` gained an optional `placeholder` prop (default `"Search..."`), then swapped in at all 3 remaining dead-placeholder sites — `app/authors/[slug]/page.tsx`, `app/blog/[slug]/page.tsx` (both generic), `app/categories/[slug]/page.tsx` (category-specific: `` `Search within ${sampleCategoryName}...` ``, preserving that page's original contextual hint instead of losing it to the generic default).

- [x] **DRY-12 — "Editorial standards" rail card duplicated near-verbatim across 3 files**
  - **Status note (2026-08-17, RESOLVED — superseded by DRY-18):** fixed as part of DRY-18's broader `InfoCard` extraction below, not as its own narrow component — see DRY-18's status note for the full account.

- [x] **DRY-13 — Two competing, unreconciled "comparison operator" data sources; one was 100% dead** _(new, found 2026-08-12)_
  - **Location(s) (as found):** `lib/mock-data.ts`'s `mockComparisonOperators: Operator[] = mockRankedSportsbooks.slice(0, 3)` — typed, built specifically for the comparison table per its own comment, but zero importers anywhere — vs. `lib/site-data.ts`'s separate, untyped `operators`/`compareRows`, which is what `ComparisonCard` actually consumes.
  - **Status note (2026-08-12, RESOLVED):** deleted the dead `mockComparisonOperators` export. Added a new minimal `ComparisonOperator` type to `lib/types.ts` (`{name, isPrimaryDomain, primaryDomainLink?}` — deliberately not unified with the full `Operator` type, since the comparison table's per-feature `compareRows` don't map onto `Operator`'s shape) and annotated `lib/site-data.ts`'s `operators` export against it. One live data source now, correctly typed.

- [x] **DRY-14 — `components/rail/BettingSiteState.tsx` was a fully orphaned component** _(new, found 2026-08-12)_
  - **Location(s) (as found):** the file existed, exported a default component, but its only "reference" anywhere was a commented-out JSX line in `components/rail/HomeRail.tsx` — never actually imported or rendered. A near-duplicate inline "state finder" card also existed hardcoded in `app/categories/[slug]/page.tsx`.
  - **Status note (2026-08-12, RESOLVED):** asked directly — answer was to delete it (no evidence it was still planned; dead code per CLAUDE.md's "no half-finished implementations" guidance). Deleted `components/rail/BettingSiteState.tsx` and removed the commented-out `{/* <BettingSiteState /> */}` line from `HomeRail.tsx`. `categories/[slug]`'s inline state-finder card was left as-is (it's real, rendered content — its own data now lives in `categoryFinderStates`, see DRY-4).

- [x] **DRY-15 — "Arrow link" JSX block duplicated ~21 times across 14 files** _(new, found 2026-08-12)_
  - **Status note (2026-08-17, RESOLVED):** extracted `components/ui/ArrowLink.tsx` (`href` + full `className` pass-through + children — the icon/props are hardcoded inside since they never varied). Wired up all 21 original sites across 13 files (`SideNav.tsx`'s "match" turned out to be a different pattern — a conditional `ChevronRight` trailing icon inside an existing `NavigationMenuLink`, not a standalone arrow-link — correctly left alone). Also swept the plain-underline "→"-character sibling variant (the "commented-out version right next to the arrow version" this finding flagged) at 6 more sites across `legal/[doc]`, `responsible-gambling`, `categories/[slug]`, and `reviews/[slug]` once spotted mid-session and confirmed in scope — every trailing-arrow link in the site is now one component.

- [x] **DRY-16 — `NewsCard` uses an ad hoc inline prop type instead of a shared one** _(new, found 2026-08-12)_
  - **Status note (2026-08-17, RESOLVED):** added `NewsItem` (`{title, meta}`) to `lib/types.ts`; `lib/mock-data.ts`'s `newsFeed` (moved here from `site-data.ts` per DRY-4) is now typed `NewsItem[]`, and `NewsCard.tsx`'s `NewsCardProps` derives `news: NewsItem` from the shared type instead of its own inline shape.

---

## Not flagged — looked like duplication, isn't a real problem

- **Repeated Tailwind utility strings** (`card`, `card-dark`, `btn-primary`, `btn-secondary`, `editorial-link-card`, `meta-label-caps`, etc.) across every page. This is exactly what `globals.css`'s `@layer components` classes are for, and they're already correctly centralized there.
- **`PageShell`/`SideNav`/`TopHeader`/`SiteFooter` usage** across every route — the shared-shell pattern working correctly, not a violation.
- **Individual one-line `<Link>` elements with shared classNames** that only appear once or twice with different hrefs/copy — normal page content, not duplicated logic.
- **`components/ui/textarea.tsx`** wrapped as `InputGroupTextarea` in `input-group.tsx`, itself unused — standard shadcn primitive scaffolding, not a duplication risk.
- **`PrimaryDomainLink` calls hardcoding `linkTier="tier2"`** at `RankedList.tsx`, `ComparisonCard.tsx`, `FeaturedBonusesCard.tsx` — legitimate, since `Operator` has no per-record tier field.
- **Rule #2 (`rel="ugc nofollow"`) and rule #4 (`AggregateRating`)** have no implementation anywhere yet (`Comments.tsx` renders no real UGC links; no JSON-LD exists at all) — nothing to deduplicate, not a DRY finding, just unbuilt.

---

## HTML structure — 2026-08-12

Follow-up pass, scoped specifically to repeated JSX/markup structure — not
logic or data-fetching (that's the pass above). Read `docs/00` through `04`,
`docs/architecture-gaps-solo-dev.md`, and both `.claude/frontend-component-plan.md`
and `.claude/viewport-audit.md` fresh before starting. Cross-checked against
every open/closed item above so nothing here re-flags DRY-10, -11, -12, or -15
(all still open, still accurate, not repeated below) or re-litigates DRY-8's
settled "keep both templates, JSX split is intentional" decision.

Scanning **`app/` only** this checkpoint, directory-by-directory per the
requested order. Numbering continues from DRY-16.

- [x] **DRY-17 — "Post row" (thumbnail + kicker/title/meta) duplicated verbatim across 3 route files**
  - **Status note (2026-08-17, RESOLVED, together with DRY-23):** extracted `components/cards/PostRow.tsx` (`post: PostTeaser`, `as="Link"|"div"`, full `wrapperClassName`/`titleClassName`/`thumbnailClassName` pass-through so each site's exact `py-4` vs `py-4.5`, `text-xl` vs `text-2xl`, Link-vs-div differences carry over unchanged). Wired into `authors/[slug]` (`authorArticles`), `categories/[slug]` (`categoryArticles`), and `RecentPublishedSection.tsx` (`recentPosts` — see DRY-23 for why `not-found.tsx` itself needed a different fix, not a direct `PostRow` call).

- [x] **DRY-18 — Generic "title + body copy + one CTA link" rail-card shape recurs well beyond DRY-12's scope**
  - **Status note (2026-08-17, RESOLVED, supersedes DRY-12):** built `components/rail/InfoCard.tsx` (`title`, optional `titleClassName` override for the one `mb-2.5` outlier, `body`, and a `cta: ReactNode` slot — deliberately a slot rather than a fixed `ctaLabel`/`ctaHref` pair, since call sites split between the `ArrowLink` icon style and the plain-underline style, and forcing one style onto the other would've been a visual change beyond what was asked). Wired into all 3 "Editorial standards" sites (DRY-12) and all 3 "Corrections" sites, plus `not-found.tsx`'s "Start from the top" and `responsible-gambling/page.tsx`'s "Our commitments". `legal/[doc].tsx`'s "Questions about this document" was left alone as originally scoped — genuinely different typography (`text-md`/`text-sm` vs the rail cards' `text-sm`/`text-xs`), not the same component.

- [x] **DRY-19 — Anchor/TOC list pattern duplicated across 6 files, including one already half-extracted into a local, unshared component**
  - **Status note (2026-08-17, RESOLVED and extended):** extracted `components/rail/AnchorList.tsx` (`items: {href, label, key?}[]`, `itemClassName` as string or per-item function for active-state variants, `as="a"|"Link"`, optional `wrapperClassName`). Wired into blog's `TocList` (deleted, both call sites now use `AnchorList` directly), `legal/[doc]`'s "In this document", `responsible-gambling`'s "On this page", `full-review`'s "Jump to", plus the active-state variant at `categories/[slug]`'s "All categories". Also found and fixed a matching active-state instance not in the original location list — `legal/[doc]`'s "All legal documents" pill list. Later gained an optional `title`/`cardClassName` prop (self-owns its `<div className="card">` + title header) so it matches sibling rail cards like `AtAGlanceCard`/`OtherBooksCard` instead of leaving the card wrapper hand-typed around each call site — applied to `full-review`'s "Jump to", both `legal/[doc]` lists, `responsible-gambling`'s "On this page", and blog's two `TocList`/"More in Guides" sites.

- [x] **DRY-20 — "TRUST BLOCK n / 3" section header triplicated within a single file**
  - **Status note (2026-08-17, RESOLVED and generalized further than proposed):** rather than a page-local component, extracted `components/section/ReviewSectionHeading.tsx` (`title`, optional `badge`/`note` — renders the "TRUST BLOCK n/3" row when set, a plain standalone `<h2 className="text-2xl text-text-primary tracking-tight mb-3">` otherwise) once it became clear the same plain-heading style was *also* hand-typed 6 more times across both reviews templates (`reviews/[slug]`: "Where it wins...", "Compare further"; `full-review`: "Where it wins...", "Bonus detail", "Questions readers ask", "Compare further"). All 9 instances across both files now go through one component. Along the way, fixed a real bug the user caught: the trust-block row used `items-baseline`, which should be `items-center` — fixed in the shared component, so all 3 badge rows corrected at once.

- [x] **DRY-21 — Reviews templates share several literal-duplicate sub-blocks that DRY-8's settled decision doesn't cover**
  - **Status note (2026-08-17, RESOLVED):** extracted exactly the 3 components suggested — `components/rail/AtAGlanceCard.tsx` (`items: AtAGlanceItem[]` — new shared type added to `lib/types.ts` — + `primaryDomainLink`), `components/rail/OtherBooksCard.tsx` (`books`), `components/section/ProsConsSection.tsx` (`pros`, `cons`, internally uses `ReviewSectionHeading` from DRY-20). Wired into both `reviews/[slug]/page.tsx` and `full-review/page.tsx`. The score-breakdown grid cell was left as inline markup in both files rather than extracted — it's small (3 lines) and the two templates' surrounding hero-card layout differs enough (see DRY-8) that pulling just the cell out didn't read as a clean win; VP-1's responsive fix (`.claude/viewport-audit.md`) can still land independently in both places.

- [x] **DRY-22 — "Compare further" teaser-card grid duplicated verbatim across 3 files**
  - **Status note (2026-08-17, RESOLVED):** extracted `components/cards/TeaserCardGrid.tsx` (`items: PostTeaser[]`, `titleClassName` override for the `text-sm`/`text-md` difference between the reviews templates and categories, optional `gridClassName` default). Renamed `categoryCompareLinks`'s `note` field to `meta` in `lib/mock-data.ts` so it matches `PostTeaser` exactly (data-shape rename only, same rendered copy) and typed the export `PostTeaser[]`. Wired into all 3 original sites.

---

## HTML structure — 2026-08-12, `components/` checkpoint

Second checkpoint of the same HTML-structure pass, per the requested
directory order. Read every file under `components/` in full (`cards/`,
`layout/`, `rail/`, `section/`, root, plus a pass over `ui/` — the latter is
standard shadcn registry scaffolding per the existing exclusion below, no
new findings there). `lib/` has no `.tsx`/JSX-rendering files, so there's
nothing to scan for the "shared/lib-adjacent markup" bucket — confirmed via
`grep -rl "<[A-Za-z]" lib/`, zero matches. Numbering continues from DRY-22.

- [x] **DRY-23 — `app/not-found.tsx` hand-rolls an exact duplicate of an existing component that nothing renders**
  - **Status note (2026-08-17, RESOLVED):** deleted the inline block in `not-found.tsx`, replaced with `<RecentPublishedSection />` — a one-line swap, exactly as anticipated. `RecentPublishedSection` itself then became the base for extracting `PostRow` (see DRY-17) once `authorArticles`/`categoryArticles` were brought into the same component.

- [x] **DRY-24 — Editorial "section wrapper" (heading + single child) shape duplicated across 4 section components**
  - **Status note (2026-08-17, RESOLVED):** extracted `components/section/EditorialSection.tsx` (`title`, `className` default `"flex flex-col gap-5"` — a full-string override rather than a computed `gap-${n}`, since Tailwind's JIT scanner needs literal class names; the `gap-3`/`gap-4` outliers pass an explicit override string instead). Wired into all 5 sites (`BettingToolboxSection`, `BlogSection`, `ExploreSection`, `LatestNewsSection`, `RecentPublishedSection`). `RankedListSection`/`MarketCard`/`FeaturedBonusesCard`/`ComparisonCard`'s deliberately-different comparison-register heading was left untouched, as scoped.

- [x] **DRY-25 — "Byline/avatar card" shape duplicated between a shared component and an inline page block**
  - **Status note (2026-08-17, RESOLVED):** extracted `components/section/BylineCard.tsx` (`as="section"|"div"`, `wrapperClassName`, `profileHref`, `children` for the variable middle content). `WriterQuoteCard` now passes its quote as children; `blog/[slug]/page.tsx`'s inline byline passes its name/credential lines the same way. The near-miss noted in the original finding (`reviews/[slug]`'s "Reviewed by" block) was left alone, as scoped — still genuinely different (no CTA link, different avatar size).

- [x] **DRY-26 — "Pill/chip filter list, first-or-matched item highlighted" pattern duplicated across 4 files with 3 different active-detection strategies**
  - **Status note (2026-08-17, RESOLVED):** extracted `components/ui/ChipList.tsx` (`items: {label, active, href?}[]`, `activeClassName`/`inactiveClassName` full pass-through, `as="div"|"button"|"Link"`). Deliberately did **not** standardize the `i === 0` vs value-match active-detection logic or the `rounded-lg` vs `rounded-full` inconsistency the finding flagged as side-effect fixes — each call site still decides its own `active` boolean and passes its own exact classes, so `LatestNewsCategory`'s `rounded-lg` is preserved rather than silently normalized to `rounded-full` (kept in scope as "remove the duplicated ternary," not "also restyle it," per this session's no-visual-change default). Wired into all 4 original sites.

- [x] **DRY-27 — Plain text-only link-list pattern duplicated verbatim between a rail component and a page**
  - **Status note (2026-08-17, RESOLVED):** folded into the `AnchorList` extraction (DRY-19) as the `href`-less/no-active-state case, exactly as anticipated — both `TrendingCard` and blog's "More in Guides" now call `AnchorList` with `as="Link"`. Padding was bumped from `py-2` to `py-3` on both (asked directly, mid-session, after the user flagged the original spacing as too tight once rendered) — the one deliberate visual change in this whole pass, applied to both sides of the pair so they stay identical. Recorded so future work doesn't revert it.
    - **Superseded 2026-08-29.** `py-3` is gone. `AnchorList` now owns all row
      geometry itself — `px-2 py-1.5 min-h-11 wide:min-h-5` — so height comes
      from a touch-target floor (44px on mobile, 32px from `wide:`) rather than
      from padding, and no call site sets its own spacing. Do not restore `py-3`.

- [x] **DRY-28 — Title+description content block re-typed independently (with class drift) by two sibling cards sharing the same `editorial-link-card` wrapper**
  - **Status note (2026-08-17, RESOLVED):** extracted `components/cards/TeaserCardBody.tsx` (`title`, `desc`), canonicalized on `ExploreCategoryCard`'s classes (`mb-1`, `text-text-meta leading-relaxed`) since those also independently matched a third instance (`categorySubCategories`, inline in `categories/[slug]/page.tsx`) — `ToolboxCard` was the actual outlier and now matches. Wired into both original sites.

- [x] **DRY-29 — Two minor same-file duplications (low priority, noted for completeness)**
  - **Status note (2026-08-17, RESOLVED):** both fixed as local, same-file helpers per the original suggestion — `SideNav.tsx` gained a local `NavIconLabel` component used by both branches; `ComparisonCard.tsx` gained a local `ComparisonLinkOrNote` component (`variant="grid"|"card"` to preserve the two branches' genuinely different fallback copy — one is `<br />`-separated onto two lines, the other is a single middot-joined line).

**Also noticed, not a DRY finding, flagged for awareness only:**

- `components/layout/SideNav.tsx:48-92` — 44 lines of commented-out old nav implementation (superseded by the `NavigationMenu` version below it). Not duplication, just dead code left in place; CLAUDE.md's "no half-finished implementations" guidance would say delete it, but that's a cleanup call for you, not a markup-duplication finding.
- `components/rail/EditorsCard.tsx:11` — `href={`/reviews/${"peakwager"}`}` is a template literal wrapping a hardcoded string for no reason (equivalent to `href="/reviews/peakwager"`). Harmless but odd; noting since the last pass caught a similar drive-by bug (the malformed Tailwind class) and it seems worth the same treatment.
- `components/rail/TopicsCard.tsx:9` and `components/rail/TrendingCard.tsx:7-11` — both have inline literal arrays (`["Sports", "Casino games", "Esports"]`, and a 4-item news-headline array) sitting directly in JSX rather than in `lib/site-data.ts`/`lib/mock-data.ts`. This is a data/logic-layer issue (out of scope for this markup-only pass), but worth flagging since the prior pass's inline-data sweep claimed "zero top-level literals remain" via a `^const \w+ = [\[{]` grep — that grep wouldn't catch an array literal written inline inside JSX rather than assigned to a top-level `const`, so these two slipped through. Not fixed here; belongs with DRY-4/DRY-2 territory in the logic-focused document above, next time that's revisited.

---

## Change log

- **2026-08-04 — initial pass.** 12 findings added (DRY-1 through DRY-12). No prior state to diff against.
- **2026-08-04 — component audit.** `components/PrimaryDomainLink.tsx` was created; reviewed against DRY-1. Nothing removed — the new file was missing the tier-gating logic that's the actual point of the component, and wasn't imported anywhere yet, so DRY-1 stayed unchecked with a status note added.
- **2026-08-04 — component fix verified.** `components/PrimaryDomainLink.tsx` was rewritten and now correctly implements the full spec. Nothing removed — DRY-1 stayed unchecked since no call sites consumed it yet.
- **2026-08-04 — first call site wired up, plus path corrections.** Recreated `lib/mock-data.ts` (deleted outside this audit) with a new `mockRankedCasinos` export. Rewrote `app/page.tsx`'s `RankedList` to take typed `Operator[]` and render through `PrimaryDomainLink`. Nothing removed — DRY-1, DRY-4, DRY-7 stayed unchecked with updated notes. Corrected stale `components/site/*` references to `components/*`.
- **2026-08-04 — full re-scan, all 12 items re-verified against a fresh read of every file.** Nothing removed this pass — no finding is fully resolved yet, all 12 stay unchecked. What changed since the last pass, found during re-reading: (1) `app/page.tsx` centralized `bonusOffers`, `methodSteps`, `operators`, `compareRows`, `marketStats`, `categories`, `newsFeed`, `blogPosts`, `toolboxItems` into `lib/site-data.ts` and now imports them. (2) `components/SiteFooter.tsx` dropped its unused `helplineText` import — `helplineText` became a fully orphaned export. (3) All 7 untouched files were re-read in full and confirmed unchanged in substance, only cosmetic reformatting. (4) New, not a DRY item: found a malformed Tailwind class in `full-review/page.tsx:219`.
- **2026-08-12 — major refactor pass.** Two-part session: (1) a targeted fix of DRY-1/6/7/9 in the reviews templates, per an explicit decision (asked directly) to keep both templates as an intentional two-tier product and share their underlying data rather than merge the files (DRY-8, above); (2) a full inline-data extraction sweep, per direct instruction, moving every top-level literal `const` out of every `app/**/page.tsx` and `components/**/*.tsx` into `lib/mock-data.ts` or `lib/site-data.ts`.
  - **Reviews templates (part 1):** added `mockPeakWagerReview: Operator` (extended `Operator` with optional `pros`/`cons`) and `otherBooksCompared` to `lib/mock-data.ts`. Both `app/reviews/[slug]/page.tsx` and `full-review/page.tsx` now derive `operatorName`/`scoreBreakdown`/`pros`/`cons` from that one record and render every CTA through `<PrimaryDomainLink linkTier="tier3" .../>`. `full-review/page.tsx`'s local comparison-table section was replaced with `<ComparisonCard id="scores" />`. `PrimaryDomainLink` gained an optional `className` prop; `ComparisonCard` gained an optional `id` prop — both additive, backward-compatible with existing call sites.
  - **Inline-data sweep (part 2):** touched `app/not-found.tsx`, `app/authors/[slug]/page.tsx`, `app/blog/[slug]/page.tsx`, `app/legal/[doc]/page.tsx`, `app/responsible-gambling/page.tsx`, `app/responsible-gambling/help-directory/page.tsx`, `app/categories/[slug]/page.tsx`, both `app/reviews/[slug]` templates, `components/Comments.tsx`, `components/cards/LatestNewsCategory.tsx`. Added a shared `PostTeaser` type to `lib/types.ts` (used by ~6 recurring "kicker/title/meta/href" lists, a decision asked for directly given the scale of files being touched anyway) and extended `Author` with optional `bio`. `lib/mock-data.ts` grew to ~20 new exports (content); `lib/site-data.ts` gained 3 new exports (`categoryFilters`, `regions`, `newsCategories` — structural taxonomy). Confirmed via `grep -rn -E "^const \w+ = [\[{]" app components` that zero top-level literals remain, and via ESLint that no unused imports/exports were left behind.
  - **Also resolved as part of the sweep:** DRY-13 (deleted dead `mockComparisonOperators`, added `ComparisonOperator` type) and DRY-14 (deleted orphaned `BettingSiteState.tsx`, asked directly before deleting).
  - **New findings from the fresh full-repo re-scan that preceded this work:** DRY-15 (ArrowLink JSX duplicated ~21×) and DRY-16 (`NewsCard`'s ad hoc prop type) — both still open, not actioned this pass.
  - **Bug found and fixed, not a DRY item:** `app/legal/[doc]/page.tsx` had a pre-existing synchronous `params` signature invalid under Next.js 16 (every `/legal/*` route was silently 404ing) — predates this session, caught while validating the sweep's own routes, fixed by awaiting `params`.
  - **Validation:** `npx tsc --noEmit` and `npx eslint app components lib` both clean after every file group; live `curl` status-code checks run against all 13 touched routes plus a 404 sanity check, and content spot-checks (grep for expected copy) run on the two most heavily rewired routes (both reviews templates) — per CLAUDE.md's "validate against real behavior" rule, not just a type-check.
  - **Left open, deliberately:** the `site-data.ts` ↔ `mock-data.ts` internal reorganization (moving `bonusOffers`/`newsFeed`/`blogPosts`/`marketStats`/`toolboxItems`/`operators`/`compareRows`/`helplineText` out of `site-data.ts` into `mock-data.ts` per the structure-vs-content rule proposed mid-session) — flagged as the next piece of DRY-4, not done this pass since the inline-data sweep took priority. DRY-2, -10, -11, -12, -15, -16 also remain open.
- **2026-08-12 — HTML-structure pass, `app/` checkpoint.** Follow-up pass requested specifically for repeated JSX/markup structure (as opposed to logic/data-fetching, covered above). Read all of `docs/00`-`04`, `docs/architecture-gaps-solo-dev.md`, `.claude/frontend-component-plan.md`, and `.claude/viewport-audit.md` fresh first, then all 11 files under `app/` in full. Read-only — no code touched. 6 new findings added (DRY-17 through DRY-22), all still open: repeated "post row" markup (DRY-17), a generic rail info-card shape that generalizes DRY-12 rather than duplicating it (DRY-18), an anchor/TOC list pattern including one local component that should be shared (DRY-19), a same-file triplicated section header (DRY-20), literal-duplicate sub-blocks between the two reviews templates that sit outside DRY-8's settled scope (DRY-21), and a teaser-card grid duplicated across 3 files (DRY-22). Confirmed DRY-10/-11/-12/-15 (breadcrumb nav, search placeholder, editorial-standards card, arrow link) are all still accurate and not re-flagged. `components/` and any remaining shared/lib-adjacent markup are the next checkpoints, pending go-ahead.
- **2026-08-12 — HTML-structure pass, `components/` checkpoint.** Continuation of the same pass. Read every file under `components/` (`cards/`, `layout/`, `rail/`, `section/`, root, plus a skim of `ui/`) in full; confirmed `lib/` has no JSX-rendering files, so nothing to scan there. Read-only — no code touched. 7 new findings (DRY-23 through DRY-29), all open: `app/not-found.tsx` duplicating the currently-orphaned `RecentPublishedSection` component verbatim (DRY-23, the sharpest finding of this checkpoint — the fix is a straight import swap, not a new extraction), a 4-file editorial section-wrapper shape (DRY-24), a byline/avatar-card shape duplicated between a component and an inline page block (DRY-25), a pill/chip filter-list pattern duplicated 4× with 3 different (inconsistent) active-item strategies (DRY-26), a small text-link-list pattern duplicated verbatim between a rail component and a page (DRY-27), a title+description block re-typed with visible class drift inside a shared `editorial-link-card` wrapper (DRY-28), and two low-priority same-file duplications (DRY-29). Also noted three non-DRY asides for awareness: 44 lines of dead commented-out nav code in `SideNav.tsx`, an odd no-op template literal in `EditorsCard.tsx`, and two inline array literals (`TopicsCard.tsx`, `TrendingCard.tsx`) that technically slipped past the prior pass's "zero top-level literals" grep since they're not top-level `const`s — a data-layer detail, not fixed here. Next checkpoint (any remaining shared/lib-adjacent markup) is effectively already covered — `lib/` had nothing to scan — so this pass may be complete pending confirmation.
- **2026-08-17 — full fix pass, every open finding.** Per direct instruction, fixed every open finding from both prior passes (DRY-2, -4, -10 through -12, -15 through -29 — 20 findings), working in checkpoints with `tsc --noEmit`/`eslint`/live-route validation after each. Governing constraint given up front: this must be a pure structural refactor — no change to visible content, copy, or rendered behavior unless the user explicitly asked for a specific change in the moment (several did come up and are called out below). Per-checkpoint detail lives in each finding's own status note above; this entry is the cross-cutting summary.
  - **New shared components (13):** `components/ui/ArrowLink.tsx` (DRY-15), `components/rail/InfoCard.tsx` (DRY-12/18), `components/rail/AnchorList.tsx` (DRY-19/27), `components/ui/ChipList.tsx` (DRY-26), `components/cards/PostRow.tsx` (DRY-17/23), `components/cards/TeaserCardGrid.tsx` (DRY-22), `components/cards/TeaserCardBody.tsx` (DRY-28), `components/section/EditorialSection.tsx` (DRY-24), `components/section/BylineCard.tsx` (DRY-25), `components/section/ReviewSectionHeading.tsx` (DRY-20), `components/rail/AtAGlanceCard.tsx`, `components/rail/OtherBooksCard.tsx`, `components/section/ProsConsSection.tsx` (all three DRY-21). Every one follows the same discipline: full `className`/style-prop pass-through rather than baked-in defaults wherever call sites had already diverged, so extraction never silently normalized a visual difference that wasn't asked for.
  - **`lib/site-data.ts` / `lib/mock-data.ts` split (DRY-4, DRY-2):** moved `bonusOffers`, `methodSteps`, `operators`, `compareRows`, `newsFeed`, `blogPosts`, `toolboxItems`, `marketStats`, `recentPosts`, `popular`, `helplineNumber`, `helplineText` into `mock-data.ts`; `site-data.ts` is now structure/taxonomy only. `lib/types.ts` gained `NewsItem` (DRY-16) and `AtAGlanceItem` (DRY-21).
  - **Breadcrumbs (DRY-10), expanded scope:** installed the real shadcn `breadcrumb` component via `npx shadcn add breadcrumb` (customized off its generic theme tokens to this project's own), built `components/layout/Breadcrumbs.tsx` on top, wired into all 7 original files. Along the way: fixed a real `<li>`-inside-`<li>` hydration bug caught live in the browser console (separator and item must be siblings, not nested — fixed via `Fragment`); replaced placeholder crumb labels (`"[author slug]"` etc.) with real in-scope page data rather than deriving crumbs from the URL client-side (a `usePathname()` approach was proposed and rejected — asked directly — since labels like "Sportsbooks" aren't literal URL segments anyway); discovered neither `/reviews` nor `/categories` had an index route at all, so both crumbs were dead links — built minimal `app/reviews/page.tsx` and `app/categories/page.tsx` (the latter later given a rail `InfoCard` and a `RecentPublishedSection` after the user flagged it as feeling too sparse); paired `Breadcrumbs` with `BreadcrumbList` JSON-LD (`lib/schema.tsx`) per `docs/00-six-layer-map.md` Layer 4, on request.
  - **DRY-15 swept wider than scoped:** beyond the 21 originally-flagged sites, found and converted 6 more plain-underline "→"-character links to `ArrowLink` once the pattern was spotted mid-session (asked directly before the wider sweep).
  - **Deliberate visual changes, all confirmed with the user before applying (everything else in this pass was zero-visual-diff):** `ReviewSectionHeading`'s trust-block row `items-baseline` → `items-center`; `AnchorList`'s plain-link-list variant `py-2` → `py-3` (now recorded in memory as a confirmed value, not to be reverted); `categories/[slug]`'s "Read our editorial standards" link converted from plain-underline to `ArrowLink` style, which cascaded into the wider DRY-15 sweep above.
  - **Validation:** `npx tsc --noEmit` and `npx eslint app components lib` clean after every checkpoint; every route spot-checked live via `curl` after the riskiest checkpoints (Breadcrumbs, the site-data/mock-data move), including a hydration-bug catch that wouldn't have shown up in `tsc`/`eslint` at all — only in an actual browser console, underscoring why live validation mattered here beyond the type/lint gates.
  - **Left open:** DRY-8 only, and it isn't a duplication finding — it's the settled decision that both reviews templates stay separate by design (see DRY-8's own note above). No other checkbox in this document is open as of this pass.
