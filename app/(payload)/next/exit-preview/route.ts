import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { safePath } from "@/lib/safe-path";

// Unauthenticated by design: leaving preview is never privileged, and requiring
// a session would strand anyone whose login expired mid-session.
export async function GET(request: Request) {
  const path = safePath(new URL(request.url).searchParams.get("path"));
  (await draftMode()).disable();
  redirect(path ?? "/");
}
