# Editorial redesign — findings and action plan

Measured 2026-09-03 against `localhost:3000` and `nytimes.com/athletic`.
Companion to `.claude/redesign-sweep-2026-09-02.md` (grid/width math) and
`.claude/content-width-reference-2026-09-02.md` (the width baseline).

**Question that started it:** the homepage uses `.card` as a wrapper on nearly
every section, and it reads as generated rather than edited.

**Answer:** the wrapper is not the fault. Nesting, heading scale, reading
measure, and the loudness of the pending state are. All four are measurable and
none require CMS data to fix.

---

## 1. Reference measurements — The Athletic

Fetched with plain headless Chromium (no `channel: "chrome"`); two overlays
appear and do not affect geometry.

### Desktop — `https://www.nytimes.com/athletic/`

| viewport | content band | side gutter | reading column |
| -------- | ------------ | ----------- | -------------- |
| 1440     | 1200         | 120         | 600            |
| 1920     | 1200         | 360         | 600            |

Their effective token is `max-width: 1248` border-box with 24px padding →
content 1200. **The band is capped and never grows; the reading column is 600
at every size.**

Structural note: they run a **top nav**, so 1200 carries main plus one
secondary column. We spend 592px on nav + rail + gaps before main gets
anything, so their band is not directly transplantable — their _reading
measure_ is.

### Mobile app — from the App Store screenshot, not a live render

- **Zero nested frames anywhere.** No card around the feed, none around a row.
- Rows divided by hairlines; headline, byline and rule share one left gutter.
- **Headline leads, thumbnail is small and secondary** (right-hand, ~⅓ row).
- Hierarchy from type — large serif headline, small grey sans byline. No box
  does any work.
- The **only** bordered units are the score tiles: a horizontal strip of
  discrete comparable data. That is the analogue of our ranked lists and
  comparison table.

---

## 2. Our geometry today

| viewport | gutter L | nav | main | rail | gutter R |
| -------- | -------- | --- | ---- | ---- | -------- |
| 1024     | 32       | 0   | 960  | 0    | 32       |
| 1280     | 160      | 0   | 960  | 0    | 160      |
| 1370     | 24       | 236 | 730  | 300  | 24       |
| 1440     | 24       | 236 | 800  | 300  | 24       |
| 1512     | 24       | 236 | 872  | 300  | 24       |
| 1920     | 204      | 236 | 920  | 300  | 204      |

Three things fall out:

1. **Gutters are 24px from 1370 through 1512** — the whole laptop band,
   including 1440 and the 1512 MacBook Pro. That is the "nav and rail touch the
   edge" complaint, and it is bounded to that range.
2. **The inversion is real:** 1280 → main 960, 1370 → main 730. A 230px drop
   the moment the rail appears.
3. **1024–1280 is the worst case, not the widest screen.** With no nav and no
   rail, main is 960 — wider than at 1920.

---

## 3. Reading measure — the standard is already ours

`app/globals.css` states the target and ships the mechanism:

```
:164   --text-article: 18px;  /* 16px measured 83 CPL, over the 60-75 band */
:210   --container-article: 655px;
```

Measured characters per line, widest running paragraph per route:

| route                   | 1024 | 1370 | 1440 | 1920 | verdict            |
| ----------------------- | ---- | ---- | ---- | ---- | ------------------ |
| `/blog/[slug]`          | 55   | 55   | 55   | 55   | **in band**        |
| `/legal/[doc]`          | —    | —    | —    | —    | uses `max-w-prose` |
| `/` · `/blog`           | 81   | 62   | 68   | 78   | over above 1440    |
| `/responsible-gambling` | 95   | 73   | 80   | 91   | over               |
| `/reviews/[slug]`       | 104  | 79   | 87   | 100  | worst on site      |

The Athletic's 600px column sits inside our own documented 60–75 band. Their
practice **confirms our written standard**; we apply it on two templates.

> Caveat: the probe takes the widest paragraph of 80+ characters per route,
> which on some pages is a standfirst rather than body copy. Verdicts hold; the
> 19px figures on `/` are standfirst.

**The fix is not to narrow main.** It is to cap running prose inside it — which
is what `/blog/[slug]` already does (`max-w-article` on the text block, full
width for tables and grids), and what The Athletic does (1200 band, 600
column).

---

## 4. Homepage chrome census

12 direct children of `<main>`. **10 carry identical chrome** — 1px border, 8px
radius, 16px padding.

**`.card` contributes no fill.** `--color-bg-card` and `--color-bg-page` are the
same value in both themes (`#fbf8f1` light, `#17150f` dark). On the homepage
`.card` is a 1px outline and padding, nothing more — and the outline is
redundant with the 32px flex gap already separating sections.

**15 `.card` nested inside a `.card`.** Each adds a second gutter on top of the
wrapper's:

```
before   section heading left=17   row content left=34    ← 17px misaligned
after    section heading left=17   row content left=17
```

This is the "content doesn't match the skeleton of the parent" defect. It is
content-independent and register-independent.

**Register misassignment.** All 38 `register=` usages across `app/` pass
`"editorial"`. Four homepage sections pass `"comparison"`:

| component               | renders            | actual register |
| ----------------------- | ------------------ | --------------- |
| `ExploreSection`        | Browse by category | editorial       |
| `LatestNewsSection`     | Latest news        | editorial       |
| `BlogSection`           | From the blog      | editorial       |
| `BettingToolboxSection` | Betting toolbox    | editorial       |

`EditorialSection`'s own comment states the rule they violate: _"docs/02 §5 —
editorial (Tier 1) separates sections with whitespace, comparison (Tier 2/3)
uses cards."_

**Heading scale — three sizes for one level:**

| size | sections                                                                 |
| ---- | ------------------------------------------------------------------------ |
| 28px | Browse by category · Latest news · From the blog · Betting toolbox       |
| 19px | Top-Rated Sportsbooks · Featured Bonuses · Compare Side by Side · Market |
| 15px | How We Review                                                            |

rg.org runs exactly **two** h2 tiers, assigned by role, identical on every
template. Ours are assigned by whichever component happened to build the
heading.

---

## 5. The pending state is the loudest thing on the page

| metric                    | value                                           |
| ------------------------- | ----------------------------------------------- |
| placeholder blocks on `/` | 20                                              |
| share of main's area      | 8.6%                                            |
| bracketed strings         | 41                                              |
| fill                      | `repeating-linear-gradient(45deg, 4px stripes)` |

8.6% understates it. A **4px diagonal stripe is a high-frequency pattern** and
pulls the eye far harder than its area share, twenty times down the page.

`globals.css:21` already classifies it: _"the wireframe chrome itself (… dashed-
border image placeholders) is **scaffolding, not final UI**."_

**Constraint — rule 3.** The placeholders are not laziness, they are the honest
empty states the project requires. We cannot fill `/` with plausible content to
make it read editorial. But **quieter is not less honest**: a flat
`--color-bg-subtle` block with a small centred label says "no image yet" exactly
as truthfully as a striped one. Rule 3 requires an honest pending state, not a
loud one.

---

## 6. Rail — constraints and decisions

**Decision: 1c throughout.** One treatment sitewide, which is the current build.

The 1a/1c register split was considered and rejected. Reasons, for the record:

- **Register is a property of content, not chrome.** docs/02 §5 wants the
  visual register to signal tier, and it already does — in the main column,
  where the ranked lists, CTAs and disclosures live. The rail is the same
  structural slot on every route.
- **Redundant signalling.** A reader on a review page already knows it is
  commercial. The rail changing shells adds nothing and costs consistency.
- **Permanent tax.** Every future rail component needs a register verdict, and
  `AnchorList` straddles both ("On this page" vs "Jump to").
- **1c is the canvas's own declared foil** — "product, not publication", on a
  canvas titled _Rails that belong to a publication, not a template_.

Modules will still differ, because their **contents** differ — `AtAGlanceCard`
and `OtherBooksCard` hold tabular scores and will read denser than
`TrendingCard` in any shell. That is emergent and honest.

### The FAB is not a rail constraint

They never coexist:

- rail — `hidden wide:flex`, absent below 1370px (`PageShell.tsx:38`)
- FAB — `wide:hidden`, present only below 1370px (`BackToTopFab.tsx:44`)

### The real constraint

```
wide:sticky  wide:top-container-desktop
wide:h-[calc(100dvh-(var(--spacing-container-desktop)*2))]
wide:overflow-y-auto  overscroll-contain
```

The rail is a sticky, **fixed-height, independently scrolling column**.

1. It cannot push the page taller — height is capped.
2. Overflow becomes a **nested scroll region**, not a visual break.
3. `justify-between` pins `BackToTop` to the bottom (`PageShell.tsx:40`). **If
   the rail overflows, `BackToTop` scrolls out of reach** — the control meant to
   rescue you from a long page becomes something you must scroll to find.

Budget: `100dvh − 2×container-desktop − BackToTop row − inter-module gaps`.
The binding case is the breakpoint floor, which has the least room.

**Per-route information budgets are not yet measured.** Target counts from the
canvas: On this page 4 · Trending 5 · Editor's pick 1 · At a glance 5 rows ·
Jump to 5 · Other books 4 + "All reviews" · Legal 1 control · Play Responsibly.

---

## 7. Reconciling with `redesign-sweep-2026-09-02.md`

**The sweep does not address the gutter complaint.** Ladder A's desktop band is
`vw − 48` — the same 24px each side we run today. §1.4 changes nav/rail widths
and the breakpoint; none of those move content away from the viewport edge.

**But it frees the budget to fix it.** §1.4 narrows chrome 592 → 536 (nav
236→208, rail 300→280, gaps 28→24). Ladder A spends all 56px on main. Spending
it on gutters instead costs nothing:

| option                   | gutter @1440 | main @1440 | main @1920 |
| ------------------------ | ------------ | ---------- | ---------- |
| today                    | 24           | 800        | 920        |
| Ladder A as written      | 24           | 856        | 960        |
| **padding 48, cap 1560** | **48**       | **808**    | **928**    |
| padding 64, cap 1560     | 64           | 776        | 896        |
| Athletic-like (cap 1248) | 120          | 664        | 664        |

**Recommended: `--spacing-container-desktop: 24 → 48`, cap stays 1560, take the
sweep's chrome reduction.** Double the gutter and main gets _wider_ than today
at both ends. Nothing regresses.

### Corrections to the sweep

- **§5 "a11y suite green at 25/0/1" is stale.** It is **112 passed / 12
  skipped** across 4 projects since dark mode shipped.
- **§5's `#999` blocker is already closed.** Our ramp bottoms at
  `--color-text-muted: #656460` (5.58:1); there is no lighter token, so the
  canvas value cannot be used regardless.
- **§4's half-pixel type** would land on top of the existing three-size h2
  inconsistency, making it worse rather than better.
- **Canvas caveat stands:** the canvases ship a diverged `globals.css`
  (`--grid-max-width: 1360`, `#ffffff` page, `#666666` muted, no
  `--breakpoint-wide`, no brand tokens). Read as direction, never as values.
- **The canvas covers only Blog-Post and Review-Post.** Blog-Post's main is a
  single article with no stacked peer sections, so the homepage's grammar
  cannot be derived from it. Home is genuinely unanswered (§3 issue 2 says so).

---

## 8. What changes, what stays

### Keep

|                                          | why                                                                                                  |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `.card` on the four comparison blocks    | ranked lists, compare table, featured bonuses — the frame earns its place marking commercial content |
| **1c rail treatment, sitewide**          | one shell; register speaks through content                                                           |
| Current sans typography, no serif        | `--font-serif` was deliberately removed (`globals.css:114-119`); `.heading` → `var(--font-sans)`     |
| Dark theme across all viewports          | ours is not scoped to mobile like The Athletic's; already shipped and green                          |
| The dark Play Responsibly block          | identical in all three canvas directions; settled                                                    |
| Honest pending states (rule 3)           | non-negotiable                                                                                       |
| `--container-article: 655px` / 60–75 CPL | our own documented standard, confirmed by The Athletic                                               |
| `--color-text-muted: #656460` floor      | 5.58:1; canvas `#999` is 2.69:1 and fails AA                                                         |
| Sticky rail height cap                   | prevents overflow structurally                                                                       |

### Change

|                                                                                       | scope             |
| ------------------------------------------------------------------------------------- | ----------------- |
| Placeholder fill: stripe → flat tone + label                                          | CSS token         |
| Running prose capped to `max-w-article` on `/`, `/responsible-gambling`, `/reviews/*` | component         |
| h2: three sizes → two role-based tiers                                                | component + token |
| Remove 15 nested `.card`; align inner content to the wrapper gutter                   | component         |
| Fix four `register="comparison"` mislabels                                            | component         |
| Homepage hierarchy: 12 equal peers → lead + secondary                                 | layout            |
| `--spacing-container-desktop: 24 → 48`                                                | token             |
| `--grid-nav-width` 236→208, `--grid-rail-width` 300→280, `--grid-gap-desktop` 28→24   | token             |
| `--breakpoint-wide` 1370 → 1440 + Ladder A                                            | token + shell     |
| News row: large left thumb → small secondary thumb, headline leads                    | component         |

### Blocked on CMS

- Image aspect ratios — three coexist today (16:9 news lead, 4:3 blog lead,
  16:9 blog small); unresolvable without real assets.
- Headline truncation against the longest real headline.
- How many rows each section carries; whether a section earns its slot.
- Rail per-route information budgets (needs real item counts).

---

## 9. Action plan — sequence

Ordered by dependency and by leverage-per-risk. Each stage is independently
shippable and independently verifiable.

| #     | stage                                                                                                                                                                                                     | scope             | why here                                                                                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1** | **Quiet the pending state** — flat fill + label, solid hairline, dedupe repeated bracket strings                                                                                                          | CSS + component   | Highest leverage for the effort, zero risk, no dependencies, violates nothing. The loudest element on the page is classified as scaffolding by our own stylesheet. |
| **2** | **Reading measure** — `max-w-article` on running prose, `/` · `/responsible-gambling` · `/reviews/*`                                                                                                      | component         | No dependencies. Fixes a violation of our own documented 60–75 CPL standard. 104ch → 55ch.                                                                         |
| **3** | **Heading scale** — three sizes → two role-based tiers                                                                                                                                                    | component + token | Must precede stage 4: removing chrome exposes type, and a surfaceless section on a broken scale looks unfinished.                                                  |
| **4** | **Homepage chrome** — remove 15 nested cards, align to the wrapper gutter, fix the four register mislabels                                                                                                | component         | Depends on 3. The defect you identified; content- and register-independent.                                                                                        |
| **5** | **Homepage hierarchy** — 12 equal peers → lead + secondary; **promote the first Latest-news item to a lead with a large image (11.7)**; remaining rows headline-leads with a small right thumbnail (11.3) | layout            | The change that most affects "reads editorial", and where `/`'s missing above-the-fold image belongs. Doable against placeholder data.                             |
| **6** | **Container gutter + chrome tokens** — padding 24→48, nav/rail/gap reductions                                                                                                                             | token             | Touches every route at once; do it after per-route work is stable so regressions are attributable.                                                                 |
| **7** | **Breakpoint ladder** — `--breakpoint-wide` 1370→1440, Ladder A                                                                                                                                           | token + shell     | Largest and riskiest; changes layout at every seam. Last.                                                                                                          |
| **8** | **Rail information budgets** — measure per-component cost against the sticky height cap, set item counts per route                                                                                        | component         | Independent of 1–7; can run in parallel. Needs the budget measurement first.                                                                                       |

**Verification gate for every stage:** `npx tsc --noEmit` · `npx eslint` ·
`node scripts/check-color-invariants.mjs` · `npm run test:a11y` (currently 112
passed / 12 skipped, 0 axe violations in both themes) · re-measure CPL and shell
geometry at 1024 / 1280 / 1370 / 1440 / 1512 / 1920.

Screenshots go to `.claude/visual-harness/_shots/`.

---

## 10. Renders produced during this sweep

In `.claude/visual-harness/_shots/`:

| file                                | what                                                                 |
| ----------------------------------- | -------------------------------------------------------------------- |
| `home-full.png` · `crop-before.png` | current state                                                        |
| `crop-after.png`                    | wrappers removed, inner frames kept — **rejected**, the failure mode |
| `crop-c6.png` · `home-c6-full.png`  | wrappers kept, 15 nested cards removed, gutters aligned              |
| `crop-d.png` · `home-d-full.png`    | no editorial wrappers, heading rules, panels on comparison blocks    |
| `rail-directions-corrected-856.png` | the three rail directions (1a/1b/1c)                                 |

---

## 11. Smaller findings — each needs a home in the sequence

| #    | finding                                                                                                                                                                                                                                                                                                                                                                                                                                                               | evidence                                 | folds into               |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------ |
| 11.1 | **`globals.css` breakpoint prose contradicts the implementation.** The block at lines 12–21 states _"lg: (desktop, ≥1024px): side-nav replaces top-header; layout becomes the 3-column grid"_. The shell actually switches at `wide:` (1370px). The prose is documented as "the source of truth for this spec" and is wrong.                                                                                                                                          | `globals.css:12-21` vs `PageShell.tsx:9` | stage 7                  |
| 11.2 | **Single-column cap is `max-w-240` = 960px.** This is what produces the 960px main and 104ch measure in the 1024–1280 band. Ladder A proposes 856.                                                                                                                                                                                                                                                                                                                    | `PageShell.tsx:9`                        | stage 2 (measure) then 7 |
| 11.3 | **`PostRow` thumbnail is `w-full md:w-56 lg:w-74`** — 296px at desktop, on the **left**, ahead of the headline. Inverts The Athletic's anatomy (small, right, secondary). Sweep §4 independently specifies a 96px thumb and leaves `thumbSide` unresolved.                                                                                                                                                                                                            | `PostRow.tsx:12-13`                      | stage 5                  |
| 11.4 | **`AnchorList` straddles registers** — "On this page" (plain links) on blog, "Jump to" (active chips) on review. Needs a variant prop even under a single 1c shell.                                                                                                                                                                                                                                                                                                   | `AnchorList.tsx`                         | stage 8                  |
| 11.5 | **Stale prose describes a font that no longer exists.** Placeholder copy reads _"Editorial register: long-form measure, serif body…"_ — `--font-serif` was removed.                                                                                                                                                                                                                                                                                                   | `app/blog/[slug]/page.tsx:97`            | stage 1                  |
| 11.6 | **`--breakpoint-cards-wide` no longer exists.** Earlier notes list it as a declared-but-unused token; a recursive grep finds it nowhere in `app/` or `components/`. Already resolved — do not re-open.                                                                                                                                                                                                                                                                | verified 2026-09-03                      | none                     |
| 11.7 | **`/` has no image above the fold.** `TopHeroSection` is h1 + SEO intro + CTA — the first ~270px is pure text, then a ranked list. The Athletic leads with a picture, which is much of why their homepage reads as a publication.                                                                                                                                                                                                                                     | stage 5                                  |
| 11.9 | **The standfirst renders at three sizes.** `text-2xl` (19px) on nine routes, `text-lg` (16px) on `/responsible-gambling` + `/help-directory`, `text-md` (15px) on `/reviews/[slug]`. With `--container-header` now constant at 820px, this is the _only_ remaining source of CPL variance in page headers — 69ch / 81ch / 89ch respectively. h1 likewise runs at two sizes (44px vs `text-3xl` on reviews → 28ch vs 57ch). Same class of defect as the three-size h2. | stage 3                                  |
| 11.8 | **`max-w-none` is dead code.** Twelve paragraphs across `/about`, `/contact`, `/news`, `/responsible-gambling`, `/help-directory` carry it, but there is no base `p { max-width }` rule anywhere — a paragraph with the class computes to `maxWidth: none`, identical to one without. Not a deliberate opt-out; safe to replace with a real cap.                                                                                                                      | stage 2                                  |

### 11.7 detail — where the hero image belongs

**The header is not the place.** It is a page header, not a story: no subject,
no byline, no date, nothing for an image to be _of_. Rule 3 forbids stock or
fabricated art, so an image slot there renders as a ~320px placeholder block as
the first thing on the page — a larger version of the problem stage 1 just
reduced.

**The Athletic's pattern is a lead story, not a hero banner.** Their large image
carries a headline, byline and comment count; subsequent stories drop to small
right-hand thumbnails. Applied honestly here that means **promoting the first
Latest-news item to a lead treatment** — large image above its headline — with
the rest of the feed on small right thumbnails per 11.3. Same visual anchor, on
an image that has a real subject, and it composes with the hierarchy work rather
than fighting it.

Their homepage carries no h1 positioning statement at all. Ours does, for SEO,
so it stays — the lead story sits directly beneath it.

---

## 12. Measurement gotchas — recorded so they are not rediscovered

1. **`.route-transition` is on an ancestor of `<main>`, not only on feed
   wrappers.** So `section.querySelector(".route-transition ul")` matches the
   **first** `ul` inside the section — the chip nav — not the feed. Cost three
   wrong renders. Use
   `section.querySelector(".route-transition").querySelector("ul")`.
2. **`grep -n` without `-r` silently skips directories** and prints nothing.
   Nearly recorded "`max-w-240` doesn't exist" as a finding. Always `-rn`.
3. **Playwright `clip` in page coordinates requires `fullPage: true`**, or the
   clip is validated against the viewport and throws "clipped area is empty".
4. **The Athletic is fetchable with plain `chromium.launch()`** — no
   `channel: "chrome"` needed. Two overlays (US-edition notice, subscription
   modal) are positioned layers and do not affect measured geometry. **Only the
   homepage was tested**; article pages are likely paywalled.
5. **`.card` inside `.card` is detectable programmatically:**
   `[...document.querySelectorAll(".card")].filter(e => e.parentElement.closest(".card"))`
   — this is the check to wire into the verification gate so nesting cannot
   regress.

---

## 13. Carried over — open, but not part of this redesign

Tracked here so they are not lost; none block the sequence above.

- **`.claude/theme-toggle-deferred.md` says PARKED.** False — dark mode shipped.
  Needs rewriting before it is committed.
- **`.claude/repo-status.md`** reports `test:a11y 25 passed, 1 skipped` and
  carries a "Parked, not open" theme-toggle section. Both false.
- **Mobile viewport audit** — never run. Known candidates: ~34 ungated `hover:`
  states (no `@media (hover:hover)` guard), rail absent below 1370, touch-target
  sizing.
- **`/login` returns 404** — Clerk not installed.
- **No `robots.ts` / `sitemap.ts`.**
- **"Component Reference — Filled States"** page not built; it is the only
  sanctioned place for filled-in mockups under rule 3.
- **Four undecided untracked `.claude` docs** — `MEMORY.md`,
  `spacing-language-2026-08-28.md`, `todo-inventory.md`,
  `visual-consistency-audit-2026-08-26.md`.
