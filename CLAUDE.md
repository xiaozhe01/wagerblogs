# Project context

This is the **wagerblogs** off-page SEO site — an independent betting/
casino review publication built to pass link equity to a separate primary
domain, without reading as a link farm or manipulative scheme.

## Before any implementation work

Read the docs in `/docs/` in numeric order before writing or
modifying any code:

1. `00-six-layer-map.md` — the full technical architecture, from editorial
   policy down to what Google's crawler actually reads. Start here.
2. `01-wireframe-component-audit.md` — per-component KEEP/EDIT/ADD/DELETE
   verdicts against the original wireframe.
3. `02-design-language-reference.md` — design system references and the
   two-register system (editorial vs. comparison).
4. `03-claude-design-handoff-prompt.md` — the design brief history; useful
   context for why components look the way they do.
5. `04-claude-code-implementation-brief.md` — the phased build order.
   Follow it in sequence; each phase depends on the last.

## Non-negotiable rules (do not violate even if not re-stated in a prompt)

1. **Tier 1 content never links to the primary domain.** The
   `PrimaryDomainLink` component returns `null` on tier1 — the link must be
   structurally absent from the rendered HTML, never hidden with CSS.
2. **All user-generated content links render `rel="ugc nofollow"`**,
   hardcoded at the render layer. Not CMS-editable. No exceptions.
3. **No fabricated trust signals, ever, on live routes.** Trustpilot
   ratings, compliance badges, author bylines, and sourced statistics must
   render an honest empty/pending state when real data is absent — never
   hardcoded realistic-looking placeholder values. (A separate, clearly
   labeled internal "Component Reference — Filled States" page is the only
   place filled-in mockups belong, using obviously fictional data.)
4. **`Review`/`AggregateRating` schema only appears on tier2/tier3 routes**,
   and `AggregateRating` is computed only from real, moderated user
   reviews — never seeded or placeholder data.
5. **Only one operator per ranked list may be the primary domain**
   (`isPrimaryDomain: true`), and only that entry carries an equity-passing
   link. Competitor entries are text-only or `nofollow`.
6. **Error and utility pages (404, etc.) are always editorial register**
   — no ranked lists, comparisons, or primary-domain links, regardless of
   what page the visitor was trying to reach. The 404 route must return a
   genuine HTTP 404 status, not a soft-404 (200 with "not found" text).

## Stack

Next.js (App Router) + React + TypeScript, PayloadCMS v3, Supabase
PostgreSQL (session-mode pooler, port 5432), Clerk for auth, Vercel
deployment, Cloudflare DNS.

## Working style

- Show output after each phase in `04-claude-code-implementation-brief.md`
  before starting the next phase — don't run ahead.
- Show PayloadCMS collection configs before running any migration.
- Validate against real behavior (curl output, actual rendered HTML,
  actual DB state) rather than assuming a fix worked.
