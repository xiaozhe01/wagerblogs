# Phase 5 — Live Preview: handoff

Written 2026-09-24, immediately after FW-1 Phase 4F completed at `c7dc2fd`.
Tree clean, `develop`.

## Resolve this before writing any code

**"Phase 5" means two different things in this repo.**

| Source                                                | Phase 5 is                                           |
| ----------------------------------------------------- | ---------------------------------------------------- |
| `docs/04-claude-code-implementation-brief.md:149`     | **Auth + UGC (Clerk)** — login, comments, moderation |
| FW-1, the frontend-wiring handoff MIGRATION.md tracks | **Live Preview**                                     |

CLAUDE.md now carries a "Which track is live" section naming FW-1 as the live
track, and MIGRATION.md's header states that its "Phase N" always means FW-1's.
Before that reconciliation, CLAUDE.md pointed only at `docs/04`, so anyone told
"do Phase 5" had even odds of building Clerk instead.

This document covers **FW-1 Phase 5, Live Preview**. It does not cover Clerk.

## The half that already exists

This is the part that makes the phase smaller than it looks, and the part most
likely to be rebuilt by accident.

**14 routes already read `draftMode()` and thread it into their queries.**

```
app/(frontend)/page.tsx                         categories/page.tsx
articles/page.tsx                               categories/[slug]/page.tsx
articles/[slug]/page.tsx                        news/page.tsx
authors/page.tsx                                news/[section]/page.tsx
authors/[slug]/page.tsx                         news/[section]/[story]/page.tsx
reviews/page.tsx                                reviews/[vertical]/page.tsx
reviews/[vertical]/[slug]/page.tsx              not-found.tsx (deliberately opts out)
```

The pattern is centralised in `lib/payload-queries.ts`:

```ts
publishedFilter(isDraft); // -> { where, draft } to spread into payload.find
```

Four collections have drafts enabled: **Reviews, Articles, News, Authors**.
Verticals, NewsSections and the three globals do not, by the editorial-vs-
structural split recorded in MIGRATION.md.

**None of this has ever executed.** There is no way to turn draft mode on, so
`isEnabled` is always `false` in every environment. The draft branch of all 14
routes is untested code. Expect it to be approximately right and not exactly
right — that is the real risk in this phase, not the plumbing below.

## The half that is missing

`payload.config.ts` has **no `admin` block at all** — no `livePreview`, no
`serverURL`, and no `preview` on any collection. `app/(payload)/` contains only
the admin route group and the REST/GraphQL handlers.

Four pieces to build:

1. **A draft-mode entry route.** Conventionally
   `app/(payload)/next/preview/route.ts`. Authenticates the request with
   `payload.auth`, refuses anonymous callers, then `(await draftMode()).enable()`
   and redirects to the target path.
2. **An exit route**, `app/(payload)/next/exit-preview/route.ts`, disabling
   draft mode. Needed for a visible "leave preview" affordance.
3. **`admin.livePreview` in `payload.config.ts`** — the breakpoints, and a
   `url` function mapping a document to its front-end path.
4. **`admin.preview` on Reviews, Articles, News, Authors** — per-collection
   document-to-URL mapping. `lib/urls.ts` already holds every derivation
   (`reviewUrl`, `articleUrl`, `newsUrl`, `authorUrl`); use it rather than
   building paths inline. That file exists precisely because three surfaces
   once derived their own URLs and drifted apart.

Optionally, Payload's `RefreshRouteOnSave` client component for live refresh
inside the preview iframe.

## Repo-specific constraints

**`siteUrl` is hardcoded to production.** `lib/schema.tsx:4` is
`export const siteUrl = "https://wagerblogs.com"`. Preview needs an
environment-aware base or it will send editors to the live site. Do not
repoint `siteUrl` itself without checking its consumers — the sitemap,
llms.txt and JSON-LD all emit absolute production URLs deliberately.

**Drafts must not reach the crawler surfaces.** `app/sitemap.ts:75`,
`app/llms.txt/route.ts` and `lib/search.ts` each pass `publishedFilter(false)`
explicitly, with a comment saying why: a crawler never carries the bypass
cookie. Preview must not change that. If a draft appears in the sitemap, the
phase has regressed 4F.

**The search corpus is cached and published-only.** `lib/search.ts` builds
behind `unstable_cache` with a 1h TTL, tagged `search-corpus`. Drafts are
correctly absent. A preview session should not see drafts in search results,
and no change is needed to keep it that way.

**RLS drops on `getPayload()` outside the app** — STRUCTURE.md:146. Any script
written during this phase must re-apply it; see `scripts/rls.ts`.

**Connection budget.** `payload.config.ts:129` caps the pool at 2 during build
and 10 at runtime, against a 15-client session pooler. Live Preview runs the
admin panel and front-end renders concurrently in one process, which is the
case the runtime cap of 10 was sized for — but it is worth re-checking under
an open preview iframe, which holds a long-lived render loop.

## Verification

**Treat this as the work, not as a checkbox after the config lands.** Adding
the config is the small part; it makes 14 untested branches execute for the
first time. Anything that renders wrong in preview is a bug in a previously
unreachable code path, not a preview misconfiguration. Budget accordingly.

Outer loop:

1. Create a draft of one Review, one Article, one News story and one Author —
   in the admin, not via a seed.
2. Confirm each is absent from its index route, its detail route (404),
   `sitemap.xml`, `llms.txt` and `/api/search` — the published-only guarantee.
3. Open preview for each and work the checklist below.
4. Exit preview, confirm every surface returns to the step-2 state.
5. `npm run build && npm run test:a11y && npm run test:unit && npm run rls:check`.

Step 2 is already known-good: verified end-to-end during 4F-3 with a draft
review, across search, the route, sitemap and llms.txt.

### Per-draft checklist, inside the preview iframe

- **Body content renders.** The draft's Lexical `body` through the rich-text
  converters. Drafts and published records store the same shape, so a failure
  here points at the query, not the editor.
- **Depth-populated relationships render.** Vertical name on a review, section
  on a news story, author on all three. This is the likeliest failure: the
  published queries set `depth` deliberately per route, and a draft query that
  loses depth degrades quietly rather than erroring.
- **Internal links in the draft body resolve.** Requires cross-linking one
  draft to another, since the seeded example is a published record. Watch
  specifically for `internalDocToHref`'s depth message — _"link was not
  populated deeply enough to expose a slug"_
  (`components/rich-text/converters/link.tsx:83`). It renders a visibly broken
  href rather than a silent `#`, so a depth regression in the draft path
  announces itself instead of hiding.
- **`generateMetadata` resolves for the draft.** Every detail route reads
  `draftMode()` inside `generateMetadata` as well as in the page body — two
  separate call sites per route, and only one of them is visible on screen.
  Check the SEO fields, including the `[TO WRITE]` placeholders, which should
  appear verbatim.
- **`seo.ogImage` renders where populated.** Currently populated on zero
  records, so this needs one set by hand to be a real test. Otherwise every
  route falls back to `public/og-default.png` and the assertion is vacuous.

**Do not run `npm run seed` or `npm run seed:content` to create fixtures for
this.** Both are non-idempotent against a hand-edited database — see
CONTENT-BACKLOG.md, "Seed idempotency". A verification run during 4F-4 created
seven duplicate records, one of which resurrected a dead URL. Create test
records in the admin instead.

## Out of scope

- **Clerk, auth and UGC** — that is `docs/04`'s Phase 5, a separate track.
- **Cache invalidation scope** — sitemap and llms.txt carry a 1h TTL with no
  per-tag invalidation. Tracked in CONTENT-BACKLOG.md as pre-launch, not
  Phase 5.
- **Seed idempotency** — its own phase, after this one. CONTENT-BACKLOG.md has
  the `seedSource` design.
- **Wiring `LatestStoriesSection` to Payload** — the last render-path fixture
  read, deliberately deferred. Its awkward `@/scripts/fixtures/news` import is
  the marker.

## Adjacent, unverified

The `afterChange` hook added in `191c395` drops the `search-corpus` tag on
write. It typechecks and is registered on all eight collections and globals,
but has never been caught firing — each attempt to observe it had a rebuild or
a server restart in between, which invalidates the cache anyway. If this phase
brings up a long-lived dev server, that is a cheap opportunity to confirm it:
warm the corpus with a search, publish an edit in the admin, search again
without restarting.
