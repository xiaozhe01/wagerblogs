import { outboundRel } from "@/lib/outbound-rel";

export const CONTACT_KINDS = ["phone", "website", "chat"] as const;

export type ContactKind = (typeof CONTACT_KINDS)[number];

// Editors type these by hand from each organisation's own site, so a field
// holds whatever that organisation publishes: a URL, a dialable number, or
// prose like "Contact Form". Only the first two can be linked.
const PHONE = /^[+0-9][0-9a-z\s().+-]*$/i;

/** The href a contact value can carry, or null when it is descriptive text
 * that must render as-is. Never guesses a scheme — a value that is not clearly
 * a URL or a number stays plain, because a dead tel: link on a help directory
 * is worse than no link. */
export function contactHref(kind: ContactKind, raw: string | null | undefined): string | null {
  const value = raw?.trim();
  if (!value || value === "-") return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (kind === "phone" && PHONE.test(value) && (value.match(/\d/g)?.length ?? 0) >= 4) {
    return `tel:${value.replace(/[\s().]/g, "")}`;
  }
  return null;
}

export const CONTACT_LABEL: Record<ContactKind, string> = {
  phone: "Phone",
  website: "Website",
  chat: "Chat",
};

/** What the reader sees. A URL shows its host, never the full path — these run
 * to eighty characters and stretch whatever column holds them. */
export function contactText(raw: string, href: string | null): string {
  if (href && /^https?:/i.test(href)) {
    try {
      return new URL(href).hostname.replace(/^www\./, "");
    } catch {
      return raw;
    }
  }
  return raw;
}

/** @deprecated Use outboundRel("helpDirectory"). Kept as the named export the
 * two help routes already import. */
export const HELP_LINK_REL = outboundRel("helpDirectory");

/** "" when the field carries no contact route. Editors use "-" for "none", so
 * it reads as absent rather than rendering a bare dash at the reader. */
export function displayContact(raw: string | null | undefined): string {
  const value = raw?.trim();
  return !value || value === "-" ? "" : value;
}
