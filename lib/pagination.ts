export const PAGE_PARAM = "page";

/** TODO(cms): the real page size comes from the collection config. */
export const PAGE_SIZE = 3;

/** Clamps to the available range, so a hand-typed ?page=99 lands on the last
 * page rather than an empty list. */
export function paginate<T>(items: T[], param: string | string[] | undefined, perPage = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const raw = Array.isArray(param) ? param[0] : param;
  const parsed = Number.parseInt(raw ?? "1", 10);
  const page = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), totalPages) : 1;
  const start = (page - 1) * perPage;

  return { page, totalPages, items: items.slice(start, start + perPage) };
}

/** Page 1 drops the param, so the first page keeps one canonical URL. Other
 * query state (an active filter chip) is carried through. */
export function pageHref({
  basePath,
  page,
  params = {},
  anchor,
}: {
  basePath: string;
  page: number;
  params?: Record<string, string | undefined>;
  /** Heading the new page should land on — without it the browser jumps to the
   * top of the document and the reader loses the list. */
  anchor?: string;
}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  if (page > 1) search.set(PAGE_PARAM, String(page));
  const query = search.toString();
  const base = query ? `${basePath}?${query}` : basePath;
  return anchor ? `${base}#${anchor}` : base;
}
