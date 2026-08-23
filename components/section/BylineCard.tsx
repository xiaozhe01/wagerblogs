import type { ReactNode } from "react";
import ArrowLink from "@/components/ui/ArrowLink";

type BylineCardProps = {
  as?: "section" | "div";
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

  return as === "section" ? (
    <section className={wrapperClassName}>{inner}</section>
  ) : (
    <div className={wrapperClassName}>{inner}</div>
  );
}
