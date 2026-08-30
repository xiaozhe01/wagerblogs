import type { ReactNode } from "react";
import { headingId } from "@/lib/utils";

// docs/02 §5 — editorial (Tier 1) separates sections with whitespace, comparison
// (Tier 2/3) uses cards. `register` is required on purpose: a default silently
// rendered Tier 1 pages carded. Outer spacing belongs to <main>'s gap, not here.
const REGISTER_CLASSNAME = {
  editorial: "flex flex-col gap-3",
  comparison: "flex flex-col gap-3 card",
} as const;

type EditorialSectionProps = {
  title: string;
  register: keyof typeof REGISTER_CLASSNAME;
  /** Anchor target for in-page TOCs — the RG rail links to these. */
  id?: string;
  /* Controls belonging to the heading rather than the body — grouped tighter
     with the h2, since the section's own gap is the heading-to-content step. */
  toolbar?: ReactNode;
  /** Appended to the register's classes, never replacing them. */
  className?: string;
  children: ReactNode;
};

export default function EditorialSection({
  title,
  register,
  id,
  toolbar,
  className = "",
  children,
}: EditorialSectionProps) {
  const titleId = headingId("section", title);
  const heading = (
    <h2 id={titleId} className="heading text-h2 leading-heading">
      {title}
    </h2>
  );

  return (
    <section
      id={id}
      className={`${REGISTER_CLASSNAME[register]} ${className}`.trim()}
      aria-labelledby={titleId}
    >
      {toolbar ? (
        <div className="flex flex-col gap-3">
          {heading}
          {toolbar}
        </div>
      ) : (
        heading
      )}
      {children}
    </section>
  );
}
