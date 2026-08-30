# Mobile & touch audit — 2026-08-28

**Not for commit.** Local working notes for the mobile pass that follows the
current (desktop-scoped) staging.

Measured on the current tree at `localhost:3000`, after the rail refactor,
motion work, and lib extraction. Viewports m320 / m390 / m425 / t768 across all
14 routes, plus a touch-emulated pass at 390.

Harness: `spacing-audit.spec.ts` + `mobile.config.ts` → `consistency.mjs`, and
`mobile-audit.mjs` for touch targets and rail parity.

---

## What is already clean

Worth stating, because it narrows the pass:

- **No horizontal scroll** on any route at any width down to 320.
- **No clipped or truncated content** anywhere.
- **No off-scale line-height ratios.**
- Off-scale font sizes are only the 404 display numeral (96px mobile / 160px
  tablet) — deliberate, not drift.
- `h1` at 22px on the review route is TS-10, closed as a deliberate
  hub-vs-detail distinction. Not a mobile issue.

So the mobile work is **not** a layout rescue. It is three specific things.

---

## M-1 · Hover states are not gated to hover-capable devices · High

`hover:` utilities compile **ungated** in this build:

```
hover utilities inside @media (hover: hover): 0
hover utilities NOT gated (fire on tap):      8
```

The 7 `@media (hover:hover)` blocks in the stylesheet contain none of the
project's `.hover\:*` utilities — they come from elsewhere in the cascade.

**Consequence:** on a touch device, tapping applies `:hover` and it _sticks_
until the reader taps somewhere else. Every one of these holds its hover fill
after a tap:

| Surface                   | Hover style                                   |
| ------------------------- | --------------------------------------------- |
| Rail rows (`AnchorList`)  | `hover:bg-bg-subtle`                          |
| `PostRow` / card wrappers | `hover:bg-bg-subtle`                          |
| `editorial-link-card`     | `hover:border-text-primary`                   |
| Buttons / chips           | `hover:bg-bg-card`, `hover:text-text-primary` |

This reads as "still selected" on a list the reader has already navigated away
from.

**Direction:** wrap the hover variant in `@media (hover: hover) and (pointer:
fine)` so it only applies to real pointers, then give touch its own feedback via
`:active`. Note Tailwind v4 is expected to gate `hover` by default — this build
does not, so establish _why_ before patching (custom variant? `shadcn/tailwind.css`
import order? version resolution?) rather than blanket-overriding.

**Related:** only 7 `active:` usages exist across the whole codebase, and the
one real one is shadcn `button.tsx`'s `active:translate-y-px`. Touch feedback is
effectively absent sitewide.

`group-hover:translate-x-1` on `ArrowLink` (4 usages) never fires on touch. That
one is decorative, not a defect — no action needed.

---

## M-2 · The entire rail is hidden on mobile · High

`PageShell` renders the rail as `hidden wide:flex`. **17 cards across 7 routes
never reach a phone.** Only the blog route has a mobile fallback (its
`wide:hidden` in-article TOC).

| Route                                  | Cards a phone never sees                                            |
| -------------------------------------- | ------------------------------------------------------------------- |
| `/responsible-gambling`                | **Play Responsibly** · On this page · Our commitments · Corrections |
| `/responsible-gambling/help-directory` | **In immediate danger?** · Understanding the risks · Corrections    |
| `/reviews/[slug]`                      | At a glance · Other books compared                                  |
| `/legal/[doc]`                         | In this document · All legal documents · Change log                 |
| `/`                                    | Help Me Choose · Trending Now · Editor's Pick                       |
| `/categories/[slug]`                   | All categories                                                      |
| `/blog/[slug]`                         | On this page _(has mobile TOC)_ · More in Guides                    |

The two bolded cards are the priority: the **helpline card** and the
**emergency-services card** are desktop-only, on the responsible-gambling
routes. A phone reader on `/responsible-gambling/help-directory` never sees
"In immediate danger?". Content-parity bug with a safety edge, not a styling gap.

**This needs a per-card decision, not a mechanical fix.** Likely split:

- _Promote inline_ — At a glance (near the score), In immediate danger? (top of
  page), Play Responsibly.
- _Mobile TOC pattern_ — In this document, On this page, following the blog
  route's existing `wide:hidden` precedent.
- _Drop on mobile_ — Trending Now, Editor's Pick, Help Me Choose, Corrections.

---

## M-3 · Touch targets below 44px · Medium

Measured at 390 with touch emulation:

| Height          | What                         | Count |
| --------------- | ---------------------------- | ----- |
| **14.4px**      | footer link rows             | 144   |
| **24px**        | breadcrumb links             | 15    |
| **30.8 / 32px** | filter chips, compact CTAs   | 43    |
| 17–22.5px       | inline prose links, wordmark | ~20   |

WCAG 2.5.8 (AA) requires 24×24, so the chips pass and the **footer rows do not**.
WCAG 2.5.5 (AAA) and Apple HIG both want 44×44.

The rail rows are currently the _only_ surface meeting 44px on touch
(`min-h-11 wide:min-h-5`, from the rail refactor). Nothing else follows that
rule — the pattern exists and just is not applied.

The 17–18px inline prose links are legitimately exempt: WCAG excludes links
inline in a sentence.

Note the token trap when fixing: `--spacing-1..8` are named 4/8/16/24/32/40/48/60,
so **`min-h-11` is 44px but `min-h-8` is 60px**. Only unnamed steps fall through
to `0.25rem × N`.

---

## Ordering

1. **M-1** — cheapest, sitewide, and it is a bug rather than a design decision.
2. **M-3** — mechanical once the `min-h-11 wide:*` pattern is adopted.
3. **M-2** — largest, needs the per-card call above before any code.

---

## Harness kept for this pass

- `mobile-audit.mjs` — touch targets + rail parity, re-runnable
- `spacing-audit.spec.ts` + `mobile.config.ts` + `consistency.mjs` — the sweep
- `rail-cards.spec.ts` — rail geometry regression guard
- `rail-sticky.mjs`, `route-fade.mjs`, `smooth-scroll.mjs`, `chip-pending.mjs` —
  live invariants from the current staging
