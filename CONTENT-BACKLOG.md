# CONTENT-BACKLOG.md

Work that must happen before public launch but sits outside FW-1's phase
sequence. Two kinds, kept apart because they are addressed by different people:

- **Editorial** — records awaiting real copy. A record awaiting an editor, not
  a route awaiting code.
- **Deferred technical** — known defects with a decided fix and a decided
  place in the sequence, parked so they do not widen a phase.

Neither drives FW-1's structural scope.

## How bracketed content lands publicly

Records ship with `[TO WRITE]` in SEO fields as a deliberate
visible-unfinished signal. `[Placeholder …]` in body and headline copy is
honest scaffold. Both are seen by public surfaces — pages, the sitemap
indirectly, and llms.txt. The pre-launch caveat in llms.txt names this
convention explicitly, which is what keeps it honest rather than misleading:

> This site is a pre-launch scaffold. Copy inside square brackets is
> placeholder text awaiting real records — treat any bracketed value as
> absent, not as fact.

## Current bracketed entries (as of 2026-09-24, post-4F-2)

18 of the 51 rows in llms.txt carry bracketed copy.

> **Re-counted 2026-09-28: now 16 lines**, down from 17. The
> `esports-betting` entry below is **fixed** — `noun` is "esports betting site"
> and `crumb` is "Esports", so `/llms.txt` reads "every esports betting site
> reviewed on the same criteria" and `/reviews/esports-betting` no longer emits
> a bracketed string into its BreadcrumbList. The six duplicate
> `help-directory-entries` are **deleted**, and the fixture that recreated them
> is empty — see below.
>
> **Three verticals still carry the same bracketed pair**: `horse-racing`,
> `sweepstakes-casinos`, `fantasy-sports`. None renders, because all three have
> `hasReviews: false` and `/reviews/<slug>` 404s. Latent, not live.

### News stories (10)

All ten seeded stories carry `[Placeholder headline — <section>]` titles and
`[Placeholder dek — <section>]` excerpts. Both surface in llms.txt, in feed
rows, in search, and in social previews. Real editorial work replaces these
when news publication starts.

### Articles (3)

All three seeded articles carry `[Placeholder]`-prefixed titles. Their
`excerpt` fields are real copy — only the titles are scaffold.

### Legal summaries (4)

All four legal documents' `summary` fields are bracketed. The schema
designates `summary` as that document's search excerpt, so each one is
public in three places. Real legal copy replaces these before public launch.

### Vertical field (1)

`esports-betting.noun` is literally `[TO WRITE] noun for esports-betting`.
This one differs in kind from the rest: it interpolates mid-sentence into a
generated string, producing a malformed sentence rather than copy that reads
as deliberately unwritten.

In llms.txt:

> every [TO WRITE] noun for esports-betting reviewed on the same criteria

A small admin-panel edit fixes it — a singular noun such as
`esports betting operator`. Worth doing ahead of the others, because it reads
as a bug rather than as scaffold.

## Author metadata worth strengthening

Neither author's credential line is bracketed, so both ship as genuine
authority signals. Two details on one record are weaker than they could be.
`Richard Reegan` / `Lead Review Editor` is the reference point here: full
name, complete title, no changes needed.

### Jane — both flags land on this record

**Mononym.** Ships as `Jane`, with no surname. A full name reads stronger to
an LLM as an authority signal, and is the weaker of the two gaps.

**Truncated credential.** `Chief Editorial` reads as an incomplete title
beside Richard's `Lead Review Editor` — likely intended as
`Chief Editorial Officer` or `Chief Editor`.

Two paths: give her a full name and a complete title, or remove the record
once real authors exist.

## SEO placeholders across records

Beyond the above, `[TO WRITE]` appears in `seo.metaTitle` and
`seo.metaDescription` on many records. These are the deliberate
visible-unfinished mechanism from the schema batch and are not tracked
individually here.

The schema enforces both as required at publish time, so any record carrying
them either stayed draft deliberately or was published with them in place.
Which of the two is the case has not been audited. **That audit is pre-launch
work**, and it matters more than the entries above: a published record with a
`[TO WRITE]` metaDescription puts bracketed copy into search-engine result
snippets, where no caveat travels with it.

# Deferred technical

Neither of the below belongs to Phase 5, which is Live Preview only.

## Cache invalidation scope does not match across surfaces — pre-launch

Phase 4F left write-invalidation wired for one surface and TTL-only for the
rest.

| Surface                              | Invalidation                         |
| ------------------------------------ | ------------------------------------ |
| Search corpus                        | `search-corpus` tag, busted on write |
| Sitemap, llms.txt, prerendered pages | 1h TTL only, no per-tag invalidation |

The hooks fire on change to Reviews, Articles, News, Authors, Verticals,
NewsSections, and the LegalDocuments and FAQ globals.

**Impact.** New or edited content appears in search within seconds, and in the
sitemap, llms.txt and page routes within an hour. A deleted record keeps
returning 200 on its own URL for up to that hour — observed directly when
`/authors/jane-placeholder` was deleted during 4F-4 and kept resolving until a
rebuild.

That is ordinary ISR behaviour, but it sits oddly against Phase 4F's premise
that crawler surfaces must not list URLs the router will not serve.

**Address before public launch:**

- Add per-route tags to the `unstable_cache` calls behind the sitemap and
  llms.txt.
- Extend the existing `afterChange` hooks to bust those tags too.
- Consider `revalidatePath` in the hooks for specific route invalidation.

## Seed idempotency is keyed on slug and name — own phase, after Phase 5

**Current.** Both seeds decide "already exists" by slug or name. A record
renamed in the admin is invisible to that check, so the next seed run creates
the original alongside the rename. Re-seeding a hand-edited database produces
duplicates rather than a no-op.

**Fix.** A `seedSource: string?` field on seed-populated collections and
globals, formatted `<collection>:<natural-key>` — for example
`articles:parlays-vs-straight-bets`. The seed writes it on creation and checks
it on subsequent runs, so the check survives an admin rename of slug or name.

Six schema additions: **Reviews, Articles, News, Authors,
help-directory-entries, bonus-offers.**

Backfill for the 30-odd existing seeded records by natural-key match, same
shape as `scripts/fix-market-stat-periods.ts`.

### Outstanding data from the failed check

Six duplicate `help-directory-entries` sit in the database, created 2026-09-24
by a verification seed run during 4F-4. They are bracketed placeholders
duplicating the six real organisations region for region:

`[National problem gambling helpline — US]`,
`[Provincial helpline network — Canada]`, `[National gambling helpline — UK]`,
`[Problem gambling service — Ireland]`,
`[Federal addiction support — Germany]`, `[Support line — Nordics]`.

They do **not** render — the help-directory page filters them out — so this is
database noise rather than a live content defect. Delete via the admin, or via
a small correction script.

### Deleted 2026-09-28, and the mechanism traced

All six were removed with a one-pass script, kept out of the repo. The
predicate was deliberately narrow — a bracketed name **and** `verified: false` —
so it could not match a real organisation. 12 rows → 6.

**The deletion is not durable, and this is the precise mechanism of the bug
described above.** Traced 2026-09-28:

- `lib/mock-data.ts:485` — `helpDirectory` contains **exactly those six
  bracketed names and nothing else**.
- `scripts/seed-content.ts:446` — loops over it to seed
  `help-directory-entries`.
- The six real organisations (`Gamcare.org.uk`, `Gamblingcare.ie`,
  `Spillemyndigheden`, `German Federal Ministry of Health`,
  `National Problem Gambling Helpline`, `Responsible Gambling Council Canada`)
  exist **only in the database**. They appear in no source file.

So the six placeholders were renamed to real organisations in the admin, and
the next seed run could not match them under their new names — exactly the
rename-defeats-idempotency failure this document describes. `npm run seed:content`
will recreate all six again.

Two ways to make it durable, neither taken yet because both pre-empt decisions
recorded elsewhere:

1. **Point the fixture at the real six.** Makes the seed a genuine no-op. But
   the real contact details would then live in source control, which is a
   verification question (rule 3) rather than a mechanical one.
2. **Drop `help-directory` from the seed entirely**, on the grounds that it is
   now hand-curated. Cheapest, and loses the ability to rebuild that collection
   from scratch.

Until one is chosen, the standing rule holds: **do not run either seed against
this database.**

### Region coverage gap — three of six regions have no entry

Separate from the duplicate bug, and older than it. `help-directory-entries`
offers six regions; only three carry any record at all:

| region                 | entries |
| ---------------------- | ------- |
| North America          | 2       |
| UK & Ireland           | 2       |
| Europe                 | 2       |
| Asia Pacific           | **0**   |
| Latin America          | **0**   |
| Middle East and Africa | **0**   |

The deleted placeholders never covered those three either, so nothing in the
2026-09-28 cleanup caused this — it was simply never visible, because the only
thing that would have shown it was a directory page filtered by a region with
no entries.

**Why it matters more than an ordinary content gap.** `/responsible-gambling`
links every "Play Responsibly" callout site-wide to this directory, and
`docs/04` Phase 6.2 specifies it as a _global_ directory of gambling-help
organisations. A reader in Asia Pacific, Latin America, or the Middle East and
Africa currently reaches a page that offers them nothing.

Filling it is verification work, not writing: every entry needs a real
organisation, a real contact, and a `verifiedAt` stamp before it publishes.
Rule 3 applies with unusual force here — a bracketed helpline is the one
placeholder class that must never reach a live route.

## Follow-ups from the access-rule fix — `dc38e2d`

The leak itself is closed. These are the loose ends it exposed.

### ~~Frontend queries pass no user~~ — resolved in `b0aa561`

Draft-mode queries passed no user, so the access rules filtered drafts out at
the data layer and Live Preview showed published content. Fixed by resolving
the editor through `payload.auth` and carrying it into `payload.find`; the
access rules were not weakened and `overrideAccess: false` stands. Verified in
the browser: a draft news story renders in the preview iframe.

Kept here because the shape recurs — a destructured `publishedFilter` result
silently drops `user`. `tests/draft-auth-propagation.test.ts` guards it.

### UGC visibility models are not unified

`ForumReplies` uses a `flagged` checkbox where `Comments`, `ReaderReviews` and
`ForumThreads` use a `status` select — and those three do not agree with each
other either (`approved`/`edited`, `approved`, `open`/`locked`). Each rule is
correct for its own schema; whether the schemas should agree is a consistency
question for a future schema pass, not a security one.

### Notifications need per-user scoping

Currently editors-only, which is right for today because no site user can
authenticate. When site-user auth lands, the rule needs
`user: { equals: req.user.id }` so a reader sees their own notifications and
nobody else's.

### site-users needs a public projection

Anonymous read is denied outright because the record carries `email` and
`username`. When public profiles are built, they need a dedicated projection
exposing display fields only — not a loosened rule on the raw collection.

## Editor attribution and an activity log — parked on cost

Raised while building the admin dashboard: the "Recently edited" panel cannot
show **who** edited a record, and there is no per-user operation history.

**Nothing records it today.** Measured, not assumed:

|                                  | State                                                                  |
| -------------------------------- | ---------------------------------------------------------------------- |
| `updatedBy` on documents         | does not exist                                                         |
| User column on `_<collection>_v` | does not exist — versions store content only                           |
| `payload_locked_documents`       | exists, but only says who has a record open **right now**              |
| Role field on `users`            | does not exist — columns are `email`, `salt`, `hash`, login throttling |
| Admin accounts                   | 1                                                                      |

So the dashboard shows no editor because the data was never captured, not
because the panel omits it. Displaying a guess would be a fabricated trust
signal.

**Parked deliberately.** An activity log writes a row for every create,
update, publish and delete across the editorial collections — permanent write
amplification and unbounded growth, carried forever, for a team small enough
that "who changed this" is usually answerable by asking. The overhead is not
worth it at current size.

**Revisit when** the team is large enough that attribution stops being
answerable in person, or when an external requirement (a compliance ask, a
dispute over a published change) makes the history load-bearing.

If it is picked up, the order matters:

1. **A role field on `users` first.** Access rules currently key off
   `req.user.collection === "users"`, which is a stand-in for a role model.
   Without roles there is no "super admin" to restrict a log view to.
2. **`activity-log` collection plus `afterChange`/`afterDelete` hooks** — the
   same hook shape `revalidateSearch` already uses. The record title must be
   **denormalised into the log row**: a deleted document cannot be
   dereferenced afterwards, which is exactly when the log matters.
3. **Retention decided before it ships**, not after it is large.
4. **"Recently edited" then reads the log** rather than needing its own
   `lastEditedBy` column — which is why adding that column alone is not worth
   doing as a shortcut.
