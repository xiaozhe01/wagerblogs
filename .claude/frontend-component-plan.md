# Front-end component plan (pre-CMS, mock-data phase)

Status: `lib/types.ts` and `lib/mock-data.ts` already exist and match this
plan. The components below were about to be written by Claude Code but the
user is writing the front-end code themselves instead — Claude reviews it
after. Keep this file as the spec to review against.

Context: PayloadCMS is deliberately not set up yet ("standalone repo
pattern" per CLAUDE.md — will live in a separate repo later). Front-end is
being built first against typed local mock data. Non-negotiable rules from
CLAUDE.md / docs/00-06 still apply even though nothing is wired to a real
CMS yet.

## `components/PrimaryDomainLink.tsx`

Exact enforcement component from `docs/00-six-layer-map.md` Layer 2:

```tsx
type Props = {
  linkTier: 'tier1' | 'tier2' | 'tier3'
  primaryDomainLink?: {
    anchorText: string
    url: string
    relAttribute: 'dofollow' | 'sponsored' | 'nofollow'
  }
}

export function PrimaryDomainLink({ linkTier, primaryDomainLink }: Props) {
  if (linkTier === 'tier1' || !primaryDomainLink) return null
  // ...
}
```

- Returns `null` (not CSS-hidden) for tier1 or missing link data — this is
  the second guard, independent of the CMS `admin.condition`.
- rel mapping per the doc: `dofollow` → no rel, `sponsored` → "sponsored
  noopener", `nofollow` → "nofollow noopener".
- Suggested hardening beyond the literal doc spec: always include
  `noopener` even in the `dofollow` case (target="_blank" with no `rel` at
  all is a reverse-tabnabbing risk; `noopener` is a browser-security token,
  not an SEO signal, so adding it doesn't change the dofollow/nofollow
  semantics Google reads).
- `data-link-tier={linkTier}` attribute per the doc — dev-facing only, not
  a public trust signal.

## `components/RankedOperatorRow.tsx` (or `RankedOperatorList.tsx`)

Per `docs/01-wireframe-component-audit.md` (Ranked Sportsbooks / Ranked
Casinos) and `docs/02-design-language-reference.md` refined edit #1:

- Props: `operator: Operator`, `rank: number` (see `lib/types.ts`).
- Row anatomy (rg.org-derived): rank badge, operator name, score + visible
  category breakdown, advantages bullets, "Last Verified" date stamp
  (`.meta-label` class in globals.css), terms small print.
- CTA logic — the actual link-policy mechanism:
  - `operator.isPrimaryDomain === true` → render
    `<PrimaryDomainLink linkTier="tier2" primaryDomainLink={operator.primaryDomainLink} />`
    as the CTA (ranked-list rows are inherently Tier 2/3 surfaces per the
    audit, so `linkTier="tier2"` is hardcoded here, not read from the
    operator).
  - Any other operator → text-only, **no link at all** (per Phase 2 spec:
    "all other operators render text-only (no outbound links to
    competitors)" — not nofollow'd, just absent).
- Only one operator in the array passed to the parent list may have
  `isPrimaryDomain: true` — this should probably be asserted/dev-warned at
  the list level, not silently allowed.

## `components/ComparisonTable.tsx`

Per audit (Comparison Table, 3 operators × N features) and design-language
refined edit — same primary-domain-only-link rule as the ranked list, in
table-column form:

- Props: `operators: Operator[]` (expected length 3, first entry is
  conventionally primary domain in mock data but should be driven by
  `isPrimaryDomain`, not array position).
- One column (the `isPrimaryDomain` one) gets the `PrimaryDomainLink` CTA
  in its cell; the other columns are text-only, no dofollow/sponsored/any
  link out to competitors.
- `Review` schema per operator belongs here later (Phase 4 / Layer 4) —
  not needed until JSON-LD work starts.

## `components/UgcLink.tsx`

Per Phase 2 item 3 / Amendment A4 — any link inside user-generated content
(comments, future forum) must render `rel="ugc nofollow"`, hardcoded, never
CMS-editable or override-able via props:

```tsx
type Props = { href: string; children: React.ReactNode }

export function UgcLink({ href, children }: Props) {
  return (
    <a href={href} rel="ugc nofollow noopener" target="_blank">
      {children}
    </a>
  )
}
```

- Deliberately does not accept a `rel` prop — the whole point is that a
  freelancer/CMS field can never override this.
- Not needed for the homepage pass; relevant once comments (Route 11) are
  built. Documented here now since it's one of the five non-negotiable
  rules and easy to forget later.

## Mock data notes (already written, see `lib/mock-data.ts`)

- All operator names, author name, and post copy are deliberately
  fictional/placeholder-labeled (e.g. "Jane Placeholder", "ExampleBet",
  "Northline Sports (placeholder competitor)") — this is a live-route
  concern, not just an internal reference page concern. CLAUDE.md rule 3
  bars "fabricated trust signals... on live routes," and an author byline
  is explicitly named as a trust signal. Using obviously-fictional labels
  (matching the convention already established in
  `docs/03-claude-design-handoff-prompt.md` Message 1.5 for the internal
  Component Reference page) avoids ever having to distinguish "is this
  placeholder or real" before launch.
- `primaryDomainLink.url` uses `https://example.com` (RFC 2606 reserved
  placeholder domain) rather than any real or guessed domain name.
- Trustpilot ratings, compliance badges, and sourced stat callouts are
  intentionally NOT in the mock data yet — those are the content-integrity
  gated components (`docs/01-wireframe-component-audit.md`) that must
  render honest empty/pending states even in dev; don't add fake-plausible
  numbers for them later either, only real data or an explicit "Component
  Reference — Filled States" page per Message 1.5.

## Not yet started

Homepage assembly (Hero, Ranked Sportsbooks section, Comparison Table,
Header/Footer scaffolding) was the next planned step but hasn't been
written — front-end code is being written by the user directly from here.
