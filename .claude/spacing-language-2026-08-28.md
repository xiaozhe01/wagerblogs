# Spacing language — proposal for review, 2026-08-28

**Not for commit. No code has been changed for this document.**

Goal: one spacing language every route speaks, with deliberate per-route
adjustment on top — rather than the current situation where each page picks
its own values.

**Method.** Counted every `gap-*`, `p*-*` and `m*-*` utility across `app/` and
`components/`, cross-referenced against the declared tokens in
`app/globals.css`, then broke the highest-traffic ones down by the element and
type-size they sit on so roles could be separated from raw numbers.

---

## 1 · The core problem is not "different sizes"

It is that **three different spellings reach the same pixel**, because only the
integers 1–8 are named in `@theme`. Everything else silently falls through to
Tailwind's `calc(0.25rem × N)`.

| px  | Named token   | Fractional fallthrough | Legacy token               |
| --- | ------------- | ---------------------- | -------------------------- |
| 4   | `--spacing-1` | —                      | —                          |
| 6   | —             | `gap-1.5`              | `--spacing-legacy-2`       |
| 8   | `--spacing-2` | —                      | —                          |
| 10  | —             | `gap-2.5` (21×)        | `--spacing-legacy-3`       |
| 12  | —             | —                      | `--spacing-legacy-4` (19×) |
| 14  | —             | `gap-3.5`              | `--spacing-legacy-5`       |
| 16  | `--spacing-3` | —                      | —                          |
| 24  | `--spacing-4` | —                      | —                          |
| 32  | `--spacing-5` | —                      | —                          |

So `gap-2.5` and `gap-legacy-3` are both 10px by unrelated routes, and nothing
in the class name signals which scale you are on. This is the same trap that
produced the `min-h-8` → 60px and `size-5` → 32px surprises earlier.

**Nine distinct gap values are in use:** 4, 6, 8, 10, 12, 14, 16, 24, 32.
Between 4 and 16 that is a 2px ramp — a continuum, not a scale.

---

## 2 · Measured usage

### Gaps (192 total)

| Value | Class          | Count  |
| ----- | -------------- | ------ |
| 16px  | `gap-3`        | **59** |
| 8px   | `gap-2`        | 33     |
| 4px   | `gap-1`        | 28     |
| 10px  | `gap-2.5`      | 21     |
| 12px  | `gap-legacy-4` | 19     |
| 24px  | `gap-4`        | 15     |
| 32px  | `gap-5`        | 7      |
| 14px  | `gap-3.5`      | 6      |
| 6px   | `gap-1.5`      | 4      |

### Box padding — one role, three values

`.card` is 16px. Boxes elsewhere use:

| Class | px     | Count |
| ----- | ------ | ----- |
| `p-3` | 16     | 7     |
| `p-4` | **24** | 9     |
| `p-5` | **32** | 7     |

### Heading → content, by role

Broken down by the element and type-size the margin sits on:

| Role                                                | Value               | Evidence                   |
| --------------------------------------------------- | ------------------- | -------------------------- |
| Card title (`h3`, `text-md`) → body                 | **6px** (`mb-1.5`)  | 9 of 20 uses are `h3`      |
| Rail card title (`h2`, `heading text-sm`) → content | **10px** (`mb-2.5`) | 9 of 11 rail cards         |
| Page section (`h2`, `heading text-h2`) → content    | **16px** (`mb-3`)   | 9 of 22 uses are `text-h2` |
| Prose paragraph (`text-xl`) → next block            | **32px** (`mb-5`)   | 6 of 10 uses               |

These four roles are already fairly clean. The inconsistency is in _mechanism_,
not value — see §3.

---

## 3 · Conventions that must NOT be flattened

Three things look like drift and are not. Flattening them would undo
deliberate decisions.

**a. The 10px rail-card title gap.** Recorded as the standard on 17 of 18
cards, with `AtAGlanceCard`'s 8px as the documented exception. Keep 10px as a
named role, even though it is off the integer scale.

**b. `gap-legacy-4 md:gap-3`.** Appears **15 times identically** (12px mobile →
16px desktop) plus 4 near-identical. This is a real responsive convention
wearing a token name that says "deprecated." It should be **renamed, not
removed** — `--spacing-legacy-4` is the only legacy step in live use.

**c. `min-h-11` (44px).** The touch floor. It resolves through fallthrough, not
the named scale, and must stay 44px regardless of any rescaling.

---

## 4 · The one genuine mechanism split

Rail card titles express the same 10px two ways:

| Mechanism                    | Where                                                                                                    | Count |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- | ----- |
| `mb-2.5` on the child `h2`   | AnchorList, TrendingCard, TopicsCard, EditorsCard, HelpLineCard, blog, legal, categories, help-directory | **9** |
| parent `flex flex-col gap-*` | `InfoCard` (10px), `AtAGlanceCard` (8px)                                                                 | 2     |

The parent-gap mechanism is the one already ruled for: _"it is all static style
with a static mt property, this would not end well once the real data from
PayloadCMS comes through — we need to use the gaps rather than fixed mt."_

A child margin does not cascade to later siblings, which is exactly why the
margin-based sections on `/responsible-gambling` had accumulated `mb-4`,
`mt-3`, `mt-2` while the gap-based ones needed nothing.

**Proposal:** migrate the 9 `mb-2.5` to a parent `gap-2.5`, leaving
`AtAGlanceCard` at 8px as the documented exception.

---

## 5 · Proposed role → value map

| Role                                         | Value     | Class               |
| -------------------------------------------- | --------- | ------------------- |
| Tight pair (number + label, icon + text)     | 4px       | `gap-1`             |
| Items within a group                         | 8px       | `gap-2`             |
| Rail card title → content _(exception, §3a)_ | 10px      | `gap-2.5`           |
| Grid, mobile → desktop _(§3b)_               | 12 → 16px | rename off `legacy` |
| Heading → content · list rows                | **16px**  | `gap-3`             |
| Sub-group separation                         | 24px      | `gap-4`             |
| Major block separation (main's own gap)      | 32px      | `gap-5`             |
| Touch floor _(§3c)_                          | 44px      | `min-h-11`          |

**142 of 192 gap usages (74%) already fit this.** The work is the remaining 50,
plus the padding and mechanism items.

Values to retire: **6px** (`gap-1.5`, 4×) and **14px** (`gap-3.5`, 6×) — they
sit between named steps, are used sparsely, and have no identified role.

---

## 5b · Scope narrowed: main content only

SideNav, rails, TopHeader and SiteFooter are settled and are **out of scope**.
Re-measured across the 37 main-content files only (`app/**`,
`components/section/**`, `components/cards/**`):

| Value | Class          | Count  |
| ----- | -------------- | ------ |
| 16px  | `gap-3`        | **51** |
| 12px  | `gap-legacy-4` | 17     |
| 8px   | `gap-2`        | 17     |
| 4px   | `gap-1`        | 16     |
| 24px  | `gap-4`        | 14     |
| 10px  | `gap-2.5`      | 12     |
| 32px  | `gap-5`        | 6      |
| 14px  | `gap-3.5`      | 5      |
| 6px   | `gap-1.5`      | 3      |

Two findings change the plan:

**`gap-legacy-4` is 17 of 17 consistent** — always `gap-legacy-4 md:gap-3`.
Not drift at all. Pure rename, zero pixels move.

**Box padding is a half-applied convention, not chaos.** Main content runs two
box systems:

| System                           | Padding                      | Where                   |
| -------------------------------- | ---------------------------- | ----------------------- |
| `.card` component class          | 16px flat                    | everywhere, incl. rails |
| ad-hoc panel                     | `p-4 md:p-5` (24→32px)       | 4 sites                 |
| ad-hoc panel, no responsive step | bare `p-5` ×3, bare `p-4` ×2 | **5 sites**             |

Two box types is defensible — a "card" may legitimately be tighter than a
"panel." The defect is only that 5 of 9 panels skip the responsive step.

---

## 6 · Recommended implementation, least-disruptive first

Ranked by visual risk. Tier 1 changes nothing visible.

**Tier 1 — zero pixels move**

- Rename `--spacing-legacy-4` to something intent-revealing (17 sites). It is
  the only legacy step in live use and is 100% consistent; the name is the
  only problem.

**Tier 2 — small, local, high payoff**

- Bring the 5 single-value panels onto `p-4 md:p-5`, matching the 4 that
  already do. Affects only those 5 boxes.
- Resolve the 8 off-scale gaps (`gap-1.5` ×3 = 6px, `gap-3.5` ×5 = 14px) to
  the nearest named step. No identified role for either.

**Tier 3 — mechanism, not pixels**

- Convert the 16 scattered `mt-*` (mt-1/2/2.5/3/4) to parent gaps where the
  parent is already a flex column. Behaviour-preserving there, and it closes
  the CMS-fragility rule.

**Deliberately not touching**

- `.card`'s 16px — used by the settled rail components.
- `main`'s 32px gap in `PageShell` — sitewide blast radius.
- The four heading→content roles in §2 — they are legitimately distinct.

---

## 7 · Full-scope backlog (superseded by §6 for main content)

**S-1 · Box padding** — 3 values for one role, 16 call sites, highest visual
payoff for the smallest surface. Decide whether 24px is a real "large box" step
(and name it) or whether `p-4`/`p-5` collapse to the `.card` 16px.

**S-2 · Rail card title mechanism** — migrate 9 `mb-2.5` to parent `gap-2.5`.
Mechanical, and it closes the CMS-fragility rule.

**S-3 · Retire 6px and 14px** — 10 call sites, resolve each to 8px or 16px.

**S-4 · Rename `legacy-4`** — 19 call sites, pure rename, no visual change.
Suggest `--spacing-grid-mobile` or similar so the intent reads.

**S-5 · Heading → content audit** — largest surface (~95 uses). Only after the
role map above is agreed, since the four roles in §2 are legitimately different
and must not collapse to one value.

---

## 8 · Open questions for review

1. **Is 24px a real step?** It has 15 gap uses and 9 padding uses. If yes it
   needs a role; if no, those 24 usages resolve to 16 or 32.
2. **Should `main`'s 32px gap stay global?** It is set once in `PageShell` and
   governs every route. Any change there is sitewide — deliberately untouched
   so far.
3. **Editorial vs comparison spacing.** `docs/02` §5 says editorial (Tier 1)
   gets "more whitespace." Should the register carry _different spacing values_,
   or only the card/no-card distinction it carries today? Currently
   `EditorialSection` differs only by `pt-5` vs `card`.
4. **6px and 14px** — confirm neither is a load-bearing convention I missed
   before they are retired.
