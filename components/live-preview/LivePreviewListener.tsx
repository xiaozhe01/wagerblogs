"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";
import { previewBaseUrl } from "@/lib/preview";

// Refreshes the route when the admin saves, so the preview iframe follows the
// editor without a manual reload.
//
// Mounted per detail route rather than in the layout, matching Payload's own
// template. The underlying event carries no document id — isDocumentEvent
// checks only the origin and the event type — so a listener in the layout
// would refresh every route on every save, including routes that are not
// single-record edit targets.
export default function LivePreviewListener() {
  const router = useRouter();
  // The listener only accepts messages whose origin matches serverURL, and the
  // admin posting them is this same origin. Reading it from the document is
  // more reliable than an env var that can be present but blank — which is how
  // an empty target origin reached postMessage the first time.
  const serverURL = typeof window === "undefined" ? previewBaseUrl() : window.location.origin;
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />;
}
