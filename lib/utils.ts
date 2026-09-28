import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Filter chips are navigation: the selected value lives in the URL, the active
// chip derives from it, and the list below is filtered server-side. Each feature
// owns its own param name; these are the shared mechanics.

export function chipSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Tolerates singular/plural drift between chip labels and record fields —
 * the "Guides" chip has to match a "Guide" kicker. */
export function chipMatches(a: string, b: string) {
  const normalise = (value: string) => chipSlug(value).replace(/s$/, "");
  return normalise(a) === normalise(b);
}

/** Unknown or absent values fall back rather than rendering an empty list. */
export function resolveChip(
  options: readonly string[],
  param: string | string[] | undefined,
  fallback: string,
) {
  const value = Array.isArray(param) ? param[0] : param;
  if (!value) return fallback;
  return options.find((option) => chipSlug(option) === chipSlug(value)) ?? fallback;
}

export function chipHref({
  basePath,
  param,
  value,
  allValue,
}: {
  basePath: string;
  param: string;
  value: string;
  allValue: string;
}) {
  return value === allValue
    ? basePath
    : `${basePath}?${param}=${encodeURIComponent(chipSlug(value))}`;
}

/** Stable id for a card/section heading, so its wrapper can aria-labelledby it. */
export function headingId(prefix: string, title: string) {
  return `${prefix}-${chipSlug(title)}`;
}

const CRUMB_MINOR_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "nor",
  "of",
  "on",
  "or",
  "the",
  "to",
  "vs",
  "via",
  "with",
]);

/** Breadcrumb label built from a URL slug, for records carrying no `crumb`.
 * A headline is too long for a crumb; the slug is already the short form. */
export function slugLabel(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word, i) =>
      i > 0 && CRUMB_MINOR_WORDS.has(word) ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

/** Payload stores dates as ISO; the UI wants "Jun 30, 2026". Locale is pinned
 * so the server render and any later client render cannot disagree. */
export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
