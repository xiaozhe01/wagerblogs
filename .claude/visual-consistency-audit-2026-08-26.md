# Visual Consistency Audit — post-typography sweep, 2026-08-26

Companion to [`typography-weight-audit.md`](typography-weight-audit.md) (which
measured the type migration itself) and
[`visual-consistency-audit.md`](visual-consistency-audit.md) (VC-1–58, signed
off at the **old** type scale). This file does not supersede either — it audits
what the Phase 1 + Phase 2 type change did to **spacing and component
geometry**, which is the one thing those two audits could not have covered.

New finding IDs are `TS-*` so they never collide with `VC-*` / `VP-*`.

**This file is now the single open worklist.** As of 2026-08-26 the VC
document is 57-of-58 closed; its two remaining live items (VC-34, VC-29)
were migrated here under "Carried over" and keep their original IDs. Their
history stays in the original file — status is maintained here.

---

## What changed, and why spacing had to move

Three uncommitted source edits are under audit:

| change                                                              | file                                                                | effect                                |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------- |
| 12 size tokens raised, scale merged 12 → 9 sizes                    | [globals.css:77-90](../app/globals.css#L77)                         | every text node grew 1–3px            |
| `--text-*--line-height` companions added to all 14 tokens           | [globals.css:77-90](../app/globals.css#L77)                         | line boxes grew independently of size |
| `.meta-label` / `-caps` given `font-weight: 500` + explicit leading | [globals.css:337-352](../app/globals.css#L337)                      | ~500 mono nodes                       |
| `TopHeroSection` wrapper `gap-5` → `gap-3`                          | [TopHeroSection.tsx:5](../components/section/TopHeroSection.tsx#L5) | home hero header                      |

No `gap-*`, `p-*`, or `m-*` class changed anywhere else. **Every spacing shift
in this document is a second-order effect of the type change** — the boxes did
not move, the ink inside them did.

---

## Method

`.claude/visual-harness/spacing-audit.spec.ts` + `spacing.config.ts`, run twice
against production builds on port 4321:

- **after** — current working tree · 13,150 records
- **before** — `git checkout --` of the two source files, i.e. HEAD `b5cf2b1` · 12,999 records

14 routes × 4 viewports (**1440 / 1370 / 1100 / 390**) = 56 runs per pass, all
56 green both times. 1370px is the `--breakpoint-wide` single-column switch —
the reflow risk flagged under "Known risk" in the typography audit.

The harness measures **leading-trimmed ink**, not box geometry, per the house
rule that card padding is judged ink-to-edge. For every text node it takes the
real line boxes via `Range.getClientRects()` and strips half-leading off each
end, so a gap that grew purely because a line box got taller is visible as a
number. Record types: `text` (size/weight/leading/wrap count), `pair` (adjacent
vertical sibling gaps, box **and** ink), `box` (padding vs ink inset per side),
`control` (height/breathing room), `clip`, `grid` (row height spread), `page`.

Spot findings were then re-verified live against the running dev server on
`localhost:3000` with `verify.spec.ts` / `verify.config.ts`.

---

## Headline numbers

| metric                                              | before |       after |
| --------------------------------------------------- | -----: | ----------: |
| adjacent-sibling pairs compared                     |      — |       4,055 |
| … drifted > 1.5px **wider**                         |      — | 2,019 (50%) |
| … drifted > 1.5px **tighter**                       |      — |    308 (8%) |
| … stable                                            |      — | 1,728 (43%) |
| **mean ink drift per pair**                         |      — | **+0.89px** |
| pairs moving ≥ 5px                                  |      — |          80 |
| pairs moving ≥ 10px                                 |      — |          11 |
| boxes with symmetric padding but ≥3px ink asymmetry |    20% |         23% |
| boxes with ≥8px ink asymmetry                       |    10% |      **9%** |
| text nodes that gained a line box                   |      — |     **332** |
| controls pinned at `min-height` that now exceed it  |      — |     **120** |
| elements with real clipping/truncation              |      0 |       **0** |
| routes with horizontal page scroll (×56)            |      0 |       **0** |

**Read this as: broad and shallow, with five sharp exceptions.** Half the site's
vertical rhythm moved, but by less than a pixel on average. The damage is
concentrated in controls, one card family, and the heading scale — not spread
evenly.

### Page height cost

Every route got taller. Worst per viewport:

| viewport | worst route          |              growth |
| -------- | -------------------- | ------------------: |
| 1440     | responsible-gambling |     +369px (+10.9%) |
| 1370     | reviews-hub          |     +358px (+12.0%) |
| 1100     | help-directory       |     +338px (+15.1%) |
| **390**  | **reviews-hub**      | **+909px (+18.0%)** |
| 390      | home                 |   +1,500px (+15.7%) |

Mobile pays roughly double the desktop cost, because narrow columns convert
size growth into wrapping. Per [docs/02 Reference 2](../docs/02-design-language-reference.md)
(NerdWallet's "generous white space") extra height is not automatically a
defect — but a 15–18% mobile increase is a scroll-depth change worth an
explicit decision rather than an accident.

---

## Summary table

| ID        | Severity   | Finding                                                                                                                                        | Route(s)                                      |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| ~~TS-1~~  | **FIXED**  | RankedList CTA pair 2px mismatched — `.btn-secondary`'s border exposed when type broke the `min-h-5` clamp                                     | home, reviews-hub, review                     |
| ~~TS-2~~  | **FIXED**  | Small controls grew +29% (28.7 → 37.1px); _prose_ leading (1.65) applied to _button_ labels was the larger half of the cause                   | all                                           |
| ~~TS-3~~  | **FIXED**  | Heading hierarchy — real defects were two broken h1s: `responsible-gambling` missing its `lg:` step, `help-directory` h1 == h2 (0px)           | home, blog-post, author, responsible-gambling |
| ~~TS-4~~  | **CLOSED** | Page-header h1→standfirst gap has three values (25.3 / 15.6 / 14.8px) — measured, and the three are three distinct roles, not drift. No change | author, review vs. rest                       |
| ~~TS-5~~  | **FIXED**  | MarketCard stat block: last two mono lines 1.44px apart — fixed with a parent `gap-1`, not a child `mt-*` (CMS-bound)                          | home                                          |
| ~~TS-6~~  | **FIXED**  | `h-full` grid cards: 21px of unequal dead space at the row's bottom — `mt-auto` on the chip wrapper, spread now 0.00px                         | home                                          |
| ~~TS-7~~  | **CLOSED** | 332 text nodes gained a line box — accepted as the intended cost of the size migration, on-brief per docs/02                                   | all                                           |
| ~~TS-8~~  | **CLOSED** | Broad +1–2px rhythm drift across 600+ nav/footer list items                                                                                    | all                                           |
| ~~TS-9~~  | **FIXED**  | Legal clause h2 was `text-xl`, identical to its own body text — raised to `text-2xl` per the VC-56.3 precedent                                 | legal/\*                                      |
| ~~TS-10~~ | **CLOSED** | Review route heading scale near-flat — no change; register tags conflate hub and detail pages                                                  | review                                        |
| ~~VC-34~~ | **FIXED**  | _(carried over)_ Rail-card CTA split — `EditorsCard` adopted the shared rail arrow-link convention; `TopicsCard` needed no change              | home rail                                     |
| ~~TS-11~~ | **FIXED**  | `--radius-sm` / `--radius-md` were each declared twice; shadcn's shadowing copies removed, project literals now govern                         | sitewide                                      |
| ~~VC-29~~ | **FIXED**  | _(carried over)_ Dead tokens — `--color-border-divider-alt` and `--breakpoint-cards-wide` removed, layout-neutral                              | n/a                                           |

---

## TS-1 — RankedList CTA pair heights diverge by exactly 2px · ~~High~~ **FIXED**

> **FIXED 2026-08-26** (commits `02f63b0`, `3440d7b`). Closed as a side effect
> of TS-2, exactly as predicted: with the control leading corrected, both
> buttons fall back under the 32px `min-h-5` clamp and the border stops being
> load-bearing. Re-measured across 4 routes — **2 pairs checked, 0 mismatched,
> both 32.00/32.00**. `border: 1px solid transparent` on `.btn-primary` was
> therefore never needed. Diagnosis below kept as the record.

**Measured, live on `localhost:3000`, both viewports:**

```
primary   h=35.09  (size 14, lh 23.1px, border 0px, min-h 32px)
secondary h=37.09  (size 14, lh 23.1px, border 1px, min-h 32px)   delta 2.00px
```

Before the type change **both were exactly 32.00px** — pinned flat by
`min-h-5`. The type growth pushed natural height past 32px, the clamp stopped
governing, and the 1px border that `.btn-secondary` carries and `.btn-primary`
does not became load-bearing for the first time.

- [globals.css:252](../app/globals.css#L252) — `.btn-primary`, no border
- [globals.css:278](../app/globals.css#L278) — `.btn-secondary`, `border: 1px solid`

Both use `box-sizing: border-box`, so the border adds height only once the
content no longer fits the clamp.

**Where it shows:**

| call site                                                           | layout                             | how the 2px reads                                 |
| ------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------- |
| [RankedList.tsx:33-44](../components/RankedList.tsx#L33)            | `flex items-center gap-2` (mobile) | side-by-side, unequal heights, misaligned bottoms |
| [RankedList.tsx:33-44](../components/RankedList.tsx#L33)            | `md:flex-col md:w-28` (desktop)    | stacked, one button visibly taller than the other |
| [PrimaryDomainLink.tsx:30](../components/PrimaryDomainLink.tsx#L30) | `btn-primary gap-1.5 min-h-5`      | the short one                                     |
| [reviews/[slug]/page.tsx:141](../app/reviews/[slug]/page.tsx#L141)  | `btn-secondary min-h-5`            | the tall one                                      |

120 control instances across the site were pinned exactly at `min-height`
before and now exceed it — all five signatures are the `min-h-5` `.btn-*`
variants.

**Not affected: ChipList.** Verified live — chip rows are plain flex containers
with default `align-items: stretch`, so the shorter active `.btn-primary` chip
stretches to match its bordered siblings. All chips measure 37.09px. The
mismatch only surfaces where the parent sets `items-center` or `flex-col`.

**Fix options** (pick one, apply at the `globals.css` layer):

1. Give `.btn-primary` `border: 1px solid transparent` — 1-line, makes the two
   classes dimensionally interchangeable forever. Recommended.
2. Restore a shared clamp at the new natural height (`min-h` ≥ 38px) — puts the
   geometry back under a single token but bakes in the inflated height TS-2 is
   about.
3. Fix TS-2 first; the natural height drops back under 32px and the clamp
   governs again on its own. **Strictly best if TS-2 is being addressed anyway.**

---

## TS-2 — Small controls grew 29%; the leading is the bigger half · ~~High~~ **FIXED**

> **FIXED 2026-08-26** (commits `02f63b0`, `3440d7b`).
>
> **The fix as originally recommended here was incomplete, and the reason is
> worth recording.** Adding `line-height` to `.btn-primary`/`.btn-secondary`
> only reaches buttons that carry no `text-*` utility. Tailwind v4's `text-xs`
> sets font-size **and** line-height together, and utilities sit in a later
> cascade layer than `@layer components` — so every compact control re-applied
> `--leading-copy` and stayed at 37.09px. Retargeting the `--text-xs` token was
> rejected: ~459 fine-print prose nodes depend on its 1.65.
>
> Shipped as two parts: the `globals.css` rule (which fixed the 44px tier,
> lh 23.1 → 16.8px), plus `leading-heading` at the **six** `text-xs` call
> sites — `PrimaryDomainLink`, `RankedList`, `ChipList`,
> `reviews/[slug]` ×2, `authors/[slug]`. The sixth (`px-3 gap-1 text-xs`) was
> missed by the first grep and caught by re-measuring, not by reading.
>
> Result, re-measured over 14 routes × 4 viewports: button heights went
> `44×106 / 35.09×51 / 37.09×217` → **`44×106 / 32×120 / 30.8×148`**. No
> within-row mismatch, nothing under the WCAG 2.5.8 24px floor, h-scroll and
> clipping still 0, and 40 of 56 route/viewport combinations got shorter with
> none growing. Gates: tsc 0, eslint 0, a11y 25 passed / 1 skipped.

`.btn-*` at `py-1.5 px-3 text-xs`: **28.66 → 37.09px**, on 50 distinct controls
(chips, ranked-row CTAs, legal doc switchers, author page links) — 264 measured
observations across 14 routes × 4 viewports.

The height is fully explained by the line box, since padding and border did not
change:

| stage                                                           | line box |      running height |
| --------------------------------------------------------------- | -------: | ------------------: |
| before — 11px × 1.333 (Tailwind's built-in `text-xs` ratio)     |  14.67px |             28.66px |
| size change alone — 14px × 1.333                                |  18.67px |     32.66px (+4.00) |
| **plus the new companion** — 14px × **1.65** (`--leading-copy`) |  23.10px | **37.09px (+4.43)** |

**The leading contributes more than the size does.** The cause is a token-role
collision created by the Phase 1 merge: `--text-xs` now carries both fine-print
_prose_ and _control labels_, and it was assigned `--leading-copy` (1.65) —
a reading leading — at [globals.css:79-80](../app/globals.css#L79).

Measured against [`rg-typography-reference.md`](rg-typography-reference.md),
rg.org runs **1.17** on 12px links/fine print and **1.14** on 14px UI labels,
reserving 1.57–1.63 for prose. Our own `--leading-heading` (1.2) is the
equivalent tier. Our controls are currently at 1.65.

**Recommended fix.** Give `.btn-primary` / `.btn-secondary` an explicit
`line-height: var(--leading-heading)` in `globals.css`, exactly as
`.meta-label` was given one in Phase 2 and for the same reason — these classes
set `font-size` via `var()`, so they never receive a companion. Effect:
14 × 1.2 = 16.8px line box → **30.8px control height**, back under the 32px
`min-h-5` clamp, which resolves TS-1 as a side effect and returns 120 controls
to a single governed height.

This is the highest-leverage single edit in this audit.

---

## TS-3 — Heading hierarchy compressed · Medium

Phase 1 held every h1 token (`--text-5xl-*`, `--text-3xl`) while raising the
tokens beneath them. Distinct heading sizes per route, desktop:

| route                |        h1 | h2 before → after         | h3 before → after         | h1−h2 delta   |
| -------------------- | --------: | ------------------------- | ------------------------- | ------------- |
| home                 | 44 (held) | 25/18/14/12 → 28/19/15/14 | 18/15/14/12 → 19/16/15/14 | 19 → **16px** |
| blog-post            | 44 (held) | 25/22/12/10 → 28/22/14/12 | 18/12 → 19/14             | 19 → **16px** |
| author               | 44 (held) | 25 → 28                   | 16/14/12 → 16/15/14       | 19 → **16px** |
| responsible-gambling | 38 (held) | 25/12 → 28/14             | 14/12 → 15/14             | 13 → **10px** |
| review               | 22 (held) | 18/14/12 → 19/15/14       | 14/12 → 15/14             | 4 → **3px**   |
| category             | 44 (held) | 28/25/12 → 28/14          | 16/14/12 → 16/15/14       | 16 → 16px     |
| legal-privacy        | 44 (held) | 16/14/12 → 16/15/14       | 12 → 14                   | 28 → 28px     |

The h1 lost 3px of dominance on four of seven routes. Per
[docs/02 §6](../docs/02-design-language-reference.md) — _"the differentiated
character lives in typography"_ — the h1 is the primary carrier of that
character, and the migration moved everything toward it while it stood still.

Note also that home still renders **eight distinct heading sizes**
(28/19/16/15/14 across h2+h3). The scale merge reduced _token_ count but not
_rendered heading_ fragmentation.

**RESOLVED 2026-08-26 — and this finding's framing was wrong.** Neither
proposed option was taken. Measuring the h1 scale per route, against register,
showed the 19 → 16px compression is not the defect:

- **16px of h1−h2 separation is twice rg.org's.** Their h1 is 40px against a
  32px section-h2 — an 8px delta. Ours is 44 against 28. Per
  [docs/02 §6](../docs/02-design-language-reference.md), typography is where we
  are _supposed_ to diverge from rg, and we diverge toward more hierarchy, not
  less. Nothing to restore.

**The real defects were two broken h1 declarations, both on editorial routes:**

| route                  | was                        | cause                                                                                                                                                                              |
| ---------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `responsible-gambling` | h1 **38px**, delta 10px    | `lg:text-5xl-desktop` missing from the class — leaving a **double space** in the string exactly where the other seven routes have it. An accidental deletion, not a design choice. |
| `help-directory`       | h1 **28px**, delta **0px** | `text-4xl` (28px) against `text-h2` section headings (28px) — **the h1 rendered at exactly its own h2's size**, so the page had no heading hierarchy at all.                       |

Both were given the standard three-step editorial scale. Measured after:

| route                         |            before |              after |
| ----------------------------- | ----------------: | -----------------: |
| blog-post / category / author |    44 / 28 · 16px |          unchanged |
| responsible-gambling          |    38 / 28 · 10px | **44 / 28 · 16px** |
| help-directory                | 28 / 28 · **0px** | **44 / 28 · 16px** |

All five editorial routes now share one h1 size and one 16px delta. Gates: tsc
0, eslint 0, build clean, a11y 25/1, 0 h-scroll, 0 clipping.

The "eight distinct heading sizes on home" note above still stands as an open
observation — it is rendered-heading fragmentation, separate from h1 scale.

---

## TS-4 — Page-header h1→standfirst gap: three values across routes · Medium

Measured live, ink-to-ink, desktop / mobile:

| route                |        h1 | wrapper                           | ink gap (1440 / 390) |
| -------------------- | --------: | --------------------------------- | -------------------: |
| home                 | 44 / 30px | `flex flex-col gap-3`             |    **25.27 / 24.59** |
| blog-post            | 44 / 30px | `flex flex-col gap-3 max-w-prose` |    **25.27 / 24.59** |
| category             | 44 / 30px | `flex flex-col gap-3`             |    **25.27 / 24.59** |
| legal-privacy        | 44 / 30px | `flex flex-col gap-3`             |    **25.27 / 24.59** |
| responsible-gambling | 38 / 30px | `flex flex-col gap-3 max-w-160`   |        23.55 / 23.59 |
| **review**           |      22px | `flex flex-col gap-2.5`           |            **15.63** |
| **author**           | 44 / 30px | `min-w-0 flex flex-col gap-2`     |    **14.77 / 14.09** |

**The `gap-5` → `gap-3` edit on TopHeroSection was correct** — it moved home
from 40.77px onto the 25.27px value that blog-post, category and legal already
share. Four routes now agree exactly.

The outlier is [`authors/[slug]/page.tsx:25-28`](../app/authors/[slug]/page.tsx#L25):
the same 44px h1 as home, but `gap-2` puts its credential line 10.5px tighter
than any other 44px h1 on the site. `review` at `gap-2.5` is defensible as
comparison-register density (its h1 is only 22px), but the author route is
editorial register per [`tests/a11y/routes.ts`](../tests/a11y/routes.ts).

**Resolved 2026-08-26 — no change. `gap-2` stays.** The proposed `gap-3` was
applied, measured, and reverted. Two reasons, both from measurement rather than
argument:

| gap                | h1 → credential | credential → bio |
| ------------------ | --------------: | ---------------: |
| `gap-2` (kept)     |         14.77px |          15.00px |
| `gap-3` (rejected) |         22.77px |          23.00px |

1. **It never reaches 25.27px anyway.** Ink gap depends on the leading of
   _both_ sides, and the element after this h1 is a 14px meta line, not a 19px
   standfirst — so `gap-3` lands at 22.77px, still not matching the routes it
   was supposed to match.
2. **It is a different role, so the premise was wrong.** This container holds
   three children (name, credential, bio), not the two of a standard page
   header. Name + credential is an identity unit; giving it the same gap as
   credential → bio flattens that grouping — visible above as 22.77 vs 23.00,
   effectively identical. Per the standing rule in
   `visual-consistency-audit.md` § "Foundational question", a container with
   multiple distinct gap roles cannot be represented by one `gap-*`, and
   forcing it is drift-creation, not drift-removal.

So the count of editorial-register header treatments stays at three, correctly:
two-child headers at `gap-3`, this three-child identity block at `gap-2`, and
`review`'s comparison-register `gap-2.5`.

---

## TS-5 — MarketCard stat block: internal rhythm inverted · Medium

Measured live, **visual** order (the block uses `order-1..4`, so DOM order and
reading order differ — gaps below are the ones a reader actually sees):

```
"$00.0B"            -> "Example annual handle"    ink 6.89px   (box 4)
"Example annual…"   -> "Source: [Example State…]" ink 7.17px   (box 6)
"Source: [Example…" -> "Period: [FY 0000]"        ink 1.44px   (box 0)   <—
card: padding 16px both sides, ink inset top 19.00 / bottom 31.88
```

Two consecutive mono attribution lines sit **1.44px** apart while the lines
above them get ~7px. The source/period pair reads as one collided block.

Cause: `--text-2xs` (12px) carries `--leading-heading` (1.2) → a 14.4px line
box, and [MarketCard.tsx:14-17](../components/section/MarketCard.tsx#L14)
puts no gap between `order-3` and `order-4`. The Phase 2 weight bump to 500
makes the collision more visible, not less.

The card's ink is also 19 top / 31.88 bottom against symmetric 16px padding —
a 12.9px asymmetry, where before the type change it was balanced (+1.3px).
That part is TS-6's cause (grid stretch), not this one.

**FIXED 2026-08-26 — `gap-1` on the card wrapper, all child margins removed.**

The `mt-1` half of the original proposal was tried first and **rejected in
review for a reason that generalises**: these stat lines are CMS-bound, and a
fixed `mt-*` on a child assumes that child always has a sibling above it. Once
`source` or `period` can be absent, the margin becomes an orphan and the card
collapses unevenly. A parent `gap-*` degrades correctly by construction —
which is also what the standing rule in `visual-consistency-audit.md`
§ "Foundational question" already required.

Shipped: `card text-center flex flex-col gap-1`, with `mb-1` dropped from the
value and `mt-1.5` from the source line.

Measured after, all four cards, both viewports — identical on every card:

| gap                 |     before |      after |
| ------------------- | ---------: | ---------: |
| value → label       |     6.89px |     6.89px |
| label → source      |     7.17px |     5.17px |
| **source → period** | **1.44px** | **5.44px** |

The collision is gone and the block now reads as one attribution group. The
last gap stays deliberately tightest: source and period are both mono
attribution and form a sub-unit, exactly the grouping logic applied to the
author header in TS-4.

**Note this supersedes the "or" in the original proposal.** Where a component
is CMS-bound, parent-`gap` is not one of two equivalent options — it is the
only one that survives absent data. Gates after: tsc 0, eslint 0.

---

## TS-6 — `h-full` grid cards: unequal dead space at the bottom · Medium

[BonusOfferCard.tsx:25](../components/cards/BonusOfferCard.tsx#L25) —
`article.card flex flex-col h-full`, desktop row of four, all 348px tall,
padding 16px:

| card             | ink top | ink bottom |
| ---------------- | ------: | ---------: |
| PeakWager        |   26.75 |  **41.00** |
| BlueHorizon Bet  |   26.75 |      20.00 |
| Crownline Coins  |   26.75 |      20.00 |
| IronStake Sports |   26.75 |      20.00 |

21px of extra dead space under card 1 only. Ink asymmetry for this component
swung from **+8.5px before → −14.3px after**. At 390px (one card per row) the
row is uniform at 20px — this is purely a stretch artifact: reflowed siblings
grew taller, `h-full` stretched every card to match, and the card whose content
did not grow absorbs the difference as trailing whitespace.

Same mechanism, `div.card text-center flex flex-col` (MarketCard):
**+1.3px → −12.9px**.

Grid row-height spread also worsened on the home shell:
`.max-w-240 … wide:grid` +350px, and one `blog-post` `flex gap-2.5 items-start`
row went from a 2.5px to a 28px spread (a 20px icon beside text that now wraps
to two lines).

**FIXED 2026-08-26 — `mt-auto` on the code-chip wrapper.**

Neither option originally written here was applied. **"Pin the terms line to a
reserved height" violates the standing CMS constraint** above — it assumes a
known line count for a field that comes from PayloadCMS. Dropping `h-full`
would have worked but costs the equal-height row, which is worth keeping on a
comparison surface.

The actual cause is that `h-full` stretches every card to the tallest sibling
while the content stays top-packed, so a shorter card banks all its slack after
its last line. Putting `mt-auto` on the code-chip wrapper moves that slack
_above_ the action block instead: chip, CTA and terms are pushed to the card
floor and the give lands between the bullets and the chip, where it reads as
breathing room rather than a ragged bottom edge.

Chosen over `mt-auto` on the terms line itself, which would have worked but
destroys its own designed spacing — `mt-auto` replaces `mt-2.5`, so on the
tallest card (zero slack) the terms text would have collapsed to just its
`pt-2`. On the chip wrapper the gap above comes from the _previous_ sibling's
`mb-2.5`, so at zero slack `mt-auto` contributes nothing and every designed gap
survives intact. CMS-safe by construction, no measurement assumed.

Measured after, 4 cards × 3 viewports (1440 / 1100 / 390):

| metric                    |      before |      after |
| ------------------------- | ----------: | ---------: |
| ink-bottom, shortest card |     41.00px |    20.00px |
| ink-bottom, other three   |     20.00px |    20.00px |
| **spread across the row** | **21.00px** | **0.00px** |

Equal card heights retained; CTA block aligned across the row at every
viewport. Gates: tsc 0, eslint 0, a11y 25 passed / 1 skipped.

---

## TS-7 — 332 text nodes gained a line box · Low-Medium

Largest clusters (count × viewport):

|   n | change             | element                                | routes                   |
| --: | ------------------ | -------------------------------------- | ------------------------ |
|  28 | 1→2 lines, 11→14px | `p.text-xs` publisher line, SiteFooter | all (1440, 1370)         |
|  28 | 3→4 lines, 11→14px | `p.text-xs` age/eligibility disclosure | all (390)                |
|  16 | 1→2 lines, 11→14px | `p.text-xs` RankedList advantage copy  | home, reviews-hub (1100) |
|  14 | 3→4 lines, 14→15px | RG banner "Gambling problem? Call…"    | all (1440)               |
|  14 | 4→5 lines          | same, mobile                           | all (390)                |
|  13 | 1→2 lines          | BonusOfferCard benefit bullets         | home (all vps)           |
|   4 | 1→2 lines, 14→15px | `h3` operator name, RankedList         | home, reviews-hub (390)  |
|   3 | 1→2 lines, 18→19px | `h3.heading text-2xl` post titles      | home, blog-post          |

The last two matter most: a card _title_ wrapping changes the card's height and
is what feeds TS-6. Everything else is prose reflow, which is expected and
mostly benign.

**CLOSED 2026-08-26 — accepted, no action.** The wrapping is the intended
consequence of a deliberate size migration, not drift: 332 nodes gained a line
because the type they carry got bigger on purpose. The resulting +15–18% mobile
height is the cost of that decision, and
[docs/02 Reference 2](../docs/02-design-language-reference.md) explicitly wants
NerdWallet's "generous white space" over rg.org's density, so extra scroll
depth is on-brief rather than a regression.

Recorded as measured-and-accepted so a later pass does not re-open it as a bug.
Two consequences were real and were fixed under their own IDs: card titles
wrapping fed the grid stretch (TS-6, fixed) and the control inflation (TS-2,
fixed). The RankedList operator-name wrap at 390px remains the one spot worth
watching if that row gets denser.

---

## TS-8 — Broad shallow rhythm drift · ~~Low~~ **CLOSED, no action**

600 nav/footer `<li>` items moved +1.2px (ink 13.14 → 15.00); 224 footer `h3`
blocks +1.9px; 168 footer disclosure paragraphs +2.1px; 112 dark-block
sections +3.1px. Mean drift across all 4,055 measured pairs is **+0.89px**.

This is the diffuse "everything reads looser" signal and it is working as
intended — it is the whitespace half of
[docs/02 §6](../docs/02-design-language-reference.md)'s target position. Listed
so it is on the record as _measured and accepted_, not overlooked.

Three pairs got materially **tighter**, all benign — dead space inside blocks
being absorbed by content that grew into it (RG banner → footer, −9.5px;
grid-max-width wrapper, −7.9px).

---

## TS-9 — Legal/utility routes jump h1 44px → h2 16px · Low

**FIXED 2026-08-26.** The cliff was the symptom; reading the markup showed a
sharper defect underneath it.

At [legal/[doc]/page.tsx:131-132](../app/legal/[doc]/page.tsx#L131) the clause
heading was `text-xl` (16px) — and **the paragraph immediately beneath it is
also `text-xl` (16px)**. The heading was distinguished from its own body copy
by weight alone.

That is precisely the defect **VC-56 item 3** already ruled on for the blog's
in-body H3 (_"`text-xl` (16px) = body size; only weight differentiates"_),
which was resolved by raising it to `text-2xl`. Applying the same precedent
here makes this a consistency fix rather than a fresh design call.

Clause h2 `text-xl` → `text-2xl` (16 → 19px). Measured: legal h2 sizes
16/15/14/12 → **19**/15/14/12, and the h1 cliff eases 28 → 25px. The cliff is
still large, which is correct — a dense legal reference should not carry
editorial section headings — but the heading now outranks its own body text.
Gates: tsc 0, eslint 0, build clean, a11y 25/1, 0 h-scroll, 0 clipping.

---

## TS-10 — Review route heading scale is nearly flat · Info

h1 22px → h2 19px → h3 15/14px. The h1−h2 delta is **3px**. The route is
comparison register, where density is correct per docs/02 §5, and the h1 is
deliberately `--text-3xl`.

**CLOSED 2026-08-26 — no change.** TS-3 was resolved without touching any h1
token, so the dependency this entry was waiting on never materialised.

Worth recording what the measurement exposed, though: `review` (h1 22px) and
`reviews-hub` (h1 44px) are **both tagged `comparison`** in
[`tests/a11y/routes.ts`](../tests/a11y/routes.ts), yet their h1s differ by
22px. That is not drift — a hub/index page and a detail page are legitimately
different — but it does mean the register tag alone does not predict type
scale, and anything automated against it would draw the wrong conclusion. The
distinction the tags are missing is hub-vs-detail, not editorial-vs-comparison.

---

## Carried over from `visual-consistency-audit.md`

That document tracked VC-1–58 and, as re-verified 2026-08-26, **57 of 58
are closed**. The two items below are everything that was still live, moved
here so there is one open worklist rather than two. Their history stays in
the original file; their status is now maintained here.

### VC-34 — Rail-card CTA affordance/height · ~~Medium~~ **FIXED 2026-08-26**

> **The blocking policy question was already answered — it just hadn't been
> read as answered.** `docs/01`'s flag is _conditional_: "**if** 'Editor's
> Pick' ever surfaces the primary domain, it needs the same
> `PrimaryDomainLink` treatment." It doesn't. It links to
> `/reviews/peakwager`, an internal route. And it structurally cannot: the
> home rail is Tier 1, where **CLAUDE.md rule #1** forbids primary-domain
> links outright. So "link slot or genuinely editorial" resolves to
> **genuinely editorial** on evidence, not preference.
>
> Which makes the visual fix a convention match rather than a design call.
> The rail already has a shared editorial CTA — `railCtaClassName`, exported
> from `InfoCard` and used by its 4 call sites plus `HelpLineCard`. Five rail
> CTAs on the convention; `EditorsCard`'s `.btn-primary` was the lone
> outlier. It now uses `ArrowLink` + `railCtaClassName`.
>
> Measured after: the CTA is a 24px arrow link, no border, no fill — matching
> `InfoCard`/`HelpLineCard`. The 44px solid button sandwiched between a 32px
> outline button and a plain link is gone. Page heights unchanged, 0
> h-scroll, 0 clipping. Gates: tsc 0, eslint 0, build clean, a11y 25/1.
>
> **Correction to this entry's own diagnosis, below:** the claim that
> `TopicsCard` "runs on shadcn's own token layer" and that its 6px radius is
> a divergence **is wrong**. 6px is `--radius-sm`, this project's documented
> radius for "compact tiles, score cards, search inputs, small icon chips" —
> exactly what those option buttons are. `.btn-*`'s 8px is `--radius-md`,
> documented for "CTA buttons". Two roles, two correct tokens. `TopicsCard`
> needed no change. (The token _plumbing_ behind that does have a real
> problem — see the new finding below.)

Measured live on `localhost:3000` at 1440px. `components/rail/HomeRail.tsx`
renders `SearchInput → TopicsCard → TrendingCard → EditorsCard`; two of
those carry a CTA and they share no chrome:

| card                                                         | control                                     |   height | size | radius | border | fill         |
| ------------------------------------------------------------ | ------------------------------------------- | -------: | ---: | -----: | -----: | ------------ |
| [TopicsCard.tsx:12](../components/rail/TopicsCard.tsx#L12)   | shadcn `Button variant="outline" size="xs"` | **32px** | 12px |    6px |    1px | transparent  |
| [EditorsCard.tsx:13](../components/rail/EditorsCard.tsx#L13) | bare `.btn-primary`, no compaction override | **44px** | 14px |    8px |      0 | solid `#111` |

Two further treatments exist on the same role elsewhere in the rail family
([HelpLineCard.tsx:12](../components/rail/HelpLineCard.tsx#L12) — plain
`ArrowLink`, no button chrome; `AtAGlanceCard` — no CTA at all any more),
so the original "four treatments" framing still holds across the family,
but only two now collide in a single visible column.

The radius split is not a size choice: `TopicsCard` runs on shadcn's own
token layer rather than this project's `.btn-*`, which is why it renders a
6px radius against `.btn-primary`'s 8px — the same class of divergence
VC-13/VC-32 closed elsewhere.

**This finding is coupled to TS-1/TS-2.** The type migration moved it:
`TopicsCard`'s label went 10px → 12px while the button stayed pinned at
32px, so its vertical breathing room dropped from 11px to 10px. More
importantly, TS-2's proposed control line-height changes what "compact
CTA" means sitewide — `.btn-*` at `text-xs` would drop from 37.09px to
~30.8px. **Settle TS-2 before choosing a target height here**, or the rail
gets normalized twice.

**Also still blocked on a policy question**, per
[docs/01](../docs/01-wireframe-component-audit.md): `EditorsCard`'s
"Editor's Pick" is flagged there as _"a disguised Tier 2/3 slot… decide now
whether this is intended as a link slot or genuinely editorial."_ Once
resolved, route its CTA through compact `PrimaryDomainLink` (if a real link
slot) or downsize it to `HelpLineCard`'s plain-link convention (if it stays
editorial). The visual inconsistency holds either way — the policy question
decides _which_ treatment wins, not whether one is needed.

### TS-11 — `--radius-sm` / `--radius-md` are each declared twice · ~~Medium~~ **FIXED**

Found while verifying VC-34's radius claim. `globals.css` has two `@theme`
blocks, and both define the same two tokens:

| token         | project block                                                                                           | shadcn block                                                | winner     |
| ------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ---------- |
| `--radius-sm` | [:154](../app/globals.css#L154) `6px` — _"compact tiles, score cards, search inputs, small icon chips"_ | [:424](../app/globals.css#L424) `calc(var(--radius) * 0.6)` | **shadcn** |
| `--radius-md` | [:155](../app/globals.css#L155) `8px` — _"cards, sections, CTA buttons, avatars/logo squares"_          | [:425](../app/globals.css#L425) `calc(var(--radius) * 0.8)` | **shadcn** |

The later block wins, so the project's own declarations — the ones carrying
the documented role comments — are **dead code**. Computed at runtime:
`--radius-sm` resolves to `calc(.625rem * .6)` = 6px and `--radius-md` to
`calc(.625rem * .8)` = 8px.

**Nothing renders wrong today, and that is precisely the hazard.** With
`--radius: 0.625rem`, shadcn's arithmetic lands on 6px and 8px by
coincidence — the same values the project intended. Two consequences, both
silent:

1. Editing `--radius-sm: 6px` at line 154 to retune compact chips does
   nothing at all.
2. Changing `--radius` — a single shadcn-owned value — silently moves every
   compact tile and every card/CTA corner on the site at once.

**FIXED 2026-08-26 — the project's literals now own `sm`/`md`; shadcn keeps
the larger steps.** Only the two conflicting redeclarations were removed, with
a comment in their place explaining why they must not come back.

Evidence for taking the conservative option rather than deleting either block
wholesale:

- `rounded-lg`/`xl`/`2xl`/`3xl`/`4xl` have **zero real usages** — the single
  `rounded-lg` hit is inside a comment in `ChipList.tsx`. But `--radius` and
  those steps are shadcn's own scale, and this project uses the `shadcn` CLI,
  so a future `shadcn add` may expect them. Removing them buys nothing and
  risks a later surprise.
- `components/ui/input-group.tsx` consumes `calc(var(--radius-sm) - 2px)`
  twice, so `--radius-sm` has to stay defined regardless of which block wins.
- `globals.css:18` already recorded the intended split, so the project's
  literals are the declarations carrying real design intent.

Verified as a genuine no-op, not assumed: token values now resolve to the
literal `6px`/`8px` instead of `calc(.625rem * .6 / .8)`, and across the full
14 route × 4 viewport sweep the **box-radius distribution is byte-identical**
— 840 × 8px, 789 × 0px, 118 × 6px before and after — with page heights
unchanged and the same record count. Spot-checked live: `.card` 8px,
`.btn-primary` 8px, `TopicsCard` chips 6px, score tiles 6px.

The practical win: editing `--radius-sm: 6px` now actually changes something,
and `--radius` can no longer silently move every corner on the site.

Checked and **not** a duplicate: everything from line 438 down is inside
`.dark` — legitimate dark-mode overrides, not redeclarations.

### VC-29 — Dead tokens · ~~Info~~ **FIXED 2026-08-26**

Both removed from `globals.css`, along with `--breakpoint-cards-wide`'s now
orphaned doc-comment. Neither was a rendering defect; both were carrying a
worse cost than being unused — two audit docs described `--breakpoint-cards-wide`
as a live convention, so leaving it defined invited a future pass to reach for
a breakpoint that no longer does anything.

**Verified unreferenced before deleting**, searched repo-wide including hidden
directories (plain `rg` skips dot-dirs, which would have missed `.claude/`):
one hit each, their own definition. Every other mention is a historical audit
doc, and `repo-status.md:367` had already flagged the same thing independently.

**Confirmed layout-neutral after deleting** — full 14 route × 4 viewport sweep
diffed against the post-TS-2 baseline: `text`, `pair`, `box`, `control` and
`page` record counts all byte-identical, 0 horizontal scroll, 0 clipping. The
only deltas were the +2px/+4px on `home` from TS-5's MarketCard change and two
grid rows becoming even enough to fall below the spread threshold — both
expected, neither from this removal. Gates: tsc 0, eslint 0, production build
clean, a11y 25 passed / 1 skipped.

| token                             | defined                                    | references                  |
| --------------------------------- | ------------------------------------------ | --------------------------- |
| `--color-border-divider-alt`      | [globals.css:40](../app/globals.css#L40)   | zero, re-checked 2026-08-26 |
| `--breakpoint-cards-wide: 1250px` | [globals.css:147](../app/globals.css#L147) | zero — **newly dead**       |

`--breakpoint-cards-wide` was orphaned by the 2026-08-21 shell/tablet
refactor, which moved every grid to a single column below `wide:` (1370px)
and removed the last `cards-wide:` call site.

### Related — `.meta-label` adoption · **FIXED 2026-08-26**

The typography audit's own residue: `text-2xs` written as a raw utility instead
of the shared class, leaving one role with two spellings — and, after Phase 2
gave `.meta-label` a weight, two different weights.

Of 32 `text-2xs` call sites, 18 matched the role exactly
(`text-2xs` + `text-text-subtle` + `font-mono`, no uppercase). **Six of those
were excluded**: they are `placeholder-asset` box captions rendering throwaway
`[image]`/`[logo]` text, which the typography audit had already set aside as
"weight is irrelevant". The remaining **12 real call sites were converted** —
`reviews/[slug]` ×4, `Comments` ×3, `ComparisonCard` ×2, `MarketCard` ×2,
`help-directory` ×1.

This is a deliberate visual change, not a no-op refactor: the class supplies
`font-weight: 500` and `letter-spacing: 0.05em` that the raw spelling never
had. That is the point — those nodes were the light half of the split.

| metric                               | before |   after |
| ------------------------------------ | -----: | ------: |
| text nodes ≤12px **and** weight ≤400 |    380 | **282** |
| routes with horizontal scroll (×56)  |      0 |   **0** |
| real clipping                        |      0 |   **0** |

The 98-node reduction matches the typography audit's predicted residual
exactly. The added tracking widens these strings slightly, which reflowed three
route/viewport combinations (`home` +27px at 1370, `review` +15px at 1370 and
+29px at 390) — **no overflow anywhere**, which was the specific risk given two
of the converted sites are `ComparisonCard` table cells.

Not converted, deliberately: sites whose colour is `text-text-meta` rather than
`text-text-subtle` (`reviews/[slug]:155`, `SelfAssessment:128`), non-mono
`text-2xs` (`BonusOfferCard:65`, `Comments:68`), accent badges, and
`button.tsx`'s size variant. Converting those would change colour, not just
weight — a different decision, still open.

Gates: tsc 0, eslint 0, build clean, a11y 25 passed / 1 skipped.

---

## Checked, ruled out

| check                                                        | result                                                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| Clipping / truncation regressions                            | **0** new or worsened, across 56 route×viewport runs, both passes                           |
| `-webkit-line-clamp` overflow                                | none — no clamped element gained hidden content                                             |
| Horizontal page scroll                                       | 0 routes at 1440 / 1370 / 1100 / 390, before and after                                      |
| 1370px `--breakpoint-wide` reflow (the flagged "known risk") | **did not materialise** — no clipping, no overflow, no h-scroll at the single-column switch |
| ChipList active/inactive height mismatch                     | ruled out — flex stretch absorbs the 2px (verified live, all chips 37.09px)                 |
| Overall box ink asymmetry ≥8px                               | slightly **improved**: 10% → 9%                                                             |
| SideNav (236px) / rail (300px) fixed-width overflow          | no clipping recorded at any viewport                                                        |
| Record count parity                                          | 6,078 text nodes both passes — nothing dropped or restructured                              |

---

## Standing constraint on every fix below

**This site is pre-CMS. Any fix that assumes a field is present, non-empty, or
a fixed number of lines is a bug waiting for PayloadCMS to land.** Established
while fixing TS-5, where the proposed `mt-1` on a stat card's period line would
have become an orphan margin the moment `period` came back empty.

Practical consequences for the remaining items:

- Prefer a parent `gap-*` over a child `mt-*`/`mb-*`. A gap collapses correctly
  when a child is absent; a margin does not.
- Distrust any fix phrased as "reserve a height" or "pin to N lines" — that is
  the same assumption in a different shape. **TS-6's first option is written
  that way and should be re-derived before it is applied.**
- Fixed-height containers holding CMS text are the general form of this trap;
  it is what TS-1 was, one layer down.

---

## Recommended order

1. ~~**TS-2**~~ — **DONE 2026-08-26**, commits `02f63b0` + `3440d7b`.
2. ~~**TS-1**~~ — **DONE 2026-08-26**, closed by (1). Verified: 0 mismatched pairs.
3. ~~**VC-34**~~ — **DONE 2026-08-26.** The `docs/01` question was already
   answered: the CTA links internally and rule #1 bars a primary-domain link
   on Tier 1, so it is editorial. `EditorsCard` adopted `railCtaClassName`;
   `TopicsCard` needed no change.
4. ~~**TS-4**~~ — **CLOSED 2026-08-26, no change.** Measured, then rejected:
   three distinct header roles, not drift. `gap-2` stays.
5. ~~**TS-5**~~ — **DONE 2026-08-26.** Parent `gap-1`, child margins removed —
   `mt-*` rejected as CMS-fragile. Source→period ink 1.44 → 5.44px.
6. ~~**TS-6**~~ — **DONE 2026-08-26.** `h-full` kept; `mt-auto` on the chip
   wrapper moves the slack above the action block. Row spread 21 → 0.00px.
7. ~~**VC-29**~~ — **DONE 2026-08-26.** Both dead tokens removed; verified
   unreferenced repo-wide and layout-neutral by full sweep.
8. **TS-3 / TS-9 / TS-10** — design decisions, not cleanups. They belong with
   the still-open register-split question carried over from
   [`typography-weight-audit.md`](typography-weight-audit.md) §"Open — the
   two-register system", which this sweep did not resolve and which remains the
   governing open item: one global scale is still applied to both registers.

Re-run the sweep after any of 1–5 and diff against the `after` dataset; every
number in this document is reproducible from the harness.

---

## Harness files added

| file                                           | purpose                                     |
| ---------------------------------------------- | ------------------------------------------- |
| `.claude/visual-harness/spacing-audit.spec.ts` | the sweep — 7 record types, ink-based       |
| `.claude/visual-harness/spacing.config.ts`     | port 4321, production build, 4 viewports    |
| `.claude/visual-harness/verify.spec.ts`        | targeted live re-verification of TS-1/4/5/6 |
| `.claude/visual-harness/verify.config.ts`      | points at `localhost:3000`                  |
| `.claude/visual-harness/analyze.mjs`           | before/after diff and aggregation           |

Datasets (`before.jsonl` / `after.jsonl`, ~4.6MB each) are session scratchpad
only and are not checked in; re-running both passes regenerates them in about
two minutes plus build time.
