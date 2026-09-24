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
