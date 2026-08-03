# Claude Design Handoff — Full Route System

## How to use this prompt (read this first, don't send it as-is)

Send Message 0 first to snapshot the existing wireframe, then Message 1
ONCE to anchor the design system, then Message 1.5 ONCE to set up the
separate filled-state reference page. Every subsequent route request should
be a SHORT follow-up (one sentence naming the route + tier) — do not
re-paste the full reference material per route. Claude Design retains
context within the same conversation, so re-sending the design language
wastes tokens for no benefit.

---

## Message 0 — Snapshot the current wireframe (send first, before the anchor)

Do this before anything else in the session, so the baseline is captured
before any redesign work touches it.

> Before we start the redesign, duplicate the current wireframe as-is into
> a separate version labeled "pre-redesign baseline" (e.g. a distinct file,
> frame, or page — whatever your versioning method supports). Do not modify
> the original during this step. Confirm the duplicate exists and is
> untouched before I send the design system in the next message.

Wait for confirmation before sending Message 1. This keeps the rg.org-
adjacent baseline available to diff against later, separate from every
route redesigned under the new system.

## Message 1 — Anchor (send once, with the three files attached)

Attach: `design-language-reference.md`, `wireframe-component-audit.md`,
`offpage-seo-six-layer-map.md`. Also point to the pre-redesign baseline
duplicated in Message 0 — that baseline IS the homepage design reference,
not just an archival copy.

> You now have two standing references for every route you design from
> here on:
>
> 1. **The pre-redesign homepage baseline** (duplicated in the previous
>    step) — this is the visual source of truth for tokens: color system,
>    typography scale, spacing, card shapes, iconography, existing
>    component anatomy (ranked-row layout, comparison table structure,
>    footer structure, etc.). Every new route should read as visually
>    continuous with this baseline — same design system, not a new one.
> 2. **The three attached markdown files** — these are the rules for what
>    changes on top of that visual system: which components get added,
>    edited, or deleted (`wireframe-component-audit.md`), which design
>    language to pull from and how (`design-language-reference.md`), and
>    the tier logic that determines register and link behavior
>    (`offpage-seo-six-layer-map.md`).
>
> Where the two conflict — e.g. the audit calls for deleting or restructuring
> something present in the baseline — the markdown files win; the baseline
> is the starting visual language, not a constraint that overrides the
> redesign decisions. Where the files are silent on a visual detail
> (spacing, exact color values, card radius, type scale), default to
> matching the baseline rather than inventing something new.
>
> Core constraint: implement the two-register system described in section
> "5. Tier register split" of `design-language-reference.md` — an editorial
> register (whitespace, restrained, no CTAs) for Tier 1 pages, and a
> comparison register (dense, tabular, CTA-bearing) for Tier 2/3 pages, per
> `offpage-seo-six-layer-map.md` Layer 1. Every route you design must be
> visually identifiable as one register or the other — never a blend — but
> both registers should still feel like the same site as the baseline.
>
> Cross-check every component against `wireframe-component-audit.md` before
> finalizing: respect every KEEP/EDIT/ADD/DELETE verdict there. Do not
> reintroduce anything marked DELETE (Trustpilot star rating without real
> data, compliance badge placeholders) even as a placeholder.
>
> Do not fabricate data. Where the audit flags a "content-integrity gate"
> (Market Stats Strip, Editorial Trust byline, Trustpilot), design the
> component to require real data as a prop — build it so it visibly fails
> to render, or renders an empty/pending state, if that data is missing.
> Do not fill these with placeholder numbers or fake quotes that look real.
>
> Once you confirm you've internalized both the baseline and the file-based
> rules, I'll give you routes one at a time. Each route request will be
> short — just the route name and which register it uses. Apply the system
> from this message and the baseline; don't ask me to re-specify either per
> route.

## Message 1.5 — Separate reference sheet for filled-in states (send after Message 1 confirms)

This resolves the placeholder-vs-fabrication tension: the live wireframe
routes always show honest empty/pending states for anything gated in the
audit (Trustpilot, compliance badges, editorial byline). But you still want
to *see* what a filled-in version looks like, for dev/design reference —
that view just doesn't live on the actual page.

> In addition to the route pages, create one separate reference page — not
> part of the site's route structure, clearly labeled something like
> "Component Reference — Filled States (internal only, not for production)."
> On this page, show each content-integrity-gated component
> (Trustpilot widget, compliance badges, editorial byline card, sourced
> stat callout) in its fully filled-in state, using obviously fictional
> placeholder data (e.g. "Jane Placeholder — Example Analyst," "4.x ★ ·
> N reviews," a generic badge shape with "[Certification Name]" as the
> label) so it's unmistakably a design reference and not a real claim.
>
> Every actual route page in the site keeps these same components in their
> honest empty/pending state, as specified in Message 1 — this reference
> page does not change that. Its only purpose is to give a visual answer to
> "what will this look like once real data exists," so the frontend
> skeleton can be built against a known target shape without the live pages
> ever displaying fabricated content.

## Message 2 onward — per-route requests (short, one per route)

Once Claude Design confirms it holds both the baseline and the file rules,
send route requests like these — each one should be a single short line,
relying on the anchor above rather than re-describing the visual system:

- "Homepage — mixed register per the wireframe (hero + Tier1 sections in
  editorial register, ranked lists + comparison table in comparison
  register)."
- "Blog post template — editorial register (Tier 1), match baseline
  typography and spacing."
- "Comparison/review post template — comparison register (Tier 2/3),
  include the PrimaryDomainLink slot per the audit, match baseline table
  styling."
- "Author page — editorial register, required fields: photo, name,
  credential line, per the audit's Editorial Trust verdict."
- "Category/vertical listing page — editorial register."
- "Responsible gaming page — editorial register, required trust page."
- "Privacy / Terms / Affiliate disclosure — editorial register, standard
  legal page template."

Keep each of these to one line. If Claude Design starts asking clarifying
questions per route, answer those specifically rather than re-explaining
the whole system — the anchor message already covers both the baseline and
the "why."

## Routes 8–11 — post-amendment additions (send after the original 7 routes)

Added after amendments A1–A4 (see `offpage-seo-six-layer-map.md`). Send in
this order; Route 10 must precede Route 11 since the comments component
nests inside the review template.

**Route 8 — RG global directory:**

> Responsible gambling directory page — editorial register, Tier 1. A
> worldwide directory of gambling-help organizations, grouped by
> region/country, each entry: org name, country, contact (phone/chat/site),
> and a "verified [date]" stamp slot. Filterable by region. This replaces
> the single-helpline concept — all "Play Responsibly" callouts site-wide
> now route here. Design the entry card so the verified-date slot is
> structural (an entry without it looks incomplete), same pattern as the
> stat-source rule.

**Route 9 — Auth pages: intentionally skipped.** Clerk's prebuilt
`<SignIn />` / `<SignUp />` components render their own complete UI;
branding is configured via Clerk's appearance/theming API in code. No
design deliverable needed.

**Route 10 — Operator review page (Tier 3, three trust sources):**

> Operator review page template — comparison register, Tier 2/3, includes
> the PrimaryDomainLink slot per the audit. Three visually and semantically
> separated trust blocks, never blended into one number: (1) our editorial
> score with category breakdown, Last Verified stamp, and required author
> byline; (2) first-party user reviews section — login-gated submission
> (signed-in state shows a write-review affordance, signed-out shows a
> sign-in prompt), each review card shows username + date, section header
> clearly labeled as user reviews; (3) Trustpilot block as conditional —
> design its empty/pending state for the live route, filled state goes on
> the Component Reference page only. Clear visual hierarchy: editorial
> first, user reviews second, Trustpilot third.

**Route 11 — Comments component (attach to Route 10's template):**

> Comment section component — appears on Tier 3 review pages only at launch
> (not Tier 1 blog templates). Login-gated: signed-out state is a sign-in
> prompt, not an empty form. Include a moderation-aware state set:
> pending-approval notice for the author's own unpublished comment, and the
> empty state for zero comments ("Be the first…" pattern, kept modest).
> Visually subordinate to the review content above it — this is an appendix
> to the page, not a feature section. Add the filled/populated state to the
> Component Reference page.

## Token-efficiency notes

- The anchor message is the only place the full design language should
  appear. Re-uploading or re-pasting the reference files per route is the
  single biggest avoidable cost in a multi-route build.
- If Claude Design's context resets between sessions (new chat), re-attach
  the three files once at the start of that new session — but still avoid
  repeating the full instructions in every route message within it.
- Batch similar routes together in one message when possible ("Privacy,
  Terms, and Affiliate disclosure — all three as the standard legal page
  template, editorial register") rather than three separate round trips.
- Expect 1–2 revision rounds per route as normal; budget for it rather than
  trying to over-specify the first prompt to avoid any revisions — over-
  specifying costs more input tokens than a short correction costs in a
  second pass.
