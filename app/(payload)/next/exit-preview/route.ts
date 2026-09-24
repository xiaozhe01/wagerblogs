import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

// Drops the draft-mode cookie. Deliberately unauthenticated: leaving preview
// is never a privileged action, and requiring a session to stop seeing drafts
// would strand anyone whose login expired mid-session.
export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path");
  (await draftMode()).disable();
  redirect(path && path.startsWith("/") && !path.startsWith("//") ? path : "/");
}
