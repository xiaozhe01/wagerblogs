# FW-1 — frontend wiring: inventory, divergence report and phase record

**Track:** FW-1, wiring the frontend onto PayloadCMS. This is a sub-track of
the build order in `docs/04-claude-code-implementation-brief.md` and numbers
its phases independently of it. Where the two collide, this file's "Phase N"
always means FW-1's.

**Position as of 2026-09-25: FW-1 is complete.** Phases 1 through 5 are done.
Live Preview was verified end-to-end in the browser — a draft news story renders
inside the admin's preview iframe with its byline and relationships resolved.

Deferred work that is not part of any FW-1 phase lives in CONTENT-BACKLOG.md.
The Phase 5 brief is kept at `.claude/phase-5-live-preview-handoff-2026-09-24.md`
for the reasoning behind its sequencing; `.claude/handover-2026-09-25.md` is the
resume point.

The sections below are a running record and are **not** rewritten as the state
moves on: an entry describing what was true in Phase 2 stays as written, with
later entries marking what resolved it. Read the phase-completion sections for
current state, and the dated entries for why something is the way it is.

The opening inventory dates from the first reading pass, when no frontend file
had yet been modified. It is preserved as the baseline the divergence report
was written against.

## Handoff assumptions that do not match this repo

| Handoff says                                            | Actual                                                                                                                                                                                               |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/collections/ exists and is empty`                  | There is **no `src/`**. This repo is root-level by decision — see STRUCTURE.md deviation 1. Collections belong in `collections/`, the SEO group in `collections/fields/seo.ts`                       |
| "folder refactor from the previous handoff is complete" | True, and committed: `81fca88`, `0337d09`                                                                                                                                                            |
| Payload installed and connected                         | True. `users` has 1 row; `payload_*` tables exist in Supabase                                                                                                                                        |
| —                                                       | The **Payload install itself is uncommitted** (`payload.config.ts`, `app/(payload)/`, `next.config.ts`, `tsconfig.json`, `package.json`). Step 3 says to proceed only once earlier work is committed |

## Step 1 — Comprehension inventory

Data today comes from three hand-written registries (`lib/reviews.ts`,
`lib/blog.ts`, `lib/news.ts`) plus one large fixture file (`lib/mock-data.ts`).
Shapes are declared in `lib/types.ts`, whose header states they are
_"mirrored from the eventual PayloadCMS collection shapes … before
Payload/Supabase exist."_

### Reviews

| File                                                | Consumes                                | Source                                | State                                                     |
| --------------------------------------------------- | --------------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| `app/(frontend)/reviews/page.tsx`                   | `reviewGroups[]`                        | `lib/reviews.ts`                      | working                                                   |
| `app/(frontend)/reviews/[vertical]/page.tsx`        | `group.operators[]`, paginated          | `lib/reviews.ts`                      | working                                                   |
| `app/(frontend)/reviews/[vertical]/[slug]/page.tsx` | full `Operator` + `mockPeakWagerReview` | `lib/reviews.ts` + `lib/mock-data.ts` | working; byline and Trustpilot render honest empty states |
| `components/section/ReviewCard.tsx`                 | `methodSteps`                           | `lib/mock-data.ts`                    | working                                                   |
| `components/section/RankedList.tsx`                 | `Operator[]`                            | props                                 | working                                                   |
| `components/section/ComparisonCard.tsx`             | `ComparisonOperator[]`, `compareRows`   | `lib/mock-data.ts`                    | working                                                   |
| `components/section/ProsConsSection.tsx`            | `Operator.pros/cons`                    | props                                 | working                                                   |

`Operator` (`lib/types.ts:108`) carries `score`, `categoryScores[]`,
`advantages[]`, `lastVerified`, `terms`, `isPrimaryDomain`,
`primaryDomainLink?`, `pros?`, `cons?`.

### Guides / blog

| File                                      | Consumes                                                                | Source                             | State                                                                                         |
| ----------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `app/(frontend)/articles/page.tsx`        | `blogPosts[]` (3 entries)                                               | `lib/blog.ts`                      | working                                                                                       |
| `app/(frontend)/articles/[slug]/page.tsx` | post record + `blogToc`, `blogBodyList`, `blogTakeaways`, `blogRelated` | `lib/blog.ts` + `lib/mock-data.ts` | **body copy is static placeholder** — only record fields vary by slug (`lib/blog.ts:33` TODO) |
| `components/cards/BlogPostCard.tsx`       | title, kicker, excerpt, byline, href                                    | props                              | working                                                                                       |

### News (no collection provided — see gaps)

`app/(frontend)/news/page.tsx`, `news/[section]/page.tsx`,
`news/[section]/[story]/page.tsx` consume `newsSections[]` / `NewsItem` from
`lib/news.ts`. Story bodies are static placeholder.

### Authors

| File                                     | Consumes                                                         | Source             | State                                                                                                        |
| ---------------------------------------- | ---------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `app/(frontend)/authors/[slug]/page.tsx` | `mockAuthor`, `authorBeats`, `authorArticles`, `authorStandards` | `lib/mock-data.ts` | renders, but **not a real record** — `generateStaticParams` is a TODO and every slug returns the same author |
| `components/section/ArticleByline.tsx`   | author name/credential                                           | props              | **honest empty state.** TODO: _"requires a real Person record (photo, fullName, credential, authorUrl)"_     |

**Author data is currently a formatted string, not a relationship.**
`lib/blog.ts:29,40,51` store `byline: "by [author] · 07/18/2026"` and
`lib/news.ts:27` emits `"by [author]"` inside a `metaItems` array. The author
is baked into display text, with the literal token `[author]` never replaced.

### Comments

`components/section/Comments.tsx` reads `sampleComments` from
`lib/mock-data.ts:727`, shaped `{ username, date, text }` — flat strings, no
author relationship, no status field, no parent linkage. The composer
(`textarea` + submit) is hard-`disabled`; copy reads _"held for moderation
before it appears"_, so moderation exists as a promise in copy with no data
behind it. Rendered only on `reviews/[vertical]/[slug]`.

### Forum threads, forum replies, notifications

**No frontend consumer exists for any of these.** Verified by case-insensitive
search across `components/`, `app/(frontend)/` and `lib/`:

```
forumThread   0 files      notification   0 files
forumReply    0 files
```

### Content rendered by the frontend with no collection in the drafts

Flagged rather than invented, per the constraints:

- **News** — three routes and `lib/news.ts`. Distinct from Guides in the nav,
  the search index (`scope: "news"`) and the sitemap. If News is meant to be
  Guides with a different `category`, that is a schema decision.
- **Categories** — `lib/categories.ts`, two routes, drives `/categories/[slug]`
  and nav.
- **FAQ** — `lib/faq.ts`, feeds `/faq` and `FAQPage` JSON-LD.
- **Legal documents** — `legalDocs` in `lib/mock-data.ts`, drives `/legal/[doc]`.
- **Help directory** — `HelpDirectoryEntry[]`, drives
  `/responsible-gambling/help-directory`.
- **Self-assessment** — `lib/self-assessment.ts`, the real NCPG instrument.

## Step 2 — Divergence report

> **Blocked.** The schema drafts have not been provided. The entries below are
> the ones determinable without them, because the handoff names the four
> features the drafts add. Entries requiring field-level comparison are
> outstanding until the `.ts` files arrive.

The handoff warns that finding zero divergences means not looking hard enough.
Three of the four named features have **zero** frontend presence; the fourth
already exists and partly conflicts.

### D1 — Funded-account gate: absent from the frontend

- **Frontend:** no `fundedAccountConfirmed` field anywhere (0 files; the only
  "funded" match is `lib/mock-data.ts:694`, a publicly funded treatment
  service, unrelated).
- **Schema:** required checkbox gating published Reviews.
- **Recommendation:** rendering-layer addition, later handoff. No conflict.

### D2 — Rubric-linked scoring vs free-text score labels

- **Frontend:** `OperatorCategoryScore = { label: string; score: number }`
  (`lib/types.ts:103`) — `label` is free text, authored per operator.
- **Schema:** scores relate to `RubricCriteria` records.
- **Recommendation:** **genuine divergence needing a decision.** Whether the
  rubric is ordered/versioned is a schema question and stays open.

**Row keying: done (2026-09-14).** `compareRows` rows now carry a stable `id`
(`lib/mock-data.ts:835`) and `ComparisonCard` keys both renders by it — the
desktop `<tr>` and the mobile `<dl>` row — instead of by `row.label`, which was
display copy. Renaming a feature label no longer remounts its row, and the rows
are ready to key against criterion IDs when the rubric becomes a relationship.

**Still open: operator column keying.** `compareRows[n].values[i]` is still
matched to `operators[i]` **by array position**, with nothing linking them —
`row.values.map((v, i) =>` in the desktop table and `r.values[i]` in the mobile
cards. Reordering `operators` silently attaches every feature value to the wrong
operator; adding a fourth leaves the `<colgroup>` one `<col>` short and renders
an empty mobile `<dd>`. Deliberately **not** fixed in the row-keying change —
it needs an operator identifier on each value, not a row identifier.

### D3 — Moderation state machine: absent from the frontend

- **Frontend:** `sampleComments` has no status field; the composer is disabled;
  moderation exists only as copy.
- **Schema:** moderation state machine on Comments.
- **Recommendation:** rendering-layer addition, later handoff. Note
  `Comments.tsx` currently renders `sampleComments.length` as
  _"N published"_ — that count must become status-filtered.

### D4 — Outbound link `rel`: already exists, and deliberately asymmetric

- **Frontend:** `RelAttribute = "dofollow" | "sponsored" | "nofollow"` exists
  (`lib/types.ts:6`) but **only on `PrimaryDomainLinkData`**.
  `OperatorLinkData` deliberately has **no** `relAttribute`, documented at
  `lib/types.ts:16-21`: every render site hardcodes `rel="nofollow"` in JSX
  _"so equity can never accidentally leak to a competitor."_
- **Schema:** an outbound link `rel` attribute.
- **Recommendation:** **genuine schema-design question.** If the schema makes
  `rel` editable on _all_ outbound links, it removes a deliberate safety
  property and conflicts with CLAUDE.md rules 2 and 5 (UGC links hardcoded
  `ugc nofollow`; only the primary-domain entry passes equity). Confirm whether
  the field is primary-domain-only before wiring.

### D5 — Author: string today, relationship in the schema

- **Frontend:** author is formatted display text — `byline: "by [author] · …"`
  (`lib/blog.ts`), `"by [author]"` inside `metaItems` (`lib/news.ts:27`).
- **Schema:** required Author relationship.
- **Recommendation:** **pre-existing frontend bug the schema exposes.** The
  handoff names "undefined author fields" and "description fields populated
  with byline text"; this is where that lives. Recorded, not fixed.

### D7 — `articles.type` deliberately excludes `news`

`articles.type` deliberately excludes `'news'` to prevent giving News two
schema homes.

**Resolved in FW-1 Phase 4C (2026-09-18): the News chip was removed, not
re-queried.** The earlier note said the News filter chip on `/categories/[slug]`
would be "resolved as a frontend query change". Wiring the route showed there is
no query to change: the chip names no `articles.type` value, **and** the News
collection has no `vertical` relationship, so nothing on a category page can
filter to it. A chip that can only ever return an empty feed is worse than no
chip, so `categoryFilters` in `lib/site-data.ts` is now
`["All", "Guides", "Analysis", "Research"]`.

If category-scoped news is wanted later it needs a schema change — a `vertical`
relationship on News — not a frontend one.

Related and still open: `articles.type` includes `'blog'`, which has no chip, so
those articles surface only under "All".

### D6 — SEO field group: absent from the frontend

- **Frontend:** no `seoFields` / `metaTitle` (0 files). Metadata is composed
  per route in each `page.tsx` via Next's `Metadata` export.
- **Schema:** reusable `seoFields` group.
- **Recommendation:** **needs a decision** — whether route-level `Metadata`
  reads from the group or the group only feeds JSON-LD. Two open defects in
  `.claude/seo-backlog-2026-09-08.md` (og:title inheritance, robots.txt
  Disallow) touch the same surface.

## Decisions taken

Recorded so a later handoff does not re-litigate them.

| Ref      | Decision                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Location | `collections/` at repo root, SEO group at `collections/fields/seo.ts`. Not `src/`.                                                                                                                                                                                                                                                                                                                          |
| **D4**   | **Keep the frontend's asymmetry — this is a deliberate change to the schema draft.** `outboundLink.relAttribute` is either hardcoded on operator links or excludes `dofollow` from the selectable options. The structural guarantee (equity cannot leak to a competitor because no editor can select `dofollow`) is stronger than defaults-plus-discipline, and it is what CLAUDE.md rules 2 and 5 require. |
| **D2**   | Schema keeps stable criterion IDs. `ComparisonCard` must be re-keyed by criterion ID instead of array index — **follow-up rendering fix, not done here.**                                                                                                                                                                                                                                                   |
| **D5**   | Recorded only. Resolves when the frontend adapts to the Author relationship in a later handoff. Do not touch.                                                                                                                                                                                                                                                                                               |

### Collection decisions for uncovered content

| Content                  | Decision                                                        | Basis                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------ | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| News                     | Its own collection, not a Guides variant. Draft to be provided. | Separate nav entry, search scope and sitemap presence                                                                                                                                                                                                                                                                                                                                                                                                  |
| FAQ                      | Its own collection                                              | —                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Legal documents          | Payload **globals**, not a collection                           | —                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Categories**           | **Taxonomy, as a thin collection**                              | `lib/categories.ts` derives `{slug, href, name, desc}` from `site-data.ts` with no body; the landing page renders a _filtered listing of other content_ via `FilterChips`/`TYPE_PARAM`. But each term carries its own `desc`, URL and metadata, which an enum or global cannot hold per-term, and other collections must relate to it. Taxonomy semantics, thin collection shape — no body field.                                                      |
| **Help directory**       | **A collection of external-organisation records**               | `HelpDirectoryEntry = { name, country, desc, contacts{phone,site,chat}, isCrisisLine? }` grouped by region. Third-party organisations with contact routes — not articles, and not navigation over our own content. `isCrisisLine` carries a verification constraint (`lib/types.ts:153-157`): it is _"a claim about a real organisation, so it is set only alongside a verified entry."_ That needs a verified/unverified field, per CLAUDE.md rule 3. |
| **NCPG self-assessment** | **Skip — no collection**                                        | `SelfAssessment.tsx` holds answers in `useState` only: no `fetch`, no `POST`, no `localStorage`. Responses never leave the browser. For the real NCPG instrument that is a privacy property to preserve, not a gap to fill.                                                                                                                                                                                                                            |

### Responsible-gambling content stays static — 2026-09-14

`/responsible-gambling` keeps reading `lib/mock-data.ts`. No collection, no
global, no migration. The same applies to `methodSteps` and `helplineNumber`.

In scope: `rgWarningSigns` (6 records), `rgTools` (4), `rgResources` (3),
`rgCommitments` (4), `rgToc` (5), `methodSteps` (4), and `helplineNumber` —
`lib/mock-data.ts:580-645`, `:800` and `:1044`.

**Why.** This is editorial policy the publisher writes about itself, not
content an editor produces on a cadence. `rgCommitments` states what the site
will and will not do commercially, `methodSteps` states how a review is
conducted, and the rest is standing reference copy. It changes when the policy
changes: rarely, and deliberately. Moving it behind the admin UI would take a
policy edit out of a reviewed diff and put it in a database row. For content
that is a promise to readers, git history is the better audit trail — who
changed the promise, when, and what the reviewer said.

**The help directory is not covered by this, and that is not an
inconsistency.** `rgResources` is a three-record teaser whose full version,
`helpDirectory`, does become a collection
(`collections/HelpDirectoryEntries.ts`) with `verified`, `verifiedAt` and
`isCrisisLine` fields. Those records are third-party organisations whose phone
numbers and URLs go stale without anyone here touching the repo. Our own policy
copy does not. Third-party facts belong in the CMS; our own promises stay in
git.

**Tradeoff accepted.** CLAUDE.md rule 3 is enforced for `helplineNumber` by
code review, not by a Payload hook. `HelpDirectoryEntries` gets a `verified`
field and hook-level validation; `helplineNumber` gets a bracketed string and a
reviewer who has to notice it:

```ts
export const helplineNumber = "[helpline number — verify before launch]";
```

Until someone confirms a real, current number against the operating
organisation's own website, that bracketed text is what renders — in the footer
banner on every route (`components/layout/SiteFooter.tsx:18`) and on the page
itself (`app/(frontend)/responsible-gambling/page.tsx:60`). It is deliberately
not digit-shaped; the TODO at `lib/mock-data.ts:1039-1043` records why, and
that a verified number must render as an explicit `tel:` link.

Two related gaps are known and deliberately left open here: nothing enforces
the `rgToc` href/id contract (5 hand-authored anchors against ids typed in the
page component), and no lint rule stops the placeholder reaching production.
Both are follow-ups, not decided by this entry.

## Outstanding before Step 3

1. The schema draft `.ts` files, including News, FAQ, Categories and Help
   directory.
2. D6 (SEO group) — whether route-level `Metadata` reads from the group, or the
   group only feeds JSON-LD.

## Deferred until frontend-wiring handoff

These are decisions and obligations that cannot be resolved until the frontend
stops reading `lib/mock-data.ts` and starts calling `getPayload` /
`payload.find`. Recorded here so they are not lost between handoffs.

### Rich-text link converter must enforce the outbound-link rel discipline

Rich-text converter for links MUST enforce `rel="nofollow noopener noreferrer"`
on external hrefs when the converters module is eventually built. D4's
outbound-link asymmetry — structural absence of `relAttribute` on
`operatorLink`, editable `relAttribute` only on `primaryDomainLink` — only
holds if the link converter enforces the same rel treatment on links inside
rich-text bodies. Without this, an author can type a URL in an article body and
accidentally dofollow to a competitor. **Do not skip.**

The converters module itself is **not** built yet, and deliberately so. Its
failure modes — CSS containing rules in `Prose.tsx`, class inheritance in page
context, `Image` component routing — only surface against real pages consuming
real Payload data. Building and testing converters in isolation gives less
signal than it appears to. The design contract, converter authorship and
consumer replacement therefore all belong to the frontend-wiring handoff, done
against the same reality at the same time.

Note there is currently **no custom Lexical renderer in this repo** to replace:
no file under `app/(frontend)/`, `components/` or `lib/` references Lexical or
rich text, and no frontend page imports `@payload-config`. Body copy today is
hardcoded JSX plus `lib/mock-data.ts` placeholders.

### Move from Drizzle push to tracked migrations

Payload runs Drizzle's push in dev, which recreates tables and **silently drops
per-table RLS**. Observed three times in one session: on a schema edit, and on
`getPayload()` from a standalone script — including `npm run seed`. Grants are
unaffected, because those are role-level default privileges; only the per-table
RLS flag is lost.

`npm run rls:check` / `npm run rls:apply` exist as the stopgap, and `seed`
re-applies automatically. The real fix is `payload migrate:create` +
`payload migrate`, so schema changes stop recreating tables. That is a larger
change and deserves its own handoff with proper scope — **not done here**.

### Vertical slug conflict deferred to frontend-wiring handoff

`/categories/online-casinos` and `/reviews/casinos` are both live today, serving
the same conceptual Vertical. Seed uses `'online-casinos'` as canonical. The
frontend-wiring handoff decides whether to (a) rename `/reviews/casinos` to
`/reviews/online-casinos`, (b) add a `reviewsSlug` field to Verticals for the
divergent case, or (c) something else. **Do not resolve now** — this is a
routing decision, not a schema decision.

`scripts/seed.ts` encodes the mapping explicitly in `REVIEW_GROUP_BY_VERTICAL`
because it is not derivable: `chipSlug("Online Casinos")` is `online-casinos`,
but `lib/reviews.ts` calls the same concept `casinos`.

### Route naming reconciliation — resolved in FW-1 Phase 3 (2026-09-17)

The frontend routes were renamed to match the schema rather than mapping
between them in the data layer:

| Was                      | Now                         |
| ------------------------ | --------------------------- |
| `blog/[slug]`            | `articles/[slug]`           |
| `reviews/[group]/[slug]` | `reviews/[vertical]/[slug]` |
| `news/[slug]/[story]`    | `news/[section]/[story]`    |

`/categories/[slug]` was already schema-consistent and did not move.

**Scope was the URL segment, its route params, and user-facing "Blog" copy.**
`lib/reviews.ts` keeps `ReviewGroup`, `reviewGroups`, `findReviewGroup` and its
other symbols unchanged — that file is deleted in Phase 4 when its contents
become Payload queries, so renaming its domain terms now would be churn that
gets undone. The resulting incongruity is deliberate and temporary: a route
param named `vertical` is passed to a lib function named `findReviewGroup`.

`lib/news.ts` needed no change at all — it already called the concept `section`
(`NewsSection`, `findNewsSection`) and its own comment documented
`/news/<section>`. The route was the half that was out of step.

No redirects were added from the old URLs. The site is not public, so there is
no SEO or bookmark history to preserve; if redirects are ever needed they land
as their own commit with intent. Only `/blog` actually stops resolving —
`/reviews/sportsbooks` and `/news/football` are unchanged as URLs, because only
the _name_ of the dynamic segment changed, not its shape.

### Rich-text body styling is prose defaults, not a visual match

Editorial body rendering uses Tailwind Typography prose defaults. Visual match
to current hand-classed article pages is a Phase 4 design pass, not part of
Phase 2 scope.

`components/section/Prose.tsx` is not a design contract for this — it is a
17-line wrapper that renders a single `<p>` and styles nothing below itself.
Every blockquote, list and heading on the site today is hand-classed at its
call site, so there is no existing rule set for `<RichText>` to reproduce.

### Rich-text internal links — resolved in FW-1 Phase 4

`internalDocToHref` (`components/rich-text/converters/link.tsx:77`) was a stub
while the route names were unsettled: a Lexical link with `linkType: 'internal'`
carries a document reference, and turning that into a URL needed the names
Phase 3 settled.

It is now implemented for articles, authors, verticals, reviews and news.
Anything it cannot resolve still becomes a visibly broken href rather than a
silent `#`, so a bad link is findable instead of merely inert — including the
case where a query's `depth` is too shallow to expose the target's slug, which
reports itself by name.

The advice to prefer custom URLs over the internal-document picker no longer
applies.

### Drafts: editorial collections have a lifecycle, structural ones do not

Settled 2026-09-18, while wiring FW-1 Phase 4. Payload's `_status` field only
exists on collections with `versions.drafts` enabled, so "filter every query by
`_status: 'published'`" cannot be a universal rule — on a collection without
drafts it queries a column that does not exist.

The split is by what the record _is_, not by which collections happened to get
drafts first:

| Drafts enabled — editorial | No drafts — structural / reference |
| -------------------------- | ---------------------------------- |
| Reviews                    | Verticals                          |
| Articles                   | NewsSections                       |
| News                       | Media                              |
| Authors                    | HelpDirectoryEntries               |
|                            | BonusOffers                        |

Editorial records are written, revised and published by a person, and each has
its own indexable route. Structural records are taxonomy and reference data:
they are either correct or they are wrong, and there is no meaningful draft of
a vertical.

Authors was the correction that produced the rule. It had neither `seoFields`
nor drafts, which was an oversight rather than a decision — an author page is
editorial content with a public URL, exactly like an article. Adding
`seoFields` alone failed: `metaTitle`/`metaDescription` are `required`, which
on a non-drafts collection means `NOT NULL`, and Postgres refuses to add a
NOT NULL column to a table that already holds rows. Enabling drafts resolved
it, because the drafts convention drops NOT NULL and moves required-ness to
publish-time validation.

Globals are a fourth case and also have no drafts: FAQ, LegalDocuments and
MarketStats are edited in place. FAQ carries its own per-entry `status`
(draft/published), which is a moderation flag on one row, not the `_status`
lifecycle — Phase 4D-2's `/faq` route filters on it directly.

**UGC collections are a third category and are not covered by this.**
ReaderReviews, Comments, ForumThreads and ForumReplies carry their own `status`
field with moderation semantics (`pending` / `approved` / `rejected` / `spam`).
That is a moderation queue, not a publish lifecycle, and it stays distinct from
`_status`.

Every `payload.find` in the frontend states which side it is on in a comment,
so a missing filter reads as a mistake rather than a style difference.

### Sequencing: a URL producer and its consumer are one unit

Learned the hard way in FW-1 Phase 4A. The plan wired the `/reviews` hub
(producer of `/reviews/<slug>` links) in one sub-phase and
`/reviews/[vertical]` (consumer of that slug) in the next. The moment the hub
started deriving slugs from Payload it emitted `/reviews/online-casinos`, while
the detail route still resolved against `lib/reviews.ts`, which calls the same
vertical `casinos`. The hub's primary navigation 404'd.

The slug conflict itself was known and recorded — see "Vertical slug conflict"
above. What was missed is that moving URL _derivation_ to Payload is not a
per-route change: it changes the contract between two routes at once.

When splitting future wiring work, look for URL-producer / URL-consumer pairs
and keep them in the same commit. A route that builds an href and the route
that resolves it cannot be migrated separately unless both slug sources already
agree.

One intermediate wart was accepted rather than pulled forward:
`/reviews/casinos/crownline-coins` still resolves, because the operator detail
route is lib-backed until Phase 4C. Nothing links to it — it is a stale URL
that still answers, not a broken link — and it stops resolving when 4C lands.

**Follow-up, 4E pre-work (2026-09-23).** The hazard outlived the routes. Three
surfaces were never wired and still read `lib/` fixtures, so they now disagree
with Payload:

| Surface                 | Reads                                                                    |
| ----------------------- | ------------------------------------------------------------------------ |
| `app/sitemap.ts`        | `lib/blog`, `lib/categories`, `lib/news`, `lib/reviews`, `lib/mock-data` |
| `app/llms.txt/route.ts` | the same set                                                             |
| `lib/search.ts`         | the same set                                                             |

Measured against the running app, the sitemap has 50 entries of which **six
return 404**:

- `/reviews/casinos`, `/reviews/casinos/crownline-coins`,
  `/reviews/casinos/spinfrontier`, `/reviews/casinos/stakeharbor` — the
  vertical was renamed `online-casinos` in Phase 4A
- `/reviews/sportsbooks/peakwager` — the seed skipped the record
  (`advantages: []` against `minRows: 1`)
- `/authors/jane-placeholder` — the author slug was renamed to `jane`

And these resolve 200 but are **absent from the sitemap entirely**:
`/authors`, `/authors/jane`, `/authors/richard-reegan`,
`/reviews/online-casinos` and its four reviews.

`llms.txt` carries five of the same dead links, and `/search` returns
`/reviews/casinos/crownline-coins` as a result. This is why no `lib/` file was
deletable in 4E: the fixtures are not orphaned, they are load-bearing for three
crawler-facing surfaces. Wiring them is **Phase 4F**.

## Phase 4 complete — what is Payload-backed and what is not

FW-1 Phase 4 wired every display route under `app/(frontend)/`. This section is
a summary of the end state; the reasoning behind each call stays in the dated
entries above and is not restated here.

### Payload-backed

| Sub-phase | Routes                                                                                             |
| --------- | -------------------------------------------------------------------------------------------------- |
| 4A        | `/categories/[slug]`, `/reviews`, `/reviews/[vertical]`                                            |
| 4B        | `/categories`, `/news`, `/news/[section]`                                                          |
| 4C        | `/articles/[slug]`, `/news/[section]/[story]`, `/reviews/[vertical]/[slug]`                        |
| 4D-1      | `/authors`, `/authors/[slug]`                                                                      |
| 4D-2      | `/legal/[doc]`, `/faq`, `/responsible-gambling/help-directory`                                     |
| 4D-3      | `/articles`, `/` — plus `/not-found` and `/categories`, pulled in by shared-component prop changes |

### Deliberately static, with the reason recorded

- **`/responsible-gambling`** — the RG decision (2026-09-14, above). Verified
  unchanged in 4D-4: every file in its dependency closure is byte-identical to
  the pre-4B baseline, `helplineNumber` and `methodSteps` still `lib/`-sourced.
- **`/about`, `/contact`, `/search`** — no collection backs them.
- **`ComparisonCard`** — waiting on D2's operator-column keying half.
- **`ReviewCard` (`methodSteps`), `BettingToolboxSection` (`toolboxItems`)** —
  no Payload source exists for either.
- **`LatestStoriesSection`** — the one section still reading a fixture for its
  rows rather than its thumbnails. It appears on `/not-found` and the news
  story page, neither of which was in 4D-3's scope. Still true after 4F: its
  import moved to `scripts/fixtures/news`, which is deliberately awkward — the
  awkwardness is the marker for the one render-path fixture read left.

### Not wired, and the reason it blocks cleanup

`app/sitemap.ts`, `app/llms.txt/route.ts` and `lib/search.ts` — see the 4E
follow-up under "Sequencing: a URL producer and its consumer are one unit".
**Resolved in Phase 4F, below.**

## Defense in depth on access rules — 2026-09-24

Found while verifying Phase 5's preview wiring. Every collection shipped
`read: () => true`. Payload does not filter `_status` or a moderation field on
its own, so `/api/<slug>` served drafts and unmoderated content to anonymous
callers — two draft reviews, one of them an unreleased review of the primary
domain, and one draft author.

**`publishedFilter` was never a security boundary.** It guards at the query
layer, in the frontend routes, one hand-written call at a time. It cannot guard
a request that never reaches those routes, and a direct call to the REST API is
exactly that. The frontend looked correct throughout, because it was.

The two layers now do different jobs:

| Layer | Guard                      | Scope                            |
| ----- | -------------------------- | -------------------------------- |
| Data  | collection `access.read`   | every read, including `/api/*`   |
| Query | `publishedFilter(isDraft)` | the frontend routes that call it |

Either alone protects the site. Both together is honest defense in depth, and
the query-layer calls stay for that reason — redundancy here is deliberate, not
leftover.

One rule per visibility model rather than one uniform rule, because the schema
does not share a vocabulary: `ForumThreads` has no `approved` value and the
uniform filter errored on the invalid enum; `Comments` treats `edited`
(Approved with Edits) as public; `ForumReplies` has no status field and is
visible until flagged. See `collections/access/read-rules.ts`.

Editor identity keys off `req.user.collection === "users"` — the slug
`AdminUsers` declares. That survives site-user auth landing without needing a
role model, and fails closed: an unrecognised session falls through to the
anonymous filter and sees less, never more.

### Consequence for Live Preview — resolved

Frontend routes called `payload.find({ overrideAccess: false })` and never
passed a user. With the access rules in place, a draft-mode request resolved
against the anonymous filter, so the draft was filtered out at the data layer
even though `publishedFilter(true)` asked for it.

Measured against the live database, the same query either side of the change:

```
draft mode, NO session   ->  9 docs, 0 draft
draft mode, WITH session -> 10 docs, 1 draft
```

Fixed by propagating the editor rather than by weakening the rules.
`resolvePreviewUser()` resolves the session through `payload.auth()` and
`publishedFilter` carries it into `payload.find`. It runs only when draft mode
is on, so the published path costs nothing and never touches `headers()` —
which matters, because `generateStaticParams` has no request to read.

## Divergence from Payload's canonical Live Preview

Payload's website template uses `overrideAccess: draft` in draft-mode queries.
That works for the template because its collections ship `read: () => true` —
there are no access rules to selectively evaluate, so bypassing access control
is the only lever available.

After the access-rule fix above, our editorial collections have real rules.
`overrideAccess: true` would bypass them and reopen the `/api/*` leak that fix
just closed.

Ours propagates the authenticated user through the query layer instead. The
access rules run, return true for an editor, and drafts render in Live Preview
without anything being bypassed.

The failure modes are what separate them:

| Approach                           | On a missing session                             |
| ---------------------------------- | ------------------------------------------------ |
| Canonical, `overrideAccess: draft` | **Fails open** — a draft cookie reads everything |
| Ours, propagate user               | **Fails closed** — filters to published-only     |

The divergence is earned by having access rules worth respecting. Do not
"fix" it by matching the canonical template: that template solves a different
problem.

## Phase 4F complete — the crawler and navigation surfaces

The four surfaces that built their own URLs from their own fixtures, and so
drifted from the routes, now read Payload directly.

| Sub-phase | Surface                 | What it had wrong                                                |
| --------- | ----------------------- | ---------------------------------------------------------------- |
| 4F-0      | `lib/nav.ts`            | Reviews dropdown emitted `/reviews/casinos`, a 404 on every page |
| 4F-1      | `app/sitemap.ts`        | six dead entries, eight live routes missing                      |
| 4F-2      | `app/llms.txt/route.ts` | five dead links, no authors, no news stories                     |
| 4F-3      | `lib/search.ts`         | `/reviews/casinos/crownline-coins` as a live hit                 |

Every dead URL identified in the 4E pre-work is gone, and the live routes the
fixtures never knew about are present. The search corpus went from 46 documents
to 53 — the fixtures under-represented Payload by four FAQ entries, two authors
and one review index.

Two structural results worth keeping:

- **`lib/urls.ts` is the single URL derivation**, shared by all three crawler
  surfaces. Each previously built its own paths, which is precisely how the
  three drifted apart.
- **Search costs zero queries per request.** The corpus is built behind
  `unstable_cache` with a one-hour TTL and dropped on write by an `afterChange`
  hook on each searchable collection. A cache miss issues six concurrent
  queries; a user's search issues none.

### Fixture vs render-path

Seed fixtures in `scripts/fixtures/` are ongoing source data for `npm run seed`
and `npm run seed:content`, not orphaned render-path code. Their consumption
pattern differs from render-path fixtures: seed reads them once per DB rebuild,
never at runtime. The path documents the role.

4F-4 acted on that distinction rather than the assumption that anything still
importing a fixture was an unfinished migration:

- **`lib/categories.ts` deleted** — genuinely orphaned, zero consumers.
- **`lib/blog.ts`, `lib/news.ts`, `lib/reviews.ts`, `lib/faq.ts` moved to
  `scripts/fixtures/`** — each is the input a seed script reads. Deleting them
  would have broken the ability to rebuild the database from scratch.

`lib/` now holds no fixture files. The one exception that proves the rule is
`LatestStoriesSection`, which reaches into `scripts/fixtures/news` from a
component; see the note above.

### Seed idempotency is keyed on slug, and renames defeat it

Found by running both seeds to verify 4F-4. `seed:content` decides a record
already exists by its slug or name. When a record is renamed in the admin, the
seed no longer recognises it and creates its original version alongside the
renamed one.

Renaming the author `jane-placeholder` to `jane` and re-running the seed
restores `/authors/jane-placeholder` as a second, live author record — one of
the exact dead URLs 4F-1 was written to remove. The same happened to six
`help-directory-entries` renamed from their seeded placeholder names.

This is a seed defect, not a wiring one, and it is worth noting that the
sitemap surfacing the duplicate is the new behaviour working correctly: it
reports what is in the database. The old fixture-driven sitemap listed
`jane-placeholder` whether or not any such record existed.

## Phase 5 complete — Live Preview, and FW-1 closed

Editors see a draft rendered by the real frontend, inside the admin.

| Sub-phase | Commit    | What landed                                                              |
| --------- | --------- | ------------------------------------------------------------------------ |
| 5A        | `78cd384` | authenticated draft-mode entry and exit routes                           |
| 5B        | `175584c` | `admin.livePreview`, four breakpoints matching this site's layout states |
| 5C        | `edc2652` | `admin.preview` on the four editorial collections                        |
| 5D        | `9ff521d` | `LivePreviewListener` on the four editorial detail routes                |

Half the phase already existed: thirteen routes read `draftMode()` and threaded
it into `publishedFilter` long before anything could turn draft mode on. That
branch had therefore **never executed**, which is where the phase's real work
turned out to be — not the plumbing.

Four defects surfaced only once it ran:

| Commit    | Defect                                                                    |
| --------- | ------------------------------------------------------------------------- |
| `b0aa561` | draft queries passed no user, so the access rules filtered drafts out     |
| `30ec0e7` | six call sites destructured `publishedFilter` and dropped `user` silently |
| `d5b9555` | a present-but-blank env var gave `postMessage` an empty target origin     |
| `3e192ac` | `/\evil.com` and `/..//evil.com` escaped the site — open redirect         |

Two smaller ones followed: `findByID` **throws** rather than returning undefined
(`042c8ea`), and the editor was being authenticated twice per request
(`54e786d`).

`LivePreviewListener` is mounted **per detail route, not in the layout**. The
event it listens for carries no document id — `isDocumentEvent` checks only the
origin and the event type — so a listener in the layout would refresh every
route on every save.

### Still fixture-backed, deliberately

`LatestStoriesSection` reads `scripts/fixtures/news` and renders on
`/not-found` and the news story page. It is the last render-path fixture read in
the codebase. The import is deliberately awkward; the awkwardness is the marker,
and it disappears when that section is wired.

### Left undone on purpose

- **Update-as-you-type preview.** What shipped is Payload's _server-side_ Live
  Preview: `RefreshRouteOnSave` refreshes on **save**. Updating on every
  keystroke is the client-side variant (`useLivePreview`), which requires the
  detail routes to become client components fed serialised data. On a site whose
  product is server-rendered HTML for crawlers, that is a bad trade for editor
  convenience. Payload's own template makes the same call.
- **The `search-corpus` hook has never been observed firing.** It typechecks and
  is registered on all eight collections and globals, but every attempt to watch
  it had a rebuild or a restart in between, which invalidates the cache anyway.

## OG metadata

Settled across the Phase 4 follow-ups. Every route emits its own
`og:title`, `og:description`, `og:type`, `og:site_name`, `og:url` and an
`og:image`; before this, all 20 shared the homepage's title and description,
because routes set `title`/`description` only at the top level of `Metadata`
and never touched `openGraph`.

`lib/og.ts`'s `buildOpenGraph` composes the block. It exists because **Next
replaces `openGraph` wholesale rather than merging it with the layout's** —
verified against rendered tags. Anything the layout sets is lost on any route
that emits its own, so `type`, `siteName` and the image fallback are restated
in one helper instead of seven `generateMetadata` bodies.

`type` is `article` on `/articles/[slug]`, `/news/[section]/[story]`,
`/reviews/[vertical]/[slug]` and `/legal/[doc]`; `profile` on
`/authors/[slug]`; `website` everywhere else.

Two intentional exceptions:

- **`/`** emits `og:title: "WagerBlogs"` — that is genuinely the homepage's
  title, not a fallback leaking through.
- **`layout.tsx`** keeps its own `openGraph` with `DEFAULT_OG_IMAGE`, covering
  any future route that does not call `buildOpenGraph`. It cannot collide with
  the wired routes precisely because they replace the block.

`seo.ogImage` is populated on very few records, so most routes serve
`public/og-default.png` — a labelled 1200x630 placeholder, regenerated by
`scripts/generate-og-default.ts`. A record with a real `ogImage` overrides it
per route with no code change.

### Extended after FW-1 closed — 2026-09-27/28

Four things landed on top of the above; see "Post-FW-1 work" at the end of this
document for the commit list.

**`article:*`.** `og:type` was already `article` on the three record routes,
but none of the article metadata went with it. `buildOpenGraph` now takes
`publishedTime`, `modifiedTime`, `authors` and `section`, all behind an ISO
guard — the CMS still carries bracketed dates, and `article:published_time` is
machine-readable, so emitting one would publish a fabricated fact.

**A 1200x630 derivative.** `Media` gained an `og` imageSize and `shareImage`
prefers it over the original. `withoutEnlargement` must be an explicit `false`:
Payload reads three states, and the other two are both wrong here — `undefined`
omits the size entirely for a source smaller than the target, and `true`
returns that source uncropped at its own aspect ratio. Measured, not assumed.

**Derivatives are built at upload time only**, so every record uploaded before
the size existed had `sizes.og = NULL` and `shareImage` silently fell through
to the original. `scripts/regenerate-media-sizes.ts` backfills them. It is
idempotent and passes `overwriteExistingFiles` — without that flag an update
collides with the record's own file and Payload appends `-1` to the filename.

**Twitter.** No `twitter:*` tag was emitted anywhere, so X fell back to `og`
and chose a small card. `buildTwitter` sets `summary_large_image` and nothing
else, declared once in `layout.tsx`. It deliberately carries no
title/description/images: setting any of them sitewide would override every
route, which is the exact defect the layout's `openGraph` block caused before
each route emitted its own. Verified against rendered tags that Next still
derives each page's own. `TWITTER_SITE` is empty — X renders it as the card's
attribution, so a handle we do not own would credit someone else on every
share.

## Rail composition

Inventoried during the 4E-era audit. **No decision has been taken here** — this
records the current state so a future rail refactor starts from fact.

The rail is one `<aside>` in `PageShell`, `hidden wide:flex` (1370px), a fixed
300px track, sticky and full-height with its own scroll, `BackToTop` pinned to
its bottom. Below 1370px it is not rendered at all — it does not reflow under
the content, so anything rail-only is invisible to phones and tablets.

Building blocks: `AnchorList` (link list, owns a card when given a `title`),
`InfoCard` (title + body + one CTA), `AtAGlanceCard` (label/value `dl`),
`NewsRail` and `ReviewsRail` (async, self-fetching, with a `children` slot),
`HomeRail`/`TrendingCard`.

Four observations, all still true:

1. **Six routes render the same "Editorial standards" card** with four
   slightly different sentences, and five of those have a single-card rail —
   300px of sticky viewport for one link to `/about`.
2. **Two incompatible data patterns.** `NewsRail` and `ReviewsRail` fetch their
   own list; every other rail is assembled in the page and passed as a prop.
   The first cannot be reused outside its section, the second cannot be dropped
   into a route without editing that route.
3. **Three hand-rolled cards re-implement `AnchorList title=`** — "All
   categories", "Other {noun}s compared", the legal "Change log".
4. **The landmark convention is stated but not followed.** `InfoCard` documents
   that rail cards are deliberately unnamed sections; four rail sections are
   named via `aria-labelledby`. The a11y suite passes because they are unique,
   not because they follow the rule.

`OtherBooksCard` was part of this inventory and was deleted in 4E — no route
imported it, and it still called the stale `reviewPath`.

## Known skeletons

Sites that render a grey `placeholder-asset` block or an empty list **by
design**, not because the wiring was missed. Each one is either waiting on a
schema field that does not exist yet, or on a route that has not been flipped
to Payload. This is institutional memory, not a bug list: check here before
filing one.

The author-photo pattern is the reference for all of them — a populated
relationship renders the image, an unpopulated one keeps the caller's own
skeleton (`components/cards/MediaImage.tsx` returns `null` rather than
inventing a placeholder).

### Operator logo — 4 sites

| Site                                                | Surface                            |
| --------------------------------------------------- | ---------------------------------- |
| `app/(frontend)/reviews/[vertical]/[slug]/page.tsx` | operator mark on the review header |
| `components/section/ReviewDirectorySection.tsx`     | directory tile                     |
| `components/section/RankedList.tsx`                 | ranked-list row                    |
| `components/cards/BonusOfferCard.tsx`               | bonus card                         |

`Reviews` has no `logo` upload field, so there is nothing to render. One field
covers all four: `BonusOffers.operator` is a relationship to `reviews`, so the
bonus card reads the logo through it at depth 2. Deferred rather than added
alone — it batches with the next round of Reviews schema additions, since each
one costs a migration.

### UGC avatars — 3 sites

`components/section/Comments.tsx` (comment row and the composer) and the
reader-review row in `app/(frontend)/reviews/[vertical]/[slug]/page.tsx`.

`Users` has no avatar field, deliberately: UGC identity is kept thin, and an
uploaded avatar is a moderation surface that FW-2 has not scoped. Revisit with
the comment and reader-review forms if it becomes relevant then; until then
these stay skeletons and are **correct as-is**.

### Teaser thumbnails

This entry is about **media, not data sources**. The sections listed here take
their rows from Payload; what stays skeleton is the thumbnail inside each row.

**Closed 2026-09-21.** `PostTeaser` gained a `thumbnail`, `storyRow` and
`articleRow` fill it from the record's `heroImage`, and `PostRow`,
`BlogPostCard` and the editor's-lead image all branch on `resolveMedia`. No
query needed a depth change — every call site already fetched at depth 1 or
better. `sizes` was measured per surface rather than guessed.

The grey block still renders everywhere, because `hero_image_id` is NULL on
all three articles and all ten news stories. That is the honest empty state,
not a missing wire: upload a hero to any article and it appears on `/articles`,
the homepage `BlogSection`, and that article's category editor's-lead.

The populated branch cannot be exercised in-process — `next/image` resolves to
a module namespace outside Next's bundler, so `renderToStaticMarkup` rejects
it. It is covered by testing `resolveMedia` directly plus the skeleton branch,
and by the author photo, which is the same pair and does render live.

`components/section/LatestStoriesSection.tsx` is the one section still reading
`lib/` for its **rows** as well. It appears on the 404 page and the news story
page, neither of which was in 4D-3's scope.

### Not a skeleton: `seo.ogImage`

**Closed 2026-09-23** — see the "OG metadata" section above. `buildOpenGraph`
reads `seo.ogImage` on every wired route and falls back to
`public/og-default.png`. The field is still populated on zero records, so the
placeholder is what ships; that is authoring work, not a wiring gap.

### Editor's pick surfacing — deferred schema question

`EditorsCard` was removed from the homepage rail in Phase 4D-3 rather than
pointed at a record. It had linked to `mockPeakWagerReview`, whose slug does not
exist in the database (the seed skipped PeakWager: `advantages` was `[]` against
`minRows: 1`), so the rail carried a 404.

Nothing in the schema records an editor's pick, and the two available
substitutes both reverse-engineer the claim: "top-scoring published review"
would have surfaced the primary-domain entry, which reads as an editorial
endorsement of the domain the site exists to pass equity to, and "top
non-primary" is an arbitrary rule dressed as a judgement. Same class of problem
as the placeholder hero image and the seeded `verified` flag, and resolved the
same way — the surface stays absent until real data backs it.

Homepage config-level curation (a homepage global with a `featured`
relationship) is probably the right shape rather than an `isEditorsPick`
boolean on Reviews, because the claim belongs to the homepage and not to the
operator. Neither is decided. The card returns when a surfacing mechanism does.

---

## Post-FW-1 work — 2026-09-26 … 2026-09-28

FW-1 closed at Phase 5. Everything below landed after it, on `develop`, and is
recorded here because MIGRATION.md is where this repo keeps the wiring record —
not because any of it belongs to a numbered FW-1 phase.

### Committed 2026-09-26 … 09-27

| Commit    | What landed                                                        |
| --------- | ------------------------------------------------------------------ |
| `4d39c6c` | real copy for the bracketed editorial sections                     |
| `a4eaf5a` | three CMS fields the frontend was ignoring                         |
| `e4ee3f3` | operator logo field on Reviews and BonusOffers, plus the migration |
| `6876889` | hero crop fixed; reading measure capped in `ch` on three routes    |
| `0ea5cea` | outbound `rel` centralised — follow forced, referrer per surface   |

### Committed 2026-09-28 — nine commits, split by concern

| Commit    | What landed                                                        |
| --------- | ------------------------------------------------------------------ |
| `7e2fda6` | a11y route fixture repointed at a slug that still exists           |
| `bdb88fe` | focal point read on the frontend for all 14 `MediaImage` consumers |
| `b762f3f` | 1200x630 OG derivative + migration + backfill script               |
| `c0ff55c` | `article:*` on the three record routes                             |
| `c5e8973` | Twitter card declared once in the layout                           |
| `3e13b5b` | breadcrumb label falls back to the slug, not the headline          |
| `28b566f` | jump rail on the news story; Corrections moved out of `NewsRail`   |
| `b27ce51` | publish line moved out of the byline into the header               |
| `aad87ed` | share button on stories, articles and reviews                      |

**Config and migration land in the same commit.** Two outages on 2026-09-26/27
came from adding a Payload field and not running its migration in the same
step: the Drizzle schema changes as soon as the config does, so every query
then selects a column that does not exist (`errorMissingColumn`, 42703). Both
migrations in the list above ship inside the commit that needs them.

### Three defects these passes uncovered

**`<time>` had never rendered on any story or article.** `ArticleByline`
guarded with `/^\d{4}-\d{2}-\d{2}/` but the route passed it `formatDate`'s
output — `"Sep 27, 2026"` — so the guard failed every time and the element was
never emitted. `PublishMeta` now takes the raw record value and formats
internally. The guard itself was right; its input was not.

**The focal point was stored but never read.** Payload has always written
`focalX`/`focalY` and crops its own derivatives around them. The frontend set
no `object-position`, so every `object-cover` image centred regardless of what
the editor picked. This was never new work — only the frontend half was missing.

**`crumb` was added optional and therefore did nothing.** `Verticals.crumb` is
`required: true`, which is why `/reviews/sportsbooks` has always read
"Sportsbooks". The same field added to News and Articles was made optional so
the thirteen existing records would not fail validation — and optional plus
NULL falls straight through to the title, so the 78-character headline kept
rendering. The fix was the fallback, not the field: it is now the slug.

### Left open

- **`twitter:site`** — wired in `lib/og.ts`, empty until a real X account
  exists. The guard in `tests/og.test.ts` enforces the `@handle` format when
  it is set.
- ~~**`Article`/`NewsArticle` JSON-LD** — still absent.~~ **Shipped
  2026-09-29**, closing `docs/04` Phase 4.3 and SEO backlog #6 together.
  `publisher` and `dateModified` are deliberately omitted — the reasoning is in
  `.claude/seo-backlog-2026-09-08.md` §6 and must be read before either is
  added back.
- **`itemReviewed.url` emits `""`** for any review that is not the primary
  domain.
- ~~**A production build has not been run** on this tree. `next dev` holds 10
  pooler connections and the build wants 8 against a 15-client cap.~~
  **Retired 2026-09-28, re-verified 2026-09-29**: the build runs to exit 0
  alongside `next dev`. The 15 was a Supavisor client cap, invisible to
  `pg_stat_activity`; `max_connections` is 60 and a full build adds one
  server-side connection.
