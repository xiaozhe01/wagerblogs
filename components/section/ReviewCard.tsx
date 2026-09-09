import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import { methodSteps } from "@/lib/mock-data";
import { headingId } from "@/lib/utils";

const TITLE = "How We Review";

/** showCta is off on /about, which *is* the full methodology — the CTA pointed
 * at the current page. */
export default function ReviewCard({ showCta = true }: { showCta?: boolean } = {}) {
  const titleId = headingId("section", TITLE);

  return (
    <section className="card" aria-labelledby={titleId}>
      <div className="flex items-baseline justify-between flex-wrap mb-3">
        <h2 id={titleId} className="heading text-2xl leading-heading">
          {TITLE}
        </h2>
        {showCta && (
          <ArrowLink href="/about#how-we-review" className={`${sectionCtaClassName}`}>
            Full methodology
          </ArrowLink>
        )}
      </div>
      <ol role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        {methodSteps.map((m, i) => (
          <li key={m} className="flex gap-2 items-start">
            <span
              aria-hidden="true"
              className="w-legacy-6 h-legacy-6 shrink-0 rounded-full bg-bg-accent text-text-on-fill flex items-center justify-center text-2xs font-bold"
            >
              {i + 1}
            </span>
            <p className="text-xs text-text-body font-medium leading-relaxed">{m}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
