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

export type ArticleJsonLdInput = {
  /** The record's own `title`, not seo.metaTitle — the editorial headline is
   * what Google wants here, and metaTitle is an override for the tab. */
  headline: string;
  /** Site-relative path of the page carrying the article. */
  pagePath: string;
  datePublished?: string | null;
  authorName?: string;
  /** Site-relative path of the author's profile. */
  authorUrl?: string;
  /** The record's own image, from `recordImage` — undefined when the record has
   * none. The sitewide fallback must not reach here. */
  image?: { url: string; width?: number; height?: number };
};

const isIso = (value?: string | null) => (value && /^\d{4}-\d{2}-\d{2}/.test(value) ? value : null);

/**
 * Returns null unless the headline, image, date and author are all real —
 * `type` is the only difference between an Article and a NewsArticle. Same gate
 * as reviewJsonLd: a block assembled from scaffold is a fabricated signal
 * whether or not the page around it renders one (rule 3).
 *
 * No `publisher`. It would be an Organization, and Organization schema is a
 * standing do-not-add while the publisher record itself is bracketed — the
 * footer still reads `Company No. [company number — verify]`. See
 * .claude/seo-backlog-2026-09-08.md.
 *
 * No `dateModified`, which docs/04 Phase 4.3 lists. The only candidate is
 * Payload's `updatedAt`, and that moves on any write — a migration or a repair
 * script, not just an edit. On the one record that currently passes this gate
 * it would have claimed a modification a day after publication while the
 * story's own Corrections block says none was issued.
 */
function articleSchema(type: "Article" | "NewsArticle", input: ArticleJsonLdInput) {
  if (isPlaceholder(input.headline)) return null;
  if (isPlaceholder(input.authorName)) return null;
  if (!isIso(input.datePublished) || isPlaceholder(input.datePublished ?? undefined)) return null;
  if (!input.image?.url) return null;

  return {
    "@context": "https://schema.org",
    "@type": type,
    headline: input.headline,
    url: `${siteUrl}${input.pagePath}`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteUrl}${input.pagePath}` },
    image: {
      "@type": "ImageObject",
      // Payload stores a root-relative URL; JSON-LD needs a crawlable one.
      url: `${siteUrl}${input.image.url}`,
      ...(input.image.width ? { width: input.image.width } : {}),
      ...(input.image.height ? { height: input.image.height } : {}),
    },
    datePublished: input.datePublished,
    author: {
      "@type": "Person",
      name: input.authorName,
      ...(input.authorUrl ? { url: `${siteUrl}${input.authorUrl}` } : {}),
    },
  };
}

export const articleJsonLd = (input: ArticleJsonLdInput) => articleSchema("Article", input);
export const newsArticleJsonLd = (input: ArticleJsonLdInput) => articleSchema("NewsArticle", input);

/** Renders nothing while the record is still scaffold. */
export function ArticleJsonLd(input: ArticleJsonLdInput) {
  const data = articleJsonLd(input);
  return data ? <JsonLd data={data} /> : null;
}

/** Renders nothing while the record is still scaffold. */
export function NewsArticleJsonLd(input: ArticleJsonLdInput) {
  const data = newsArticleJsonLd(input);
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
