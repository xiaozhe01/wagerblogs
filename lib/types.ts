// Shared content types, mirrored from the eventual PayloadCMS collection
// shapes (see docs/00-six-layer-map.md Layer 2 and
// docs/04-claude-code-implementation-brief.md Phase 1). Front-end is being
// built against these types + local mock data before Payload/Supabase exist.

export type RelAttribute = "dofollow" | "sponsored" | "nofollow";

export type LinkTier = "tier1" | "tier2" | "tier3";

export type PrimaryDomainLinkData = {
  anchorText: string;
  url: string;
  relAttribute: RelAttribute;
};

/** A non-primary operator's own outbound link (their own site, not ours to
 * monetize). No relAttribute — unlike PrimaryDomainLinkData, this is never a
 * choice: every render site hardcodes rel="nofollow" in the JSX itself, not
 * as configurable data, so equity can never accidentally leak to a
 * competitor. Kept as its own type, not reused from PrimaryDomainLinkData,
 * so the two can never be confused for each other. */
export type OperatorLinkData = {
  anchorText: string;
  url: string;
};

/** Featured-bonus card entry — discriminated on isPrimaryDomain so
 * primaryDomainLink/operatorLink narrow correctly at call sites instead of
 * both being optional on every entry. */
export type BonusOffer =
  | {
      name: string;
      headline: string;
      code: string;
      benefits?: string[];
      isPrimaryDomain: true;
      primaryDomainLink: PrimaryDomainLinkData;
    }
  | {
      name: string;
      headline: string;
      code: string;
      benefits?: string[];
      isPrimaryDomain: false;
      operatorLink: OperatorLinkData;
    };

export type Author = {
  id: string;
  slug: string;
  name: string;
  credentialLine: string;
  photoUrl: string;
  bio?: string;
};

/** Recurring "post teaser" card shape — recentPosts/related-reading/author's-recent-work
 * lists across several routes. `href` is omitted where the card isn't a link. */
export type PostTeaser = {
  kicker: string;
  title: string;
  meta: string;
  href?: string;
};

export type NewsItem = {
  title: string;
  meta: string;
};

/** "At a glance" rail-list shape, shared by both reviews templates. */
export type AtAGlanceItem = {
  label: string;
  value: string;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  linkTier: LinkTier;
  primaryDomainLink?: PrimaryDomainLinkData;
  author: Author;
  publishedAt: string;
  updatedAt: string;
};

export type OperatorCategoryScore = {
  label: string;
  score: number;
};

export type Operator = {
  id: string;
  name: string;
  score: number;
  categoryScores: OperatorCategoryScore[];
  advantages: string[];
  lastVerified: string;
  terms: string;
  /** Only one operator per rendered list may be true. */
  isPrimaryDomain: boolean;
  /** Present only when isPrimaryDomain is true. */
  primaryDomainLink?: PrimaryDomainLinkData;
  /** Used by the full operator-review templates; not rendered by ranked-list rows. */
  pros?: string[];
  cons?: string[];
};

/** Minimal operator shape for the side-by-side comparison table — feature rows
 * live separately in `compareRows`, keyed by index against this array. */
export type ComparisonOperator = {
  name: string;
  isPrimaryDomain: boolean;
  primaryDomainLink?: PrimaryDomainLinkData;
};
