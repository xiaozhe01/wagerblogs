# TODO inventory — WagerBlogs

Every `TODO` marker in `app/`, `components/`, `lib/`, `scripts/`, as of
**2026-09-28**. **These stay in the source until the thing they name is actually
built.** They are not comment clutter: most are pre-publish gates tied to
CLAUDE.md's non-negotiables (no fabricated bylines, ratings, stats, badges or
helpline numbers), so deleting one silently removes a guard against shipping
placeholder data as if it were real.

Regenerate with:
`rg -n "TODO" app components lib tests scripts --glob '*.ts' --glob '*.tsx'`

**55 markers — 45 `TODO(cms)`, 7 untagged `TODO`, 2 `TODO(clerk)`,
1 `TODO(dev)`.**

> The previous version of this file was dated 2026-08-21 and counted 43 markers
> against `app/blog/[slug]`, `app/reviews/[slug]` and `components/Comments.tsx`
> — paths that no longer exist. Routes moved into `app/(frontend)/`, `/blog`
> became `/articles`, reviews gained a `[vertical]` segment, and components were
> reorganised into subdirectories. Every line reference below is current.

## Blocking gates — cannot publish with placeholder data (CLAUDE.md rule 3/4)

| file                                                | line     | what it gates                                                     |
| --------------------------------------------------- | -------- | ----------------------------------------------------------------- |
| `components/section/ArticleByline.tsx`              | 15       | real Person record; Article schema needs author.name + author.url |
| `app/(frontend)/page.tsx`                           | 260      | EditorialByline — the reviewer quote needs a real Person record   |
| `app/(frontend)/page.tsx`                           | 282      | "As Featured In" placements — no logo without proof               |
| `app/(frontend)/responsible-gambling/page.tsx`      | 265      | ExpertReview — no reviewer record connected                       |
| `app/(frontend)/responsible-gambling/page.tsx`      | 214      | stateSelfExclusion[] — never link an unverified registry          |
| `app/(frontend)/reviews/[vertical]/[slug]/page.tsx` | 434      | Trustpilot — no schema field for an external rating               |
| `app/(frontend)/legal/[doc]/page.tsx`               | 218      | LegalReview — no counsel sign-off; doc stays draft                |
| `components/layout/SiteFooter.tsx`                  | 92       | ComplianceBadge[] — omitted until verifiable                      |
| `app/(frontend)/categories/[slug]/page.tsx`         | 323      | SourcedStat[] — each figure needs a real source + period          |
| `app/(frontend)/articles/[slug]/page.tsx`           | 214      | Sources[] — Articles has no sources field; News does              |
| `app/(frontend)/about/page.tsx`                     | 30, 31   | Organisation record + teamMembers[] with credentials              |
| `lib/schema.tsx`                                    | 80       | Organization JSON-LD stays absent until the publisher is real     |
| `lib/types.ts`                                      | 163      | `verified` set from the record, never by hand                     |
| `app/(frontend)/layout.tsx`                         | 31       | explicit `tel:` links need a verified number                      |
| `lib/mock-data.ts`                                  | 865, 866 | verify the real helpline number before launch                     |
| `lib/mock-data.ts`                                  | 481, 806 | DirectoryEntry / SourcedStat verification gates                   |

## Phase 4 holds — no Payload source for the field yet

| file                                                | line              |
| --------------------------------------------------- | ----------------- |
| `app/(frontend)/categories/[slug]/page.tsx`         | 17, 205, 312, 316 |
| `app/(frontend)/reviews/[vertical]/[slug]/page.tsx` | 25, 446           |
| `app/(frontend)/news/[section]/[story]/page.tsx`    | 292               |
| `app/(frontend)/page.tsx`                           | 268, 277          |
| `components/rail/HomeRail.tsx`                      | 3                 |

`page.tsx:268` is the notable one: **`ComparisonCard` self-imports `operators`
and `compareRows` from `lib/mock-data` and takes no props**, so rule 5 — one
primary domain per ranked list — is currently enforced by a fixture file.

## Auth stubs — `docs/04` Phase 5, Clerk not installed

| file                                                | line | stub                                    |
| --------------------------------------------------- | ---- | --------------------------------------- |
| `components/layout/SideNav.tsx`                     | 111  | `TODO(clerk)` — static Log In link      |
| `components/layout/MobileNav.tsx`                   | 92   | `TODO(clerk)` — static Log In link      |
| `components/section/Comments.tsx`                   | 13   | composer wired to nothing; `disabled`   |
| `app/(frontend)/reviews/[vertical]/[slug]/page.tsx` | 394  | `TODO(FW-2)` — reader-review invitation |

`/login` returns 404 today, and all four of these link to or assume it.

## Rendering / data-shape follow-ups

| file                                     | line   | note                                            |
| ---------------------------------------- | ------ | ----------------------------------------------- |
| `components/cards/PostRow.tsx`           | 56     | metaItems need a real ISO date for `<time>`     |
| `components/section/Comments.tsx`        | 54     | comment records need an ISO timestamp           |
| `components/section/TopHeroSection.tsx`  | 4      | render the real lastReviewed date as `<time>`   |
| `components/section/ReviewSection.tsx`   | 5      | trust-block sequencing is hardcoded             |
| `app/(frontend)/authors/[slug]/page.tsx` | 179    | links need an author-filtered archive           |
| `app/(frontend)/contact/page.tsx`        | 19, 85 | contactChannels[] + a real form endpoint        |
| `lib/nav.ts`                             | 105    | restore the group once /articles has a taxonomy |
| `lib/pagination.ts`                      | 3      | real page size should come from the CMS         |
| `lib/search.ts`                          | 78     | Lexical bodies are not indexed, only titles     |

## Deployment

| file                           | line | check                                                                                                         |
| ------------------------------ | ---- | ------------------------------------------------------------------------------------------------------------- |
| `app/(frontend)/not-found.tsx` | 17   | `TODO(dev)` — must serve a real HTTP 404. Verify: `curl -sI https://wagerblogs.com/does-not-exist \| head -1` |

## Fixture files — stand-ins that remain by design

`lib/site-data.ts:2` (nav/footer taxonomy, deliberately static) ·
`lib/mock-data.ts` 274, 306, 556, 772, 835 ·
`scripts/fixtures/` — `news.ts` 26/46, `blog.ts` 18, `reviews.ts` 18,
`faq.ts` 12.

The `scripts/fixtures/` files are **seed inputs, not render-path reads**, with
one exception: `components/section/LatestStoriesSection.tsx` imports
`@/scripts/fixtures/news`. That awkward import is the deliberate marker for the
last fixture still on a render path.

## Untagged markers

Seven use a bare `TODO` rather than a scope tag — the four Phase 4 holds in
`categories/[slug]`, two in `reviews/[vertical]/[slug]`, and
`ReviewSection.tsx:5`. All would take `TODO(cms)` if the tags are ever
normalised.
