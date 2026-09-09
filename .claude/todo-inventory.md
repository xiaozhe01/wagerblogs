# TODO inventory — WagerBlogs

Every `TODO` marker in `app/`, `components/`, `lib/`, `tests/`, as of
2026-08-21. **These stay in the source until the thing they name is actually
built.** They are not comment clutter: most are pre-publish gates tied to
CLAUDE.md's non-negotiables (no fabricated bylines, ratings, stats, badges or
helpline numbers), so deleting one silently removes a guard against shipping
placeholder data as if it were real.

Regenerate with:
`grep -rn "TODO" app components lib tests --include="*.ts" --include="*.tsx"`

**43 markers — 38 `TODO(cms)`, 1 `TODO(dev)`, 3 untagged `TODO`.**

## Blocking gates — cannot publish with placeholder data (CLAUDE.md rule 3/4)

| file                                     | line                                                               | what it gates                                                     |
| ---------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `components/section/ArticleByline.tsx`   | 11                                                                 | real Person record; Article schema needs author.name + author.url |
| `components/section/WriterQuoteCard.tsx` | 6                                                                  | EditorialByline — real Person record                              |
| `app/page.tsx`                           | 44                                                                 | EditorialByline — real Person record                              |
| `app/reviews/[slug]/page.tsx`            | 128                                                                | ReviewerByline — Review schema needs author.name                  |
| `app/responsible-gambling/page.tsx`      | 191                                                                | ExpertReview — no reviewer record connected                       |
| `app/authors/[slug]/page.tsx`            | 32                                                                 | Person record — photo, fullName, credential, bio, slug            |
| `app/reviews/[slug]/page.tsx`            | 240                                                                | TrustpilotWidget requires real data                               |
| `app/legal/[doc]/page.tsx`               | 135                                                                | LegalReview — no counsel sign-off; doc stays draft                |
| `components/layout/SiteFooter.tsx`       | 77                                                                 | ComplianceBadge[] — omitted until verifiable                      |
| `lib/mock-data.ts`                       | 1027                                                               | verify the real helpline number before launch                     |
| `lib/mock-data.ts`                       | 690, 726                                                           | help-directory contact details are a verification gate            |
| `app/responsible-gambling/page.tsx`      | 154                                                                | stateSelfExclusion[] — never link an unverified registry          |
| `app/page.tsx`                           | 56 · `app/categories/[slug]/page.tsx` 168 · `lib/mock-data.ts` 957 | SourcedStat[] — each figure needs a real source + period          |
| `app/blog/[slug]/page.tsx`               | 188                                                                | Sources[] — every numeric claim needs a citation                  |
| `app/page.tsx`                           | 72                                                                 | "As Featured In" placements — omitted, no logo without proof      |

## CMS wiring — static stand-ins to replace

`app/authors/[slug]/page.tsx` 9, 54, 80 · `app/blog/[slug]/page.tsx` 18 ·
`app/categories/[slug]/page.tsx` 27 · `app/legal/[doc]/page.tsx` 15, 66 ·
`app/reviews/[slug]/page.tsx` 26 · `app/not-found.tsx` 24 ·
`app/page.tsx` 24 · `components/cards/ExploreCategoryCard.tsx` 8 ·
`lib/mock-data.ts` 412, 534, 797, 986, 1010, 1011 · `lib/site-data.ts` 2 ·
`tests/a11y/routes.ts` 12

## Feature stubs — not wired to anything yet

| file                                               | line | stub                                                   |
| -------------------------------------------------- | ---- | ------------------------------------------------------ |
| `components/layout/TopHeader.tsx`                  | 15   | real search + mobile nav drawer                        |
| `components/layout/SideNav.tsx`                    | 110  | real auth state (static Log In link)                   |
| `components/Comments.tsx`                          | 12   | composer assumes a signed-in viewer, not wired to auth |
| `app/reviews/[slug]/page.tsx`                      | 190  | swap invitation state for real auth                    |
| `app/responsible-gambling/help-directory/page.tsx` | 23   | real region filtering                                  |

## Deployment

| file                | line | check                                                                                                                         |
| ------------------- | ---- | ----------------------------------------------------------------------------------------------------------------------------- |
| `app/not-found.tsx` | 14   | `TODO(dev)` — must serve a real HTTP 404, not a soft-404. Verify: `curl -sI https://wagerblogs.com/does-not-exist \| head -1` |

## Resolved this session (removed correctly, not lost)

- screening questions → real NODS instrument in `lib/self-assessment.ts`
- full-review alternate template → route deleted
- `ReviewerByline` / `Sources[]` → reworded and moved, still present

**One was lost and has been restored:** the `ArticleByline` gate disappeared
when that block was extracted into its own component. Watch for this whenever
a block moves into a component — the marker has to travel with it.

## Untagged markers

Three use a bare `TODO` rather than a scope tag (`TopHeader.tsx` 15,
`help-directory/page.tsx` 23, `reviews/[slug]/page.tsx` 190). All three are
feature stubs, so `TODO(dev)` would fit if the tags are ever normalised.
