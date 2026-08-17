import ReviewSectionHeading from "@/components/section/ReviewSectionHeading";

type ProsConsSectionProps = {
  pros: string[];
  cons: string[];
};

// "Where it wins and where it doesn't" strengths/trade-offs section —
// verbatim-identical between the two reviews templates (DRY-21).
export default function ProsConsSection({ pros, cons }: ProsConsSectionProps) {
  return (
    <section>
      <ReviewSectionHeading title="Where it wins and where it doesn't" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        <div className="card">
          <div className="text-sm font-bold text-text-primary mb-2.5">Strengths</div>
          {pros.map((p) => (
            <div key={p} className="text-sm text-text-muted leading-relaxed py-1">
              + {p}
            </div>
          ))}
        </div>
        <div className="card">
          <div className="text-sm font-bold text-text-primary mb-2.5">Trade-offs</div>
          {cons.map((c) => (
            <div key={c} className="text-sm text-text-muted leading-relaxed py-1">
              − {c}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
