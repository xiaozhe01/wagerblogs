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
  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={previewBaseUrl()} />;
}
