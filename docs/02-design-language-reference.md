# Design Language Reference — For Claude Design Handoff

Purpose: gives Claude Design concrete reference design languages, mapped to
the 6-layer off-page SEO model and the component audit verdicts, so the next
design pass is grounded in (a) what the niche expects, (b) what best-in-class
trust design looks like, and (c) what our link-policy architecture requires
structurally. Companion files: `offpage-seo-six-layer-map.md`,
`wireframe-component-audit.md` (do not modify that file; this one refines it).

---

## Reference 1 — rg.org (niche convention baseline)

Fetched and analyzed directly. This is what the gambling/betting review
niche expects a credible site to look like. Its design language:

**Structure and hierarchy**
- Dense, information-first homepage: ranked operator tables dominate the
  fold after a short SEO-intro hero. Content sections alternate between
  monetized surfaces (ranked lists, bonus cards) and authority surfaces
  (news feeds, research features, state statistics).
- Left-sticky nav (desktop) with deep collapsible sub-routes: News,
  Statistics (per-state), Research, Reviews, About — the nav itself
  advertises content depth, which is a trust signal.
- Heavy state-by-state segmentation (38+ state pages linked from the
  homepage) — communicates regulatory seriousness and gives crawlers a
  large, well-structured internal link surface.

**Trust signal placement (their pattern)**
- "How we review" methodology block directly beneath the ranked table,
  with a step-by-step process (hands-on testing, consistent criteria,
  benchmarked scoring, published standards) and links to a public
  methodology page.
- Editor-in-Chief quote + byline immediately after the ranked list —
  humanizes the rankings right where skepticism peaks.
- "As Featured In" media logo strip (NYT, BBC, Bloomberg, ESPN...) —
  authority-by-association, repeated in the footer.
- Author cards with names, photos, credentials, language/region tags, and
  social links; "Meet All Our Experts" page.
- Trustpilot rating widget with review count and outbound CTA.
- Per-listing "Last Verified — [date]" stamps on every operator row —
  freshness as a visible trust signal, not just metadata.
- Responsible-gambling helpline references inline in operator terms, plus
  dedicated Responsible Gambling page in the footer.
- Extended legal footer: affiliate disclosure, publisher identity with
  company number and address, disclaimers page, privacy/terms.

**Visual language**
- Conventional, utilitarian, data-dense. Comparison tables with payment
  method icons, rating breakdowns per category (six scored areas per
  operator), bonus terms in small print under every offer.
- Not visually distinctive — its credibility comes from density,
  specificity, and disclosure, not aesthetics.

**What to take:** the trust-signal *placement pattern* (methodology beneath
rankings, byline near rankings, verified dates on rows, disclosure in
footer). These are niche conventions; omitting them reads as less
trustworthy, not more original.

**What NOT to take:** fabricating any of the above. rg.org's signals work
because they're (presumably) backed by real authors, real Trustpilot data,
real methodology pages. Copying the visual shell with placeholder data is
the exact fabrication risk already flagged in the component audit. Also do
not copy their identity/branding — reference the pattern, not the skin.

---

## Reference 2 — NerdWallet (trust-first review design, best-in-class analog)

NerdWallet is the strongest non-gambling analog: a YMYL (financial) review/
comparison site whose entire brand is built on reading as independent and
consumer-first. Design language per current design analyses:

- Clean, modern, generous white space — the opposite of rg.org's density.
  Clear organization that makes choosing a service path effortless.
- Interactive guidance elements (progressive questionnaires before showing
  recommendations) — the site asks about the user's situation before
  recommending, which itself signals independence: recommendations feel
  earned, not pre-sold.
- Consistent branding, simple color system, and friendly illustration over
  stock photography.

**What to take:** the *feel* of independence. Whitespace, restraint, and
"help me choose" interaction patterns read as consumer-advocate; wall-to-wall
ranked tables with bonus CTAs read as affiliate-first. Our three-tier model
is exactly this tension formalized — Tier 1 pages should feel NerdWallet-
like, Tier 2/3 surfaces can be denser and more rg.org-like.

---

## Reference 3 — Trust-signal placement research (cross-industry)

Synthesized from current conversion/trust research:

- First impressions are overwhelmingly design-driven; credibility judgments
  are made mostly on overall aesthetic before any copy is read. A cluttered
  or inconsistent layout undermines every badge placed on it.
- Limit trust badges to roughly three per location (header, above fold,
  footer) — badge overload reads as desperate and lowers trust.
- The highest-impact signals for an unknown site: professional branded
  domain, HTTPS, a real About page with named people and photos, visible
  contact info, and reviews on a third-party platform. All five map
  directly to Layer 4 (Person/Organization schema) and Layer 6 (trust
  pages) in our model.
- Testimonials/reviews need full names and photos to function; anonymous
  quotes actively hurt.
- Privacy Policy and Terms linked in the footer are baseline expectations,
  not extras.

---

## Mapping: design language → 6-layer model

| Layer | Design implication | Reference source |
|---|---|---|
| 1. Editorial policy | Tier 1 surfaces designed NerdWallet-like (whitespace, editorial feel); Tier 2/3 surfaces designed rg.org-like (comparison density, CTAs). The visual register itself should signal which tier a page is. | Both |
| 2. CMS + components | Ranked lists, bonus cards, comparison tables built as data-driven components with a `linkTier` + `primaryDomainLink` prop contract — never static rows. Design must accommodate one visually-integrated primary-domain entry among competitors. | rg.org structure |
| 3. Rendering | No design implication except: no critical content (links, rankings) behind client-side-only interactions/tabs that delay DOM presence. | — |
| 4. Structured data | Byline component designed to *require* photo + name + credential (making anonymity structurally awkward); "Last Verified" date stamps on review rows (surfacing `dateModified`); methodology block linking to a real methodology page. | rg.org pattern |
| 5. Crawlability | Deep footer + category directory as deliberate internal-link surfaces; state/vertical segmentation pages if content plan supports them; every nav item resolves to a real route. | rg.org structure |
| 6. Off-site/trust | Responsible-gambling callout, affiliate disclosure, publisher identity block (real company details) in extended footer; Trustpilot widget conditional on real data existing; max ~3 badges per zone. | rg.org + research |

---

## Refined edits to the component audit (supersedes nothing; adds design
direction on top of the existing verdicts)

1. **Ranked Sportsbooks / Comparison Table (EDIT verdicts)** — adopt
   rg.org's row anatomy as the reference: rank badge, score with visible
   category breakdown, key advantages bullets, "Last Verified" date, terms
   small-print. Add our requirement on top: the row component takes
   `linkTier`/`primaryDomainLink` props, and only the primary-domain entry
   renders an equity-passing link.

2. **Editorial Trust (EDIT verdict)** — adopt rg.org's placement (byline
   directly adjacent to rankings) but design the component so it cannot
   render without real author data: photo, full name, credential line, and
   author-page link are required props, not optional. Empty = section
   doesn't render.

3. **Market Stats Strip (EDIT verdict)** — adopt rg.org's per-state
   statistics pattern as the aspiration (their stats link to sourced
   state-regulator data). Design each stat callout with a visible source
   attribution slot — a stat without a source citation should look visibly
   incomplete in the design system.

4. **Trustpilot (conditional DELETE verdict)** — follow rg.org's placement
   (pre-footer) but implement per the audit: renders nothing without real
   Trustpilot data. Design the empty state as absence, not placeholder.

5. **Tier register split (new design direction)** — introduce two visual
   registers in the design system: an "editorial" register (more
   whitespace, serif or editorial type accents, no CTAs) for Tier 1
   content pages, and a "comparison" register (denser, tabular, CTA-
   bearing) for Tier 2/3 surfaces. The homepage mixes both, which is
   correct — but individual content pages should sit clearly in one
   register, reinforcing the tier separation visually.

6. **Overall character** — target position: rg.org's disclosure/methodology
   conventions with NerdWallet's restraint and whitespace. Distinct from
   both: neither rg.org's utilitarian density nor NerdWallet's playfulness.
   The differentiated character lives in typography, color system, and the
   editorial register — not in omitting the niche's expected trust
   conventions.
