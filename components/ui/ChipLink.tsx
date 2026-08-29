"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

// Filter chips keep a real href so crawlers and no-JS visitors get a normal,
// indexable link. With JS the click is handled by the router, which keeps the
// navigation client-side and uses replace() so a run of filter clicks doesn't
// pile up history entries — Back returns to wherever the reader came from
// rather than stepping through every chip they tried.
//
// Still next/link so the RSC payload is prefetched: Link runs this onClick
// first and bails when the event is defaulted, leaving replace() in control.
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
