# wagerblogs

An independent betting/casino review publication built as an off-page SEO
asset: it passes link equity to a separate primary domain without reading
as a link farm or manipulative scheme. Editorial trust and crawlability are
first-class product requirements, not decoration — see
[`docs/00-six-layer-map.md`](docs/00-six-layer-map.md) for the full policy
this codebase encodes.

## Status

**Two phase sequences run in this repo and they number independently.** Check
which one a task belongs to before starting — a bare "Phase 5" is ambiguous.

| Track                                                                | Scope                               | State                                                       |
| -------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------- |
| **FW-1** ([`MIGRATION.md`](MIGRATION.md))                            | Wiring the frontend onto PayloadCMS | **Complete**, closed 2026-09-25 at Phase 5 (Live Preview)   |
| **`docs/04`** ([brief](docs/04-claude-code-implementation-brief.md)) | The overall Phase 0–7 build order   | **Phases 0–3 done · 4 and 6 partial · 5 and 7 not started** |

Every route renders from PayloadCMS against Supabase Postgres. 21 routes,
20 collections, 7 tracked migrations, Live Preview working end to end.

What is **not** built:

- **Clerk auth and UGC** (`docs/04` Phase 5). Clerk is not installed; `/login`
  returns 404. The UGC collections exist in Payload, but nothing can
  authenticate to write to them, so `Comments` and reader reviews render as
  disabled skeletons.
- **`Article` JSON-LD** (`docs/04` Phase 4.3). `lib/schema.tsx` emits
  `WebSite`, `BreadcrumbList`, `FAQPage` and a gated `Review`. There is no
  `Article`/`NewsArticle` helper yet.
- **Verification CI** (`docs/04` Phase 7). No `.github/workflows`. The
  link-policy rules below hold because the code is correct, not because
  anything fails a build when it stops being correct.
- **Real editorial copy.** Bracketed `[Placeholder …]` and `[TO WRITE]` values
  ship deliberately as a visible-unfinished signal — see
  [`CONTENT-BACKLOG.md`](CONTENT-BACKLOG.md), which explains the convention and
  what is still bracketed.

`Organization` JSON-LD and compliance badges are absent **on purpose**, not as
gaps: rule 3 forbids them until a real publisher record exists.

## Before touching code

Read `/docs` in numeric order — each doc builds on the last:

1. [`00-six-layer-map.md`](docs/00-six-layer-map.md) — full technical
   architecture, from editorial policy down to what Google's crawler
   actually reads. Start here.
2. [`01-wireframe-component-audit.md`](docs/01-wireframe-component-audit.md)
   — per-component KEEP/EDIT/ADD/DELETE verdicts against the original
   wireframe.
3. [`02-design-language-reference.md`](docs/02-design-language-reference.md)
   — design system references and the two-register system (editorial vs.
   comparison).
4. [`03-claude-design-handoff-prompt.md`](docs/03-claude-design-handoff-prompt.md)
   — design brief history; context for why components look the way they do.
5. [`04-claude-code-implementation-brief.md`](docs/04-claude-code-implementation-brief.md)
   — the phased build order. Follow it in sequence.

Then [`MIGRATION.md`](MIGRATION.md) for the FW-1 record — what is
Payload-backed, what is deliberately static, and why. Also
[`docs/architecture-gaps-solo-dev.md`](docs/architecture-gaps-solo-dev.md) for
solo-dev scalability constraints.

## Non-negotiable rules

These hold even when not restated in a prompt or PR — full detail in
[`CLAUDE.md`](CLAUDE.md):

1. Tier 1 content never links to the primary domain — `PrimaryDomainLink`
   returns `null` on tier1, structurally absent from rendered HTML.
2. All user-generated content links render `rel="ugc nofollow"`, hardcoded
   at the render layer.
3. No fabricated trust signals on live routes — ratings, badges, bylines,
   and stats render an honest empty state when real data is absent.
4. `Review`/`AggregateRating` schema only on tier2/tier3 routes, computed
   only from real moderated reviews.
5. Only one operator per ranked list may be `isPrimaryDomain: true` and
   carry an equity-passing link; competitors are text-only or `nofollow`.
6. Error/utility pages (404, etc.) are always editorial register and must
   return a genuine HTTP status, not a soft-404.

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **CMS:** PayloadCMS v3, co-located in this repo (`app/(payload)/`,
  `collections/`), with a white-labelled admin and a custom dashboard
- **Database:** Supabase PostgreSQL, session-mode pooler (port 5432), via
  `@payloadcms/db-postgres` and tracked migrations
- **Media:** Supabase Storage through `@payloadcms/storage-s3`
- **Auth:** Clerk — _specified in the brief, not yet installed_
- **UI:** Tailwind CSS v4, shadcn/ui (`base-mira` style), Base UI,
  lucide-react icons
- **Testing:** `node:test` unit suite + Playwright/`@axe-core/playwright`
- **Deployment:** Vercel, Cloudflare DNS

## Project structure

```
app/
  (frontend)/             21 public routes, all Payload-backed
    page.tsx              Homepage
    articles/[slug]/      Editorial articles
    news/[section]/[story]/
    reviews/[vertical]/[slug]/
    categories/[slug]/    Per-vertical landing
    authors/[slug]/       Author bios
    legal/[doc]/          Legal documents
    responsible-gambling/ RG hub + help directory
    not-found.tsx         404 (editorial register, real HTTP 404)
  (payload)/              Admin panel, REST/GraphQL, preview entry/exit
  sitemap.ts  robots.ts  llms.txt/   Crawler surfaces

collections/              20 Payload collections + i18n label dictionary
migrations/               7 tracked migrations — never edit an applied one

components/
  layout/                 PageShell, TopHeader, SideNav, SiteFooter, Breadcrumbs
  section/                Page sections (editorial, comparison, ranked list, ...)
  cards/                  Post/news/teaser card variants + MediaImage
  rail/                   Sidebar rail widgets
  controls/               Links, chips, pagination, share button
  rich-text/              Lexical converters (enforce outbound rel policy)
  live-preview/           Draft-mode refresh listener
  admin/                  Custom Payload dashboard
  ui/                     shadcn/ui primitives

lib/
  payload-queries.ts      publishedFilter / resolvePreviewUser — always SPREAD
  urls.ts                 single URL derivation for every crawler surface
  schema.tsx              JSON-LD helpers
  og.ts                   Open Graph + Twitter card composition
  outbound-rel.ts         centralised rel policy per surface
  mock-data.ts            static stand-ins that remain (see MIGRATION.md)
  site-data.ts            nav/footer taxonomy — deliberately static

scripts/                  seed, migrations helpers, one-off corrections
tests/                    unit suite + tests/a11y/ (Playwright + axe)
docs/                     Architecture and implementation briefs (read first)
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000); the admin is at
`/admin`. `predev` runs `migrate:status` first, so a schema/migration
mismatch surfaces before the server starts.

Needs `.env.local` with `DATABASE_URI`, `PAYLOAD_SECRET`, and the `S3_*`
media variables.

## Scripts

| Command                           | Description                                                   |
| --------------------------------- | ------------------------------------------------------------- |
| `npm run dev`                     | Dev server (runs `migrate:status` first)                      |
| `npm run build`                   | Production build (runs token check + `migrate:status`)        |
| `npm run start`                   | Serve the production build                                    |
| `npm run lint`                    | ESLint                                                        |
| `npm run test:unit`               | Unit suite (`node:test` via tsx)                              |
| `npm run test:a11y`               | Playwright accessibility suite                                |
| `npm run migrate`                 | Apply pending migrations                                      |
| `npm run migrate:create`          | Generate a migration from config changes                      |
| `npm run migrate:status`          | Show applied/pending migrations                               |
| `npm run seed` / `seed:content`   | Seed — **not idempotent**, never run against a hand-edited DB |
| `npm run rls:check` / `rls:apply` | Row-level security verification                               |

## Working style

- Confirm which track a phase belongs to (FW-1 vs `docs/04`) before starting.
- Show PayloadCMS collection configs before running any migration, and land
  the config change and its migration in the **same commit** — splitting them
  makes every query fail on a missing column.
- `npm run build` succeeds **with the dev server running** — measured
  2026-09-28, exit 0 in 68s, no connection errors. The long-standing "stop dev
  or the build fails on the pooler" rule did not reproduce: Supavisor
  multiplexes, so a full build adds **one** server-side connection, and
  `max_connections` is 60, not the 15 the docs had assumed.
- Validate against real behavior (curl output, rendered HTML, actual DB
  state) rather than assuming a fix worked.
