# Typography size + weight migration — measured 2026-08-25, re-verified 2026-08-29

Record of a completed migration. Companion to `rg-typography-reference.md`
(which measured rg.org). This one measured **us**: every visible text-bearing
element on all routes at 1440px and 390px.

**Re-run:** `.claude/visual-harness/type-distribution.mjs` for the size/weight
distribution (dev server, seconds), or `type-audit.spec.ts` for the full
per-node record (production build, 3049 records).

---

## The finding, and where it landed

The original sweep found the whole page sitting in one corner of the scale —
**69% of desktop text nodes at ≤12px, 56% at weight 400**. Re-measured after
both phases:

| | 2026-08-25 | 2026-08-29 |
| --- | ---: | ---: |
| nodes ≤12px | **69%** | **29%** |
| nodes at weight 400 | **56%** | **11%** |

Per route, now: home 24%, review 23%, responsible-gambling 24%,
legal-privacy 31%, blog-post 35%, category 39%, author 46%.

The remaining ≤12px mass is meta labels, timestamps and fine print — roles that
belong there. The w400 collapse (56% → 11%) is the bigger result: body copy now
carries `--font-weight-medium` rather than defaulting.

## What shipped

- **Phase 1 — size tokens**, `globals.css` only. Rationalised the one-off
  half-pixel sizes (9.5/10.5/11.5/12.5/13.5/14.5/17.5px) into the
  `--text-2xs…--text-5xl-*` scale.
- **Phase 2 — size floor, weight, line-height.** Every line-height companion
  snapped to an existing `--leading-*` token. Measured result at the time:
  **1641/1641 nodes on-system, 0 off-system, 0 browser-normal.**

## rg.org line-height, for reference

| role | size | ratio |
| --- | --- | ---: |
| prose | 16px w400 | 1.57–1.63 |
| article h3 | 26px w700 | 1.23 |
| section h2 | 32px w800 | 1.13 |
| h1 | 40px w800 | 1.15 |

Role-driven, not size-driven: prose 1.57–1.63, headings 1.04–1.43, tightening
as type grows. Their prose brackets our `--leading-loose` (1.6) and
`--leading-copy` (1.65), independently confirming our prose tokens.

## The course correction worth keeping

The first cut set line-height companions from rg.org's numbers directly. That
was wrong, and `docs/02-design-language-reference.md` says why: §6 targets
*"rg.org's conventions with NerdWallet's restraint and whitespace… neither
rg.org's utilitarian density"*, and *"the differentiated character lives in
typography"*. Reference 1: *"reference the pattern, not the skin."*

**Typography is the one dimension the brief says should not follow rg.org.**
Seven of the fourteen ratios written were off-system magic numbers — two of them
*tighter* than our own `--leading-heading: 1.2`. All were replaced with tokens.

---

## Resolved since

**The two-register system** — was open here, flagged as "one global scale
applied to both registers, which flattens the distinction `docs/02` §5
requires". Now implemented: `PageShell` sets the block rhythm per register
(editorial 48px / comparison 32px), `EditorialSection` requires an explicit
`register` and renders whitespace vs card accordingly, and every route declares
its register in a `{/* Register: … */}` comment. `tests/a11y/routes.ts` still
tags each route, so the split stays machine-readable.

**Known risk — container reflow.** Every fixed-width container (236px SideNav,
300px rail, comparison-table cells, chip rows) was sized against the old smaller
type, so the `sm` 12→14 bump risked reflowing all of them. Overflow was the
mandatory gate. Verified 2026-08-29 with
`.claude/visual-harness/overflow-check.mjs` — **no horizontal overflow on any of
10 routes at either 1370px (the `--breakpoint-wide` single-column switch) or
390px.** Gate cleared.

## Still open

**Section heading size does not follow the register.** `EditorialSection`
hardcodes `--text-h2` (28px) for both registers, while every hand-rolled
comparison section uses `--text-2xl` (19px). Home therefore renders peer
sections at both sizes. Reviewed 2026-08-29 and **deliberately deferred** — the
direction (converge up on 28px, or make size follow register) is a design call,
not cleanup. Detail in `rg-typography-reference.md`.

**Three components bypass `.heading`** — `ReviewCard`, `Comments` and legal's
closing block render section headings at 15px with default tracking. Possibly
deliberate restraint; not decided.
