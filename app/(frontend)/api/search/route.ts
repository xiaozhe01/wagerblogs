import { NextRequest } from "next/server";
import { MAX_QUERY, SCOPE_PARAM, SEARCH_PARAM, resolveScope, search } from "@/lib/search";

// Not force-static — it reads the query string, and prerendering pinned every
// response to the empty-query result. cache-control is what the CDN reuses.
const MODAL_LIMIT = 8;

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = (params.get(SEARCH_PARAM) ?? "").slice(0, MAX_QUERY);
  const scope = resolveScope(params.get(SCOPE_PARAM) ?? undefined);
  const hits = await search(query, scope, MODAL_LIMIT);

  return Response.json(
    { query, scope, hits, total: hits.length },
    { headers: { "cache-control": "public, max-age=60, stale-while-revalidate=600" } },
  );
}
