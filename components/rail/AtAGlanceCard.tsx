import type { AtAGlanceItem } from "@/lib/types";

type AtAGlanceCardProps = {
  items: AtAGlanceItem[];
};

export default function AtAGlanceCard({ items }: AtAGlanceCardProps) {
  return (
    <div className="card flex flex-col gap-2">
      <div className="font-bold text-sm text-text-primary">At a glance</div>
      {items.map((a) => (
        <span
          key={a.label}
          className="flex justify-between gap-2.5 text-xs font-semibold text-text-muted py-1.5 text-center border-b border-border-hairline-alt last:border-b-0"
        >
          <span>{a.label}</span>
          <span className="text-text-strong-secondary font-semibold text-right">{a.value}</span>
        </span>
      ))}
      <div className="text-xs font-semibold text-text-subtle leading-relaxed py-1">
        21+. T&amp;Cs apply. [terms placeholder]
      </div>
    </div>
  );
}
