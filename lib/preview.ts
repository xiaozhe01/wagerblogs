import type { PayloadRequest } from "payload";
import type { Article, Author, News, Review } from "@/payload-types";
import { articleUrl, authorUrl, newsUrl, reviewUrl } from "@/lib/urls";

// Derived from the admin's own request so the preview iframe is same-origin
// with the panel that framed it — the auth cookie is only sent when it is.
// NEXT_PUBLIC_SERVER_URL is inlined at build time, so it cannot follow a
// tunnel hostname; it survives only as the fallback for callers with no
// request. `||`, not `??`: a present-but-blank env var is an empty string, and
// an empty origin throws in postMessage. Separate from siteUrl in
// lib/schema.tsx, which stays pinned to production for the sitemap, llms.txt
// and JSON-LD.
export const previewBaseUrl = (req?: { headers: Headers }) => {
  const host = req?.headers.get("host");
  if (req && host) {
    const forwarded = req.headers.get("x-forwarded-proto")?.split(",")[0].trim();
    const local = /^(localhost|127\.0\.0\.1|\[::1\])(:|$)/.test(host);
    return `${forwarded || (local ? "http" : "https")}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";
};

/** Wraps a path in the draft-mode entry route, which is what sets the cookie. */
export const toPreviewUrl = (path: string, req?: { headers: Headers }) =>
  `${previewBaseUrl(req)}/next/preview?path=${encodeURIComponent(path)}`;

/** The admin may hand over a bare id instead of a populated relationship.
 * findByID throws on a missing record, so a dangling reference resolves to
 * undefined and the caller drops the URL rather than the button erroring. */
async function populate<T extends object>(
  req: PayloadRequest,
  collection: "verticals" | "news-sections",
  value: number | T,
): Promise<T | undefined> {
  if (typeof value === "object") return value;
  try {
    return (await req.payload.findByID({ collection, id: value, depth: 0 })) as T;
  } catch {
    return undefined;
  }
}

/** Frontend path for a document, or undefined when it cannot be derived.
 * Derivation stays in lib/urls.ts. */
export async function previewPath(
  collection: string,
  doc: Record<string, unknown>,
  req: PayloadRequest,
): Promise<string | undefined> {
  // A document being created has no slug yet; without this the URL is
  // "/articles/undefined" rather than absent.
  if (!doc.slug) return undefined;

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

/** `admin.preview` for a collection. */
export const previewFor =
  (collection: string) =>
  async (doc: Record<string, unknown>, { req }: { req: PayloadRequest }) => {
    const path = await previewPath(collection, doc, req);
    return path ? toPreviewUrl(path, req) : null;
  };
