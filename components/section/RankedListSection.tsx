import RankedList from "../RankedList";
import { headingId } from "@/lib/utils";
import type { Operator } from "@/lib/types";

export default function RankedListSection({
  title,
  operators,
}: {
  title: string;
  operators: Operator[];
}) {
  const titleId = headingId("section", title);
  return (
    <section
      aria-labelledby={titleId}
      className="flex flex-col gap-3 bg-bg-subtle border border-border-divider rounded-md p-3"
    >
      <h2 id={titleId} className="heading text-2xl">
        {title}
      </h2>
      <RankedList operators={operators} />
    </section>
  );
}
