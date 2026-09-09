import type { ReactNode } from "react";
import { headingId } from "@/lib/utils";
import { TIER_CLASSNAME, type HeadingTier } from "./heading-tiers";

// TODO: trust-block sequencing ("TRUST BLOCK 1 / 3") and each block's
// provenance line. Both were hardcoded per call site; derive them here from the
// blocks actually rendered — the provenance is a trust claim, so it must come
// from the record that gates the block.

// The review route's section wrapper — comparison-register counterpart to
// EditorialSection. Owns the tag, its accessible name, and the heading gap.
type ReviewSectionProps = {
  title: string;
  /** Defaults to the comparison register's own step: 22px, denser than
   * editorial's 28px major but clear of the 19px supporting tier. */
  tier?: HeadingTier;
  /** Anchor target — #reader-reviews is linked from inside the section. */
  id?: string;
  children: ReactNode;
};

export default function ReviewSection({
  title,
  tier = "section",
  id,
  children,
}: ReviewSectionProps) {
  const titleId = headingId("section", title);

  return (
    <section id={id} aria-labelledby={titleId} className="flex flex-col gap-3">
      <h2 id={titleId} className={TIER_CLASSNAME[tier]}>
        {title}
      </h2>
      {children}
    </section>
  );
}
