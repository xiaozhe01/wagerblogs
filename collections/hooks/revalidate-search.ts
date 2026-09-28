import type { PayloadRequest } from "payload";
import { SEARCH_CACHE_TAG } from "../../lib/search-shared";

// Drops the cached search index on write, so a publish shows up in search
// without waiting out the hour-long TTL.
//
// next/cache is imported dynamically because this file sits in the Payload
// config's module graph, which the admin UI also pulls in.
const revalidate = async ({ req }: { req?: PayloadRequest } = {}) => {
  if (typeof window !== "undefined") return;

  // The seed and migrate scripts run outside the Next server, where there is no
  // store for revalidateTag to reach and nothing cached to drop either way.
  // Measured: NEXT_RUNTIME is "nodejs" inside a request and undefined in a
  // script. Guarded rather than caught, so an expected no-op does not print a
  // stack trace for every seeded record.
  if (!process.env.NEXT_RUNTIME) return;

  try {
    const { revalidateTag } = await import("next/cache");
    // Next 16 requires a cache-life profile; "max" replaces the old one-arg call.
    revalidateTag(SEARCH_CACHE_TAG, "max");
  } catch (error) {
    // Only reachable from inside the Next server now, so this is a real failure
    // and the search index stays stale until the TTL expires. It still must not
    // fail the write that triggered it.
    //
    // Logged rather than discarded: a bare catch made a working hook and a
    // permanently broken one look identical from outside, which is how this was
    // recorded as "never observed firing" across three handover documents.
    const message = error instanceof Error ? error.message : String(error);
    if (req?.payload?.logger) {
      req.payload.logger.warn(
        { err: error, tag: SEARCH_CACHE_TAG },
        "revalidateSearch: search cache tag was not dropped",
      );
    } else {
      console.warn(`revalidateSearch: search cache tag was not dropped — ${message}`);
    }
  }
};

export const revalidateSearch = [revalidate];
