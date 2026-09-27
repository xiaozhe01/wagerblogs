export const PAGE_PARAM = "page";

/** Single-column lists. TODO(cms): the real page size comes from the
 * collection config. */
export const PAGE_SIZE = 3;

/** Two-column grids. Must stay a multiple of the column count — an odd page
 * size leaves an empty cell in the last row of every page, not just the last. */
export const GRID_PAGE_SIZE = 4;

/** Tile grids, which are two columns at md and three at lg. 6 is the first
 * size that fills whole rows at both. */
export const TILE_PAGE_SIZE = 6;

/**
 * Pages fill to perPage; only the last page is ever short. Spreading items
 * evenly instead would put a half-empty row on every page — six items at
 * perPage 4 would page as 3 + 2 rather than 4 + 2, and in a two-column grid
 * both of those pages end on a single card.
 *
 * Clamps to the available range, so a hand-typed ?page=99 lands on the last
 * page rather than an empty list.
 */
export function paginate<T>(items: T[], param: string | string[] | undefined, perPage = PAGE_SIZE) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const raw = Array.isArray(param) ? param[0] : param;
  const parsed = Number.parseInt(raw ?? "1", 10);
  const page = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), totalPages) : 1;
  const start = (page - 1) * perPage;
  const slice = items.slice(start, start + perPage);

  return {
    page,
    totalPages,
    items: slice,
    total,
    from: total === 0 ? 0 : start + 1,
    to: start + slice.length,
  };
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
