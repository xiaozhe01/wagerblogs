import ArrowLink from "@/components/ui/ArrowLink";
import { methodSteps } from "@/lib/mock-data";

export default function ReviewCard() {
  return (
    <section className="card" aria-labelledby="how-we-review">
      <div className="flex items-baseline justify-between flex-wrap mb-3">
        <h2 id="how-we-review" className="font-bold text-md text-text-primary">
          How We Review
        </h2>
        <ArrowLink
          href="/about"
          className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
        >
          Full methodology
        </ArrowLink>
      </div>
      <ol role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        {methodSteps.map((m, i) => (
          <li key={m} className="flex gap-2 items-start">
            <span
              aria-hidden="true"
              className="w-legacy-6 h-legacy-6 shrink-0 rounded-full bg-bg-accent text-text-on-accent flex items-center justify-center text-2xs font-bold"
            >
              {i + 1}
            </span>
            <p className="text-xs text-text-body leading-relaxed">{m}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
