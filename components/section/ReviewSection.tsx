import type { ReactNode } from "react";
import { headingId } from "@/lib/utils";

// The review route's section wrapper — comparison-register counterpart to
// EditorialSection. Owns the tag, its accessible name, and the heading gap.
type ReviewSectionProps = {
  title: string;
  /** Trust-block counter ("TRUST BLOCK 1 / 3") shown before the heading. */
  badge?: string;
  /** Provenance line shown beside the heading, not below it. */
  note?: string;
  /** Anchor target — #reader-reviews is linked from inside the section. */
  id?: string;
  children: ReactNode;
};

export default function ReviewSection({ title, badge, note, id, children }: ReviewSectionProps) {
  const titleId = headingId("section", title);
  const heading = (
    <h2 id={titleId} className="heading text-2xl">
      {title}
    </h2>
  );

  return (
    <section id={id} aria-labelledby={titleId} className="flex flex-col gap-3">
      {badge || note ? (
        <div className="flex items-center gap-3 flex-wrap">
          {badge && (
            <span className="text-2xs tracking-wide px-2 py-1 rounded-sm bg-bg-accent text-text-on-accent">
              {badge}
            </span>
          )}
          {heading}
          {note && <p className="text-xs text-text-subtle tabular-nums leading-relaxed">{note}</p>}
        </div>
      ) : (
        heading
      )}
      {children}
    </section>
  );
}
