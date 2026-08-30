# Accessibility handover — landmark naming & related findings, 2026-08-28

**Status: §5 c/d/e open. §1 and §6 resolved.**

Written as a handover for accessibility work to follow the spacing/gap refactor,
because both touch the same lines (section tags, wrappers, `<main>` children).
**That refactor is now finished and committed**, so the sequencing warning no
longer applies — and §1/§6 were completed inside it. What remains is §5 c/d/e,
which is cross-cutting and overlaps nothing.

---

> **Status update 2026-08-29 — §1 and §6 are DONE.** The landmark naming work
> was completed during the spacing pass: **72 named, 0 unnamed** across all ten
> routes. The per-route table and priority list below are kept as the record of
> what was wrong and how it was found. Everything in **§5 (c/d/e)** is still
> open, and is now the whole of the remaining work. See §8 for what changed.

## 1 · The headline finding _(resolved — see status note above)_

**30 of 73 landmarks across the site have no accessible name.**

A `<section>` is the only common element that gets **no name from its
contents**. Without `aria-label` or `aria-labelledby` it is not exposed as a
`region` landmark at all — an inner `<h2>` does _not_ name it. Same for
`<article>`, which has a role but takes no name from its heading.

| Route                                  | Landmarks | Unnamed       |
| -------------------------------------- | --------- | ------------- |
| `/responsible-gambling`                | 9         | **0** ✅      |
| `/responsible-gambling/help-directory` | 7         | **0** ✅      |
| `/blog/[slug]`                         | 4         | 1             |
| `/categories`                          | 3         | 1             |
| `/categories/[slug]`                   | 5         | 2             |
| `/reviews`                             | 6         | 3             |
| `/` (home)                             | 13        | 5             |
| `/legal/[doc]`                         | 10        | 6             |
| `/authors/[slug]`                      | 5         | 4             |
| `/reviews/[slug]`                      | 11        | **8** ← worst |
| **Total**                              | **73**    | **30**        |

`axe` does **not** flag these. Unnamed `<section>` is valid HTML — it simply
drops out of the landmark tree, so the automated suite stays green while
landmark navigation silently degrades. All 25 a11y tests pass today.

---

## 2 · The rule — what to name, what to leave alone

Verified against the Chrome accessibility tree via CDP
(`Accessibility.getFullAXTree`), reading the `name.sources` "comes from" field.

| Element                          | Name it?                                  | Why                                                                                                                  |
| -------------------------------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `<section>`                      | **Yes** — `aria-labelledby` → its heading | Takes no name from contents; unnamed = not a landmark                                                                |
| `<article>`                      | **Yes** — same wiring                     | Has a role, takes no name from its `h3`                                                                              |
| `<nav>`, `<aside>`               | **Yes** — `aria-label`                    | Multiple per page; names disambiguate them                                                                           |
| `<h1>`–`<h6>`                    | **No**                                    | Named from `contents` automatically. `aria-label` would _replace_ the visible text — breaks WCAG 2.5.3 Label in Name |
| `<div>`, `<p>`, `<span>`, `<dl>` | **No**                                    | No role; `aria-label` on a roleless element is ignored by most AT and adds noise where honoured                      |

Measured proof of the distinction:

```
region   "North America"                    <- relatedElement   (aria-labelledby)
heading  "North America"                    <- contents         (automatic)
heading  "[National problem gambling ...]"  <- contents         (automatic)
article  "[National problem gambling ...]"  <- relatedElement   (after wiring)
```

**Preferred mechanism:** `aria-labelledby` pointing at the visible heading, via
the existing `headingId(prefix, title)` helper in `lib/utils.ts`. Use
`aria-label` only where there is no visible heading (e.g. the help-directory
filter unit).

---

## 3 · Why the component beats hand-authoring

`components/section/EditorialSection.tsx` wires `aria-labelledby` from its
`title` automatically. The correlation is exact:

- `/responsible-gambling` — fully converted to `EditorialSection` → **0 unnamed**
- `/reviews/[slug]` — all hand-written `<section>` → **8 unnamed**

Hand-authored sections carry the name 0–100% of the time depending on the file.
The component is 100% by construction. **Prefer converting to
`EditorialSection` over hand-adding `aria-labelledby`** wherever the section has
a visible heading — it fixes the naming and removes a duplicated `h2` in one
move.

`EditorialSection` currently requires a `register` prop (`"editorial"` |
`"comparison"`) — see `docs/02` §5. Tier 1 pages are editorial, Tier 2/3
comparison. Each route declares its register in a `{/* Register: … */}` comment
at the top of its JSX.

---

## 4 · Already done (do not redo)

- `/responsible-gambling` — 7 sections converted to `EditorialSection`, 0 unnamed.
- `/responsible-gambling/help-directory` — filter + results joined into one
  named section; 3 region sections wired to their `h2`; 6 `<article>`s wired to
  their `h3`; closing block converted to `EditorialSection`. 0 unnamed.
- `ChipLink` — `aria-current="page"` on the active filter chip.
- `AnchorList` — `aria-current` + 44px touch floor below `wide`.
- `SelfAssessment` — non-text contrast fixed (see §5).

---

## 5 · Other accessibility findings from this session

**a. Custom controls are invisible to axe.** `SelfAssessment`'s radio uses an
`sr-only` `<input>` with a styled `<span>`. axe reported **0 violations**
because it never evaluates the visual control. Manual WCAG 1.4.11 measurement
found the unchecked ring at **1.61:1** against a required 3:1 — fixed to 3.95:1.
**Any other `sr-only`-input control needs the same manual check.**

**b. `prefers-reduced-motion` and false positives.** axe intermittently reports
a _serious_ contrast violation on text inside `animate-in fade-in` when it
samples mid-animation. `playwright.config.ts` sets
`contextOptions: { reducedMotion: "reduce" }` for this reason — **any ad-hoc
audit config must set it too**, or it will chase phantom failures.

**c. Hover states are not gated to hover-capable devices.** 0 of 8 hover
utilities compile inside `@media (hover: hover)`; all fire on tap and stick
until the reader taps elsewhere. Tailwind v4 is expected to gate `hover` by
default and this build does not — **find out why before overriding**. Detail in
`.claude/mobile-touch-audit-2026-08-28.md` (M-1).

**d. Touch targets.** 144 footer link rows at 14.4px, breadcrumbs at 24px,
filter chips at 30.8–32px. WCAG 2.5.8 (AA) needs 24×24; 2.5.5 (AAA) and Apple
HIG want 44. Only the rail rows currently meet 44px. Detail in the mobile audit
(M-3).

**e. Rail content is desktop-only.** 17 rail cards across 7 routes never reach a
phone, including the **helpline card** and the **"In immediate danger?" card**
on the responsible-gambling routes. Content-parity issue with a safety edge.
Detail in the mobile audit (M-2).

---

## 6 · Remaining work, by priority _(all cleared 2026-08-29 — see §8)_

1. **`/reviews/[slug]`** — 8 unnamed. Worst offender; all hand-written sections.
2. **`/legal/[doc]`** — 6 unnamed, plus a `<div>` wrapping the numbered clauses
   that should be a section.
3. **`/` (home)** — 5 unnamed.
4. **`/authors/[slug]`** — 4 unnamed, plus a `<div>` closing block.
5. **`/reviews`** — 3 unnamed.
6. **`/categories/[slug]`** — 2 unnamed.
7. **`/blog/[slug]`, `/categories`** — 1 each.

Then §5 items c/d/e, which are cross-cutting rather than per-route.

---

## 7 · Harness

- `.claude/visual-harness/section-names.mjs` — per-route landmark naming audit.
  Run against `localhost:3000`. This is the metric to drive to zero.
- `.claude/visual-harness/a11y-tree.mjs` — CDP accessibility tree dump with the
  "name comes from" source. Use this to confirm _why_ something is named.
- `.claude/visual-harness/selfassessment-audit.spec.ts` — axe + manual contrast,
  including checked/disabled states axe cannot reach.
- `.claude/visual-harness/sa-nontext.mjs` — WCAG 1.4.11 non-text contrast.
- `npm run test:a11y` — the committed axe suite, 25 passing. Green throughout;
  it does not catch anything in §1.

---

## 8 · What the 2026-08-29 spacing pass closed

**All of §1 and §6.** 30 unnamed → **0**; 72 named across ten routes. Verify
with `.claude/visual-harness/section-names.mjs`.

Most of it landed in components, not pages, which is why the count moved faster
than the route list suggested:

| Change                                                                                         | Closed                              |
| ---------------------------------------------------------------------------------------------- | ----------------------------------- |
| `RankedListSection`, `ComparisonCard` — `aria-labelledby` at the component                     | home, `/reviews`, `/reviews/[slug]` |
| `ReviewSectionHeading` → **`ReviewSection`** — now owns its `<section>`, name, and heading gap | 7 call sites                        |
| `TopHeroSection`, authors identity block → `<header>`                                          | home, `/authors/[slug]`             |
| `EditorialSection` conversions                                                                 | categories ×2, blog, authors ×3     |
| Legal clause group named; each numbered clause wired to its `h2`                               | `/legal/[doc]`                      |

**The rule that decided every remaining `main-audit` flag:** a _bounded surface_
(background + border, or rules top **and** bottom) owns its padding as interior;
a _lone rule_ with padding is block spacing and was removed. The audit script
cannot tell these apart, so the surviving flags — card padding on home/reviews,
the legal summary panel, the authors header band, the RG helpline aside — are
all correct as-is.

### Still open — this is now the entire backlog

§5 **c** (hover not gated to hover-capable devices), **d** (touch targets),
**e** (rail content desktop-only, including the helpline card). All three are
cross-cutting, all three are detailed in
`.claude/mobile-touch-audit-2026-08-28.md`.

Plus one found on 2026-08-29 and deliberately not fixed:

**Legal chip nav resets focus to `<body>`.** Clicking a doc chip navigates
`/legal/a` → `/legal/b`; Next keys the dynamic segment by its param, so the page
subtree remounts and focus is lost. Pre-existing, not a regression — it behaved
the same before the transition work.

The only fix is hosting the nav in `app/legal/layout.tsx`, above the `[doc]`
segment. **Considered and declined on 2026-08-29**, because a layout wraps its
children rather than injecting into them: the chips sit mid-page, so the layout
would have to own the breadcrumb, `h1` and summary above them — all doc-specific,
and unreachable from a layout that gets no `params`. It would push the chips
above the page title and force the per-doc "In this document" rail card either
out of the rail or onto the client. Not worth it for a focus reset. **Do not
re-open without a stronger reason than the fade** — that part is already fixed
(`app/template.tsx` shares one key across `/legal/*`; only the clause list
animates).
