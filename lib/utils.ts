import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A ChipList row is navigation: the selected value lives in the URL, the active
// chip derives from it, and the list below is filtered server-side. Each feature
// owns its own param name and anchor; these are the shared mechanics.

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
  anchor,
}: {
  basePath: string;
  param: string;
  value: string;
  allValue: string;
  anchor?: string;
}) {
  const base =
    value === allValue ? basePath : `${basePath}?${param}=${encodeURIComponent(chipSlug(value))}`;
  return anchor ? `${base}#${anchor}` : base;
}

/** Stable id for a card/section heading, so its wrapper can aria-labelledby it. */
export function headingId(prefix: string, title: string) {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${prefix}-${slug}`;
}
