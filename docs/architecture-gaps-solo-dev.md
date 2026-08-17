# Architecture Gaps — Solo-Dev Scalability Constraints

Purpose: concrete gaps identified in the PayloadCMS/Next.js architecture
that matter specifically because this is a solo build with no second
reviewer. Companion to `00-six-layer-map.md` and
`04-claude-code-implementation-brief.md`. Feed to Claude Code alongside
those once ready to implement.

---

## 1. Content model versioning discipline

PayloadCMS schema changes become migrations against live data once real
content exists — not free edits. Before real content is loaded:

- Treat every collection field addition/change as a migration, even in
  early stages, so the habit exists before it's costly to skip.
- For fields likely to evolve (`linkTier`, `primaryDomainLink`), prefer
  additive changes (new optional field) over destructive ones (renaming,
  removing) once any real content exists. Deprecate old fields rather than
  deleting them immediately.
- Keep a running migration log (even a simple markdown changelog) noting
  what changed and why — a solo dev six months later has no memory of
  today's reasoning otherwise.

## 2. Ownership split: CMS-owned truth vs. code-owned truth

Be explicit about which parts of "the truth" live in the database
(PayloadCMS) versus in code, so schema changes aren't reached for when a
render-logic fix is the correct tool.

**CMS-owned (editor sets it, changes per content item):**

- `linkTier`, `primaryDomainLink` fields
- Operator data, scores, `isPrimaryDomain` flag
- Author bylines, credentials

**Code-owned (fixed behavior, not editable per post):**

- The two-register visual system (which components render for which tier)
- `PrimaryDomainLink` render/null logic
- `rel="ugc nofollow"` hardcoding on UGC links
- JSON-LD generation logic (structure is code; the data plugged into it is
  CMS-owned)

Rule of thumb: if the answer to "should this ever differ per post" is no,
it's a code constant, not a CMS field. Adding a CMS field for something
that should be a hardcoded rule is the failure mode to avoid — it creates
a new way for a human (including future you) to accidentally break a
non-negotiable rule.

## 3. Single data-access layer for PayloadCMS

Do not call PayloadCMS's REST/GraphQL API directly from scattered route or
component files. Build one typed data-access module
(e.g. `lib/payload.ts` or `lib/cms/`) that every route goes through:

```ts
// lib/cms/posts.ts
export async function getPostBySlug(slug: string): Promise<Post> { ... }
export async function getPostsByTier(tier: LinkTier): Promise<Post[]> { ... }
export async function getOperators(): Promise<Operator[]> { ... }
```

Why this matters more for a solo dev than a team: a schema change means
updating one function instead of grepping the whole codebase for raw
fetch calls. This is the difference between a 10-minute schema change and
a multi-hour bug hunt six months in.

## 4. Type safety between PayloadCMS schema and frontend

PayloadCMS v3 supports generating TypeScript types from its collection
config. Wire this in from the start:

- Generated types become the single source of truth for what a `Post` or
  `Operator` object shape looks like on the frontend.
- Without this, a manual schema edit is one keystroke away from a runtime
  crash that TypeScript should have caught at build time — and a solo dev
  has no second reviewer to catch the mismatch before it ships.
- Re-run type generation as part of the normal workflow after any schema
  change, not as an occasional cleanup task.

## 5. CI scope: link-policy checks are necessary but not sufficient

The existing CI plan (verify no Tier 1 page links to primary domain,
verify UGC links carry `rel="ugc"`) protects content-policy integrity.
It does not protect content-model integrity. Add, once Phase 1 schema is
stable:

- A build-time type check that fails if PayloadCMS-generated types and
  frontend component prop types have drifted.
- A basic schema-linting step (e.g. every collection referenced by a
  component actually exists in the current PayloadCMS config) — cheap
  insurance against a rename breaking something silently.

## 6. Scaling vs. CI — do not conflate these two problems

These are different risks with different timelines:

- **CI / consistency risk (near-term, real now):** protecting against your
  own mistakes as the sole reviewer of your own code. This is what items
  1–5 above address. Build this now — it's cheap and pays off immediately.
- **Traffic/infrastructure scaling (later, likely not urgent):** handling
  more visitors, more concurrent requests, more content volume. Next.js
  SSG/ISR plus Supabase's connection pooling already cover most of this
  for a site at this stage. Don't let scaling anxiety pull effort away
  from the nearer risk (1–5) — infrastructure scaling is a problem you'll
  see coming with real traffic data, not one to pre-solve speculatively.

## 7. Component contract convention (beyond design tokens)

A consistent `globals.css` token system solves visual/token consistency.
It does not solve component contract consistency — two components can
both correctly use the same CSS variables while diverging in prop shape,
naming, or where they fetch data from.

Adopt a convention before building many components, not after:

- Every data-driven component takes a typed `props` interface matching
  its corresponding PayloadCMS-generated type — never an untyped object
  or ad-hoc shape.
- Data fetching happens in the route/page (server component) via the
  data-access layer (item 3); presentational components receive typed
  props, they don't fetch their own data.
- One naming convention for prop interfaces (e.g. `<ComponentName>Props`)
  applied consistently, so any component's contract is predictable
  without opening the file.

This convention is invisible when skipped early and expensive once dozens
of components exist with inconsistent patterns — worth writing down and
following from Phase 1, not retrofitting later.
