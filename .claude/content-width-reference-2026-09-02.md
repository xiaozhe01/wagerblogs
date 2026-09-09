# Content-width reference — wagerblogs vs. The Athletic

Measured 2026-09-02. Read-only measurement pass, taken to support a redesign
brief. All figures are live-rendered `getBoundingClientRect()` values from
headless Chromium at `deviceScaleFactor: 1`, not CSS declarations.

Scripts are not kept in-repo (they lived in the session scratchpad, consistent
with the rg.org harness that produced `rg-typography-reference.md`). Method is
documented below well enough to reproduce.

## Method

- Chromium headless, viewport heights 900px, no device scale factor.
- wagerblogs measured against `localhost:3000` (`next dev`), routes `/`,
  `/blog/how-odds-boosts-actually-work`, `/reviews/peakwager`, `/about`.
- The Athletic measured against `https://www.nytimes.com/athletic/` (index)
  and one article URL.
- No layout scrollbar was present at any width — measured `clientWidth`
  equalled the nominal viewport at every step, and the geometry closes exactly
  (e.g. 96 + 1248 + 96 = 1440). macOS overlay scrollbars behave the same way,
  so these are representative.
- Both sites measured the same way, so the comparison is like-for-like.

**Correction to a prior note:** The Athletic does _not_ block automated
fetching. It returns 200 to plain curl with a browser UA, and plain
`chromium.launch()` (headless, no `channel: "chrome"`) renders the complete
page. Two overlays appear — a US-edition notice and a subscription modal — but
both are positioned layers and do not affect measured geometry.

## The Athletic — index page (`/athletic/`)

One container does all the work: `max-width: 1248px`, `padding: 0 24px`,
centered. Ink width therefore caps at **1200px**.

| Viewport | Band (ink) | Editorial col | Right rail | Edge→band |  Edge→ink |
| -------: | ---------: | ------------: | ---------: | --------: | --------: |
|     1440 |   **1200** |           900 |        300 |   96 / 96 | 120 / 120 |
|     1280 |   **1200** |           900 |        300 |   16 / 16 |   40 / 40 |
|     1024 |    **976** |           732 |        244 |     0 / 0 |   24 / 24 |

The 1248px cap binds at 1440 _and_ 1280 — at 1280 it still spends 1200 of 1280. Below ~1296px the container goes edge-to-edge on its 24px padding.
Widest teaser prose: 600px at 1440/1280 (they run 2-up 600px columns inside
the 1200 band), 651px at 1024.

## The Athletic — article template

The truer analogue for our Tier 1 editorial register.

| Viewport | Prose column | Left gutter | Right gutter |
| -------: | -----------: | ----------: | -----------: |
|     1440 |      **722** |         359 |          359 |
|     1280 |      **722** |         279 |          279 |
|     1024 |      **722** |         151 |          151 |

**722px, fixed and centered, at every width.** The article measure does not
respond to viewport at all — only the gutters flex.

Caveat: the article renders paywalled (detected on all three runs). The
visible paragraphs render in the real template column, so the 722px is
trustworthy, but it was measured on a truncated article.

## wagerblogs — current state

Identical across all four routes tested. Editorial vs. comparison register
makes **no difference** to column width. `main` has zero padding, so its box
width is its ink width — directly comparable to The Athletic's ink figures.

| Viewport | Band |  `main` | Rail | Nav | Edge→`main` | Truly empty |
| -------: | ---: | ------: | ---: | --: | ----------: | ----------: |
|     1440 | 1392 | **800** |  300 | 236 |   288 / 352 |     24 / 24 |
|     1280 |  960 | **960** |    — |   — |   160 / 160 |   160 / 160 |
|     1024 |  960 | **960** |    — |   — |     32 / 32 |     32 / 32 |

The asymmetric 288/352 at 1440 is track math, not a centering bug:
left = 24 gutter + 236 nav + 28 gap; right = 28 gap + 300 rail + 24 gutter.

### Layout tokens behind these numbers

From `app/globals.css`:

```
--breakpoint-wide:    1370px
--grid-max-width:     1560px
--grid-nav-width:      236px
--grid-rail-width:     300px
--grid-gap-desktop:     28px
--spacing-container-desktop: 24px
```

Shell is `max-w-240` (960px) below `wide:`, and a
`236px / 1fr / 300px` grid at and above it.

## Finding 1 — the breakpoint inverts the content column

Measured across the `wide:` (1370px) boundary on `/`:

| Viewport |  `main` | Mode          |
| -------: | ------: | ------------- |
|     1360 |     960 | single column |
|     1369 | **960** | single column |
|     1370 | **730** | 3-col grid    |
|     1371 |     731 | 3-col grid    |
|     1400 |     760 | 3-col grid    |
|     1440 |     800 | 3-col grid    |

**One pixel of extra viewport width costs 230px of content width** — a 24%
drop, at the moment the layout "upgrades" to three columns.

## Finding 2 — `main` never recovers

| Viewport | Band |  `main` |
| -------: | ---: | ------: |
|     1500 | 1452 |     860 |
|     1560 | 1512 | **920** |
|     1600 | 1512 |     920 |
|     1920 | 1512 |     920 |
|     2560 | 1512 |     920 |

`--grid-max-width: 1560px` caps the band at 1512px, so `main` ceilings at
**920px** (1512 − 236 − 300 − 56). It never returns to the 960px it has in
single-column mode below 1370px.

**`main` is at its widest on the narrowest desktop.** Every viewport ≥1370px
gives less content width than a 1369px one.

## Finding 3 — the gap, like for like

Editorial column, index page:

| Viewport | Athletic | wagerblogs | Delta             |
| -------: | -------: | ---------: | ----------------- |
|     1440 |      900 |        800 | **−100px (−11%)** |
|     1280 |      900 |        960 | **+60px (+6.7%)** |
|     1024 |      732 |        960 | **+228px (+31%)** |

wagerblogs is **not uniformly narrower**. It is behind only at 1440, and is
wider at both smaller widths. Against the _article_ template (722px fixed),
wagerblogs' `main` is wider at every measured width.

## Finding 4 — whitespace ratio

"Empty" for wagerblogs at 1440 excludes the nav (236px) and rail (300px),
which occupy the gutter — genuinely empty space is only 24px gutter + 28px
gap per side.

| Viewport |      Athletic empty |  wagerblogs empty |                                      |
| -------: | ------------------: | ----------------: | ------------------------------------ |
|     1440 | 240px (16.7% of vw) |      104px (7.2%) | wagerblogs uses more of the viewport |
|     1280 |         80px (6.3%) | 320px (**25.0%**) | wagerblogs leaves 4× more empty      |
|     1024 |         48px (4.7%) |       64px (6.3%) | near parity                          |

**1280 is the outlier.** wagerblogs drops below `wide:`, collapses to the
960px single column, and leaves 320px genuinely empty — while The Athletic is
still spending 1200 of the same 1280. This is the measurement behind the
"constrained" feel, and it is a _breakpoint artifact, not a max-width one_.

## Structural note

At 1440 wagerblogs' total band (1392) is **wider** than The Athletic's (1200).
The difference is allocation: 264px (236 nav + 28 gap) goes to a persistent
left side-nav that The Athletic does not have at all — they use a top header
and spend the recovered width on content. That is what pushes `main` to 800.

## Not measured

- The Athletic's mobile viewports (their black theme is mobile-only — see
  the external-design-sites memory).
- Whether their 722px article measure changes on a non-paywalled article.
- Any wagerblogs viewport below 1024px.
