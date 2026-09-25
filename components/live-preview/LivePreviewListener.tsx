"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { previewBaseUrl } from "@/lib/preview";

// Refreshes the route when the admin saves. Mounted per detail route, not in
// the layout: the event carries no document id, so a layout listener would
// refresh every route on every save.
export default function LivePreviewListener() {
  const router = useRouter();
  // The admin posting these messages is this same origin, and reading it from
  // the document beats an env var that can be present but blank.
  const serverURL = typeof window === "undefined" ? previewBaseUrl() : window.location.origin;
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />;
}
