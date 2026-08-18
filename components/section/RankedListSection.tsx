import RankedList from "../RankedList";
import type { Operator } from "@/lib/types";

export default function RankedListSection({
  title,
  operators,
}: {
  title: string;
  operators: Operator[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="heading text-2xl">{title}</h2>
      <RankedList operators={operators} />
    </section>
  );
}
