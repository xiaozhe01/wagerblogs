// JSON-LD helpers — see docs/00-six-layer-map.md Layer 4.
import type { LinkTier } from "@/lib/types";

export const siteUrl = "https://wagerblogs.com";

export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

export type BreadcrumbJsonLdItem = {
  label: string;
  href?: string;
};

/** Placeholder marker used throughout the mock data ("[Jun 30, 2026]",
 * "Jane Placeholder"). Any field still carrying one is not publishable. */
function isPlaceholder(value: string | undefined): boolean {
  return !value || /[[\]]/.test(value) || /placeholder|pending|tbd/i.test(value);
}

export type ReviewJsonLdInput = {
  /** Only tier2/tier3 may carry Review schema — see CLAUDE.md rule 4. */
  linkTier: LinkTier;
  itemName: string;
  itemUrl: string;
  ratingValue: number;
  bestRating: number;
  reviewerName?: string;
  reviewerUrl?: string;
  datePublished?: string;
};

/**
 * Returns null unless every field is real. Review schema is a trust signal, so
 * it must be structurally absent while the page runs on placeholder data
 * rather than emitting a plausible-looking rating (CLAUDE.md rules 3 and 4).
 * AggregateRating is deliberately NOT produced here — it may only ever be
 * computed from real, moderated user reviews.
 */
export function reviewJsonLd(input: ReviewJsonLdInput) {
  if (input.linkTier === "tier1") return null;
  if (isPlaceholder(input.reviewerName) || isPlaceholder(input.datePublished)) return null;
  if (isPlaceholder(input.itemName) || !Number.isFinite(input.ratingValue)) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Organization",
      name: input.itemName,
      url: input.itemUrl,
    },
    reviewRating: {
      "@type": "Rating",
      ratingValue: input.ratingValue,
      bestRating: input.bestRating,
    },
    author: {
      "@type": "Person",
      name: input.reviewerName,
      url: input.reviewerUrl ? `${siteUrl}${input.reviewerUrl}` : undefined,
    },
    datePublished: input.datePublished,
  };
}

/** Renders nothing when the data isn't publishable yet. */
export function ReviewJsonLd(input: ReviewJsonLdInput) {
  const data = reviewJsonLd(input);
  return data ? <JsonLd data={data} /> : null;
}

export function breadcrumbJsonLd(items: BreadcrumbJsonLdItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? `${siteUrl}${item.href}` : undefined,
    })),
  };
}
