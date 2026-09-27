import { cache } from "react";
import { headers as nextHeaders } from "next/headers";
import { getPayload, type TypedUser, type Where } from "payload";
import config from "@payload-config";

/**
 * The "filter _status: published unless in draft mode" pattern, as
 * { where, draft, user } ready to spread into payload.find.
 *
 * Editorial collections (drafts enabled): Reviews, Articles, News, Authors.
 * Structural ones have no _status column and must not use this.
 *
 * Always spread the result. `user` is load-bearing: overrideAccess: false runs
 * the collection's access rule, which hides drafts from anyone it does not
 * recognise as an editor. Destructuring { where, draft } drops it and the
 * draft stays invisible — see tests/draft-auth-propagation.test.ts.
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
 * The editor behind a draft-mode request, or null. Call only when draft mode is
 * on: it reads headers(), which generateStaticParams has no access to.
 *
 * cache() so the routes that resolve once in a lookup helper and again in the
 * page body verify the session once per request, not twice.
 *
 * Fails closed — no session resolves to null, the access rule filters to
 * published, and preview shows published content rather than leaking a draft.
 */
export const resolvePreviewUser = cache(async (): Promise<TypedUser | null> => {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await nextHeaders() });
  return user ?? null;
});

/**
 * The live window for a bonus offer. `active` is the editor's manual switch;
 * this adds the dated one, so an offer that has expired stops rendering
 * without anyone remembering to untick it. An offer with no dates set is
 * always in window.
 *
 * Spread into a `where`, never used alone — the caller still owns `active`.
 */
export function offerWindow(now = new Date().toISOString()): Where {
  return {
    and: [
      { or: [{ validFrom: { exists: false } }, { validFrom: { less_than_equal: now } }] },
      { or: [{ validUntil: { exists: false } }, { validUntil: { greater_than: now } }] },
    ],
  };
}
