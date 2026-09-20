import type { Where } from "payload";

/**
 * Wraps the "filter _status: published unless in draft mode" pattern used
 * across every editorial-collection query. Returns { where, draft } ready to
 * spread into payload.find.
 *
 * Editorial collections (drafts enabled): Reviews, Articles, News, Authors.
 * See MIGRATION.md's editorial-vs-structural split. Structural collections —
 * Verticals, NewsSections, Media, HelpDirectoryEntries, BonusOffers — have no
 * _status column and must not use this.
 */
export function publishedFilter(
  draftMode: boolean,
  additional: Where = {},
): { where: Where; draft: boolean } {
  return {
    where: draftMode ? additional : { ...additional, _status: { equals: "published" } },
    draft: draftMode,
  };
}
