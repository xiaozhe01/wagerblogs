import type { ReactNode } from "react";
import type { SerializedAutoLinkNode, SerializedLinkNode } from "@payloadcms/richtext-lexical";
import type { JSXConverters } from "@payloadcms/richtext-lexical/react";
import { siteUrl } from "@/lib/schema";

// Outbound rel for body copy. Forced at render, never read from the node, and
// not exposed to authors: MIGRATION.md D4 keeps an editable relAttribute only
// on a Review's primaryDomainLink, which does not render through this module.
// Payload's own LinkJSXConverter emits nofollow for no link at any time, so
// this override supplies the enforcement rather than hardening a weak default.
const EXTERNAL_REL = "nofollow noopener noreferrer";

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

/** Phase 4 gap. Resolving a document reference to a URL needs the route names
 * settled in Phase 3, so this fails loudly in development rather than quietly
 * rendering "#" the way Payload's default converter does. */
export function internalDocToHref(): string {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(
      "internalDocToHref is not yet implemented: rich-text internal links cannot " +
        "resolve until Phase 4 maps a document reference to a route. See MIGRATION.md.",
    );
  }
  return UNRESOLVED_INTERNAL_HREF;
}

function anchor(node: SerializedAutoLinkNode | SerializedLinkNode, children: ReactNode) {
  const fields = node.fields;
  const href = fields.linkType === "internal" ? internalDocToHref() : (fields.url ?? "");
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
