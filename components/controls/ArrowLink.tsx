import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Standalone section CTA. Call sites append their own width/min-height. */
export const sectionCtaClassName =
  "inline-flex items-center gap-1 min-h-11 wide:min-h-0 text-md link-cta font-semibold group";

type ArrowLinkProps = {
  href: string;
  className: string;
  children: React.ReactNode;
};

export default function ArrowLink({ href, className, children }: ArrowLinkProps) {
  const inner = (
    <>
      {children}
      <ArrowRight
        strokeWidth={2}
        className="size-3 shrink-0 transition duration-300 group-hover:translate-x-1 group-active:translate-x-1"
        aria-hidden="true"
      />
    </>
  );

  return href.startsWith("#") ? (
    <a href={href} className={className}>
      {inner}
    </a>
  ) : (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
