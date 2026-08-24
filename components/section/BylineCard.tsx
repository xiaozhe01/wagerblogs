import type { ReactNode } from "react";
import ArrowLink from "@/components/ui/ArrowLink";

type BylineCardProps = {
  /** No "section": a byline/pull-quote is not a titled region, and an unnamed
   * <section> is a landmark with no accessible name. */
  as?: "div" | "figure";
  wrapperClassName: string;
  profileHref: string;
  children: ReactNode;
};

export default function BylineCard({
  as = "div",
  wrapperClassName,
  profileHref,
  children,
}: BylineCardProps) {
  const inner = (
    <>
      <div className="w-13 h-13 shrink-0 rounded-full placeholder-asset" />
      <div>
        {children}
        <ArrowLink
          href={profileHref}
          className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
        >
          View author profile
        </ArrowLink>
      </div>
    </>
  );

  if (as === "figure") {
    return <figure className={wrapperClassName}>{inner}</figure>;
  }
  return <div className={wrapperClassName}>{inner}</div>;
}
