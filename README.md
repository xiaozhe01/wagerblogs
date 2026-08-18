# wagerblogs

An independent betting/casino review publication built as an off-page SEO
asset: it passes link equity to a separate primary domain without reading
as a link farm or manipulative scheme. Editorial trust and crawlability are
first-class product requirements, not decoration — see
[`docs/00-six-layer-map.md`](docs/00-six-layer-map.md) for the full policy
this codebase encodes.

## Status

Currently a Next.js frontend scaffold built against typed mock data
(`lib/mock-data.ts`, `lib/site-data.ts`). Routes, components, the link-policy
rules, and the Playwright a11y suite are in place. PayloadCMS, Supabase, and
Clerk are specified in the stack but not yet wired in — see Phase 1 and
Phase 5 of
[`docs/04-claude-code-implementation-brief.md`](docs/04-claude-code-implementation-brief.md)
for what's next.

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

Also see [`docs/architecture-gaps-solo-dev.md`](docs/architecture-gaps-solo-dev.md)
for solo-dev-specific scalability constraints (CMS migration discipline,
etc.).

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
- **CMS:** PayloadCMS v3 *(not yet integrated — see Status)*
- **Database:** Supabase PostgreSQL, session-mode pooler *(not yet
  integrated)*
- **Auth:** Clerk *(not yet integrated)*
- **UI:** Tailwind CSS v4, shadcn/ui (`base-mira` style), Base UI,
  lucide-react icons
- **Testing:** Playwright + `@axe-core/playwright` (accessibility)
- **Deployment:** Vercel, Cloudflare DNS

## Project structure

```
app/                      Routes (Next.js App Router)
  page.tsx                Homepage
  reviews/[slug]/         Review pages (+ full-review subpage)
  blog/[slug]/            Blog posts
  categories/[slug]/      Category listings
  authors/[slug]/         Author pages
  legal/[doc]/            Legal documents
  responsible-gambling/   RG hub + help directory
  not-found.tsx           404 (editorial register, real HTTP 404)

components/
  layout/                 PageShell, TopHeader, SideNav, SiteFooter, Breadcrumbs
  section/                Page sections (hero, editorial, comparison, ranked list, ...)
  cards/                  Post/news/teaser card variants
  rail/                   Sidebar rail widgets (trending, topics, at-a-glance, ...)
  ui/                     shadcn/ui primitives + custom UI atoms
  RankedList.tsx          Operator ranking table (link-policy-aware)
  PrimaryDomainLink.tsx   Tier-gated link to the primary domain
  Comments.tsx            UGC comments (nofollow-enforced)

lib/
  types.ts                Shared content types (mirrors eventual PayloadCMS collections)
  mock-data.ts            Placeholder content — fictional, never promote to prod as-is
  site-data.ts            Static nav/footer/legal structure (stand-in for CMS taxonomy)
  schema.tsx              JSON-LD structured data helpers
  utils.ts                cn() and other shared helpers

tests/a11y/               Playwright accessibility suite (axe-core)
playwright/                Ad hoc visual/diagnostic scripts + screenshots
docs/                      Architecture, design, and implementation-brief docs (read first)
```

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run test:a11y` | Run the Playwright accessibility suite against a production build |

## Working style

- Show output after each phase in
  [`04-claude-code-implementation-brief.md`](docs/04-claude-code-implementation-brief.md)
  before starting the next — don't run ahead.
- Show PayloadCMS collection configs before running any migration.
- Validate against real behavior (curl output, actual rendered HTML, actual
  DB state) rather than assuming a fix worked.
