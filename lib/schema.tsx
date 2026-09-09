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
  /** Site-relative path of the page carrying the review, e.g. "/reviews/examplebet". */
  pagePath?: string;
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
    // The review's own canonical page, not the operator's site.
    url: input.pagePath ? `${siteUrl}${input.pagePath}` : undefined,
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

/** No SearchAction: the search box is not wired to anything (rule 3).
 * TODO(cms): Organization stays absent until the publisher record is real —
 * company number and address are still bracketed in the footer. */
export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "WagerBlogs",
    url: siteUrl,
  };
}

export type FaqJsonLdEntry = { q: string; a: string };

/** Only entries with a real question and answer: a bracketed placeholder
 * surfaced as a rich result is a fabricated signal (rule 3). Gates the schema
 * only — the page still renders every question. */
export function faqPageJsonLd(entries: FaqJsonLdEntry[]) {
  const publishable = entries.filter((e) => !isPlaceholder(e.q) && !isPlaceholder(e.a));
  if (publishable.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: publishable.map((e) => ({
      "@type": "Question",
      name: e.q,
      acceptedAnswer: { "@type": "Answer", text: e.a },
    })),
  };
}

/** `currentPath` gives the trailing crumb — the page itself — its own URL; it
 * is the one crumb with no href to render as a link. */
export function breadcrumbJsonLd(items: BreadcrumbJsonLdItem[], currentPath?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => {
      const href = item.href ?? (i === items.length - 1 ? currentPath : undefined);
      return {
        "@type": "ListItem",
        position: i + 1,
        name: item.label,
        item: href ? `${siteUrl}${href}` : undefined,
      };
    }),
  };
}
