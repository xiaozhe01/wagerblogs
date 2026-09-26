import { getPayload } from "payload";
import config from "@payload-config";
import { gatherLocks } from "@/lib/editing-now";

// Polled by the dashboard's "Editing now" panel. One request per poll, with the
// joins done here — the alternative, router.refresh(), re-runs the whole
// dashboard, which is roughly 46 queries.
//
// Authenticated: lock rows name who is editing what, which is not public.
export async function GET(request: Request) {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) return new Response("Unauthorised", { status: 401 });

  return Response.json(
    { locks: await gatherLocks(payload) },
    { headers: { "cache-control": "no-store" } },
  );
}
