# rg.org typography reference — fetched 2026-08-21

Live-measured companion to `html-semantics-audit.md`. Gathered because the
two workstreams intersect: the semantics audit says what tag ~110 sites
should become; this data says what a market-reference site renders those
roles at. Neither pass should run without the other in view.

**Method:** Playwright (project-local install), real-Chrome UA (rg.org's
WAF blocks the headless default and WebFetch), 6 pages sequential +
politely paced, measured at 1440px and 390px via viewport resize (no
re-request). Pages: `/`, a news article, `/sportsbooks`,
`/sportsbooks/arizona`, `/research`, `/about`. Computed font-size/weight/
line-height for every visible h1–h6 and p. Re-runnable; raw JSON was
session-scratchpad-only.

## rg.org's scale (desktop → mobile)

| role                 | size                | mobile | notes                                                              |
| -------------------- | ------------------- | ------ | ------------------------------------------------------------------ |
| h1                   | **40px w800**       | 32px   | one size on every template (about-page 46px is the lone exception) |
| h2 — page section    | **32px w800**       | 28px   |                                                                    |
| h2 — card/module     | **24px w700**       | 24px   | exactly two h2 tiers, role-consistent sitewide                     |
| h3 — article subhead | 26px w700           | 22px   |                                                                    |
| h3 — card title      | **18.7px w700**     | 18.7px | their workhorse (×115 across 6 pages)                              |
| h4 / h5 / h6         | 18 / 18 / 16px w700 | same   | full ladder in real use                                            |
| p — body             | **16px w400**       | same   | ONE body size, all pages (×317)                                    |
| p — lead/standfirst  | 18px w500           | same   |                                                                    |
| p — meta/fine print  | 14px / 12px         | same   |                                                                    |

The identity: heading LEVEL is decoupled from SIZE — two h2 sizes chosen
by role, but each role renders identically on every template.

## Our deviations (all 11 routes, same method, same day)

- **h1: 5 sizes vs their 1.** 44px standard on 7 routes; deviants:
  `reviews/[slug]:72` (`text-3xl` = 22px), `responsible-gambling:73`
  (missing `lg:text-5xl-desktop` — double space in the class string
  suggests accidental deletion, caps at 38px), `help-directory:60` (flat
  `text-4xl` = 28px, no mobile step). 404's 160px numeral is deliberate.
- **h2: 4 sizes vs their 2.** 25px editorial (×24) + 18px comparison
  (×16) = the documented two-register system, fine. Fragmentation: 22px
  blog in-article tier, 16px legal/help-directory numbered sections.
- **Lead: 3 sizes vs their 1.** 18px w500 on 7 routes (= rg exactly);
  15px on both responsible-gambling pages; 16px blog opening.
- **p body: no single size.** Blog 16 (= rg), reviews/legal 14, RG pages 15. Dominant measured `<p>` is the 11px footer fine print (×78) —
  because most body copy is in `<div>`s, invisible to a tag audit.
- **h4–h6 unused; one `<h3>` sitewide** — card titles are styled divs.

## How this correlates with html-semantics-audit.md

1. **The `<p>` comparison is provisional until the audit lands.**
   SEM-11/12/21 (~30 sites) hold prose in divs; retagging them will
   completely change the measured p-scale. Don't normalize body sizes
   before (or separately from) that retag.
2. **This data is the missing size half of the retag.** SEM-1/2 (rail
   titles → h2) and SEM-3/4/5 (in-card titles → h3) assign levels but
   not sizes. rg's precedent: a module-h2 tier visually distinct from
   the section-h2 tier, one size per role. Our rail-title h2s should
   keep their 12px look (level ≠ size); the ladder above is the
   reference for which roles deserve which size.
3. **Sequencing: retag + size in one per-component pass**, after the
   user reviews the audit. A typography-only pass first would churn the
   same lines twice (e.g. SEM-22's `<article>` wrap touches the blog
   h2s that also need 22→25).
4. **Safe to do independently (audit doesn't touch these lines):** the
   three h1 class fixes — h1s are already h1s. Proposed: restore the
   `text-5xl-*` ramp on reviews/[slug] and help-directory; confirm
   whether responsible-gambling's missing lg: step was intended.
