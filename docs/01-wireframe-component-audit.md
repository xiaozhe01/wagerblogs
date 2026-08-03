# Wireframe Component Audit — Mapped to the 6-Layer Off-Page SEO Stack

Purpose: cross-checks every section of the existing rg.org-referenced
wireframe against the 6-layer technical map. Each section gets a verdict —
KEEP / EDIT / ADD / DELETE — plus which layer(s) it must satisfy to actually
function, not just look right. Feed this whole document to Claude Design as
the brief for the next pass.

Reference: see `offpage-seo-six-layer-map.md` for full layer detail.

---

## Section-by-section verdicts

### Header
**Verdict: KEEP, minor edit.**
No link-policy role. Layer 5 concern only — every nav link must resolve to a
real canonical route (no dead `<a href="#">`), since broken internal links
hurt crawlability. No visual change needed.

### Hero
**Verdict: KEEP.**
This is Tier 1 territory — the H1 + intro paragraph is pure-authority framing
for the site itself. Must NOT contain any primary-domain link or CTA that
points at the primary domain. The "Compare Top Sites" CTA should route to an
internal `/sportsbooks` or `/reviews` listing page, not externally. Layer 1 +
Layer 4 (`Organization` schema lives in the root layout this page inherits).

### Ranked Sportsbooks (5 rows, fictional brands)
**Verdict: EDIT — this is the primary Tier 2/3 slot.**
Currently 5 generic fictional brands with no distinction. This section needs
to become the actual mechanism: one row is the primary domain (Tier 2/3,
`PrimaryDomainLink` component, `dofollow` or `sponsored` per policy), the
remaining rows are real or fictional competitors with either no link or
`nofollow`'d links (you don't want to pass equity to actual competitors).
Needs: `linkTier` badge in CMS admin view (dev-facing only, not public),
`Review`/`AggregateRating` JSON-LD per row (Layer 4). Design-wise: the
primary-domain row shouldn't be visually flagged as "sponsored" in a way
that undercuts trust, but shouldn't be indistinguishable from competitors
either — the "brand on top, followed by comparables" pattern you described
is the right instinct here.

### Ranked Casinos (5 rows)
**Verdict: EDIT — same treatment as Ranked Sportsbooks**, if the primary
domain has a casino-side product. If not, this section is pure Tier 1/
competitor-comparison content with zero primary-domain links — decide this
before Claude Design touches it, since it changes whether this section needs
the `PrimaryDomainLink` component at all.

### Featured Bonuses (4 cards)
**Verdict: EDIT.**
Same mechanism as Ranked Sportsbooks — decide whether the primary domain has
a bonus offer that belongs here. If yes: Tier 2/3, `PrimaryDomainLink`
component, `sponsored` rel by policy default. If the primary domain has no
bonus/promo model, this section may not apply — flag to Claude Design as
"structure only, content TBD."

### Comparison Table (3 operators x 5 features)
**Verdict: KEEP, this is a core Tier 2 asset.**
This is the clearest "comparison content" Tier 2 use case in the whole
wireframe. One of the 3 operator columns should be the primary domain.
Needs the `PrimaryDomainLink` component embedded in that column's CTA cell,
`Review` schema per operator, and `rel` attribute set per policy on that one
column only — the other 2 columns get no dofollow/sponsored link out at all
(text-only comparison, not links to competitors).

### Market Stats Strip (4 stat callouts)
**Verdict: EDIT — content-integrity gate, not a link-policy issue.**
No connection to the 6-layer link map. Flagged separately in prior sessions:
these numbers ($26.3B handle, 38 states, etc.) must be sourced from real
public data (state gambling commission reports) or removed — this is a
YMYL fabrication risk independent of off-page mechanics. Pass to Claude
Design as "structure only, real data required before copy is final."

### Category Directory (6 verticals)
**Verdict: KEEP.**
Pure Tier 1 internal navigation — supports Layer 5 (internal linking
density). No outbound link concern.

### Latest News (single card + filter chips + feed)
**Verdict: KEEP.**
Tier 1 pure-authority content by default. Needs `Article` schema per news
item (Layer 4) and real author bylines (Layer 4 E-E-A-T requirement) — no
anonymous posts. No primary-domain links belong in this section.

### Editorial Trust (quote + EIC byline)
**Verdict: EDIT — content-integrity gate.**
Same fabrication risk flagged previously for the about-page copy. The quote
and byline must belong to a real named person with a real `Person` schema
entry (Layer 4), or the section should be cut for v1. Do not let Claude
Design fill this with placeholder-that-looks-real copy — flag explicitly as
"real author required, do not fabricate."

### Blog Previews (3 posts)
**Verdict: KEEP.**
Tier 1 by default (per your freelancer-written independent content plan),
though individual posts may be Tier 2/3 depending on freelancer's brief.
Each preview card needs to route to a real `/blog/[slug]` route with its own
canonical + `Article` schema (Layers 4 + 5).

### Betting Toolbox (4 resource cards: Guides/Research/Stats/Compare)
**Verdict: KEEP.**
Tier 1 internal navigation, supports internal linking density (Layer 5). No
outbound concern.

### Right Rail (search, Trending Now, state finder, Editor's Pick,
Newsletter, Play Responsibly)
**Verdict: EDIT — split by sub-component.**
- Search, Trending Now, state finder: KEEP, Tier 1, internal links only.
- **Editor's Pick**: this is a disguised Tier 2/3 slot — if "Editor's Pick"
  ever surfaces the primary domain, it needs the same `PrimaryDomainLink`
  treatment as the ranked list rows. Decide now whether this is intended as
  a link slot or genuinely editorial; don't let it become an undeclared
  fourth tier.
- Newsletter signup: flagged in a prior session as questionable ROI for v1
  (ongoing content commitment). Consider DELETE for v1, revisit later.
- Play Responsibly mini-card: KEEP, required trust signal (Layer 6, YMYL
  compliance), links to `/responsible-gaming` (must exist per Layer 6).

### Trustpilot (logo, star rating, review count, CTA)
**Verdict: EDIT — content-integrity gate.**
Cannot display a real Trustpilot rating without an actual Trustpilot
account and real reviews. Fabricated star ratings/review counts are a
direct YMYL trust violation. DELETE until a real Trustpilot presence exists,
or replace with a genuine (even if modest) real number.

### Responsible Gambling callout (helpline + Get Help CTA)
**Verdict: KEEP, required.**
Layer 6 compliance requirement. Links to `/responsible-gaming` route, which
must exist before launch per the earlier production-readiness audit.

### Footer (4 columns + disclaimer + copyright)
**Verdict: KEEP.**
Layer 5 (internal linking to all major sections) + Layer 6 (links to
`/privacy`, `/affiliate-disclosure`, `/responsible-gaming` — all three must
be real routes, not placeholders).

### Extended Legal (5 links, 4 disclaimer paragraphs, compliance badges)
**Verdict: EDIT — content-integrity gate on badges specifically.**
Legal links and disclaimer paragraphs: KEEP, required (Layer 6). Compliance
badge placeholders: DELETE unless the primary domain/publisher actually
holds the certifications those badges represent — a fake compliance badge
is a more serious trust violation than a missing one.

---

## Consolidated instruction set for Claude Design

**ADD (new, not in original wireframe):**
- `linkTier` visual indicator in any admin/preview view (not public-facing)
  for Ranked Sportsbooks, Ranked Casinos, Featured Bonuses, Comparison Table
- Explicit "real author required" placeholder convention for Editorial
  Trust and Blog Previews author bylines — Claude Design should design the
  byline component to visually require a photo + name + credential line,
  making it awkward to leave anonymous

**EDIT (structure stays, content/logic changes):**
- Ranked Sportsbooks, Ranked Casinos, Featured Bonuses, Comparison Table —
  build as data-driven components accepting a `linkTier` + `primaryDomainLink`
  prop set per entry, not static fictional rows
- Right Rail "Editor's Pick" — decide and design explicitly as either a
  Tier 2/3 link slot or genuinely independent editorial pick, not both
- Market Stats Strip — design to accept real sourced data, not fabricated
  placeholder numbers
- Trustpilot section — design as optional/conditional (renders nothing if
  no real Trustpilot data exists yet), not a hardcoded placeholder

**DELETE (cut for v1 or entirely):**
- Trustpilot star rating/review count until real data exists
- Compliance badge placeholders until real certifications exist
- Newsletter signup (reconsider for v1 given ongoing content commitment)

**KEEP as-is (no link-policy or integrity concern):**
- Header, Category Directory, Betting Toolbox, Latest News (structure),
  Search/Trending/state finder in Right Rail, Play Responsibly callout,
  Footer structure, Responsible Gambling callout
