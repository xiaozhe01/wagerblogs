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

export type Author = {
  id: string;
  slug: string;
  name: string;
  credentialLine: string;
  photoUrl: string;
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
};
