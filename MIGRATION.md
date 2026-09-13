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

| File                                             | Consumes                                | Source                                | State                                                     |
| ------------------------------------------------ | --------------------------------------- | ------------------------------------- | --------------------------------------------------------- |
| `app/(frontend)/reviews/page.tsx`                | `reviewGroups[]`                        | `lib/reviews.ts`                      | working                                                   |
| `app/(frontend)/reviews/[group]/page.tsx`        | `group.operators[]`, paginated          | `lib/reviews.ts`                      | working                                                   |
| `app/(frontend)/reviews/[group]/[slug]/page.tsx` | full `Operator` + `mockPeakWagerReview` | `lib/reviews.ts` + `lib/mock-data.ts` | working; byline and Trustpilot render honest empty states |
| `components/section/ReviewCard.tsx`              | `methodSteps`                           | `lib/site-data.ts`                    | working                                                   |
| `components/section/RankedList.tsx`              | `Operator[]`                            | props                                 | working                                                   |
| `components/section/ComparisonCard.tsx`          | `ComparisonOperator[]`, `compareRows`   | `lib/mock-data.ts`                    | working                                                   |
| `components/section/ProsConsSection.tsx`         | `Operator.pros/cons`                    | props                                 | working                                                   |

`Operator` (`lib/types.ts:108`) carries `score`, `categoryScores[]`,
`advantages[]`, `lastVerified`, `terms`, `isPrimaryDomain`,
`primaryDomainLink?`, `pros?`, `cons?`.

### Guides / blog

| File                                  | Consumes                                                                | Source                             | State                                                                                         |
| ------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `app/(frontend)/blog/page.tsx`        | `blogPosts[]` (3 entries)                                               | `lib/blog.ts`                      | working                                                                                       |
| `app/(frontend)/blog/[slug]/page.tsx` | post record + `blogToc`, `blogBodyList`, `blogTakeaways`, `blogRelated` | `lib/blog.ts` + `lib/mock-data.ts` | **body copy is static placeholder** — only record fields vary by slug (`lib/blog.ts:33` TODO) |
| `components/cards/BlogPostCard.tsx`   | title, kicker, excerpt, byline, href                                    | props                              | working                                                                                       |

### News (no collection provided — see gaps)

`app/(frontend)/news/page.tsx`, `news/[slug]/page.tsx`,
`news/[slug]/[story]/page.tsx` consume `newsSections[]` / `NewsItem` from
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
behind it. Rendered only on `reviews/[group]/[slug]`.

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
  `ComparisonCard` keys `compareRows` **positionally by array index**.
- **Schema:** scores relate to `RubricCriteria` records.
- **Recommendation:** **genuine divergence needing a decision.** Index-keyed
  comparison rows break if criteria become relationships with stable IDs and
  variable ordering. Whether `ComparisonCard` re-keys by criterion ID is a
  frontend fix, but whether the rubric is ordered/versioned is a schema
  question.

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

### Route naming reconciliation

The frontend uses `blog/[slug]`, `news/[slug]/[story]`,
`reviews/[group]/[slug]`. The schema uses `articles`, `news`, `reviews` with a
`verticals` relationship. Route naming reconciliation is a decision for the
frontend-wiring handoff — either the frontend routes get renamed to match the
schema, or the data-fetching layer maps between them. **Do not resolve now.**

Related: `reviews/[group]` and the `verticals` collection describe overlapping
concepts under different names — see SCHEMA-INVENTORY.md on the four taxonomy
axes, where review groups are a renamed subset of verticals.
