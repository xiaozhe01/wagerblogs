import AnchorList from "./AnchorList";
import type { Operator } from "@/lib/types";
import { reviewPath } from "@/lib/reviews";

/** The rest of the group, each row linking to its own review. */
export default function OtherBooksCard({
  title,
  operators,
}: {
  title: string;
  operators: Operator[];
}) {
  return (
    <AnchorList
      title={title}
      cardClassName="card"
      items={operators.map((operator) => ({
        href: reviewPath(operator),
        key: operator.slug,
        label: (
          <>
            <span className="font-semibold">{operator.name}</span>
            <span className="text-text-primary font-bold">
              <data value={operator.score}>{operator.score.toFixed(1)}</data>
            </span>
          </>
        ),
      }))}
    />
  );
}
