import { SEARCH_CACHE_TAG } from "../../lib/search-shared";

// Drops the cached search index on write, so a publish shows up in search
// without waiting out the hour-long TTL.
//
// next/cache is imported dynamically because this file sits in the Payload
// config's module graph, which the admin UI also pulls in. The try/catch covers
// the seed and migrate scripts, where there is no Next store and revalidateTag
// throws — it must not fail the write that triggered it.
const revalidate = async () => {
  if (typeof window !== "undefined") return;
  try {
    const { revalidateTag } = await import("next/cache");
    // Next 16 requires a cache-life profile; "max" replaces the old one-arg call.
    revalidateTag(SEARCH_CACHE_TAG, "max");
  } catch {
    // No Next runtime — nothing cached, nothing to drop.
  }
};

export const revalidateSearch = [revalidate];
