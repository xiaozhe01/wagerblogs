import type { PayloadRequest } from "payload";
import { SEARCH_CACHE_TAG } from "../../lib/search-shared";

// Drops the cached search index on write, so a publish shows up in search
// without waiting out the hour-long TTL.
//
// next/cache is imported dynamically because this file sits in the Payload
// config's module graph, which the admin UI also pulls in.
const revalidate = async ({ req }: { req?: PayloadRequest } = {}) => {
  if (typeof window !== "undefined") return;
  try {
    const { revalidateTag } = await import("next/cache");
    // Next 16 requires a cache-life profile; "max" replaces the old one-arg call.
    revalidateTag(SEARCH_CACHE_TAG, "max");
  } catch (error) {
    // Never fail the write that triggered this. It is expected and harmless in
    // the seed and migrate scripts, where there is no Next store.
    //
    // It is logged rather than discarded because a bare catch made those two
    // cases indistinguishable: a hook working normally and a hook throwing on
    // every single call look identical from outside. This hook has been
    // recorded as "never observed firing" across three handover documents, and
    // a silent catch is the one mechanism that would explain that.
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
