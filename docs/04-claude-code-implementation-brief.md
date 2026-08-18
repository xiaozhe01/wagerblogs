# Claude Code Implementation Brief — Off-Page SEO Site

## How to use

Paste the prompt at the bottom into Claude Code as the opening message, with
this file plus `offpage-seo-six-layer-map.md` and
`wireframe-component-audit.md` available in the repo (e.g. a `/docs`
folder). The finalized Claude Design route outputs are the visual spec;
this brief is the behavioral/architectural spec. Where they conflict on
behavior (link rendering, schema, gating), this brief wins; on visuals,
the design output wins.

## Stack (fixed, do not substitute)

- Next.js (App Router) + React, TypeScript
- PayloadCMS v3 (standalone repo pattern), Supabase PostgreSQL
  (session-mode pooler, port 5432)
- Clerk for auth (email/password + Google OAuth)
- Vercel deployment, Cloudflare DNS

## Build order

### Phase 0 — Route scope (resolved, do not deviate without re-confirming)

Resolved via a stakeblogs-vs-wagerblogs design audit. This is the
authoritative route list for this build. Do not add routes outside it
(notably: no Guides/Guide, BestLines, or Forum/Thread — explicitly
deferred, see below) without checking back first.

**Redesign this pass (wagerblogs design system applied fresh to a
stakeblogs-precedent page):**

- Blog (listing)
- Reviews (listing/comparison grid)
- Categories (listing)
- Article / Blog-Post (detail)
- About
- Contact
- Header, Header-Nav, Footer — restyle to wagerblogs tokens only,
  structure carries over from stakeblogs as-is

**Already designed in wagerblogs, carried forward:**

- Home
- Review-Post (canonical operator review detail — see OPEN ITEM below)
- Responsible-Gambling
- Not-Found (404)
- Comments (component)

**New pages, no stakeblogs precedent:**

- Author
- RG-Directory
- Disclaimer
- Category (per-vertical landing — distinct from the Categories listing
  above; do not conflate the two)

**Not designed — Clerk handles it directly:**

- Login (no custom route design; use Clerk's prebuilt components)

**Explicitly out of scope for this build — do not implement:**

- Guides / Guide
- BestLines
- Forum / Thread
  These exist as hrefs/precedent in the old stakeblogs export but represent
  new feature scope, not redesign scope. Flag any reference to them found
  during migration; do not build routes or CMS collections for them.

**OPEN ITEM — Review-Post is missing three blocks found in the retired
Operator-Review draft during audit:** the reader-reviews trust block
(sign-in-gated submission form), the conditional Trustpilot block, and the
Comments component import. These must be folded into Review-Post — treat
Phase 5's review-page work (below) as incomplete until this is verified,
not as new scope layered on top.

## Build order

### Phase 1 — CMS schema (PayloadCMS)

1. Posts collection: add `linkTier` select field (tier1/tier2/tier3,
   default tier1, required) and `primaryDomainLink` group
   (anchorText, url, relAttribute: dofollow/sponsored/nofollow, default
   sponsored) with `admin.condition` hiding the group entirely unless
   linkTier is tier2/tier3. Exact field spec in
   `offpage-seo-six-layer-map.md` Layer 2.
2. Users collection: ensure `name` text field exists (required for author
   bylines and Person schema).
3. Authors: photo, full name, credential line, slug — all required. A post
   cannot publish without a valid author reference.
4. Operators collection (for ranked lists/comparison tables): name, score,
   category score breakdown, advantages array, lastVerified date, terms
   text, and an `isPrimaryDomain` boolean — only one operator may have it
   true per rendered list. `primaryDomainLink` group (anchorText, url,
   relAttribute: dofollow/sponsored/nofollow, default sponsored) — same
   shape as the Posts collection's field in item 1 — with
   `admin.condition` hiding it unless `isPrimaryDomain` is true.
   Non-primary operators get no link field at all: per Phase 2 item 2
   below, they render text-only with no outbound link, so there is
   nothing for the CMS to store.
   (Note: `FeaturedBonusesCard`'s bonus-offer content is a distinct data
   shape, not sourced from this collection — its competitor entries DO
   carry a real, nofollow'd outbound link [`operatorLink`, typed as
   `OperatorLinkData` in `lib/types.ts`, deliberately separate from
   `primaryDomainLink` so the two can never be confused]. That content
   needs its own CMS collection spec; not written here.)

### Phase 2 — Link-policy components

1. `PrimaryDomainLink` component: returns `null` for tier1 or missing
   link data (structural absence, never CSS-hidden). rel mapping:
   dofollow → no rel, sponsored → "sponsored noopener", nofollow →
   "nofollow noopener". Full spec in the map, Layer 2.
2. Ranked-row and comparison-table components: data-driven, accept
   operator arrays; only the `isPrimaryDomain` entry renders
   `PrimaryDomainLink`; all other operators render text-only (no outbound
   links to competitors).
3. All rich-text/UGC rendering: any link inside user-generated content
   hardcodes `rel="ugc nofollow"` at the render layer. Not configurable
   via CMS or props. No exceptions.

### Phase 3 — Rendering + crawlability

1. Blog/review routes: SSG via `generateStaticParams`; ISR
   (`revalidate`) on pages with freshness-sensitive content (bonus
   terms, lastVerified data).
2. No tier-bearing content rendered client-side only — server components
   by default; `PrimaryDomainLink` must be in initial HTML.
3. `app/sitemap.ts` generated from CMS posts, `lastmod` = post
   `updatedAt`. `app/robots.ts` disallowing CMS/admin routes.
4. Per-route `generateMetadata()` with self-referencing canonical on every
   route — never inherit the homepage canonical.
5. `not-found.tsx` at app root (known gap from prior build).

### Phase 4 — Structured data (JSON-LD)

1. Shared `JsonLd` helper component (script type application/ld+json).
2. `Organization` schema once in root layout.
3. `Article` schema on every post: author as Person with author-page URL,
   datePublished, dateModified.
4. `Review`/`AggregateRating` schema ONLY on tier2/tier3 routes
   (conditional, same pattern as the link component).
5. `AggregateRating` from first-party user reviews only when reviews are
   real and moderated — never from seed/placeholder data.
6. `BreadcrumbList` on all routes.
7. Comments/UGC excluded from `Article` schema entirely.

### Phase 5 — Auth + UGC (Clerk)

1. Clerk integration: email/password + Google OAuth, App Router middleware
   pattern.
2. Commenting: login-gated, moderation-before-publish (a `status` field:
   pending/approved/rejected; only approved renders).
3. Rollout scope: comments enabled on Tier 3 review routes only at launch;
   Tier 1 blog comments behind a feature flag, off by default.
4. Review-Post page (canonical operator review route, per Phase 0):
   confirm all three blocks flagged in the Phase 0 OPEN ITEM are present —
   reader-reviews section (login-gated, moderated), conditional Trustpilot
   block, and the Comments component — before treating this page as
   complete. Login-gated, moderated, rendered in a section visually
   separate from the editorial score and Trustpilot block.

### Phase 6 — Trust pages + integrity gates

1. Routes that must exist and render real content before launch:
   `/privacy`, `/terms`, `/affiliate-disclosure`, `/responsible-gaming`.
2. `/responsible-gaming` (or `/help-resources`): global directory of
   gambling-help organizations worldwide, data-driven from a CMS
   collection (org name, country/region, contact, url, verifiedDate).
   Every "Play Responsibly" callout site-wide links here.
3. Integrity-gated components (Trustpilot widget, compliance badges,
   editorial byline, sourced stat callouts): render empty/pending state or
   nothing when real data is absent. Never ship hardcoded
   realistic-looking values. Trustpilot block renders only when API data
   from a real Trustpilot account is present.
4. Stat callout component: `source` (label + url) is a required prop;
   missing source = component does not render.

### Phase 7 — Verification (CI)

1. Script: fetch every URL in the sitemap; for each page identified as
   tier1 (via a meta tag or JSON-LD marker the build emits), assert zero
   `href` matches against the primary domain. Fail CI on violation.
2. Script: assert every UGC-rendered link contains `rel` including "ugc".
3. Anchor-text audit script: sample all tier2/tier3 primary-domain links,
   report anchor-text distribution (guards against a freelancer repeating
   one exact-match anchor).

## Process constraints (not code)

- Link velocity: no batch-publishing many tier2/tier3 posts in a short
  window.
- No seeding fake positive user reviews of the primary domain, ever —
  including "temporary" ones.

---

## Prompt to paste into Claude Code

Read /docs/claude-code-implementation-brief.md,
/docs/offpage-seo-six-layer-map.md, and
/docs/wireframe-component-audit.md in full before writing any code.

Implement the project following the brief's Phase 0–7 build order exactly.
Do not skip ahead: each phase's output is a dependency of the next. After
completing each phase, stop and show me what was built before starting the
next phase.

Non-negotiable behavioral rules, regardless of anything else you infer:

1. Tier 1 content must never render a link to the primary domain — the
   PrimaryDomainLink component returns null, structurally absent from the
   HTML, never hidden via CSS.
2. Every link inside user-generated content renders rel="ugc nofollow",
   hardcoded at the render layer, not configurable.
3. Integrity-gated components (Trustpilot, compliance badges, bylines,
   stat callouts) render empty/pending states when real data is absent —
   never hardcoded realistic-looking placeholder values.
4. Review/AggregateRating schema only on tier2/tier3 routes, and
   AggregateRating only from real moderated reviews.
5. Only one operator per ranked list may have isPrimaryDomain: true, and
   only that entry carries an equity-passing link; competitors are
   text-only.

The finalized Claude Design outputs are the visual spec — match them for
layout, tokens, and component anatomy. Where design output and this brief
conflict on behavior (links, schema, gating, rendering), the brief wins.

Start with Phase 0. Confirm the route scope with me before touching Phase 1
schema work.
