import type { ReactNode } from "react";
import Link from "next/link";
import { headingId } from "@/lib/utils";
import { TIER_CLASSNAME } from "./heading-tiers";

// docs/02 §5 — editorial (Tier 1) separates sections with whitespace, comparison
// (Tier 2/3) uses cards. `register` is required on purpose: a default silently
// renders Tier 1 pages carded. Outer spacing belongs to <main>'s gap.
const REGISTER_CLASSNAME = {
  editorial: "flex flex-col gap-3",
  comparison: "flex flex-col gap-3",
} as const;

// Tiers are assigned by the section's role on the page rather than by whichever
// component built the heading — see heading-tiers.ts for the scale.

type EditorialSectionProps = {
  title: string;
  /** Makes the heading itself the section's link — for a section that has a
   * page of its own, like a news category. */
  titleHref?: string;
  register: keyof typeof REGISTER_CLASSNAME;
  tier?: keyof typeof TIER_CLASSNAME;
  /** Anchor target for in-page TOCs — the RG rail links to these. */
  id?: string;
  /** Controls belonging to the heading rather than the body. */
  toolbar?: ReactNode;
  /** The section's "see all" destination, on the heading baseline. */
  action?: ReactNode;
  /** Appended to the register's classes, never replacing them. */
  className?: string;
  children: ReactNode;
};

export default function EditorialSection({
  title,
  titleHref,
  register,
  tier = "major",
  id,
  toolbar,
  action,
  className = "",
  children,
}: EditorialSectionProps) {
  const titleId = headingId("section", title);
  const heading = (
    <h2 id={titleId} className={TIER_CLASSNAME[tier]}>
      {titleHref ? (
        <Link
          href={titleHref}
          className="text-text-primary no-underline hover:underline underline-offset-2"
        >
          {title}
        </Link>
      ) : (
        title
      )}
    </h2>
  );
  const headingRow = action ? (
    <div className="flex items-baseline justify-between gap-3 flex-wrap">
      {heading}
      <div className="ml-auto">{action}</div>
    </div>
  ) : (
    heading
  );

  return (
    <section
      id={id}
      className={`${REGISTER_CLASSNAME[register]} ${className}`.trim()}
      aria-labelledby={titleId}
    >
      {toolbar ? (
        <div className="flex flex-col gap-3">
          {headingRow}
          {toolbar}
        </div>
      ) : (
        headingRow
      )}
      {children}
    </section>
  );
}
