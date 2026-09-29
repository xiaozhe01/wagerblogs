import type { Metadata } from "next";
import { resolveMedia, type MediaRef } from "@/components/cards/MediaImage";
import type { Media } from "@/payload-types";

// Next shallow-merges metadata, so a page's `openGraph` REPLACES the layout's
// rather than composing with it — verified against the rendered tags, not
// assumed. Anything the layout sets (type, siteName) has to be restated by
// every route that emits its own openGraph, or that route silently drops it.
// That is why this helper exists: the sitewide parts live here once instead of
// in seven generateMetadata bodies.

export const SITE_NAME = "WagerBlogs";
export const DEFAULT_TYPE = "website";

/** Sitewide fallback for a record with no seo.ogImage. Deliberately a labelled
 * placeholder — see scripts/generate-og-default.ts. Without it a route that
 * emits openGraph would have no image at all, because the layout's cannot
 * reach it. */
export const DEFAULT_OG_IMAGE = {
  url: "/og-default.png",
  width: 1200,
  height: 630,
  alt: "WagerBlogs — betting and gaming coverage",
} as const;

/** The site's own X account, as "@name". X renders it as the card's
 * attribution, so an unowned handle would credit someone else on every share —
 * it stays empty until the account exists, and buildTwitter omits the tag. */
export const TWITTER_SITE = "";

/** Card type only. Deliberately no title/description/images: set here they
 * would be inherited verbatim by every route, which is exactly what made the
 * layout's openGraph block override each page's own. Left absent, X reads the
 * route's og:* tags instead — verified against the rendered tags. */
export function buildTwitter(): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    ...(TWITTER_SITE.trim() ? { site: TWITTER_SITE.trim() } : {}),
  };
}

type OpenGraphType = "website" | "article" | "profile";

/** The 1200x630 derivative Media generates, or the original when the source
 * was too small to make one. Preferring the derivative is what stops each
 * platform cropping a 3:2 photo into its 1.91:1 slot however it likes. */
function shareImage(image: Media | undefined) {
  if (!image?.url) return undefined;
  const og = image.sizes?.og;
  const use = og?.url ? og : image;
  return {
    url: use.url as string,
    // Payload's upload config records these; a record missing them is still
    // worth emitting, just without the size hints.
    ...(use.width ? { width: use.width } : {}),
    ...(use.height ? { height: use.height } : {}),
    alt: image.alt,
  };
}

/** The record's own share image, or undefined — never DEFAULT_OG_IMAGE. Takes
 * the refs in preference order and returns the first that resolves.
 *
 * Separate from buildOpenGraph's fallback on purpose: an og:image has to point
 * somewhere, so falling back to the sitewide placeholder is right there. JSON-LD
 * has no such duty, and a block whose `image` is the sitewide fallback describes
 * the site rather than the record. */
export function recordImage(...refs: (MediaRef | undefined)[]) {
  for (const ref of refs) {
    const image = shareImage(resolveMedia(ref));
    if (image) return image;
  }
  return undefined;
}

export function buildOpenGraph({
  title,
  description,
  ogImage,
  type = DEFAULT_TYPE,
  path,
  publishedTime,
  modifiedTime,
  authors,
  section,
}: {
  title?: string | null;
  description?: string | null;
  /** The record's seo.ogImage. Unpopulated falls back to DEFAULT_OG_IMAGE —
   * never to heroImage, which is editorial content, not a social preview. */
  ogImage?: MediaRef;
  type?: OpenGraphType;
  /** Root-relative path. metadataBase in layout.tsx makes it absolute. */
  path?: string;
  /** article:* below. Only emitted on type "article", and only when the value
   * is real — a placeholder date would become a machine-readable timestamp
   * platforms and Google both read as fact. */
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: (string | null | undefined)[];
  section?: string | null;
}): Metadata["openGraph"] {
  const image = resolveMedia(ogImage);
  const isIso = (v?: string | null) => (v && /^\d{4}-\d{2}-\d{2}/.test(v) ? v : undefined);
  const named = (authors ?? []).filter((a): a is string => Boolean(a?.trim()));
  const article =
    type === "article"
      ? {
          ...(isIso(publishedTime) ? { publishedTime: isIso(publishedTime) } : {}),
          ...(isIso(modifiedTime) ? { modifiedTime: isIso(modifiedTime) } : {}),
          ...(named.length ? { authors: named } : {}),
          ...(section?.trim() ? { section } : {}),
        }
      : {};
  return {
    type,
    siteName: SITE_NAME,
    ...article,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(path ? { url: path } : {}),
    images: [shareImage(image) ?? DEFAULT_OG_IMAGE],
  };
}
