import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { safePath } from "@/lib/safe-path";

// The only place draft mode is enabled. Authenticated: the cookie exempts a
// request from the published-only filter on every editorial query.
export async function GET(request: Request) {
  const path = safePath(new URL(request.url).searchParams.get("path"));
  if (!path) return new Response("A relative ?path is required", { status: 400 });

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return new Response("Log in to the admin panel to preview drafts", { status: 401 });
  }

  (await draftMode()).enable();
  redirect(path);
}
