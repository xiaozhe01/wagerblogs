# Repo status — WagerBlogs

**First swept 2026-08-25, re-verified 2026-08-29.** Records where things stand,
not what to do next. Everything below was checked live, not inferred.

| Check | Result |
| --- | --- |
| `npx tsc --noEmit` | clean |
| `npm run lint` | 0 errors, 4 warnings (all in `.claude/visual-harness/` and `playwright/` scratch scripts) |
| `npm run test:a11y` | 25 passed, 1 skipped |
| landmark naming | 72 named, 0 unnamed (`visual-harness/section-names.mjs`) |
| horizontal overflow @ 1370 / 390px | none on 10 routes (`visual-harness/overflow-check.mjs`) |

## Stack

`next 16.2.12` · `react 19.2.4`. **Payload, Clerk and Supabase are not
installed** — the CMS, auth and DB layers named in CLAUDE.md are entirely
unbuilt. Everything renders from `lib/mock-data.ts`, which is what the ~47
`TODO(cms)` markers gate.

## Routes that exist

```
/  ·  /categories  ·  /categories/[slug]  ·  /reviews  ·  /reviews/[slug]
/blog/[slug]  ·  /authors/[slug]  ·  /legal/[doc]
/responsible-gambling  ·  /responsible-gambling/help-directory
```

---

## Open

**1 · Five internal link targets 404.** Linked from real navigation, not
placeholders:

| route | linked from |
| --- | ---: |
| `/about` | 9 files |
| `/news` | 5 files |
| `/contact` | 5 files |
| `/blog` (index; only `[slug]` exists) | 4 files |
| `/login` | 2 files |

**2 · No crawl plumbing.** No `app/robots.ts`, no `app/sitemap.ts`. Required by
`docs/00` Layer 4; an off-page SEO site cannot ship without them.

**3 · `globals.css`'s breakpoint doc block contradicts the file it sits in.**
The prose block says *"no custom `--breakpoint-*` tokens are declared — use
unprefixed, `md:`, `lg:` directly"*, but line 153 declares
`--breakpoint-wide: 1370px`, and `wide:` is what actually drives the shell.
The same block describes the side-nav replacing the top-header at `lg:`
(1024px); since the shell/tablet refactor that switch happens at `wide:`
(1370px). Both statements are now wrong, in the file that calls itself the
source of truth.

**4 · `next.config.ts` carries `allowedDevOrigins: ["live-test.stakeblogs.com"]`**
— a different project's host.

**5 · The "Component Reference — Filled States" page doesn't exist.**
CLAUDE.md rule 3 names it as the *only* place filled-in mockups belong. Until it
exists there is nowhere legitimate to put them.

**6 · `full-review` is referenced in `lib/mock-data.ts` (×2)** after the route
was deleted. The other ~24 references are inside `.claude/` audit docs and are
historical.

---

## Resolved since 2026-08-25

- **`--breakpoint-cards-wide`** — dead token, now removed from `globals.css`.
- **Landmark naming** — was 30 unnamed regions sitewide; now 0.
- **`<main>` spacing ownership** — every route now declares its register and
  lets `<main>` own the gaps between blocks.
- **Typography migration** — both phases shipped; ≤12px nodes 69% → 29%,
  weight-400 nodes 56% → 11%. See `typography-weight-audit.md`.
- **Two h1 deviations** (`/responsible-gambling`, `/responsible-gambling/help-directory`)
  — both back on the `text-5xl-*` ramp.

## References removed from this doc

This doc previously linked eight files that are not in the repo. Four were
`docs/` files under pre-rename names — they exist today under their numbered
names (`00-`…`04-`), so those links were repointed or dropped.

The other four never existed here and their content is not recoverable from this
repo: html-semantics-audit, handover-2026-08-20, link-audit and
reaudit-2026-08-18-status (named without links on purpose, so a link check does
not treat them as live). The first of those was also cited by the two companion
typography docs; both citations were removed in the same pass, so nothing in
`.claude/` points at a missing file any more.
