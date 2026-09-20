# Folder structure — frontend + PayloadCMS co-location

Target layout for co-locating PayloadCMS v3 in this repo, and the deviations
from the original handoff with reasoning.

## Target

```
wagerblogs/
  app/
    (frontend)/          all routes, the site layout, and not-found.tsx
      [...notfound]/     hands unmatched URLs to the group's not-found.tsx
    (payload)/           installer-owned; never hand-edit
    robots.ts            MUST stay here — see deviation 4
    sitemap.ts           kept here with robots.ts
    llms.txt/            kept here with robots.ts
  collections/           Payload collection configs (added in a later step)
  components/            unchanged — layout/section/rail/cards/ui/controls
  lib/                   unchanged
  hooks/                 unchanged
  payload.config.ts      created by Step 3
```

`tsconfig.json` keeps `"@/*": ["./*"]`, so no import string in the repo
changed.

## Verified against current docs

| Claim                                               | Status                                                                            |
| --------------------------------------------------- | --------------------------------------------------------------------------------- |
| Payload v3 supports our Next version                | Docs list `16.2.6+`; we are on **16.2.12**                                        |
| Node floor                                          | Docs require `20.9.0+`; local is **v24.15.0**                                     |
| Route-group convention `(payload)` + frontend group | Current, unchanged                                                                |
| `src/` required                                     | **No.** Config goes "at the root of your repository, or next to your /app folder" |

Source: [Payload — Installation](https://payloadcms.com/docs/getting-started/installation).

## The `(frontend)` group is mandatory, not stylistic

Tested directly: keeping `app/layout.tsx` at the root and adding only a
`(payload)` group beside it **builds and returns HTTP 200, but emits invalid
HTML** — the root layout wraps Payload's group layout, producing **2 `<html>`
and 2 `<body>` tags**, with Payload's admin nested inside our document and our
stylesheet applied to it. Payload's own layout owns `<html>`/`<body>`, so the
site's root layout has to move into a group of its own. There is no
"just add `(payload)` and leave the rest alone" option.

## Deviations from the handoff

**1. No `src/` directory.** Payload does not require it. Keeping `app/`,
`components/`, `lib/`, `hooks/` at the repo root means `@/*` stays `./*` and
**zero import strings changed**. It also preserves the `components/`
reorganisation already on `develop`.

**2. The handoff says Next.js 14; this repo is 16.2.12.** Not a blocker —
Payload supports `16.2.6+` — but assumptions in the handoff sourced from
14-era docs should be re-verified rather than trusted.

**3. The handoff says Clerk is installed. It is not.** No Clerk dependency in
`package.json`, and the three `/login` links (`SideNav`, `MobileNav`, the
review-page CTA) point at a route that does not exist and returns 404.
Flagged, not fixed — auth is out of scope here.

**4. `robots.ts` must live at `app/` root. It breaks inside a route group.**
With the file at `app/(frontend)/robots.ts` the build registered `/llms.txt`
and `/sitemap.xml` but **no `/robots.txt` at all**, and the URL returned
**HTTP 404**. Moving it to `app/robots.ts` registered it immediately.
`sitemap.ts` and `llms.txt/` work in _either_ location and are kept beside it
only for consistency.

> **Do not "tidy" these three files into `(frontend)` later.** They look like
> an inconsistency — three stray files outside the group — and they are not.
> `sitemap.ts` and `llms.txt/` would survive the move; `robots.ts` would
> silently stop being served, taking the robots policy shipped in `99f1a6f`
> with it. If they are ever moved, `curl -i /robots.txt` is the check that
> catches it, because the build prints no error.

**5. `not-found.tsx` needs a catch-all route to be reachable.** It lives in
`app/(frontend)/not-found.tsx`, where the layout that themes and styles it
lives. But unmatched URLs never enter a route group, so they fell through to
Next's built-in 404 — plain black-on-white, no editorial register, violating
the CLAUDE.md rule that error pages stay in editorial register. Putting the
file at `app/` root instead _renders_ our markup but outside
`(frontend)/layout.tsx`, so it loses `ThemeProvider` and the `globals.css`
import — the a11y suite caught this as `expected the light theme / Received
""`. The fix is `app/(frontend)/[...notfound]/page.tsx`, a one-line route that
calls `notFound()` so unmatched URLs land inside the group.

## Config that had to move with the files

Two files hardcode the stylesheet path and would have failed the build, not
just looked wrong:

- `components.json` → `"css": "app/(frontend)/globals.css"` (shadcn)
- `scripts/check-color-invariants.mjs` → resolves `app/(frontend)/globals.css`;
  it runs on **`prebuild`** and **`pretest:a11y`**, so a stale path breaks both
  `npm run build` and `npm run test:a11y`

Documentation under `.claude/` and `docs/` still references `app/globals.css`
in prose. Left alone deliberately — those are historical audit records, and
the handoff forbids unrelated cleanup.

## Step 2 verification

Baseline captured before any move (status + byte count for 33 routes), then
re-run after:

```
all 33 route statuses IDENTICAL to the pre-refactor baseline
/no-such-page        404, editorial page, themed (a11y: 4/4 pass)
/sitemap.xml         200
/robots.txt          200
/llms.txt            200
/api/search?q=review 200, returns our hits
a11y suite           254 passed / 14 skipped / 0 failed — matches HEAD exactly
```

Byte counts drift by a few hundred on every page; that is build-id and
chunk-hash churn, not content.

## Step 3 — install (not started)

Blocked on one decision only the human can make: **which database**, and its
connection settings. Expected changes:

- `next.config.ts` wrapped in `withPayload` (requires ESM config)
- `tsconfig.json` gains `"@payload-config": ["./payload.config.ts"]`
- `app/(payload)/` written from Payload's blank template — treat as read-only

### `/api/search` — checked, no conflict

Payload mounts its REST API at `/api/[...slug]` by default and we serve
`/api/search`. Built and served together in a scratch tree: no duplicate-route
error, both register, and `/api/search?q=review` returns **our** hits — the
static segment beats the catch-all. `/api/anything-else` falls through to
Payload. No change needed. Re-check after the real install, since this was
proven against a stub handler.

### Watch during install

`app/(frontend)/[...notfound]/` is a catch-all. Payload's routes (`/admin`,
`/api`) are explicit segments and should win over it the same way
`/api/search` does — but confirm unmatched URLs still 404 _and_ `/admin`
still resolves once Payload is installed.

## ⚠️ RLS drops on getPayload() outside the app

Any `getPayload()` call from a standalone script (including `npm run seed`)
triggers Drizzle's push mode, which recreates tables and silently drops
per-table RLS.

Before running any of these, know that RLS will be dropped and needs
re-applying:

- `npm run seed`
- Any custom script in `/scripts` that imports payload
- Any `tsx` / `node` command that imports the Payload config

After running any of these, verify RLS is back:

```
npm run rls:check    # expect 56/56
```

If it's not, restore it:

```
npm run rls:apply
```

`npm run seed` already calls `rls:apply` for you and fails loudly if it cannot
— but anything else you write does not.

Tracked migrations narrow this bug class, and on **this** database new tables
do not arrive unprotected at all. Supabase installs an `ensure_rls` event
trigger on `ddl_command_end` that calls `rls_auto_enable()` and switches RLS on
for every `CREATE TABLE` in the public schema. Measured during the Phase 1
drafts migration: it created 12 tables and `rls:check` reported **56/56 before
`rls:apply` was run at all**.

This is Supabase behaviour, not vanilla Postgres — plain Postgres leaves
`relrowsecurity` false on a new table, which is what an earlier revision of
this document claimed applied here.

`rls:check` / `rls:apply` stay, for two reasons. They are the assertion that
the trigger actually fired, and they cover the paths that bypass it entirely:
a dump restore, a replica, or direct SQL run as a role the trigger does not
catch. Both are idempotent and cost nothing to run.

Tracked as a follow-up in MIGRATION.md, "Move from Drizzle push to tracked
migrations".

## Schema changes — tracked migrations

Drizzle push is off (`push: false` in `payload.config.ts`). Schema changes are
tracked files in `migrations/`, committed like any other source.

To change the schema:

```
1. edit the collection config
2. npm run migrate:create -- descriptive-name
3. read the generated .ts before running it
4. npm run migrate
5. npm run rls:apply        # only if the migration created a table
```

Step 3 is not optional. `migrate:create` diffs your config against the newest
`.json` snapshot in `migrations/`, never against the live database, so a
generated migration can describe changes you did not intend.

`npm run migrate:status` shows what is pending. It also runs on `predev` and
`prebuild` for awareness only — neither applies anything, and a pending
migration does not block either command.

**Never run these without knowing exactly what they do.** They are deliberately
not npm scripts, so running one means typing it in full:

```
npx payload migrate:fresh     # drops every table, then re-runs all migrations
npx payload migrate:reset     # rolls back every migration
npx payload migrate:refresh   # rolls back every migration, then re-runs them
```

`npx payload migrate:down` rolls back only the last batch and is wired up as
`npm run migrate:down`.

### The baseline migration

`migrations/20260914_055459_initial_schema.ts` describes the 44 tables that
already existed when push was retired. It was **never executed** — its
`CREATE TABLE` statements would have failed against the live database. Instead
its row was written into `payload_migrations` directly, and push mode's
`batch: -1` `dev` sentinel row was deleted.

This matters for a fresh database: running `npm run migrate` there **will**
execute the baseline and build all 44 tables from scratch, which is correct.
It only had to be skipped on the database that push had already built.

## Postgres connection budget

Session-mode pooler (port 5432): **pool_size = 15 clients**.

**Build parallelism.** Next collects page data and prerenders with a pool of
worker processes, each opening its own `getPayload` pool. The build-time cap
must satisfy `workers x max < 15`. The worker count defaults to cores-1 (7 on
this machine), which is **pinned to 4** by `experimental.cpus` in
`next.config.ts` — see below.

**Dev / runtime.** One process — but active use is the admin panel _and_ route
rendering _and_ ad-hoc queries at the same time. A cap of 2 here deadlocks on
any slow query or `idle in transaction` state.

Current setting, in `payload.config.ts`:

```ts
max: process.env.NODE_ENV === "production" ? 2 : 10,
connectionTimeoutMillis: 10_000,
idleTimeoutMillis: 30_000,
```

- **Build:** 4 workers x 2 = 8, leaving 7 spare for scripts and `rls:check`.
- **Dev:** 1 process x 10, comfortably under 15.

**Why the worker count is pinned.** The default 7 workers x 2 = 14 fits under 15
only on paper: it assumes the workers never all want a connection at once. That
held while few routes queried Payload at collect time. FW-1 Phase 4D-2 added
`generateStaticParams` on `/legal/[doc]` — enough extra collect-time query sites
that all 7 workers wanted a pool simultaneously, and the build failed with
`EMAXCONNSESSION` on a **different route each run** (`/legal/[doc]`, then
`/authors/[slug]`). Capping workers at 4 fixes the multiplier rather than
shaving the per-process cap, which keeps `max` at 2 and avoids the single-client
deadlock risk that `max: 1` would carry.

Note that `pg_stat_activity` is the wrong instrument here: it shows Supavisor's
warm upstream connections to Postgres (15, near-permanently), not the client
sessions the `pool_size` limit actually counts. It will look saturated even with
nothing running. Trust the build's exit code, not the row count.

The timeouts exist so that pool exhaustion surfaces as a **timeout error** —
a loud failure — rather than an infinite hang, which is a silent one. Same
principle as chaining verification commands with `&&` instead of `;`.

Re-evaluate the production side as more routes are wired and each prerendered
page opens more query sites. The worker count no longer moves with the machine's
core count, so a faster machine will not silently reintroduce the failure.

### Dev + build coexistence

The dev server (`max` 10) and a build (4 x 2 = 8) **cannot run at the same
time** — combined they exceed the 15-client cap. Kill the dev server before
`npm run build`, and restart it after.

**Diagnostic signature:** `EMAXCONNSESSION` during a build while the dev server
is running.

This is a manual step rather than a config problem: each cap is correct for its
own context, and only their overlap breaks. The durable fix is raising Supabase
`pool_size` in the dashboard — deferred, because it needs a paid plan and the
manual step is bounded.

### Diagnostic signatures

| Where  | Signature                                                                                                                                                        |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build  | `FATAL` / `EMAXCONNSESSION`, with **non-deterministic page names** failing between runs — a logic error names the same page every time                           |
| Dev    | **Every Payload-querying route hangs** while cached routes still serve; `pg_stat_activity` shows `idle in transaction` connections that never return to the pool |
| Either | pool acquire times out after 10s                                                                                                                                 |

### If pressure grows

- Raise Supabase `pool_size` in the dashboard (subject to plan limits).
- Reduce Next build workers further via `experimental.cpus` in `next.config.ts`
  — trades build speed for headroom. Already applied at 4.
- Add `?statement_timeout=30000` to `DATABASE_URL` to force stuck transactions
  to release. **Not applied** — it is aggressive (it kills any query over 30s)
  and is held as a follow-up should `idle in transaction` recur.
- **Do not** switch to the transaction-mode pooler (port 6543) without testing.
  Drizzle prepared statements break under transaction pooling in subtle ways.

A `pool.max` change only takes effect on process restart, and a stuck
`idle in transaction` client clears the same way — restart the dev server after
touching this block.

## Seeding a fresh environment

`npm run seed` creates the 6 Verticals and 5 NewsSections that existing routes
need in order to have backing data. Run it once on a fresh clone or new
database; it skips records that already exist and never updates them. Not part
of the build or CI — it is a manual bootstrap step.

## Code style — collections/

13 of the 18 files in `collections/` were authored with single quotes and no
semicolons, out of step with the other 5 and with the rest of the repo, which
Prettier formats at `--print-width 100` with double quotes. Running
`prettier --write` across the folder rewrites those 13 wholesale, which buries
a one-line change under a few hundred lines of churn.

Not urgent. Normalise when next touching a file, or as part of a dedicated
repo-wide formatting pass if one ever happens — not as a standalone formatting
commit, which only adds git-blame noise.

## Out of scope here

Collection configs, any auth wiring, subdomain/Cloudflare Access setup, and
the pre-existing bugs tracked in `.claude/seo-backlog-2026-09-08.md`.
