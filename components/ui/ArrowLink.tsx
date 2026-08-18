import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ArrowLinkProps = {
  href: string;
  className: string;
  children: React.ReactNode;
};

// The "text + trailing arrow" link composite repeated throughout the site.
// `className` is the full outer <Link> class list (call sites vary in text
// size/color/spacing), kept as a required prop rather than a fixed default
// so each site's exact existing styling carries over unchanged.
export default function ArrowLink({ href, className, children }: ArrowLinkProps) {
  return (
    <Link href={href} className={className}>
      {children}
      <ArrowRight
        strokeWidth={2}
        className="size-3 shrink-0 transition duration-300 group-hover:translate-x-1"
        aria-hidden="true"
      />
    </Link>
  );
}
