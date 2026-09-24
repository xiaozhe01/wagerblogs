import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";

// The only place Next's draft mode is ever enabled. Until this route existed
// every route's isDraft branch was unreachable, so the draft path had never
// run — see .claude/phase-5-live-preview-handoff-2026-09-24.md.
//
// Authenticated: the draft-mode cookie exempts a request from the
// published-only filter on every editorial query, so handing one out without
// checking who is asking would publish every draft to anyone who found the URL.
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path");

  // Relative paths only. A leading-slash check alone is not enough — the
  // browser reads "//evil.com" as protocol-relative and leaves the site.
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return new Response("A relative ?path is required", { status: 400 });
  }

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: request.headers });
  if (!user) {
    return new Response("Log in to the admin panel to preview drafts", { status: 401 });
  }

  (await draftMode()).enable();
  redirect(path);
}
