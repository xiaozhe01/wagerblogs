# SEO backlog — 2026-09-08

Resume point for the next SEO pass. Everything below was measured against a
production build (`npx next build && npx next start -p 4321`), not inferred.
Do not re-derive the "already shipped" section.

---

## Already shipped (2026-09-08) — do not redo

| element                 | state                                                                                                                                                                                                                                                                                                                            |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/sitemap.ts`        | 50 URLs, **every one verified 200**. Built from `newsSections` / `reviewGroups` / `categories` / `blogPosts` / `legalDocs` / `mockAuthor`, i.e. the same registries `generateStaticParams` resolves from, so it cannot list a route the router 404s. Excludes `/login`, the 404 route, and all `?page=` / `?type=` permutations. |
| `app/robots.ts`         | serves `/robots.txt`, points at the sitemap. **See item 2 — the Disallow block is probably wrong.**                                                                                                                                                                                                                              |
| `app/llms.txt/route.ts` | serves `/llms.txt`, `text/plain`, ~4.3KB, generated from the same registries. A route handler (not `public/llms.txt`) so it cannot drift.                                                                                                                                                                                        |
| `metadataBase`          | `new URL(siteUrl)` in `app/layout.tsx` — required for absolute canonicals and sitemap entries.                                                                                                                                                                                                                                   |
| canonical               | every route, static and dynamic. Verified absolute on `/`, `/about`, `/faq`, `/news/football`, `/reviews/sportsbooks/peakwager`, `/blog/[slug]`, `/legal/[doc]`, `/authors/[slug]`.                                                                                                                                              |
| meta description        | all 18 routes (was missing on 5).                                                                                                                                                                                                                                                                                                |
| JSON-LD                 | `WebSite` sitewide · `BreadcrumbList` every route except `/` (correct) · `FAQPage` on `/faq` emitting **4 of 7** entries · `Review` correctly emitting **0** blocks while the reviewer is a placeholder.                                                                                                                         |

Verification one-liners kept for reuse:

```bash
# every sitemap URL resolves
curl -s localhost:4321/sitemap.xml | grep -o '<loc>[^<]*' | sed 's/<loc>//'
# canonical on a route
curl -s localhost:4321/faq | grep -o '<link rel="canonical" href="[^"]*"'
# which og/twitter tags a route emits
curl -s localhost:4321/faq | grep -oE '<meta (property|name)="(og|twitter):[^"]+" content="[^"]{0,60}'
```

---

## 1. Every page shares the site's `og:title` / `og:description` — DEFECT

**Evidence.** `/faq` renders `<title>FAQ — WagerBlogs</title>` but
`og:title` is `"WagerBlogs"`, and `og:description` is the site-level string.
Same on every route. Every social share of a review, a story, or the FAQ
produces an identical card.

**Cause.** `app/layout.tsx` sets `openGraph.title` and `openGraph.description`
explicitly. Next only derives those from a page's own `title`/`description`
when the parent has **not** set them; children inherit the explicit parent
values instead.

**Fix.** Delete `title` and `description` from the `openGraph` block in
`app/layout.tsx`, keeping `type` and `siteName`. Then re-check a few routes
with the og one-liner above — each should show its own title.

**Do not** re-add them "for safety"; that is what caused this.

---

## 2. `robots.txt` Disallow is probably the wrong call — DEFECT (self-inflicted)

`app/robots.ts` currently ships:

```
Disallow: /*?*type=
Disallow: /*?*news=
Disallow: /*?*region=
Disallow: /*?*page=
```

Added for crawl budget. The problem: those URLs are internally linked (filter
chips, `PageNav`), and blocking them means Google cannot fetch them and so
cannot read the canonical that would consolidate them — the standard route to
"Indexed, though blocked by robots.txt" with no snippet.

**Fix.** Remove the four Disallow lines and let the canonical do the
consolidating; every filtered/paginated route already canonicalises to its
unfiltered self. Keep the `Sitemap:` line.

Revisit a Disallow only if crawl logs later show real budget waste, and prefer
`robots: { index: false, follow: true }` metadata on the variant pages over a
robots.txt block, since that is readable by the crawler.

---

## 3. No favicon anywhere — highest value remaining

`/favicon.ico` returns **404**; there is no `app/icon.*`, `app/apple-icon.*`.
Google renders a favicon beside every mobile result, so the site currently
shows a generic globe, and every browser page load makes a 404 request.

**Fix.** Add `app/icon.svg` (Next serves it as the tab and search icon and
generates the `<link rel="icon">`). Optionally `app/apple-icon.png` at 180×180.

Constraint: the icon is brand identity, not a trust signal — a plain wordmark
glyph is fine and does not touch CLAUDE.md rule 3.

---

## 4. No `og:image` / `twitter:image` — count is 0 sitewide

Shares render as bare text cards. `app/layout.tsx` already carries a
`TODO(cms)` for per-route OG images.

**Fix.** `app/opengraph-image.tsx` generates one at build time from the route's
title, so this does **not** need to wait on a design asset. Add a matching
`app/twitter-image.tsx` or let Twitter fall back to `og:image`.

Constraint: the generated card may show the page title and the wordmark only.
It must not render a score, a rating, a star row, or a badge — those are the
trust signals rule 3 forbids while the data is placeholder.

---

## 5. No RSS/Atom feed

Standard for a publication with a newsroom, and a real discovery channel.

**Fix.** `app/feed.xml/route.ts` (same shape as `app/llms.txt/route.ts`),
built from `newsSections` and `blogPosts`. Add
`alternates: { types: { "application/rss+xml": "/feed.xml" } }` to
`app/layout.tsx` so it is discoverable from `<head>`.

Blocked-ish: item `pubDate` needs a real date. Every `publishedAt` today is
`[Jul 20, 2026]` — bracketed, not parseable. Either ship the feed with items
omitted until dates are real, or land this after the CMS date fields.

---

## 6. No `NewsArticle` / `BlogPosting` JSON-LD helper

It cannot legitimately emit today: `datePublished` is `[Jul 20, 2026]` and the
byline is "Jane Placeholder", both rejected by `isPlaceholder` in
`lib/schema.tsx`. But unlike `ReviewJsonLd` there is no gated helper waiting,
so nothing lights up when the CMS lands.

**Fix.** Add `articleJsonLd()` beside `reviewJsonLd()`, following the exact
same gate — return `null` unless headline, ISO `datePublished` and a real
author name are all present. Wire it into `/news/[slug]/[story]` and
`/blog/[slug]`. It will render nothing until real records exist; that is the
point.

---

## 7. Sitemap `lastModified` — do NOT put this on a schedule

`app/sitemap.ts` currently stamps every entry with `new Date()`, i.e. build
time, so each deploy resets every URL's date.

**Do not fix this with a cron/daily job.** `lastmod` is only worth sending if
it is true. Stamping every URL with today's date claims the whole site changes
daily; Google's documented behaviour is to ignore `lastmod` altogether once it
judges it unreliable, so a nightly refresh destroys the signal it is trying to
send.

**Correct fix, and it needs no script.** PayloadCMS maintains `createdAt` /
`updatedAt` on every collection document automatically. When the collections
land, read each record's own `updatedAt`:

```ts
lastModified: new Date(story.updatedAt);
```

Regeneration is event-driven, not timed — on-demand revalidation when an editor
publishes, not a schedule. Until then leave the build-time fallback; it is
honest for a site whose content has never actually changed.

---

## Deliberately NOT to add — do not "helpfully" fix these

- **`Organization` JSON-LD.** Blocked until the publisher record is real. The
  footer still carries `[company number — verify]` and `[Registered address
placeholder]`; `app/about/page.tsx` has a standing TODO saying no
  Organization/Person schema until then. Emitting it would be a fabricated
  trust signal (CLAUDE.md rule 3).
- **`SearchAction` on `WebSite`.** Google retired the sitelinks searchbox rich
  result, and our search box is not wired to anything — it would advertise a
  capability the site cannot serve.
- **`ItemList` on the ranked lists.** The scores are placeholder; a ranked
  ItemList of operators would surface them as real (rules 3 and 4).
- **`AggregateRating`.** Only ever from real moderated reviews (rule 4).
- **`hreflang`.** Single locale.
- **Markup to produce Google sitelinks.** None exists. Sitelinks are automated;
  the screenshot that prompted this doc was a _Google Ads sitelink asset_,
  configured in the Ads UI, not in code.

---

## Suggested order

1 and 2 first — both are defects, both are deletions, neither needs new assets.
Then 3 (one file), then 4. Leave 5, 6 and 7 until the CMS supplies real dates
and bylines, since all three are gated on exactly that.
