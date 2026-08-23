import ArrowLink from "@/components/ui/ArrowLink";
import { methodSteps } from "@/lib/mock-data";

export default function ReviewCard() {
  return (
    <section className="card">
      <div className="flex items-baseline justify-between flex-wrap mb-3">
        <div className="font-bold text-md text-text-primary">How We Review</div>
        <ArrowLink
          href="/about"
          className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
        >
          Full methodology
        </ArrowLink>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        {methodSteps.map((m, i) => (
          <div key={m} className="flex gap-2 items-start">
            <div className="w-legacy-6 h-legacy-6 shrink-0 rounded-full bg-bg-accent text-text-on-accent flex items-center justify-center text-2xs font-bold">
              {i + 1}
            </div>
            <div className="text-xs text-text-body leading-relaxed">{m}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
