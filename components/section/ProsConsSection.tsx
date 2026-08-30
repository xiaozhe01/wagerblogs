import ReviewSection from "@/components/section/ReviewSection";

type ProsConsSectionProps = {
  pros: string[];
  cons: string[];
};

// Both columns render from one definition so the marker column, item gap and
// heading step cannot drift apart between them.
function ProsConsList({
  title,
  marker,
  items,
}: {
  title: string;
  marker: string;
  items: string[];
}) {
  return (
    <div className="card flex flex-col gap-3">
      <h3 className="text-sm font-bold text-text-primary">{title}</h3>
      <ul role="list" className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-1.5 text-sm text-text-muted font-medium leading-relaxed"
          >
            {/* Its own column — inline, a wrapped line ran back underneath the
                marker instead of aligning with the text above it. */}
            <span aria-hidden="true" className="w-2 shrink-0">
              {marker}
            </span>
            <span className="min-w-0">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  return (
    <ReviewSection title="Where it wins and where it doesn't">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        <ProsConsList title="Strengths" marker="+" items={pros} />
        <ProsConsList title="Trade-offs" marker="−" items={cons} />
      </div>
    </ReviewSection>
  );
}
