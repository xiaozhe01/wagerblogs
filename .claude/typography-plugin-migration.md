# Article body → @tailwindcss/typography — migration reference

**Status: not started.** The plugin is deliberately not installed yet. Written 2026-08-29 as the reference for wiring
`@tailwindcss/typography` once PayloadCMS is supplying article bodies.

Scope: the long-form article body only — `app/blog/[slug]/page.tsx` today, plus
any future route that renders CMS richtext (news posts, guides, author bios).
Nothing else on the site needs it.

---

## 1 · Why this is needed at all

Payload's Lexical richtext serializer emits **bare HTML with no `className`**:

```html
<p>…</p>
<h2>…</h2>
<ul>
  <li>…</li>
</ul>
<blockquote>…</blockquote>
```

Before the 2026-08-29 pass, the blog template styled every one of those
elements with per-element utilities — 17 margin utilities across 13 CMS-owned
elements. All 17 would have evaporated the moment real content flowed in,
leaving unstyled text. **Any styling that must survive the CMS has to live on
an ancestor container, not on the elements themselves.**

That is the whole argument for the plugin. It is not a preference.

---

## 2 · What the interim pass already did

The blog template was reworked so the container owns the rhythm as far as
utilities allow. Current state, measured at 1440px:

```
prose parent row-gap: 32px
  p            18px  mt  0 mb  0   realGap  32
  h2           28px  mt 24 mb  0   realGap  56
  p            18px  mt  0 mb  0   realGap  32
  ul           16px  mt  0 mb  0   realGap  32
  blockquote   19px  mt  0 mb  0   realGap  32
  h3           19px  mt 16 mb  0   realGap  48
```

- Parent is `flex flex-col gap-5` (32px) and owns every inter-block gap.
- Body elements carry **zero** margin.
- Headings carry **one** top margin each (`mt-4` = 24px, `mt-3` = 16px) — the
  extra step above a heading. Nothing sets spacing from two sides.
- 17 margin utilities → 4.

**These are the numbers the plugin must reproduce.** They are the migration's
acceptance criteria.

Also settled in that pass, and not to be re-litigated:

| Decision     | Value                                            | Why                                                                                                                                               |
| ------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Body size    | `--text-article: 18px` / `--leading-copy` (1.65) | 16px measured 83 CPL; 18px gives 77. Standard band is 60–75.                                                                                      |
| Article `h2` | `--text-h2` (28px)                               | Was `text-3xl` (22px) — the only route not using the sitewide editorial h2.                                                                       |
| Measure      | `max-w-prose` (65ch → 655px)                     | Unconditional on purpose: inert below ~700px viewport, clamps above. Self-limiting, not redundant.                                                |
| Alignment    | left, one edge                                   | Breadcrumb, h1, body and Related reading all at L0. Centred-header variant was measured and rejected — it breaks the axis at the byline (see §5). |

---

## 3 · The install

```bash
npm i -D @tailwindcss/typography
```

Tailwind v4 loads plugins from CSS, not from a config file. In
`app/globals.css`, after the existing `@import` lines:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@plugin "@tailwindcss/typography";
```

---

## 4 · The overrides — and the trap

The plugin ships its own type scale, colours and spacing. **None of it maps to
this project's tokens.** Two specific hazards:

**a. The `--spacing-1..8` override.** This project names the spacing scale
`4/8/16/24/32/40/48/60px`, which shadows Tailwind's numeric scale. So
`prose-h2:mt-4` is **24px**, not 16px. Every `prose-*:mt-N` / `mb-N` modifier
in the list below is in _project_ units. Verify against
`.claude/visual-harness/_blog-rhythm.mjs` after wiring, do not assume.

**b. `max-w-prose` vs `prose`'s own max-width.** The plugin sets
`max-width: 65ch` on `.prose` itself. That collides with the existing
`max-w-prose` on the `<article>`. Keep the measure on the `<article>` and
neutralise the plugin's with `max-w-none` on the prose container, or the two
compound unpredictably when font-size changes.

Target markup:

```tsx
<article aria-labelledby="post-title" className="w-full max-w-prose flex flex-col gap-5">
  <header>…</header>
  <ArticleByline … />
  <figure>…</figure>

  <div
    className="
      prose max-w-none
      prose-p:text-article prose-p:text-text-strong-secondary
      prose-headings:font-bold prose-headings:text-text-primary
      prose-headings:tracking-[-0.015em]
      prose-h2:text-h2 prose-h2:leading-heading prose-h2:mt-4 prose-h2:mb-0
      prose-h3:text-2xl prose-h3:leading-heading prose-h3:mt-3 prose-h3:mb-0
      prose-li:text-article
      prose-a:text-text-body prose-a:underline prose-a:underline-offset-2
      hover:prose-a:text-text-primary
      prose-blockquote:text-2xl prose-blockquote:italic
      prose-blockquote:border-l-2 prose-blockquote:border-text-primary
      prose-figcaption:text-xs prose-figcaption:text-text-subtle
    "
    dangerouslySetInnerHTML={{ __html: post.bodyHtml }}
  />
</article>
```

The plugin's own `> * + *` spacing replaces the current `flex flex-col gap-5`
on that div, so the `gap-5` comes off when the plugin goes on. The `mb-0` on
headings is required — the plugin sets a bottom margin and the interim design
deliberately has none.

**Honest assessment of the cost:** that modifier list is long enough that it is
worth re-comparing against the alternative below before committing to it.

---

## 5 · The alternative that was recommended and not chosen

A project-owned `.article-body` class in the existing `@layer components`:

```css
@layer components {
  .article-body {
    > * + * {
      margin-top: var(--spacing-5);
    }
    h2 {
      font-size: var(--text-h2);
      line-height: var(--leading-heading);
      margin-top: var(--spacing-6);
    }
    h3 {
      font-size: var(--text-2xl);
      margin-top: var(--spacing-4);
    }
    p,
    li {
      font-size: var(--text-article);
      line-height: var(--leading-copy);
    }
    blockquote {
      border-left: 2px solid var(--color-text-primary);
      padding-left: var(--spacing-4);
    }
  }
}
```

Advantages: no dependency, uses the project's own tokens directly so the
`--spacing-1..8` trap never applies, one place to tune, and the JSX carries a
single class instead of fifteen modifiers.

Disadvantage: hand-maintained; the plugin covers `table`, `code`, `hr`, `kbd`,
nested lists, and `figcaption` out of the box, and this does not.

Decision on 2026-08-29 was to go with the plugin. This section exists so the
trade-off is on record rather than re-derived.

---

## 6 · Verification

Run after wiring — the numbers in §2 are the pass condition:

- `.claude/visual-harness/_blog-rhythm.mjs` — prose child margins + real gaps
  at 1440px. Every body element must read `mt 0 mb 0`; headings `mt 24 / mt 16`.
- `.claude/visual-harness/_blog-audit.mjs` — font size, line-height and CPL
  across six viewports. Body must stay 18px and CPL in the 60–80 band.
- `.claude/visual-harness/_prose-crossover.mjs` — where `max-w-prose` engages.
  Expect inert ≤640px, clamping from ~700px.
- `.claude/visual-harness/main-audit.mjs http://localhost:3000 /blog/sample-post`
  — `<main>` children must stay at 0 outer-spacing violations.

---

## 7 · Open, not decided

**The 1024–1280px band.** With sidenav and rail both `wide:`-only (≥1370px),
the column opens to the full 960px there while the article stays at 655px —
305px of dead space down the right. It is the widest slack anywhere on the
route and the likely source of the "too narrow on a big screen" complaint.

Two candidates, neither applied:

1. Centre the article below `wide:` (`mx-auto wide:mx-0`) — 152px each side.
   Standard for bare single-column layouts. Cost: the breadcrumb stays at L0
   while the article starts at L152, breaking the single left edge.
2. Narrow the single-column shell from `max-w-240` (960px) toward ~760px in
   that band. Keeps one left edge for everything, but touches `PageShell` and
   therefore every route.

Recommendation was (2). Needs a decision before the plugin work starts, since
it changes what the measure is being tuned against.
