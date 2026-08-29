import type { AtAGlanceItem } from "@/lib/types";

type AtAGlanceCardProps = {
  items: AtAGlanceItem[];
};

export default function AtAGlanceCard({ items }: AtAGlanceCardProps) {
  return (
    <section className="card flex flex-col gap-2" aria-labelledby="rail-at-a-glance">
      <h2 id="rail-at-a-glance" className="heading text-sm">
        At a glance
      </h2>
      <dl className="flex flex-col gap-2">
        {items.map((a) => (
          <div
            key={a.label}
            className="flex justify-between gap-2.5 text-xs font-semibold text-text-muted py-1.5 text-center border-b border-border-hairline-alt last:border-b-0"
          >
            <dt>{a.label}</dt>
            <dd className="text-text-strong-secondary font-semibold text-right">{a.value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs font-medium text-text-subtle leading-relaxed py-1">
        21+. T&amp;Cs apply. [terms placeholder]
      </p>
    </section>
  );
}
