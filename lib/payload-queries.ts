import { headers as nextHeaders } from "next/headers";
import { getPayload, type TypedUser, type Where } from "payload";
import config from "@payload-config";

/**
 * Wraps the "filter _status: published unless in draft mode" pattern used
 * across every editorial-collection query. Returns { where, draft, user }
 * ready to spread into payload.find.
 *
 * Editorial collections (drafts enabled): Reviews, Articles, News, Authors.
 * See MIGRATION.md's editorial-vs-structural split. Structural collections —
 * Verticals, NewsSections, Media, HelpDirectoryEntries, BonusOffers — have no
 * _status column and must not use this.
 *
 * `user` exists because `overrideAccess: false` runs the collection's access
 * rule, and that rule hides drafts from anyone it does not recognise as an
 * editor. A draft-mode query that passes no user is filtered to published at
 * the data layer no matter what `where` asks for — measured, not assumed:
 * the same query returned 9 docs and 0 drafts without a user, 10 and 1 with.
 */
export function publishedFilter(
  draftMode: boolean,
  additional: Where = {},
  user?: TypedUser | null,
): { where: Where; draft: boolean; user?: TypedUser } {
  return {
    where: draftMode ? additional : { ...additional, _status: { equals: "published" } },
    draft: draftMode,
    user: user ?? undefined,
  };
}

/**
 * The editor behind a draft-mode request, or null.
 *
 * Call only when draft mode is on. It reads `headers()`, which does not exist
 * during `generateStaticParams` — the published-only path must never reach it.
 *
 * Fails closed: a draft cookie with no admin session resolves to null, the
 * access rule filters to published, and preview shows published content rather
 * than leaking a draft.
 */
export async function resolvePreviewUser(): Promise<TypedUser | null> {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  return user ?? null;
}
