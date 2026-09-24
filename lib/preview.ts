import type { PayloadRequest } from "payload";
import type { Article, Author, News, Review } from "@/payload-types";
import { articleUrl, authorUrl, newsUrl, reviewUrl } from "@/lib/urls";

// Where the admin panel sends an editor to see a draft. Separate from `siteUrl`
// in lib/schema.tsx, which stays pinned to the production domain because the
// sitemap, llms.txt and JSON-LD must emit absolute production URLs wherever
// they are generated. This one has to follow the environment or the preview
// iframe loads the live site instead of the branch under review.
export const previewBaseUrl = () => process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

/** Wraps a frontend path in the draft-mode entry route, which is what actually
 * sets the cookie. Pointing the iframe straight at the path would render the
 * published record, or a 404 for a record that has never been published. */
export const toPreviewUrl = (path: string) =>
  `${previewBaseUrl()}/next/preview?path=${encodeURIComponent(path)}`;

/** Reviews and news live under a two-level route, so their URL needs the
 * related record's slug. The admin does not guarantee the relationship is
 * populated — it may hand over a bare id — so fetch it when it is not. */
async function populate<T extends object>(
  req: PayloadRequest,
  collection: "verticals" | "news-sections",
  value: number | T,
): Promise<T | undefined> {
  if (typeof value === "object") return value;
  const doc = await req.payload.findByID({ collection, id: value, depth: 0 });
  return doc as T | undefined;
}

/** Frontend path for a document, or undefined when it cannot be derived.
 * Derivation itself stays in lib/urls.ts — the single place a path is built. */
export async function previewPath(
  collection: string,
  doc: Record<string, unknown>,
  req: PayloadRequest,
): Promise<string | undefined> {
  switch (collection) {
    case "articles":
      return articleUrl(doc as unknown as Article);
    case "authors":
      return authorUrl(doc as unknown as Author);
    case "reviews": {
      const review = doc as unknown as Review;
      const vertical = await populate(req, "verticals", review.vertical);
      return vertical ? reviewUrl({ slug: review.slug, vertical }) : undefined;
    }
    case "news": {
      const story = doc as unknown as News;
      const section = await populate(req, "news-sections", story.section);
      return section ? newsUrl({ slug: story.slug, section }) : undefined;
    }
    default:
      return undefined;
  }
}
