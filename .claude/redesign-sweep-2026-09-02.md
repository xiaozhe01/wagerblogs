# Redesign sweep — Home-Redesign-v1 + Rail-Directions-v1

Reviewed 2026-09-02. Companion to `.claude/content-width-reference-2026-09-02.md`,
which holds the measured before/after baseline this sweep argues against.

Canvases live in `~/Downloads/Rg.org design language research (1)/`.

**Note on the canvas `globals.css`:** the design canvases ship their own
stylesheet, which has diverged from `app/globals.css`. Canvas has
`--grid-max-width: 1360px`, `--color-bg-page: #ffffff`,
`--color-text-muted: #666666`, no `--breakpoint-wide`, no brand tokens.
Production has 1560px, `#fbf8f1`, `#656460`, `--breakpoint-wide: 1370px`,
`--color-brand: #1d3b73` and `--color-brand-on-inverted: #7fa3e0`. The
canvases' blue is therefore _already a production token_, not a new colour.
The rest is reconciliation work at build time.

---

## 1. Width math

### 1.1 The redesign fixes the measured inversion — deliberately

Laptop main (856) and desktop main (856) are equal by construction. The
`widthNote` says so: "no inversion at 1440". This directly addresses Finding 1
of the content-width reference (1369px→960, 1370px→730).

### 1.2 The 960 cap depends on `content-box` — production is `border-box`

`shellStyle` sets `maxWidth: 1496px` with `padding: 24px` and no
`box-sizing`, so padding falls _outside_: outer 1544, content 1496,
main = 1496 − 536 = 960. Hence "cap 960 @≥1544".

`app/globals.css` imports Tailwind, whose preflight sets `border-box`
globally. Implemented literally, `max-width: 1496px` gives:

```
band = 1496 − 48 = 1448
main = 1448 − 208 − 280 − 48 = 912   ← not 960
```

**Fix: the declared max-width must be 1544px under border-box.**

### 1.3 The two canvases disagreed (corrected 2026-09-02)

| File                        | Frame      | box-sizing  | main    |
| --------------------------- | ---------- | ----------- | ------- |
| Home-Redesign-v1            | band 1160  | content-box | 856     |
| Rail-Directions-v1 (before) | width 1160 | border-box  | **808** |

Every rail slice was showing a content column 48px narrower than the Home
redesign specifies, making all three rails look proportionally roomier than
they will be.

Corrected in `Rail-Directions-v1.dc.html`: `width` 1160→1208 (border-box,
padding 24 → content box 1160), `scale` 0.6→0.5762 so the 696px frame still
fits. Verified by measurement:

```
1a blog/review   gridW=1208  main=856  rail=280
1b blog/review   gridW=1208  main=856  rail=280
1c blog/review   gridW=1208  main=876  rail=260
```

Screenshot: `.claude/visual-harness/_shots/rail-directions-corrected-856.png`

### 1.4 Token deltas implied

| Token                | Now  | Proposed          |
| -------------------- | ---- | ----------------- |
| `--grid-nav-width`   | 236  | 208               |
| `--grid-rail-width`  | 300  | 280               |
| `--grid-gap-desktop` | 28   | 24                |
| `--grid-max-width`   | 1560 | 1544 (border-box) |
| `--breakpoint-wide`  | 1370 | 1440              |

### 1.5 Before / after

| Viewport | main now |              main proposed | Δ       |
| -------: | -------: | -------------------------: | ------- |
|     1024 |      960 | 672 _if 2-col starts here_ | −288    |
|     1280 |      960 |                        856 | −104    |
|     1440 |      800 |                        856 | **+56** |
|    ≥1544 |      920 |                        960 | +40     |

Empty gutter at 1280 goes **25% → 5.6%**. That is the measured problem being
solved; the 104px of main is the price.

---

## 2. Breakpoint ladder (the spec the canvases don't carry)

The `.dc.html` files switch layout via discrete JS toggles
(mobile 375 / tablet 834 / laptop 1280 / desktop 1440), so the real switch
points are invisible. Two of them are load-bearing:

- **The nav must appear at exactly 1440.** At today's 1370, desktop band =
  1322 → main = 786, which reintroduces a 70px inversion against laptop's 856.
- **2-col must not start below ~1208.** In 2-col mode main is `vw − 352`, so
  at 1024 it would be **672** — worse than today by 288px.

### Ladder A — monotonic, plateau 856 (recommended)

| Range     | Mode                           | Band             | main               |
| --------- | ------------------------------ | ---------------- | ------------------ |
| <768      | single, top header, rail below | vw − 32          | vw − 32            |
| 768–1023  | single, top header, rail below | vw − 40, cap 856 | min(vw−40, 856)    |
| 1024–1207 | single, top header, rail below | vw − 48, cap 856 | 856                |
| 1208–1439 | 2-col: main + rail             | min(vw−48, 1160) | 856                |
| 1440–1543 | 3-col: nav + main + rail       | vw − 48          | vw − 584 (856→960) |
| ≥1544     | 3-col, capped                  | 1496             | 960                |

Continuity check at every seam:

```
 896 single   main 856
1207 single   main 856
1208 2-col    main 1160 − 304 = 856   ✓ seamless
1439 2-col    main 856
1440 3-col    main 1392 − 536 = 856   ✓ seamless
1544 3-col    main 1496 − 536 = 960   ✓ plateau
```

**main is monotonically non-decreasing across the entire range.** No
inversion anywhere.

Implementation values (all border-box):

- single-column cap: **856px** (replaces the current 960px `max-w-240`)
- 2-col wrapper: `max-width: 1208px` → content 1160
- 3-col wrapper: `max-width: 1544px` → content 1496
- breakpoints: `md: 768`, `lg: 1024`, **new `rail: 1208`**, `wide: 1440`

Cost: main drops 960→856 in the 1024–1207 band. Gain: the rail arrives at
1208 instead of 1370, and 1280's dead gutter collapses.

### Ladder B — constant 960 (alternative)

Single cap 960 through 1311; 2-col from 1312 (`max-width: 1312`, band 1264,
main 960); 3-col from 1544 (band 1496, main 960). main is 960 everywhere
above ~1008 — the simplest possible rule, one measure sitewide.

Rejected as primary because 1280 stays single-column with its ~25% dead
gutter, which is the thing the redesign set out to fix.

---

## 3. Rail direction — on choosing 1a + 1c

Current rail cards use the shared `.card` shell:
`1px solid var(--color-border-divider)`, `--radius-md` (8px), per-module
boxes, across all ten components in `components/rail/`.

**The "matches our current implementation" rationale supports 1c, not 1a.**
1c is bordered compact cards — that is today's build (at 6px rather than 8px
radius). 1a is a single continuous sunken panel with rule-separated modules
and _no per-card borders_; adopting it means every rail component drops its
`.card` wrapper for a new shared module treatment. That is a real refactor.

Three open issues with the split:

1. **Rail widths differ.** 1a is 280, 1c is 260 → main 856 on editorial vs
   876 on comparison. Measured today: main is identical across all four
   routes regardless of register. This would introduce a 20px
   register-dependent variance. Normalise to one width.
2. **Home has no answer.** `tests/a11y/routes.ts` classes `/` as `mixed` —
   both registers, one rail. Home-Redesign's own rail is neither 1a nor 1c;
   it is the current treatment, labelled "colour-ported only".
3. **1c is the canvas's own declared foil** ("product, not publication"),
   on a canvas titled "Rails that belong to a publication, not a template".
   Picking it is a legitimate migration-cost call, but it is the option that
   moves least on the axis the exercise was set up to test.

---

## 4. Home redesign — the four changed areas

**Hero / header.** h1 is 30px desktop against `--text-5xl-desktop: 44px`.
The Blog-Post h1 in Rail-Directions is 48px — so the homepage hero would
render _smaller than an article title_, inverting the usual hierarchy.
Confirm intent; the token needs updating either way.

**Latest news.** 1.5fr/1fr at gap 32 → lead 494, stack 330. Small cards net
220px of text beside a 96px thumb at 17px serif — 3–4 lines for the
placeholder headlines. Tight; test against the longest real headline.
`thumbSide` (`right`/`left`) is still an unresolved prop.

**Blog.** Geometry is fine at 856 (414/414 lead, 269 three-up). Three aspect
ratios now coexist on one page: 16:9 news lead, 4:3 blog lead, 16:9 blog
small.

**Betting toolbox.** Likely oversight: it stays `repeat(4, 1fr)` at tablet
while `methodGrid` and `bonusGrid` both step to 2. At 834 that is 168px
columns with a 12.5px description — about four lines each. `blogSmallGrid`
also holds 3-up at tablet, but 249px survives; the toolbox does not.

**Half-pixel type.** The canvases reintroduce 9.5 / 10.5 / 11.5 / 12.5 /
13.5 / 15.5 / 17.5px throughout. `globals.css` inconsistency #1 explicitly
rationalised these into the `--text-*` scale. Implementing literally undoes
that.

---

## 5. Blockers

**Contrast — `#999` on `#fbf8f1` is 2.69:1.** AA needs 4.5:1. The production
text ramp bottoms out at `--color-text-muted: #656460` (5.58:1); there is no
token as light as `#999`. The canvases use it at 9.5–11px for the 21+ / T&Cs
small print — smallest type, lowest contrast, most compliance-sensitive copy.
`#6a6a6a` should also resolve to `#656460`.

**Mixed placeholder convention.** `[26]`, `[1–3 days]`, `[Aug 30]` are
bracketed; scores are bare — `9.4`, `9.2`, `Betting 9.2 · App 9.4`, and
"Highest overall score for the third month running." Not a rule-3 violation
on a canvas, but bare realistic scores should not be inherited into the build.

**Semantics.** Search fields are `div`s with placeholder text. Fine on a
canvas; must not survive to build — the a11y suite is green at 25/0/1.

---

## 6. Compliance — passes

- **Rule 5** (one primary per ranked list): correct throughout —
  `primary: true` on rank 1 only in `topSites`, `topCasinos`, `bonusOffers`
  and the compare table; competitors get `#nofollow`.
- **Rule 1** (Tier 1 never links to primary domain): Blog-Post rails link
  only internally to `Reviews.dc.html`; `#primary-domain` appears only on
  Review-Post (Tier 2/3).
- **Rule 3** (no fabricated trust signals): the content-integrity gates are
  the strongest part of the Home file — `EditorialByline` ships as _absent
  from the DOM_ with no anonymous fallback, and uncited `SourcedStat` figures
  are dropped rather than filled.
