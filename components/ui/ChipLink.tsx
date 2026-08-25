"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <Link
      href={href}
      className={className}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        router.replace(href, { scroll: false });
      }}
    >
      {children}
    </Link>
  );
}
