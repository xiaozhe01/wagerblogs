# Project memory — synced 2026-09-08

A checked-in mirror of the assistant's per-project memory index, so the same
context is available to anyone reading the repo rather than only inside a
session.

Two things about this file:

- **It is a copy, not the source.** The live index lives in the agent memory
  store; each entry there has a longer note behind it. The file names in
  parentheses below are those notes' names — they are **not** paths in this
  repo, which is why they are not links.
- **The previous version of this file was a stale 10-entry snapshot** whose
  markdown links pointed at files that have never existed in `.claude/`. If you
  re-sync, keep the links stripped.

Verified on sync: three pointers below name `.claude/` docs that **no longer
exist** — `html-semantics-audit.md`, `handover-2026-08-20.md`,
`reaudit-2026-08-18-status.md` (plus `tablet-refactor-parked.md`, already noted
as deleted). Entries citing them are kept for history but flagged inline.

---

## Standing rules and preferences

- **Prettier is width 100, with no config file** (`project_prettier_width_100`) —
  the repo _is_ prettier-formatted, but ships no `.prettierrc`. Always pass
  `--print-width 100`; a bare `npx prettier --write` reflows the whole repo at
  80 and buries real changes.
- **Verify in the browser** (`feedback_verify_in_browser`) — render and _look_
  at the screenshot before proposing and after applying. Code-level reasoning
  produced two wrong visual calls in one session.
- **Measure before a spacing refactor** (`feedback_measure_before_spacing_refactor`)
  — get the real computed gap/margin from Playwright before picking a
  replacement `gap-*`; don't infer from a sibling's convention. Measure
  INK-to-edge, not box-to-box, when auditing card padding.
- **Don't write rationale comments** (`feedback_comment_density`) — the user
  strips explanatory comments; match the sparse `TODO(cms)` house style and
  keep rationale in the reply or handover, not the source.
- **Manual approval** (`feedback_manual_approval`) — don't auto-chain long tool
  sequences; check in.
- **Screenshots go in `_shots`** (`feedback_screenshot_location`) — always
  `.claude/visual-harness/_shots/`, never the scratchpad or `/tmp`; the user
  cannot open tmp paths.
- **shadcn `button.tsx` is customized** (`project_shadcn_button_customization`)
  — the `sm` variant's `text-lg` diverges from the registry; `shadcn add` will
  offer to overwrite it, decline by default.
- **`AnchorList` uses `py-3`** (`feedback_anchorlist_py3_spacing`) — confirmed,
  not `py-2`; don't "correct" it during cleanup.

## Design decisions already settled — don't re-derive

- **Warm-light and the dark toggle are BOTH shipped** (`project_warm_light_shipped_dark_deferred`)
  — palette `#fbf8f1`/`#f3ede0` as of 2026-08-31; muted deliberately kept at
  `#646464` against the brief. The dark toggle is **not parked**: all six phases
  verified complete 2026-09-28, evidence table in
  `.claude/theme-toggle-deferred.md`.
- **Shell/tablet refactor COMPLETE** (`project_tablet_refactor_parked`) —
  finished 2026-08-21; single column below `wide:` (1370px), rail and side-nav
  desktop-only, footer tracks the content column. Its scratch doc is deleted.
- **Chrome sticky clamps to the grid container**
  (`chrome_sticky_clamps_to_grid_container`) — measured, and it contradicts the
  spec reading. This is why `SiteFooter` gets its own sibling grid in
  `PageShell` rather than a second row.
- **Rail card spacing standard** (`project_rail_card_spacing`) — 10px title gap
  on 17 of 18 cards, `AtAGlanceCard` the deliberate 8px exception; the
  `pb-0`/`pb-2` overrides are correct compensation, don't delete them.
- **404 has no broken-link note** (`project_404_no_broken_link_note`) —
  deliberate, settled 2026-08-23. Don't re-add it or flag it as a gap.
- **NODS self-assessment** (`project_self_assessment_nods`) — the
  `/responsible-gambling` self-check is the real NCPG instrument in
  `lib/self-assessment.ts`. Verbatim text, published bands, and the
  deliberately absent helpline number are all load-bearing.
- **Component directory structure** (`component_directory_refactor`) —
  `layout/ section/ rail/ cards/ ui/`, since extended with `controls/` (our own
  components, so `shadcn add` can't collide) and a top-level `hooks/`.

## Live resume points

- **SEO backlog** (`seo_backlog_pointer`) → `.claude/seo-backlog-2026-09-08.md`.
  Sitemap, robots, llms.txt, `metadataBase`, canonicals and `WebSite`/`FAQPage`
  JSON-LD shipped. Seven items left, two of which are defects. **Never put the
  sitemap's `lastModified` on a cron.**
- **Editorial redesign plan** (`project_editorial_redesign_plan`) →
  `.claude/editorial-redesign-plan-2026-09-03.md`. 8-stage sequence; `.card` is
  not the defect (nesting is); 60–75 CPL is our own documented standard.
- **Content-width baseline** (`project_content_width_baseline`) →
  `.claude/content-width-reference-2026-09-02.md`. The `wide:` breakpoint
  _inverts_ the column (1369px→960px, 1370px→730px) and `main` ceilings at
  920px.
- **Redesign v1 sweep** (`project_redesign_v1_sweep`) →
  `.claude/redesign-sweep-2026-09-02.md`. The canvases have their own
  `globals.css` — don't read them as production.
- **Typography migration in flight** (`project_typography_weight_migration`) →
  `.claude/typography-weight-audit.md`. It is SIZE-led, not weight-led.
- **rg.org typography reference** → `.claude/rg-typography-reference.md`, fetched
  2026-08-21. The external half does not go stale; the script that fetched it
  was deleted 2026-09-08 precisely so nobody re-fetches.
- **External design references** (`reference_external_design_sites`) — rg.org
  (comparison density), NerdWallet (editorial restraint), The Athletic (dark
  theme, mobile only).

## Closed, kept for history

- **DRY audit** (`dry_audit_pointer`) — 28/29 findings resolved 2026-08-17.
- **Component inventory** (`wagerblogs_component_inventory`) — the 13 shared
  components from that pass.
- **Re-audit arc complete through 2026-08-19** — VC-1–58 and VP-1–9 all closed.
  ⚠ cites `reaudit-2026-08-18-status.md`, which no longer exists.
- **HTML-semantics refactor complete** (`project_html_semantics_refactor`) — all
  five phases done. ⚠ cites `.claude/html-semantics-audit.md`, which no longer
  exists.
- **2026-08-20 handover** — was the resume point; ⚠
  `.claude/handover-2026-08-20.md` no longer exists. Superseded by the redesign
  and SEO plans above.
- **Visual swap planned** (`project_visual_swap_planned`) — superseded by the
  redesign plan.

## Corrections applied on this sync

- **A11y baseline** (`a11y_suite_baseline`) said "25 passed / 0 failed / 1
  skipped". As of 2026-09-08 the suite is **234 passed / 0 failed / 14
  skipped** — it gained `/faq`, an accordion interaction test, and a whole
  `best-practice.spec.ts` covering `heading-order` and `landmark-unique`, which
  the WCAG-tagged scan never checked. The base-ui focus-guard local patch still
  stands; re-verify if `@base-ui/react` is upgraded.
- **"No repo script fetches external hosts"** was wrong when written —
  `rg-leading.spec.ts` fetched `https://www.rg.org`. That script was deleted on
  2026-09-08, so the statement is true again.
