"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// Filter chips keep a real href so crawlers and no-JS visitors get an indexable
// link; with JS the router takes over and replace() keeps a run of filter clicks
// out of history. Still next/link, so the RSC payload is prefetched.
export default function ChipLink({
  href,
  className,
  current,
  children,
}: {
  href: string;
  className?: string;
  /** The chip whose filter is applied. Without this, the active state is
   * carried by colour alone and never reaches assistive tech. */
  current?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  // replace() is a server round-trip; isPending is the only signal between
  // click and repaint.
  const [isPending, startTransition] = useTransition();

  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      aria-busy={isPending || undefined}
      data-pending={isPending ? "" : undefined}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        startTransition(() => {
          router.replace(href, { scroll: false });
        });
      }}
    >
      {children}
    </Link>
  );
}
