# Off-Page SEO — Full Technical Map (6 Layers)

Purpose: this document maps everything required to make the off-page SEO asset
actually pass link equity to the primary domain — from editorial rules down to
the raw HTML Googlebot reads. Each layer builds on the one above it. Google
never sees "tier" as a concept; it only ever sees the final rendered output —
presence/absence of a link, its anchor text, and its `rel` attribute. Every
layer below exists to control what that final output is.

Stack assumed: Next.js (App Router) + React + PayloadCMS + Supabase Postgres.

---

## Layer 1 — Editorial policy (the three-tier link model)

This is the rule set everything downstream encodes. It exists to prevent the
site from reading as a link farm or doorway site — the single biggest signal
that separates a legitimate publication from a manipulative one.

| Tier | Purpose | Links to primary domain? | Internal links? |
|---|---|---|---|
| **Tier 1 — Pure authority** | Reads as genuinely independent editorial. Builds the new site's own domain trust. | **Never.** No outbound to primary domain, or it stops reading as independent. | Links to Tier 2/3 |
| **Tier 2 — Comparison** | Primary domain appears alongside real competitors, in natural comparison context. | Yes, embedded naturally. | Both directions |
| **Tier 3 — Direct-reference** | Explicit review/reference where a link to primary domain is contextually expected. | Yes, direct and expected. | Back to Tier 1/2 |

**Why it matters:** topical relevance of the *linking context* matters more
than raw authority. A link embedded in genuinely relevant, well-supported
content passes more trust than the same link sitting on a thin page.

**Who owns this layer:** the editor/freelancer, per-article, via the CMS field
in Layer 2. This is not a design decision — it's assigned at the content
level, before a single line of layout code touches it.

---

## Layer 2 — CMS schema and React components

This is where policy becomes data, and data becomes conditional rendering.
The tier is set once, in the CMS, by whoever writes the post — not decided
in code per-page.

### CMS field (PayloadCMS)

```ts
// Posts.ts
{
  name: 'linkTier',
  type: 'select',
  required: true,
  defaultValue: 'tier1',
  options: [
    { label: 'Tier 1 — Pure authority (no outbound link)', value: 'tier1' },
    { label: 'Tier 2 — Comparison (embedded outbound)', value: 'tier2' },
    { label: 'Tier 3 — Direct reference (explicit review link)', value: 'tier3' },
  ],
  admin: {
    description: 'Controls whether/how this post links to the primary domain. Tier 1 must never link out.',
  },
},
{
  name: 'primaryDomainLink',
  type: 'group',
  admin: {
    condition: (data) => data.linkTier === 'tier2' || data.linkTier === 'tier3',
  },
  fields: [
    { name: 'anchorText', type: 'text', required: true },
    { name: 'url', type: 'text', required: true },
    {
      name: 'relAttribute',
      type: 'select',
      defaultValue: 'sponsored',
      options: ['dofollow', 'sponsored', 'nofollow'],
    },
  ],
},
```

The `admin.condition` is the enforcement point in the CMS UI — the link
fields are physically absent from the editing screen for a Tier 1 post, so a
freelancer cannot accidentally add an outbound link to a Tier 1 article.

### React component (rendering enforcement)

```tsx
// components/PrimaryDomainLink.tsx
type Props = {
  linkTier: 'tier1' | 'tier2' | 'tier3'
  primaryDomainLink?: {
    anchorText: string
    url: string
    relAttribute: 'dofollow' | 'sponsored' | 'nofollow'
  }
}

export function PrimaryDomainLink({ linkTier, primaryDomainLink }: Props) {
  // Second guard, independent of the CMS condition above.
  if (linkTier === 'tier1' || !primaryDomainLink) return null

  const { anchorText, url, relAttribute } = primaryDomainLink
  const relMap: Record<string, string> = {
    dofollow: '',
    sponsored: 'sponsored noopener',
    nofollow: 'nofollow noopener',
  }

  return (
    <a href={url} rel={relMap[relAttribute] || undefined} target="_blank" data-link-tier={linkTier}>
      {anchorText}
    </a>
  )
}
```

For a Tier 1 post, this component returns `null` — no `<a>` tag exists
anywhere in that route's HTML. Not hidden with CSS, not `nofollow`'d:
structurally absent. This is the strongest possible enforcement, since
"hidden with CSS" is itself a pattern Google's spam systems can detect;
"the tag was never generated" leaves nothing to detect.

---

## Layer 3 — Rendering strategy (SSG vs ISR vs client-side)

Controls *when* the HTML containing (or omitting) the link is generated, and
therefore whether Googlebot reliably sees it on first crawl.

- **Static Site Generation (`generateStaticParams`, no `dynamic` export)** —
  HTML built once at deploy time. Best default for blog/review posts, since
  content doesn't change per-request. Googlebot fetches genuinely static
  HTML — fastest, most reliable crawl.
- **ISR (`revalidate: N`)** — same as SSG but regenerates on a schedule. Use
  for anything with freshness-sensitive content (bonus terms, odds,
  `dateModified`-driven trust signals).
- **Avoid client-only rendering** for any tier-bearing content. If the `<a>`
  tag only appears after client JS executes, you're relying on Googlebot's
  secondary render pass — real, but less reliable than server-rendered HTML.
  Since PayloadCMS data is fetched server-side by default in App Router, this
  is mostly avoided automatically — just don't move `PrimaryDomainLink`
  rendering into a `'use client'` component that fetches on mount.

---

## Layer 4 — Structured data (JSON-LD)

This turns "a page with a link on it" into something Google's systems can
parse as a *specific kind* of trust signal, rather than plain text.

**`Organization` schema** (site-wide, once, in root layout) — establishes the
site as a real publisher entity, not an anonymous doorway page.

```tsx
// app/layout.tsx
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'YourSiteName',
  url: 'https://yoursite.com',
  logo: 'https://yoursite.com/logo.png',
  sameAs: ['https://twitter.com/yourhandle', 'https://www.linkedin.com/company/yourco'],
}
```

**`Article` schema** (every post, especially Tier 1) — carries `author`,
`datePublished`, `dateModified`. This is the primary E-E-A-T carrier; Tier 1
content needs a real author byline tied to this, not an anonymous post.

```tsx
const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  author: { '@type': 'Person', name: post.author.name, url: `https://yoursite.com/authors/${post.author.slug}` },
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  publisher: { '@type': 'Organization', name: 'YourSiteName', logo: { '@type': 'ImageObject', url: 'https://yoursite.com/logo.png' } },
}
```

**`Review`/`AggregateRating` schema** (Tier 2/3 only) — expected in this
niche; makes comparison content eligible for rich results.

```tsx
const reviewSchema = {
  '@context': 'https://schema.org',
  '@type': 'Review',
  itemReviewed: { '@type': 'Organization', name: operator.name },
  reviewRating: { '@type': 'Rating', ratingValue: operator.score, bestRating: '10' },
  author: { '@type': 'Person', name: post.author.name },
}
```

**`BreadcrumbList`** — crawl-path clarity, cheap, standard on every route.

Implementation pattern:

```tsx
// lib/schema.tsx
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

// app/blog/[slug]/page.tsx
<JsonLd data={articleSchema} />
{post.linkTier !== 'tier1' && <JsonLd data={reviewSchema} />}
```

Same conditional pattern as Layer 2 — `Review` schema only emits on Tier 2/3.

---

## Layer 5 — Crawlability plumbing

Determines whether Googlebot *finds and correctly indexes* pages at all,
independent of link policy.

- **`app/sitemap.ts`** — Next.js App Router native support; auto-generate
  from the CMS post list. `lastmod` must match `dateModified`.
- **`app/robots.ts`** — CMS admin routes disallowed, public routes allowed.
- **Canonical tags** — every route needs its own `generateMetadata()`
  returning its own canonical URL, never inheriting the homepage's. (This
  exact bug was previously caught in the stakeblogs audit — worth checking
  it doesn't recur on the new build.)
- **Internal linking density** — Tier 1 content should link to Tier 2/3 and
  vice versa. The rich-text renderer needs to support contextual
  `<a href="/blog/other-post">` links, not just the primary-domain outbound
  component.
- **`hreflang`** — deferred per the earlier locale sequencing decision (ship
  flat routes first); revisit once regional demand is confirmed.

---

## Layer 6 — Off-site signals and measurement

Confirms the mechanism is actually working once live, and keeps it honest
over time.

- **Google Search Console** on both the new site and the primary domain —
  track referring domains and indexing status, not just raw backlink count.
- **Trust/legal pages** — `/privacy`, `/responsible-gaming`,
  `/affiliate-disclosure`. Previously flagged as blocking production
  readiness on the prior site; same requirement applies here. Content/legal
  work, not code, but routes must exist before launch.
- **Anchor text diversity audit** — since a freelancer will be writing
  Tier 2/3 content, run a periodic script sampling anchor text across posts
  so the same exact-match anchor doesn't repeat across every article.

  ```bash
  curl -s https://yoursite.com/blog/tier1-post-slug \
    | grep -o 'href="https://your-primary-domain[^"]*"'
  # should return nothing for a Tier 1 post
  ```

- **Link velocity discipline** — a process constraint, not code: avoid
  batch-publishing many Tier 2/3 posts in a short window once the freelancer
  starts; sudden spikes read as manipulative.

---

## Amendments (added after initial map)

### A1 — Global responsible-gambling directory page (Tier 1 linkable asset)
A dedicated route (e.g. `/responsible-gaming` expanded, or `/help-resources`)
listing gambling-help organizations worldwide, not limited to one country.
This is a pure Tier 1 authority page and one of the few pages that can earn
*inbound* links organically (treatment orgs, forums, even competitors link
to good RG resources — no commercial conflict). Requirements: every listing
verified and current (stale helpline info is worse than none); editorial
register; all "Play Responsibly" callouts site-wide route here. Layer 5
benefit: large, well-structured internal + outbound resource page.

### A2 — Authentication via Clerk
Email/password + Google OAuth via Clerk (first-class Next.js App Router
support). Purpose: enables verified-account user reviews and comments — the
actual trust value. The Clerk watermark itself is not a meaningful trust
signal to end users; keep if on free tier, don't count it as a feature.

### A3 — Review page structure (Tier 3)
Three visually and semantically separate trust sources per review page:
1. Editorial score (our review — Tier 3 content, `Review` schema, real
   author byline required)
2. First-party user reviews (login-gated via Clerk; feeds `AggregateRating`
   schema ONLY when real and moderated — same integrity gate as all else)
3. Trustpilot rating (conditional render — only when a real Trustpilot
   account + API data exists; empty state otherwise)
Never blend these into one number; blended scores read as manipulation in
this niche.

### A4 — User-generated content (comments/forum) rules
UGC does not break the tier model — tiers govern *editorial* outbound
links; UGC is a separate content class (per Google's `rel="ugc"`
formalization). A Tier 1 article with comments below it remains independent
editorial. Hard rules:
- Every link inside UGC renders `rel="ugc nofollow"` — hardcoded in the
  render layer, not CMS-editable, no exceptions. (Gambling comment-spam
  operations actively hunt followed comment links; one crawl with followed
  spam links poisons Tier 1 from underneath.)
- Login-gated commenting only (Clerk), moderation-before-publish initially.
- Comments excluded from `Article` structured data.
- Rollout: comments on Tier 3 review pages first (users have motivation to
  write there); add to Tier 1 blog content later once traffic sustains
  them. Empty comment sections site-wide are a mild negative signal.
- Tier 3 inverse risk: watch for fake *positive* reviews of the primary
  domain, including well-intentioned seeding — that pattern gets review
  content discounted or flagged.

## Summary — where each layer lives

| Layer | Owned by | Format |
|---|---|---|
| 1. Editorial policy | Editor / freelancer | Decision per article |
| 2. CMS schema + components | Dev | PayloadCMS field + React component |
| 3. Rendering strategy | Dev | Next.js route config (SSG/ISR) |
| 4. Structured data | Dev | JSON-LD, conditional on tier |
| 5. Crawlability plumbing | Dev | sitemap/robots/canonical/internal links |
| 6. Off-site + measurement | Dev + editor | GSC, legal pages, audit scripts, process |
