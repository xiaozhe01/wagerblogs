import { SEARCH_CACHE_TAG } from "../../lib/search-shared";

// Drops the cached search index when a searchable record changes, so a publish
// shows up in search without waiting out the hour-long TTL.
//
// next/cache is imported dynamically: this file is in the Payload config's
// module graph, which the admin UI also pulls in, and a static import puts an
// App-Router-only API into a bundle that cannot have it. The try/catch covers
// the seed and migrate scripts, which load the same config under tsx with no
// Next store — revalidateTag throws there, and must not fail the write.
const revalidate = async () => {
  if (typeof window !== "undefined") return;
  try {
    const { revalidateTag } = await import("next/cache");
    // Next 16 requires a cache-life profile; "max" is the documented
    // replacement for the old single-argument call.
    revalidateTag(SEARCH_CACHE_TAG, "max");
  } catch {
    // No Next runtime — nothing cached, nothing to drop.
  }
};

export const revalidateSearch = [revalidate];
