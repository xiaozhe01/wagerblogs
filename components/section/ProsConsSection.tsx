import ReviewSection from "@/components/section/ReviewSection";

type ProsConsSectionProps = {
  pros: string[];
  cons: string[];
};

export default function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  return (
    <ReviewSection title="Where it wins and where it doesn't">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        <div className="card">
          <h3 className="text-sm font-bold text-text-primary mb-2.5">Strengths</h3>
          <ul role="list">
            {pros.map((p) => (
              <li key={p} className="text-sm text-text-muted leading-relaxed py-1">
                <span aria-hidden="true">+ </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="text-sm font-bold text-text-primary mb-2.5">Trade-offs</h3>
          <ul role="list">
            {cons.map((c) => (
              <li key={c} className="text-sm text-text-muted leading-relaxed py-1">
                <span aria-hidden="true">− </span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ReviewSection>
  );
}
