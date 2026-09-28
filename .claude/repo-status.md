# Repo status — WagerBlogs

**Rewritten 2026-09-28.** Records where things stand, not what to do next.
Everything in the table below was run this session; anything older is marked
as such rather than restated as current.

The previous version of this file was swept 2026-08-25 and re-verified
2026-08-29, before PayloadCMS was installed. It claimed "Payload, Clerk and
Supabase are **not installed**" and listed a route set that no longer exists.
All of that is superseded here.

| Check               | Result                                                                        |
| ------------------- | ----------------------------------------------------------------------------- |
| `npx tsc --noEmit`  | clean                                                                         |
| `npm run lint`      | 0 errors, 32 warnings (all generated migrations + `playwright/` scratch)      |
| `npm run test:unit` | 77 passed, 0 failed                                                           |
| `npm run test:a11y` | 254 passed, 0 failed, 14 skipped                                              |
| `migrate:status`    | 7 migrations, all applied                                                     |
| Prettier            | clean at `--print-width 100` (there is no config file — always pass the flag) |

**Not re-run since 2026-08-29**, so treat as stale rather than green: landmark
naming (`visual-harness/section-names.mjs`) and horizontal-overflow sweep
(`visual-harness/overflow-check.mjs`).

`npm run build` — **run 2026-09-28, exit 0.** Three runs: 63s, 69s, and 68s
with the dev server deliberately left running. 66 static pages, four workers,
one warning ("No email adapter provided", from Payload).

**The "build fails while dev runs" rule did not reproduce and has been
retired.** Sampling `pg_stat_activity` across a build showed server-side
connections going 14 → 15 — a delta of **one** — because Supavisor multiplexes
the four workers. `max_connections` is **60**, not 15; the 15 figure is a
Supavisor _client_ cap, which `pg_stat_activity` cannot show, and which the
build never came close to exhausting in practice.

## Stack

`next 16.2.12` · `react 19.2.4` · `payload ^3.89.0` ·
`@payloadcms/db-postgres ^3.89.0` · `tailwindcss ^4`.

PayloadCMS and Supabase Postgres are **installed and live** — every route
renders from the CMS. Media is on Supabase Storage via
`@payloadcms/storage-s3`. **Clerk is not installed**; it remains specified in
`docs/04` Phase 5 and nothing in `package.json` references it.

20 collections · 7 tracked migrations · 21 frontend routes.

## Routes that exist

```
/  ·  /about  ·  /contact  ·  /faq  ·  /search
/articles  ·  /articles/[slug]
/news  ·  /news/[section]  ·  /news/[section]/[story]
/reviews  ·  /reviews/[vertical]  ·  /reviews/[vertical]/[slug]
/categories  ·  /categories/[slug]
/authors  ·  /authors/[slug]
/legal/[doc]
/responsible-gambling  ·  /responsible-gambling/help-directory
/[...notfound]
```

Plus `app/(payload)/` — admin, REST/GraphQL, and the draft-mode preview
entry/exit routes.

## Open

**1 · `docs/04` Phase 5 (Clerk auth + UGC) is not started.** `/login` returns
404 and is linked from `SideNav` and `MobileNav`, both carrying `TODO(clerk)`.
The UGC collections (Comments, ReaderReviews, ForumThreads, ForumReplies)
exist with access rules and moderation fields, but nothing can authenticate to
write to them, so `Comments` and the reader-review block render as disabled
skeletons.

**2 · `docs/04` Phase 4.3 — `Article` JSON-LD was never built.** `lib/schema.tsx`
exports `webSiteJsonLd`, `breadcrumbJsonLd`, `faqPageJsonLd` and a gated
`reviewJsonLd`. There is no `articleJsonLd`, so story, article and review
routes emit no `Article`/`NewsArticle` block. The date and byline gate that
once blocked it is gone — records now carry real `publishedAt` and author
relationships.

**3 · `docs/04` Phase 7 (verification CI) is not started.** No
`.github/workflows`, and none of the three scripts the brief specifies: the
tier1 primary-domain sweep, the UGC `rel` assertion, and the anchor-text
distribution audit. Rules 1, 2 and 5 currently hold because the code is
correct, not because anything fails a build when it stops being.

**4 · `LatestStoriesSection` is the last render-path fixture read.** It imports
`@/scripts/fixtures/news` and appears on `/not-found` and the news story
route. The awkward import is the deliberate marker; it goes when the section is
wired.

**5 · `ComparisonCard` self-imports `operators` and `compareRows` from
`lib/mock-data`** and takes no props, so CLAUDE.md rule 5 (one primary domain
per ranked list) is enforced by a fixture file rather than by data.

**6 · `itemReviewed.url` emits an empty string** for any review that is not the
primary domain — `reviews/[vertical]/[slug]/page.tsx`,
`itemUrl={review.primaryDomainLink?.url ?? ""}`.

**7 · `robots.ts` still carries four `Disallow` lines** for `?type=`, `?news=`,
`?region=` and `?page=`. Those URLs are internally linked from `PageNav`, so
blocking them stops Google reading the canonical that would consolidate them.
The SEO backlog calls this self-inflicted; the fix is a deletion.

**8 · No favicon.** No `app/icon.*` or `app/apple-icon.*`; `/favicon.ico` 404s.

**9 · 55 `TODO` markers** across `app/`, `components/`, `lib/`, `scripts/` —
45 `TODO(cms)`, 7 untagged, 2 `TODO(clerk)`, 1 `TODO(dev)`. Most are
pre-publish gates tied to rule 3; see `.claude/todo-inventory.md`.

## Parked, not open

**Light/dark theme toggle** — scoped 2026-08-31, phases 0 and 0.5 done, 1–6
outstanding. Reasoning and the four `TODO(theme)` debt sites are in
`theme-toggle-deferred.md`. Do not re-derive it.

**Editor attribution / activity log** — parked on cost, see CONTENT-BACKLOG.md.
Nothing records who edited a document.

**Update-as-you-type Live Preview** — deliberately not built; what shipped is
the server-side variant that refreshes on save. See MIGRATION.md.

## Resolved since the 2026-08-25 sweep

- **Crawl plumbing** — `app/sitemap.ts`, `app/robots.ts` and `app/llms.txt`
  all exist and are built from the same registries `generateStaticParams`
  resolves from.
- **The five 404ing internal link targets** — `/about`, `/news` and `/contact`
  are real routes; `/blog` was replaced by `/articles`. Only `/login` still
  404s, and that is Phase 5 scope.
- **`next.config.ts` `allowedDevOrigins`** — no longer points at another
  project's host.
- **`full-review`** — route and its references are gone.
- **The whole FW-1 track** — five phases, closed 2026-09-25. See MIGRATION.md.

## Still true from the old sweep

**The "Component Reference — Filled States" page does not exist.** CLAUDE.md
rule 3 names it as the only legitimate place for filled-in mockups, so until it
exists there is nowhere those belong.

## Verification pass — 2026-09-28

A full re-measurement of claims that had been carried across documents without
re-checking. Corrections, not confirmations, are what is listed here.

**Retired — the claim was wrong.**

- **"Build fails while dev runs."** It does not. See the build section above.
- **"Tailwind `hover:` utilities are not gated to hover-capable devices."**
  Tailwind v4 gates them automatically. Measured against the compiled
  stylesheet: 55 `:hover` rules, **47 inside `@media (hover: hover)`**, 8 not.
  All 8 are hand-written component classes — `.btn-primary`, `.btn-secondary`,
  `.btn-brand`, `.btn-safety`, `.btn-on-fill`, `.link-inline`,
  `.link-on-marker`, `.editorial-link-card`. M-1 is that list, nothing more.
- **`theme-toggle-deferred.md` "Phases 0 and 0.5 done".** All six phases are
  done; that file now carries a per-phase evidence table.

**Fixed.**

- Six duplicate `help-directory-entries` deleted, 12 rows → 6. **Not durable** —
  `lib/mock-data.ts:485` still holds those six bracketed names and
  `scripts/seed-content.ts:446` seeds from them. CONTENT-BACKLOG.md has the
  traced mechanism and the two options for making it stick.

**Newly found.**

- **`esports-betting.crumb` is `[TO WRITE] crumb for esports-betting`** and
  `Verticals.crumb` is `required: true`, so it renders — on
  `/reviews/esports-betting` it appears in the visible trail **and in the
  BreadcrumbList JSON-LD `name`**, which is what Google renders in a SERP
  breadcrumb. `/categories/esports-betting` is unaffected; it uses
  `vertical.name`. This is more serious than the known `noun` placeholder,
  which only reaches `/llms.txt`.
- **21 bracketed SEO fields on published records** — 18 on news (9 records ×
  `metaTitle` + `metaDescription`), 3 `metaTitle` on articles. Reviews and
  authors are clean. The `metaDescription` ones are the live risk: they reach
  search snippets, where the `/llms.txt` caveat does not travel.

**Resolved with a throwaway admin (created, used, deleted).**

- **The `search-corpus` hook works.** Live-fire test, no server restart: a
  distinctive word added to a published story's title through the authenticated
  REST path was absent at +0s, present at **+10s**, and stable at +60s — far
  inside the 1h TTL. The write was made via `PATCH /api/news/:id`, which runs in
  the Next process, because `revalidateTag` only affects the process that calls
  it. Title restored afterwards. Three handover documents had carried this as
  "never observed firing"; it fires.

- **`esports-betting.noun` and `.crumb` are real**, following the house pattern
  the two written verticals set (`Online Casinos` → crumb `Casinos`, so the name
  shortens). Now `noun: "esports betting site"`, `crumb: "Esports"`.
  `/reviews/esports-betting` emits `['Home', 'Reviews', 'Esports']` in both the
  visible trail and the BreadcrumbList; `/categories/esports-betting` is
  unchanged at `Esports Betting` because it reads `vertical.name`; `/llms.txt`
  now reads "every esports betting site reviewed on the same criteria" and its
  bracketed line count dropped 17 → 16.

**Still latent — three more verticals carry the same bracketed pair.**
`horse-racing`, `sweepstakes-casinos` and `fantasy-sports` all have
`[TO WRITE]` in `noun` and `crumb`. None renders today: all three have
`hasReviews: false`, so `/reviews/<slug>` 404s and the crumb has no surface.
They become live defects the moment that flag flips. The house pattern above
makes each a one-line edit.
