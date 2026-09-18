# Collection wiring — comprehension inventory and divergence report

Step 1 is complete. Step 2 is partially complete and blocked — see the note at
the head of that section. No frontend file was modified; this was a reading
pass only.

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
schema homes. The News filter chip on `/categories/[slug]` pages is resolved as
a frontend query change, not a schema change.

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

### Rich-text internal links do not resolve yet

`internalDocToHref` (`components/rich-text/converters/link.tsx`) is a stub. A
Lexical link with `linkType: 'internal'` carries a document reference, and
turning that into a URL needs the route names Phase 3 settles. Until then the
stub **throws in development** and returns `/#internal-link-not-resolved` in
production, rather than Payload's default of logging and rendering `#`.

Phase 4 implements it. Until it does, authors should use custom URLs for
internal links, not the internal-document picker.

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

**UGC collections are a third category and are not covered by this.**
ReaderReviews, Comments, ForumThreads and ForumReplies carry their own `status`
field with moderation semantics (`pending` / `approved` / `rejected` / `spam`).
That is a moderation queue, not a publish lifecycle, and it stays distinct from
`_status`.

Every `payload.find` in the frontend states which side it is on in a comment,
so a missing filter reads as a mistake rather than a style difference.
