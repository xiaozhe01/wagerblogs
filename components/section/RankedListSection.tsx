import RankedList from "./RankedList";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import { headingId } from "@/lib/utils";
import type { Operator } from "@/lib/types";
import { TIER_CLASSNAME } from "./heading-tiers";

export default function RankedListSection({
  title,
  operators,
  action,
}: {
  title: string;
  operators: Operator[];
  /** The full directory this list is an extract of. */
  action?: { href: string; label: string };
}) {
  const titleId = headingId("section", title);

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 id={titleId} className={TIER_CLASSNAME.section}>
          {title}
        </h2>
        {action && (
          <ArrowLink href={action.href} className={`${sectionCtaClassName} ml-auto w-fit shrink-0`}>
            {action.label}
          </ArrowLink>
        )}
      </div>
      <RankedList operators={operators} />
    </section>
  );
}
