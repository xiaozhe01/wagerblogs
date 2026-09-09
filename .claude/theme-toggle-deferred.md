# Light/dark theme toggle — scope and build record

**Status: IN PROGRESS since 2026-08-31.** Was parked; the park was then
overridden as a deliberate call, not because the reasoning below was wrong.
Phases 0 and 0.5 are done. The sections below are the standing scope — do not
re-derive them.

Build order: 0 token rename · 0.5 invariant guard · 1 dark token set ·
2 toggle · 3 RG inversion · 4 pending states · 5 interactive states ·
6 doubled a11y suite. Each gated on the previous passing.

## Why it had been parked (the risks are still live)

These were the deferral reasons. Overriding the park does not retire them —
reasons 2 and 3 are the phases most likely to surface a blocker.

1. **The light baseline was not settled when the estimate was made.**
   The dark estimate was built assuming warm-light was live; it wasn't —
   globals.css still read `#ffffff`/`#fafafa`. Dark values are chosen for
   perceptual symmetry with the light ones, not independently, so every
   contrast pair would have been computed twice. That specific reason is now
   resolved (warm-light is live), but it is why the estimate was wrong.

2. **Empty-state semantics are about to change under CMS.** 13 components
   render pending/empty states today _because there is no real data_. Once
   Payload lands, most become rare or unreachable on live routes. This is the
   strongest remaining reason to wait, because the pending states are also the
   single hardest part of dark mode — see "The one part that isn't a recolour".

3. **The blog body is the largest untested dark surface.**
   `@tailwindcss/typography` is deferred (see `typography-plugin-migration.md`);
   Lexical emits bare HTML and the prose rules don't exist yet. `/blog/[slug]`
   is the longest reading surface on the site and the one where dark mode's
   readability claim is actually cashed. Build the ramp first and the article
   body gets themed twice.

## The mechanism is free — this is not why it's parked

Verified against the compiled CSS, not the source: every colour utility
compiles to a `var()` reference, and all project tokens are defined once in a
single `:root, :host` block.

```css
.text-text-primary {
  color: var(--color-text-primary);
}
```

Zero hardcoded hex in `components/` or `app/`. So `.dark { --color-*: … }` on
`<html>` repaints the whole site without touching one component file.

**Hazard when it is picked up:** `@custom-variant dark` (globals.css top) and
shadcn's full `.dark` block (globals.css bottom) already exist. Adding
`class="dark"` to `<html>` today flips shadcn's 28 variables — button, input,
textarea, breadcrumb, navigation-menu, pagination — while every project token
stays light. Half-dark site on the first commit. The two blocks must land
together.

## Tracked debt — colour rules that assume a light ground

Marked in-source with `TODO(theme)`. All four are light-mode debt _today_
(they are simply invisible because the dark blocks have almost no focusable
children); none is a live a11y failure.

| Site                            | Rule                                                                                                                                 | Dark status                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| `app/globals.css`               | `.btn-primary` / `.btn-secondary` / `.btn-brand` / `.editorial-link-card` `:focus-visible` — `outline: 2px solid var(--color-brand)` | 1.6:1 on a dark surface. **WCAG 1.4.11 blocker**, not optional                      |
| `app/globals.css`               | `.chip-active` — `color-mix(in srgb, var(--color-brand) 10%, transparent)`                                                           | 10% navy over near-black ≈ invisible; needs a higher mix or `--color-brand-on-dark` |
| `components/layout/SideNav.tsx` | active nav state — `text-brand font-semibold`, on **both** `NavigationMenuTrigger` and `NavigationMenuLink`                          | navy on dark, same failure                                                          |
| `app/globals.css`               | `.btn-primary` — `#111` fill means "this link leaves the site for an operator"                                                       | on a near-black page the whole semantic collapses                                   |

`.btn-brand-on-dark:focus-visible` already carries the override
(`outline: 2px solid var(--color-text-on-dark)`). **That is the model the other
four should copy** — the fix exists, it needs generalising.

## Phase estimate (as scoped, still valid)

| Phase             | Size                                | Note                                                                                                                                                                                                             |
| ----------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dark token set    | 1–2 sessions                        | ~14 genuine new colour decisions, ~8 "on-dark" re-decisions. Accent is nearly free: `--color-brand-on-dark` `#7fa3e0` is already verified at 6.81:1 on `#1a1a1a`                                                 |
| Toggle mechanism  | ~half a session                     | `next-themes` (not installed). `app/layout.tsx` has **no providers at all** — this introduces the first client boundary. Control has no home: SideNav and rail are both desktop-only, so it goes in `SiteFooter` |
| RG-card exception | trivial CSS, a session of judgement | `.card-dark` already opts out for free — that's the problem, not the solution (dc.html §4a: 1.7:1 interruption vs 100:1 today)                                                                                   |
| Re-verification   | 2–3 sessions                        | `tests/a11y/routes.ts` 11 routes → 22, and it needs a theme fixture, not a config flag                                                                                                                           |

**Total: medium-to-large, ~5–7 sessions.** Not large architecturally — large in
the "every colour decision gets re-litigated once" sense.

**No CMS conflict found.** No theming in the Payload schema; none of the three
dark surfaces is CMS-driven (`helplineNumber` and the RG copy come from
`lib/mock-data.ts` as _text_). The exception is a render-layer class Payload
never sees. But docs/04 Phase 6 ("Trust pages + integrity gates") will rewrite
those components' content — doing the theme exception first means touching them
twice.

## The one part that isn't a recolour

`--color-border-placeholder` is chosen to read as **deliberately absent** on a
light ground. On a dark ground the same value reads as a _filled_ field. Same
for `.placeholder-asset`'s gradient.

Everywhere else "quieter" means "lower contrast" and inverts cleanly with the
palette. For a pending state it does not: quiet on paper is a light grey; on
near-black, a light grey is loud. **That visual language needs re-designing,
not re-measuring** — and it is exactly what CMS is about to change the meaning
of. This is the crux of reason 2 above.

## Ramp asymmetry to expect

The light ramp cost a session to prove **only one tier fits below `text-body`**
(usable band 1.42:1 wide). Dark inverts that — the band below body on a
near-black page is wider, so a dark ramp may support five tiers where light
supports four. The token names are shared, so one theme ends up with a wasted
step or a doubled value. Design decision, not arithmetic.

## Warm-light, as shipped (2026-08-31)

Landed in two passes: backgrounds/borders first, then the ink. `bg-card`
tracks `bg-page` as it did at `#ffffff` — cards are defined by their border,
not by a lift.

### Pass 2 — warm ink and the safety strip

The first pass warmed the ground but left every neutral at **chroma exactly
0.0000** — all four text tiers, both dark blocks, both dark borders, both
on-dark texts. A hueless black belongs to no family and reads _cold_ against
warm paper by simultaneous contrast. That is invisible to contrast testing,
which is luminance-only.

All thirteen re-hued to the paper's 87.5°, solved to hold WCAG relative
luminance exactly (ΔY ~1e-17, max contrast drift 0.037 — no WCAG level can
change, which is why the table below is still accurate):

```
--color-text-primary          #111111 -> #12110e   --color-bg-accent        #111111 -> #13110b
--color-text-strong-secondary #333333 -> #343330   --color-bg-accent-hover  #2a2a2a -> #2d2a23
--color-text-body             #555555 -> #565551   --color-bg-dark-block    #1a1a1a -> #1c1a14
--color-text-muted            #646464 -> #656460   --color-border-dark      #333333 -> #36332c
--color-text-on-dark          #eeeeee -> #f1eee5   --color-border-on-dark   #333333 -> #36332c
--color-text-on-dark-muted    #bbbbbb -> #bebbb3   --color-text-on-accent   #ffffff -> #fffdf7
```

Text carries less chroma (0.006) than the blocks (0.012) on purpose:
perceived chroma scales with area, and 0.012 on 14px type starts reading
sepia. `--color-bg-accent-active` stays `#000000` — pure black takes no
chroma without losing luminance.

**New token `--color-bg-safety: #1d3b73`**, used by the footer RG strip only
([SiteFooter.tsx:14](../components/layout/SiteFooter.tsx)). Three reasons, in
order of weight:

1. `--color-bg-accent` is also `.btn-primary`'s fill plus two avatar circles
   and a badge. Repointing it would have turned every operator CTA navy —
   docs/02 §6. The strip needed its own token, not a redefinition.
2. `#111` over `#1a1a1a` was **1.08:1** — the footer's two blocks read as one
   700px wall. Navy over warm-black is 1.59:1, two distinct blocks.
3. It _strengthens_ the button system. A 250px black slab on every route was
   diluting "black means this link leaves the site for an operator" far more
   than any button was.

All AAA: banner text 10.72, Get Help fill 10.28, its navy label 10.28, focus
ring 9.40.

**The navy itself was left alone.** It sits 174° from the paper —
near-complementary, which is what makes an accent read as an accent; cream and
navy is a settled editorial pairing. It felt unrelated because it was
underused (small text and a 10% chip tint, never a surface), not because it
was wrong. Giving it the strip fixed that.

**The three RG cards on `/responsible-gambling` stay black** — contextual
emergency interrupts on two routes, versus boilerplate on all ten. The dc.html
§4 distinctiveness argument only protects the contextual ones.

### Pass 1 — ground

Deviation from the colour-system brief: brief gave `--color-text-muted:
#6a6a6a`; kept `#646464`. `#6a6a6a` is _lighter_ than the shipped value, which
is the wrong direction once the ground darkens — it drops muted to 4.64 on
`bg-subtle` and 4.16 on `bg-subtle-active` (under AA). `#6a6a6a` was the
comparison document's own page chrome, sitting on `#e8e1d1`, a surface this
site does not have.

Border tokens were warmed to hold their previous ratio against the page
(divider 1.28 vs 1.27, hairline 1.14 vs 1.14) — a neutral grey rule on warm
paper reads cool.

Measured after the swap; every pair holds its previous WCAG level:

```
text        page/card(#fbf8f1)  subtle(#f3ede0)  subtle-active(#e9e1cf)
primary      17.80 AAA           16.19 AAA        14.51 AAA
strong       11.91 AAA           10.83 AAA         9.71 AAA
body          7.03 AAA            6.39 AA          5.73 AA
muted         5.58 AA             5.07 AA          4.55 AA
brand        10.28 AAA            9.35 AAA         8.38 AAA
```

Net gain: `page→subtle` separation went **1.04 → 1.10**, so subtle panels
actually read as panels. Largest single loss is `primary on subtle-active`,
16.57 → 14.51 — irrelevant at those levels.

Deleted as dead in the same pass (definition-only, zero call sites):
`--color-bg-placeholder-a`, `--color-bg-placeholder-b`,
`--color-bg-wireframe-backdrop`. Their values lived on as literals inside
`--background-image-placeholder-asset`, which has 6 live call sites and was
warmed separately.

## Related

- `.claude/repo-status.md` — open small items
- `.claude/typography-plugin-migration.md` — the blog-body prose work this is sequenced behind
- `.claude/mobile-touch-audit-2026-08-28.md` — M-1 hover gating, unrelated but also colour-adjacent
