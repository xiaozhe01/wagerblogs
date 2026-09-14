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
npm run rls:check    # expect 44/44
```

If it's not, restore it:

```
npm run rls:apply
```

`npm run seed` already calls `rls:apply` for you and fails loudly if it cannot
— but anything else you write does not.

Tracked migrations narrow this bug class rather than eliminating it. A
migration that only alters existing tables leaves RLS alone, but a migration
that creates a new table still lands with RLS off — that is the Postgres
default, not something Payload turns off — so `rls:apply` is still needed after
any migration that adds a table. The improvement is blast radius: the drop
becomes predictable and per-migration instead of firing on any dev boot or any
`getPayload()` from a script.

Tracked as a follow-up in MIGRATION.md, "Move from Drizzle push to tracked
migrations".

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
