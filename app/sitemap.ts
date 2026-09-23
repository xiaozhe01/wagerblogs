import type { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import { siteUrl } from "@/lib/schema";
import { publishedFilter } from "@/lib/payload-queries";
import {
  articleUrl,
  authorUrl,
  categoryUrl,
  legalUrl,
  newsUrl,
  reviewIndexUrl,
  reviewUrl,
  sectionUrl,
} from "@/lib/urls";

// Built from the records the routes resolve from, so it cannot list a URL the
// router would 404. It previously read lib/ fixtures and had drifted: six dead
// entries, eight live routes missing. See MIGRATION.md.
//
// No changefreq, no priority. Google ignores both, and lastmod is a real
// record timestamp rather than generation time — a sitemap whose lastmod moves
// on every build is one Google learns to distrust.
export const revalidate = 3600;

/** Routes with no record behind them. Their lastmod is generation time, which
 * is the only honest answer — there is nothing else to read. /contact and
 * /search are deliberately absent: utility, not content. */
const STATIC_PATHS = [
  "/",
  "/articles",
  "/news",
  "/reviews",
  "/categories",
  "/authors",
  "/faq",
  "/about",
  "/responsible-gambling",
  "/responsible-gambling/help-directory",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config });
  const now = new Date();
  const entry = (path: string, lastModified: string | Date) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(lastModified),
  });

  // Sequential, as everywhere else — this runs at build and on revalidate, not
  // in a user's request path.

  // Structural taxonomies: no drafts, so no _status filter. verticals serves
  // both the category pages and the review indexes.
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });
  const { docs: newsSections } = await payload.find({
    collection: "news-sections",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  // Editorial collections: published only. No draftMode here — a sitemap is
  // for crawlers, which never carry the bypass cookie.
  // depth 1 on reviews and news populates the relationship their URL needs.
  const { docs: reviews } = await payload.find({
    collection: "reviews",
    ...publishedFilter(false),
    sort: "-updatedAt",
    limit: 1000,
    depth: 1,
    overrideAccess: false,
  });
  const { docs: stories } = await payload.find({
    collection: "news",
    ...publishedFilter(false),
    sort: "-updatedAt",
    limit: 1000,
    depth: 1,
    overrideAccess: false,
  });
  const { docs: articles } = await payload.find({
    collection: "articles",
    ...publishedFilter(false),
    sort: "-updatedAt",
    limit: 1000,
    depth: 0,
    overrideAccess: false,
  });
  const { docs: authors } = await payload.find({
    collection: "authors",
    ...publishedFilter(false),
    sort: "-updatedAt",
    limit: 1000,
    depth: 0,
    overrideAccess: false,
  });

  // A global. Its array entries carry no updatedAt of their own, so all four
  // documents share the global's.
  const legal = await payload.findGlobal({
    slug: "legal-documents",
    depth: 0,
    overrideAccess: false,
  });
  const legalUpdated = legal.updatedAt ?? now;

  // Grouped by content type rather than sorted lexically — a sitemap is read
  // by machines, but debugged by people.
  return [
    ...STATIC_PATHS.map((path) => entry(path, now)),
    ...verticals.map((vertical) => entry(categoryUrl(vertical), vertical.updatedAt)),
    ...verticals
      .filter((vertical) => vertical.hasReviews)
      .map((vertical) => entry(reviewIndexUrl(vertical), vertical.updatedAt)),
    ...reviews.flatMap((review) => {
      const path = reviewUrl(review);
      return path ? [entry(path, review.updatedAt)] : [];
    }),
    ...newsSections.map((section) => entry(sectionUrl(section), section.updatedAt)),
    ...stories.flatMap((story) => {
      const path = newsUrl(story);
      return path ? [entry(path, story.updatedAt)] : [];
    }),
    ...articles.map((article) => entry(articleUrl(article), article.updatedAt)),
    ...authors.map((author) => entry(authorUrl(author), author.updatedAt)),
    ...(legal.documents ?? []).map((doc) => entry(legalUrl(doc), legalUpdated)),
  ];
}
