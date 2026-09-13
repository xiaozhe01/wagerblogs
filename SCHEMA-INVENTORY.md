# Schema needs inventory

What the frontend actually renders today, as evidence for designing fresh
collection drafts. Reading pass only — no files outside this one were touched,
and no field types or Payload configuration are proposed here.

Field types are described **as the frontend currently treats them**, including
where that treatment is wrong. Broken shapes are kept as signal.

Data comes from four registries — `lib/reviews.ts`, `lib/blog.ts`,
`lib/news.ts`, `lib/categories.ts` — plus one fixture file,
`lib/mock-data.ts` (1044 lines), with shapes declared in `lib/types.ts`.

---

## 1. Reviews (operators)

**Rendered by**
- `app/(frontend)/reviews/page.tsx` — hub, lists groups
- `app/(frontend)/reviews/[group]/page.tsx` — paginated operator list
- `app/(frontend)/reviews/[group]/[slug]/page.tsx` — full review
- `components/section/RankedList.tsx`, `RankedListSection.tsx`
- `components/section/ComparisonCard.tsx`, `ReviewDirectorySection.tsx`
- `components/section/ProsConsSection.tsx`, `ReviewSection.tsx`
- `components/rail/AtAGlanceCard.tsx`, `OtherBooksCard.tsx`
- `components/controls/PrimaryDomainLink.tsx`
- Source: `lib/reviews.ts` → `mockRankedSportsbooks`, `mockRankedCasinos`,
  `mockPeakWagerReview` in `lib/mock-data.ts`

**Fields read** (`Operator`, `lib/types.ts:108`)

| Field | Current treatment | Used by |
| --- | --- | --- |
| `id` | string | keys |
| `slug` | string, URL segment under `/reviews/<group>/` | routing, `generateStaticParams` |
| `name` | string | everywhere |
| `score` | number | ranked rows, directory, at-a-glance |
| `categoryScores` | array of `{ label: string; score: number }` — **`label` is free text authored per operator**, not a reference | review page, comparison |
| `advantages` | string[] | ranked rows; also the search excerpt fallback (`lib/search.ts`) |
| `lastVerified` | string, **pre-formatted display text**, bracketed placeholder | review page |
| `terms` | string | bonus terms line |
| `isPrimaryDomain` | boolean; only one per rendered list may be true | link gating |
| `primaryDomainLink` | `{ anchorText, url, relAttribute }`, present only when `isPrimaryDomain` | `PrimaryDomainLink` |
| `pros` / `cons` | string[], optional — review page only | `ProsConsSection` |

**Group wrapper** (`ReviewGroup`, `lib/reviews.ts:4`): `slug`, `href`, `title`,
`crumb` (breadcrumb label), `noun` (singular word used in running copy),
`operators[]`.

**Relationships**
- → **RubricCriteria** *(implied, absent)*. `categoryScores[].label` is free
  text; nothing links a score to a shared criterion.
- → **ReviewGroup** *(currently structural)*: operators are nested inside a
  hardcoded group array, not referenced by a field on the operator.
- → **Author/reviewer** *(implied, absent)*. `ReviewerByline` renders an empty
  state; TODO at `reviews/[group]/[slug]/page.tsx:164` says Review schema needs
  `author.name`.
- → **Reader reviews** (§2) and **Comments** (§3) both render on this page.

**Lifecycle / state signals**
- `lastVerified` implies a re-verification cycle; currently a bracketed string.
- `isPrimaryDomain` is an exclusivity constraint across a *list*, not a
  per-record flag — CLAUDE.md rule 5.
- `href` is **stored on the group record** rather than derived from slug.
- Ordering is array order; no explicit rank/weight field.
- No draft/published state anywhere.

**Expected but with no real source**
- Reviewer byline, Trustpilot rating, compliance badges — deliberate empty
  states (CLAUDE.md rule 3).
- `lastVerified` bracketed on purpose (`page.tsx:133` TODO).
- Per-operator bonus offer — TODO at `page.tsx:194`.

**Related bugs** — MIGRATION.md §D2 (positional comparison keys), §D4
(outbound `rel` asymmetry), §D1 (funded-account gate absent).

---

## 2. Reader reviews — **distinct from Comments**

**Rendered by** `app/(frontend)/reviews/[group]/[slug]/page.tsx`.
Source: `reviewReaderReviews`, `lib/mock-data.ts:298`.

**Fields read**

| Field | Current treatment |
| --- | --- |
| `username` | string, bracketed `[@somename]` |
| `meta` | string, **one pre-formatted line combining date and status**: `"[12/02/2026] · verified member"` |
| `text` | string |

**Relationships** → **User** *(implied, absent)*: "verified member" is text
inside `meta`, not a reference. → **Operator** *(implied)*: placeholder copy
states *"one account per operator"*, an integrity constraint with nothing
enforcing it.

**Lifecycle** the placeholder text states *"moderated before publish"* and
*"edits create a new moderation pass"* — a moderation lifecycle described in
copy with no field behind it. This is the type CLAUDE.md rule 4 governs:
`AggregateRating` may be computed only from real moderated reviews. **No rating
value is currently stored on a reader review** — only free text.

**Note for design:** this is a separate type from §3. Both render on the same
page and both currently use `username`/`text`, which makes them easy to
conflate.

---

## 3. Comments

**Rendered by** `components/section/Comments.tsx`, mounted only on
`app/(frontend)/reviews/[group]/[slug]/page.tsx`.
Source: `sampleComments`, `lib/mock-data.ts:727`.

**Fields read**: `username` (string), `date` (string, bracketed
`[MM/DD/YYYY]`), `text` (string).

**Relationships** → **User** *(implied, absent)* — `username` is a plain
string. → **Parent content** *(implied)* — comments are passed no target id;
the component takes no props, so it cannot know what it is attached to. No
parent/child field, so no threading.

**Lifecycle** composer is hard-`disabled`; note reads *"held for moderation
before it appears"*. The heading renders `sampleComments.length` as
**"N published"** — a count that must become status-filtered once a status
field exists. TODO at `Comments.tsx:13`: *"wire to auth + the moderation queue,
then drop the `disabled` flags."*

**Related bugs** — MIGRATION.md §D3.

---

## 4. Blog / Guides

**Rendered by**
- `app/(frontend)/blog/page.tsx` (paginated), `blog/[slug]/page.tsx`
- `components/cards/BlogPostCard.tsx`, `components/section/BlogSection.tsx`
- `components/section/RecentPublishedSection.tsx`
- Source: `lib/blog.ts` (3 records) + `blogToc`, `blogBodyList`,
  `blogTakeaways`, `blogRelated` in `lib/mock-data.ts`

**Fields read**

| Field | Current treatment |
| --- | --- |
| `slug` | string |
| `href` | string, **stored** (`/blog/<slug>`) rather than derived |
| `kicker` | string — values are `"Guides"`, `"Analysis"` |
| `title` | string, bracketed `[Placeholder] …` |
| `excerpt` | string, also consumed by the search index |
| `publishedAt` | string, **pre-formatted display date** `"[Jul 18, 2026]"` |
| `updatedAt` | string, same |
| `readTime` | string, `"9 min read"` — **pre-computed, not derived** |
| `byline` | string, **pre-formatted display string**: `"by [author] · 07/18/2026"` |

**Relationships** → **Author** *(implied, absent)*: see `byline` above.
→ **Category/type** *(implied)*: `kicker` overlaps `categoryFilters` in
`lib/site-data.ts:68` = `["All","Guides","Analysis","Research","News"]`.

> **Open question for the human:** is **Guides** a distinct content type, or a
> `kicker`/type value on Blog posts? Evidence for the latter: there is no
> `/guides` route; "Guides" is one of four `categoryFilters` values and appears
> as a `kicker` string on blog records. Evidence for the former: the previous
> handoff listed Guides and Blog as separate collections. Reporting the
> evidence rather than deciding.

**Lifecycle** `publishedAt` vs `updatedAt` distinction exists; both display
strings. No draft/published flag. Ordering is array order.

**Expected but with no real source** the entire body is shared placeholder —
`lib/blog.ts:33` TODO: *"the body below is static placeholder; only the record
fields vary."* Also TOC, takeaways, related posts, and a hero image
(`blog/[slug]/page.tsx:92` TODO requires a real `<Image>` + figcaption credit).

**Related bugs** — MIGRATION.md §D5.

---

## 5. News — its own type, not a Guides variant

**Rendered by**
- `app/(frontend)/news/page.tsx`, `news/[slug]/page.tsx`,
  `news/[slug]/[story]/page.tsx`
- `components/section/LatestNewsSection.tsx`, `LatestStoriesSection.tsx`
- `components/rail/NewsRail.tsx`, `components/cards/PostRow.tsx`
- Source: `lib/news.ts` → `newsFeed` (`lib/mock-data.ts:846`)

**Fields read** (`NewsItem`, `lib/types.ts:73`; `NewsStory` adds `slug`, `href`)

| Field | Current treatment |
| --- | --- |
| `title` | string, bracketed |
| `excerpt` | string — dek on feed rows *and* standfirst on the story page |
| `meta` | string, **one pre-formatted summary line** |
| `category` | string, **must match `newsCategories`** in `lib/site-data.ts:82` — an unenforced string contract |
| `publishedAt` | string, pre-formatted |
| `readTime` | string, pre-computed |
| `slug`, `href` | strings; `href` stored |

**Section wrapper** (`NewsSection`, `lib/news.ts:30`): `category`, `slug`,
`href`, `stories[]`.

**Relationships** → **Author** *(implied, absent)*: `lib/news.ts:27` builds
`metaItems: [readTime, publishedAt, "by [author]"]` — the literal token
`[author]`. A second, separate author object exists at
`mock-data.ts:940` (`newsStoryAuthor` = `{ name, credential, profileHref }`),
unconnected to `mockAuthor`. → **Section/category** *(currently a string match)*.

**Lifecycle** routed taxonomy, not query-filtered (`/news/<section>/<story>`).
`sectionSummary()` derives *"N stories · latest <date>"* from array order, so
**ordering is load-bearing** and implies recency sorting. No draft state.

**Expected but with no real source** story bodies are static placeholder;
per-story takeaways (`newsStoryTakeaways`) are one shared array; sources and
revisions are TODO'd empty states (`[story]/page.tsx:148,159`); hero image
TODO at `:106`.

---

## 6. Authors

**Rendered by** `app/(frontend)/authors/[slug]/page.tsx`,
`components/section/ArticleByline.tsx`. Source: `mockAuthor`, `authorBeats`,
`authorStandards`, `authorArticles` (`lib/mock-data.ts:20-90`).

**Fields read** (`Author`, `lib/types.ts:48`): `id`, `slug`, `name`,
`credentialLine` (string), `photoUrl` (string), `bio?` (string).

Sub-content on the author page: `authorBeats` (string[]), `authorStandards`
(string[]), `authorArticles` (`PostTeaser[]`).

**Relationships** → **Posts/News/Reviews** *(implied, absent in both
directions)*. `authorArticles` is a hardcoded teaser list, not a query. TODO at
`authors/[slug]/page.tsx:83`: *"article list renders from posts where author ===
this record."*

**Lifecycle** `generateStaticParams` is a TODO (`:11`) — **every slug returns
the same author record**. TODO at `:37` notes beats become links once an
author-filtered archive exists. TODO at `:110`: `sameAs` profiles omitted.

**Expected but with no real source** photo, full name, credential, bio,
author URL — `ArticleByline.tsx:11` states a real Person record is required and
that *"a post cannot publish without it"* because `Article` schema needs
`author.name` + `author.url`.

**Related bugs** — MIGRATION.md §D5.

---

## 7. Categories — **decision required**

**Rendered by** `app/(frontend)/categories/page.tsx`,
`categories/[slug]/page.tsx`, `components/cards/LinkTileGrid.tsx`,
`components/controls/FilterChips.tsx`, `lib/nav.ts`.
Source: `lib/categories.ts`, derived from `categories` in `lib/site-data.ts:58`.

**Fields read** (`Category`, `lib/categories.ts:5`): `slug`, `href` (stored),
`name`, `desc`.

**Relationships** → **Articles** *(implied)*: the landing page renders
`categoryArticles` + `categoryCompareLinks` from `mock-data.ts`, filtered
client-side by `TYPE_PARAM`. Nothing links an article to a category record.

> **The human's question: taxonomy, or full content type with landing pages?**
>
> **Frontend evidence for taxonomy:** the record has four fields and **no body**;
> it is derived from a flat array in `site-data.ts`; the landing page renders a
> *filtered list of other content* through `FilterChips`/`TYPE_PARAM`, not its
> own prose; `lib/categories.ts:11` TODO says *"the taxonomy comes from the CMS,
> and each record carries its own article list — today the body content below a
> category is shared placeholder."*
>
> **Evidence against pure enum:** each term carries its own `desc`, its own
> route, and its own page metadata — none of which an enum or a global holds
> per-term — and other content types need to reference it.
>
> **My read:** taxonomy semantics, but it needs per-term records, not an enum.
> Flagged as a decision.

---

## 8. FAQ

**Rendered by** `app/(frontend)/faq/page.tsx` (shadcn Accordion) and
`lib/search.ts` (indexed, `scope: "pages"`). Source: `lib/faq.ts`.

**Fields read** (`FaqEntry`, `lib/faq.ts:1`): `q` (string), `a` (string),
`link?` (`{ href, label }`).

**Relationships** → **Source content** *(explicit intent)*: the `link` field's
comment states every entry *"summarises a section that already exists somewhere
else, and links back to it rather than becoming a second source of truth."*
Some answers are drawn from `methodSteps` and `authorStandards`.

**Lifecycle** `faqPageJsonLd` (`lib/schema.tsx:96`) emits **only entries with
real answers** — bracketed placeholders are excluded from structured data. That
is an implicit published/pending distinction with no field behind it.

**Expected but with no real source** several answers stay bracketed until the
sections they summarise are written. `lib/faq.ts:12` TODO: *"one FAQ
collection, so answer and source cannot drift apart."*

**Search note** every FAQ entry indexes to the bare `/faq` URL — there is no
per-entry anchor, so all FAQ search hits share one destination.

---

## 9. Help directory — **decision required**

**Rendered by** `app/(frontend)/responsible-gambling/help-directory/page.tsx`.
Source: `helpDirectory` (`lib/mock-data.ts:652`).

**Fields read** (`HelpDirectoryEntry`, `lib/types.ts:149`)

| Field | Current treatment |
| --- | --- |
| `name` | string, bracketed |
| `country` | string, ISO-like code (`"IE"`) |
| `desc` | string |
| `contacts` | `Record<HelpContactKind, string>` — keys `phone`, `site`, `chat` |
| `isCrisisLine?` | boolean, optional |

Grouped by `HelpDirectoryRegion` = `{ region, entries[] }`, where `region`
values align with `regions` in `lib/site-data.ts:71`.

**Relationships** → none internal. Entries point at **external
organisations**, not at our own content.

**Lifecycle / integrity** `isCrisisLine` carries a verification constraint in
`lib/types.ts:153-157`: *"A claim about a real organisation, so it is set only
alongside a verified entry … TODO(cms): set from the verified record, never by
hand."* An unverified/verified distinction is required by CLAUDE.md rule 3.

> **The human's question: collection of articles, or navigation over existing
> content?**
>
> **My read: neither — it is a directory of external organisation records.**
> Each entry is a third party with contact routes (`phone`/`site`/`chat`), not
> an article and not a link to our own pages. It needs per-record storage plus a
> verification flag.

---

## 10. Legal documents

**Rendered by** `app/(frontend)/legal/[doc]/page.tsx`; also indexed by
`lib/search.ts` (`kicker: "Legal"`). Source: `legalDocs`
(`lib/mock-data.ts:455`), keyed by slug.

**Fields read**: `title` (string), `intro` (string, bracketed), `summary`
(string, bracketed — also the search excerpt), `sections[]` (nested blocks).

**Lifecycle** `generateStaticParams` is TODO'd (`:10`). Revisions are an
explicit empty state — `:65` TODO: *"revisions[] — every published change
appends a dated entry here."* `:139` TODO: *"LegalReview — no counsel sign-off
connected."* So a review/approval lifecycle is anticipated but absent.

Four documents exist: privacy-policy, terms-of-service, affiliate-disclosure,
cookie-policy.

---

## 11. NCPG self-assessment — **no stored responses**

**Rendered by** `components/section/SelfAssessment.tsx` (client component),
mounted on `app/(frontend)/responsible-gambling/page.tsx`. Instrument data in
`lib/self-assessment.ts`.

**Storage check:** the component holds `answers`, `index` and `finished` in
`useState` only. There is **no `fetch`, no `POST`, no `localStorage`, no
`sessionStorage`** anywhere in the file. Responses never leave the browser.

**Read:** no collection needed. Since this is the real NCPG-sourced instrument
with verbatim text and published scoring bands, not persisting answers is a
privacy property worth preserving rather than a gap. The instrument questions
themselves are static reference data in code.

---

## 12. Forum threads and replies — **no frontend consumer**

Case-insensitive search across `components/`, `app/(frontend)/` and `lib/`
returns **0 files** for `forumThread` and `forumReply`. There is no forum
route, no thread listing, no reply component. Nothing in the frontend implies
this type today.

---

## 13. Notifications — **no frontend consumer**

Same search returns **0 files** for `notification`. No bell, no inbox, no
unread count anywhere in the nav or header.

---

## 14. Users

**Rendered by** nothing in the frontend renders a user record. Three components
link to `/login` — `components/layout/SideNav.tsx:113`,
`components/layout/MobileNav.tsx:96`,
`app/(frontend)/reviews/[group]/[slug]/page.tsx:245` — and **that route does not
exist; it returns HTTP 404**. All three carry `TODO(clerk)` comments.

Payload's own `users` collection exists in Supabase (1 row, the admin account)
and `/api/users` correctly returns 403 unauthenticated.

**Implied by other types:** §2 needs "verified member" status and a
one-review-per-operator constraint; §3 needs comment authorship. Both currently
store a bare `username` string.

**Note** the previous handoff's context said auth uses Clerk; **Clerk is not
installed** (no dependency in `package.json`). Whether site users are Payload
users, Clerk users, or Supabase Auth users is undecided.

---

## 15. Other renderable content with no obvious owner

Reported as evidence, not proposed as types.

| Data | Shape | Rendered by |
| --- | --- | --- |
| `bonusOffers` | `BonusOffer` (`lib/types.ts:30`) — discriminated union on `isPrimaryDomain`; `name`, `headline`, `code`, `benefits?`, plus `primaryDomainLink` **or** `operatorLink` | `components/section/FeaturedBonusesCard.tsx`, `components/cards/BonusOfferCard.tsx` |
| `marketStats` | `{ value, label, source, period }` — TODO: *"each figure needs a real source + period, or it is dropped from the strip entirely (never shown uncited)"* | `components/section/MarketCard.tsx` |
| `toolboxItems` | tool links | `components/section/BettingToolboxSection.tsx` |
| `methodSteps` | review methodology steps | `components/section/ReviewCard.tsx`, and reused by `lib/faq.ts` |
| `authorStandards`, `authorBeats` | string[] | author page |
| `rgWarningSigns`, `rgTools`, `rgResources`, `rgCommitments`, `rgToc` | page-section content | `/responsible-gambling` |
| `recentPosts`, `categoryArticles`, `categoryCompareLinks`, `blogRelated`, `reviewRelated`, `authorArticles` | all `PostTeaser[]` | various feeds |

**`PostTeaser`** (`lib/types.ts:59`) is worth calling out: six different feeds
across the site render through this one shape — `kicker?`, `title`, `meta`,
`excerpt?`, `metaItems?`, `href`. It is a **projection**, not a content type;
today each instance is hand-authored rather than derived from a source record.

`bonusOffers` is the strongest candidate for a real type of its own: it has a
declared union type, two dedicated components, and per-operator data
(`reviews/[group]/[slug]/page.tsx:194` TODO wants the offer to become
per-operator). Flagged for the human, not assumed.

---

## Cross-cutting observations

1. **Display strings instead of data.** `byline`, `meta`, `lastVerified`,
   `publishedAt`, `readTime` and reader-review `meta` are all pre-formatted for
   rendering. Dates are bracketed placeholder text, not dates. Any field the
   frontend reads as one string may need to be several.
2. **`href` is stored, not derived.** Blog, News, Categories and ReviewGroup
   records each carry `href` alongside `slug`, so the two can drift.
3. **String contracts with no enforcement.** `NewsItem.category` "must match one
   of `newsCategories`"; blog `kicker` overlaps `categoryFilters`; help-directory
   `region` aligns with `regions`. All three are comment-documented conventions
   between a record and a hardcoded array.
4. **Placeholders are deliberate.** Bracketed `[…]` values are honest empty
   states under CLAUDE.md rule 3, not unfinished data. Whatever replaces them
   must keep a pending state that renders as absent rather than as a plausible
   fake value.
5. **No draft/published state exists anywhere** in the frontend's data, yet
   several TODOs and the FAQ JSON-LD filter assume one.
6. **Ordering is array order** everywhere — ranked operators, news recency,
   comparison rows. Only `ComparisonCard` depends on index *alignment* between
   two arrays (MIGRATION.md §D2).
