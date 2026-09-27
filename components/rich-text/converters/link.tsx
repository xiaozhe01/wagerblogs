import type { ReactNode } from "react";
import type { SerializedAutoLinkNode, SerializedLinkNode } from "@payloadcms/richtext-lexical";
import type { JSXConverters } from "@payloadcms/richtext-lexical/react";
import { siteUrl } from "@/lib/schema";
import { outboundRel } from "@/lib/outbound-rel";

// Outbound rel for body copy. Forced at render, never read from the node, and
// not exposed to authors: MIGRATION.md D4 keeps an editable relAttribute only
// on a Review's primaryDomainLink, which does not render through this module.
// Payload's own LinkJSXConverter emits nofollow for no link at any time, so
// this override supplies the enforcement rather than hardening a weak default.
const EXTERNAL_REL = outboundRel("bodyLink");

const SITE_HOST = new URL(siteUrl).hostname.toLowerCase();

export const UNRESOLVED_INTERNAL_HREF = "/#internal-link-not-resolved";

/** Hostname rules, decided rather than inherited:
 *  - `www.` is the same property; the canonical is non-www (lib/schema.ts).
 *  - any other subdomain counts as somebody else's, because a wrong nofollow
 *    costs nothing and a wrong dofollow leaks equity (CLAUDE.md rules 1, 5).
 *  - non-http schemes (mailto:, tel:) carry no equity, so nothing is forced. */
export function isExternalHref(href: null | string | undefined): boolean {
  const value = href?.trim();
  if (!value) return false;
  if (value.startsWith("#")) return false;
  // "//host/path" is protocol-relative and does leave the site, so it must not
  // be caught by the root-relative check.
  if (value.startsWith("/") && !value.startsWith("//")) return false;

  let url: URL;
  try {
    url = new URL(value, siteUrl);
  } catch {
    return false;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return false;

  const host = url.hostname.toLowerCase();
  return host !== SITE_HOST && host !== `www.${SITE_HOST}`;
}

type LinkedDocRef = {
  relationTo?: string;
  value?: number | string | { [key: string]: unknown; id?: number | string; slug?: string };
};
type LinkedDoc = LinkedDocRef | null;
type LinkedValue = LinkedDocRef["value"];

function slugOf(value: LinkedValue): string | undefined {
  return value && typeof value === "object" && typeof value.slug === "string"
    ? value.slug
    : undefined;
}

/** A nested relationship's slug — the section on a news story, the vertical on
 * a review. Present only when the page fetched deeply enough to populate it. */
function parentSlug(value: LinkedValue, field: string): string | undefined {
  if (!value || typeof value !== "object") return undefined;
  const parent = value[field];
  return parent &&
    typeof parent === "object" &&
    typeof (parent as { slug?: unknown }).slug === "string"
    ? (parent as { slug: string }).slug
    : undefined;
}

function unresolved(reason: string): string {
  if (process.env.NODE_ENV !== "production") {
    console.error(`Rich-text internal link could not be resolved: ${reason}`);
  }
  return UNRESOLVED_INTERNAL_HREF;
}

/** Maps a Lexical internal link's document reference to a frontend route.
 * Anything it cannot resolve becomes a visibly broken href rather than a
 * silent "#", so a bad link is findable instead of merely inert. */
export function internalDocToHref({ linkNode }: { linkNode: { fields: { doc?: LinkedDoc } } }) {
  const doc = linkNode.fields.doc;
  const relationTo = doc?.relationTo;
  const slug = slugOf(doc?.value);

  if (!relationTo) return unresolved("link has no relationTo");
  if (!slug) {
    return unresolved(
      `${relationTo} link was not populated deeply enough to expose a slug — ` +
        "increase the page query's depth",
    );
  }

  switch (relationTo) {
    case "articles":
      return `/articles/${slug}`;
    case "authors":
      return `/authors/${slug}`;
    case "verticals":
      return `/categories/${slug}`;
    case "news-sections":
      return `/news/${slug}`;
    case "news": {
      const section = parentSlug(doc?.value, "section");
      return section
        ? `/news/${section}/${slug}`
        : unresolved(`news link "${slug}" has no populated section — needs depth 2`);
    }
    case "reviews": {
      const vertical = parentSlug(doc?.value, "vertical");
      return vertical
        ? `/reviews/${vertical}/${slug}`
        : unresolved(`review link "${slug}" has no populated vertical — needs depth 2`);
    }
    default:
      return unresolved(`${relationTo} is not linkable from body content`);
  }
}

function anchor(node: SerializedAutoLinkNode | SerializedLinkNode, children: ReactNode) {
  const fields = node.fields;
  const href =
    fields.linkType === "internal"
      ? internalDocToHref({
          linkNode: node as {
            fields: { doc?: Parameters<typeof internalDocToHref>[0]["linkNode"]["fields"]["doc"] };
          },
        })
      : (fields.url ?? "");
  const external = isExternalHref(href);

  return (
    <a
      href={href}
      rel={external ? EXTERNAL_REL : fields.newTab ? "noopener noreferrer" : undefined}
      target={fields.newTab ? "_blank" : undefined}
    >
      {children}
    </a>
  );
}

export const linkConverters: JSXConverters<SerializedAutoLinkNode | SerializedLinkNode> = {
  autolink: ({ node, nodesToJSX }) => anchor(node, nodesToJSX({ nodes: node.children })),
  link: ({ node, nodesToJSX }) => anchor(node, nodesToJSX({ nodes: node.children })),
};
