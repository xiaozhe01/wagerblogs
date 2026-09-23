import type { Article, Author, News, NewsSection, Review, Vertical } from "@/payload-types";

// Canonical path per record type. One derivation shared by the sitemap,
// llms.txt and search — the three surfaces that drifted from the routes in the
// first place, precisely because each built its own URLs from its own fixture.
//
// The two relationship-dependent paths need the query to populate at depth 1.
// An unpopulated relationship has no slug to read, so they return undefined
// and the caller drops the row rather than emitting a guessed URL.

export const categoryUrl = (vertical: Pick<Vertical, "slug">) => `/categories/${vertical.slug}`;

export const reviewIndexUrl = (vertical: Pick<Vertical, "slug">) => `/reviews/${vertical.slug}`;

export const sectionUrl = (section: Pick<NewsSection, "slug">) => `/news/${section.slug}`;

export const articleUrl = (article: Pick<Article, "slug">) => `/articles/${article.slug}`;

export const authorUrl = (author: Pick<Author, "slug">) => `/authors/${author.slug}`;

export const legalUrl = (doc: { slug: string }) => `/legal/${doc.slug}`;

export function reviewUrl(review: Pick<Review, "slug" | "vertical">): string | undefined {
  const vertical = typeof review.vertical === "object" ? review.vertical : undefined;
  return vertical ? `/reviews/${vertical.slug}/${review.slug}` : undefined;
}

export function newsUrl(story: Pick<News, "slug" | "section">): string | undefined {
  const section = typeof story.section === "object" ? story.section : undefined;
  return section ? `/news/${section.slug}/${story.slug}` : undefined;
}
