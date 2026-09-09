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
 * lists across several routes. */
export type PostTeaser = {
  /** Omitted where the section heading above the row already names the category. */
  kicker?: string;
  title: string;
  meta: string;
  /** Two-line dek under the title — the row's readable middle. */
  excerpt?: string;
  /** Meta split into its own parts (read time, date, byline). Rendered instead
   * of `meta`, which stays the single-line fallback for records without them. */
  metaItems?: string[];
  /** Required: a teaser that renders as a link needs somewhere to go. */
  href: string;
};

export type NewsItem = {
  title: string;
  meta: string;
  /** Two-line dek, shown on feed rows and as the story standfirst. */
  excerpt: string;
  /** Must match one of lib/site-data's newsCategories (excluding "All"). */
  category: string;
  /** Byline fields on the story page. `meta` stays the one-line row summary. */
  publishedAt: string;
  readTime: string;
};

/** "At a glance" rail-list shape on the operator review. */
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
  /** URL segment for the review page at /reviews/<group>/<slug>. */
  slug: string;
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
  /** Rendered by the operator review, not by ranked-list rows. */
  pros?: string[];
  cons?: string[];
};

/** Minimal operator shape for the side-by-side comparison table — feature rows
 * live separately in `compareRows`, keyed by index against this array. Every
 * column carries a Visit link; only the primary-domain entry passes equity, the
 * rest render rel="nofollow" at the layer below. */
export type ComparisonOperator =
  | {
      name: string;
      isPrimaryDomain: true;
      primaryDomainLink: PrimaryDomainLinkData;
    }
  | {
      name: string;
      isPrimaryDomain: false;
      operatorLink: OperatorLinkData;
    };

export const HELP_CONTACT_KINDS = ["phone", "site", "chat"] as const;
export type HelpContactKind = (typeof HELP_CONTACT_KINDS)[number];

/** A Record, not an array: every entry must account for every contact kind, so
 * cards in a row cannot end up different heights. An empty string means the
 * organisation does not offer that channel — it is not missing data. */
export type HelpDirectoryEntry = {
  name: string;
  country: string;
  desc: string;
  contacts: Record<HelpContactKind, string>;
  /** Answers crisis calls, not just gambling-harm enquiries. A claim about a
   * real organisation, so it is set only alongside a verified entry — the
   * directory's notice tells readers the rest are not crisis lines.
   * TODO(cms): set from the verified record, never by hand. */
  isCrisisLine?: boolean;
};

export type HelpDirectoryRegion = {
  region: string;
  entries: HelpDirectoryEntry[];
};
