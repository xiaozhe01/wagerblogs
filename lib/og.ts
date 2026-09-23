import type { Metadata } from "next";
import { resolveMedia, type MediaRef } from "@/components/cards/MediaImage";

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

type OpenGraphType = "website" | "article" | "profile";

export function buildOpenGraph({
  title,
  description,
  ogImage,
  type = DEFAULT_TYPE,
  path,
}: {
  title?: string | null;
  description?: string | null;
  /** The record's seo.ogImage. Unpopulated falls back to DEFAULT_OG_IMAGE —
   * never to heroImage, which is editorial content, not a social preview. */
  ogImage?: MediaRef;
  type?: OpenGraphType;
  /** Root-relative path. metadataBase in layout.tsx makes it absolute. */
  path?: string;
}): Metadata["openGraph"] {
  const image = resolveMedia(ogImage);
  return {
    type,
    siteName: SITE_NAME,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(path ? { url: path } : {}),
    images: [
      image?.url
        ? {
            url: image.url,
            // Payload's upload config records these; a record missing them is
            // still worth emitting, just without the size hints.
            ...(image.width ? { width: image.width } : {}),
            ...(image.height ? { height: image.height } : {}),
            alt: image.alt,
          }
        : DEFAULT_OG_IMAGE,
    ],
  };
}
