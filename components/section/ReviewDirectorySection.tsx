import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import { headingId } from "@/lib/utils";
import { TIER_CLASSNAME } from "./heading-tiers";

/** What a tile needs, nothing more. `href` is supplied by the caller rather
 * than looked up here — the component no longer knows where reviews live. */
export type ReviewTile = {
  id: number | string;
  name: string;
  score: number;
  categoryScores: { label: string; score: number }[];
  /** Display text. `lastVerifiedISO` carries the machine-readable value. */
  lastVerified: string;
  lastVerifiedISO?: string;
  href: string;
};

// The hub's tile grid — deliberately not the ranked rows on /: no rank, no
// operator CTA, no bonus terms. Score breakdown and verification date instead.
export default function ReviewDirectorySection({
  title,
  operators,
  allHref,
  allLabel,
  limit,
}: {
  title: string;
  operators: ReviewTile[];
  /** The group's own page. Omit on that page — it is where the link points. */
  allHref?: string;
  allLabel?: string;
  limit?: number;
}) {
  const titleId = headingId("section", title);
  const visible = limit ? operators.slice(0, limit) : operators;

  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 id={titleId} className={TIER_CLASSNAME.section}>
          {title}
        </h2>
        {allHref && (
          <ArrowLink href={allHref} className={`${sectionCtaClassName} ml-auto w-fit shrink-0`}>
            {allLabel ?? "See all"}
          </ArrowLink>
        )}
      </div>
      <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        {visible.map((operator) => (
          <li key={operator.id} className="flex">
            <article className="flex grow">
              <Link
                href={operator.href}
                className="card group grow flex flex-col gap-2.5 no-underline transition-colors hover:bg-bg-subtle active:bg-bg-subtle-active"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 shrink-0 placeholder-asset rounded-md"
                  />
                  <h3 className="heading text-lg leading-snug min-w-0 flex-1 text-pretty">
                    {operator.name}
                  </h3>
                  <span className="shrink-0 font-bold text-lg text-text-primary tabular-nums">
                    <data value={operator.score}>{operator.score.toFixed(1)}</data>
                    <span className="text-xs text-text-muted font-medium">/10</span>
                  </span>
                </div>

                <dl className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium text-text-muted tabular-nums">
                  {operator.categoryScores.map((category) => (
                    <div key={category.label} className="flex gap-1">
                      <dt>{category.label}</dt>
                      <dd className="text-text-primary font-bold">
                        <data value={category.score}>{category.score}</data>
                      </dd>
                    </div>
                  ))}
                </dl>

                <p className="flex items-center justify-between gap-2 text-xs font-medium text-text-muted tabular-nums">
                  <span>
                    Last verified{" "}
                    <time dateTime={operator.lastVerifiedISO ?? operator.lastVerified}>
                      {operator.lastVerified}
                    </time>
                  </span>
                  {/* The tile is the link, so the CTA colours on the card's
                      hover — .link-cta only reacts to its own. */}
                  <span className="inline-flex items-center gap-1 font-semibold text-text-primary transition-colors duration-200 group-hover:text-brand group-active:text-brand-active">
                    Read review
                    <ArrowRight
                      strokeWidth={2}
                      className="size-3 shrink-0 transition duration-300 group-hover:translate-x-1 group-active:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </p>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
