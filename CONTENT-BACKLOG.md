# CONTENT-BACKLOG.md

Editorial content needing real copy before public launch. This file records
what is placeholder or template-generated; it does not drive FW-1's structural
scope. Nothing here is a wiring defect — every entry is a record awaiting an
editor, not a route awaiting code.

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
