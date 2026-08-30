# rg.org typography reference — fetched 2026-08-21

External reference data: what a market-reference site renders each typographic
role at. The rg.org half does not go stale; our half is re-measured below.

**Method:** Playwright (project-local), real-Chrome UA (rg.org's WAF blocks the
headless default and WebFetch), 6 pages sequential and politely paced, measured
at 1440px and 390px via viewport resize. Pages: `/`, a news article,
`/sportsbooks`, `/sportsbooks/arizona`, `/research`, `/about`. Computed
size/weight/line-height for every visible h1–h6 and p. Re-runnable.

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

The identity: heading LEVEL is decoupled from SIZE — two h2 sizes chosen by
role, but each role renders identically on every template.

## Our deviations — re-measured 2026-08-29

Run `.claude/visual-harness/type-state.mjs` to refresh.

| | 2026-08-21 | now | |
| --- | --- | --- | --- |
| h1 sizes | 5 | **3** | 44px on 9 routes; `/reviews/[slug]` 22px; 404's 160px numeral deliberate |
| h2 sizes | 4 | **5** | 28×29, 19×22, 15×5, 14×1, 12×2 |
| `<h3>` sitewide | 1 | **109** | the retag landed; card titles are real h3s now |
| h4–h6 | unused | unused | still no ladder below h3 |

**Resolved since the original pass:**

- `/responsible-gambling` h1 — was capped at 38px by a missing `lg:` step; now
  on the full `text-5xl-*` ramp at 44px.
- `/responsible-gambling/help-directory` h1 — was a flat `text-4xl` (28px) with
  no mobile step; now on the ramp at 44px.
- The blog's 22px in-article h2 tier — folded into `--text-h2` (28px), so the
  route no longer carries a size the rest of the site doesn't use.

**Still open:**

- `/reviews/[slug]` h1 is `text-3xl` (22px) against 44px everywhere else. The
  only remaining h1 deviation, and the smallest h1 on the site sits on its most
  commercially important template.
- Five h2 sizes against rg.org's two. 28px (editorial) and 19px (comparison) are
  the documented two-register system and are fine; 15px is three components
  bypassing `.heading` (`ReviewCard`, `Comments`, legal's closing block) and
  12px is the `meta-label-caps` panel treatment, which is deliberate.
- No single body size. rg.org runs one (16px w400) across 317 nodes.

**Deliberately different, not a deviation:** article body is 18px
(`--text-article`) rather than rg.org's 16px — chosen from a measured
characters-per-line sweep, see `typography-plugin-migration.md` §2.
