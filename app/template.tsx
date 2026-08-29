"use client";

import { usePathname } from "next/navigation";

// Keyed so React remounts the node — a CSS animation does not restart on a
// reused one. No useSearchParams here: it needs a Suspense boundary, and the
// fallback's unkeyed wrapper broke hydration for every client component below.
//
// Legal docs share one key so the chip nav does not tear down <main> on every
// click; app/legal/[doc] scopes its own fade instead.
const transitionKey = (pathname: string) => (pathname.startsWith("/legal/") ? "/legal" : pathname);

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={transitionKey(pathname)} className="route-transition">
      {children}
    </div>
  );
}
