import Link from "next/link";
import PrimaryDomainLink from "@/components/controls/PrimaryDomainLink";
import type { PrimaryDomainLinkData } from "@/lib/types";

/** One ranked row, already resolved from a Reviews record: the page builds the
 * href because only it knows the vertical, and flattens advantages. */
export type RankedOperator = {
  id: number;
  name: string;
  score: number;
  advantages: string[];
  href: string;
  primaryDomainLink?: PrimaryDomainLinkData;
};

export default function RankedList({ operators }: { operators: RankedOperator[] }) {
  return (
    <ol role="list" className="rounded-md border border-border-divider bg-bg-card">
      {operators.map((operator, i) => (
        <li
          key={operator.id}
          className={`flex flex-col md:flex-row md:items-center gap-3 md:gap-legacy-4 p-4 ${i < operators.length - 1 ? "border-b border-border-divider" : ""}`}
        >
          {/* md:contents dissolves this wrapper on desktop, where the rank block
              and the copy are siblings of the row itself. */}
          <div className="flex items-start gap-3 md:contents">
            <div className="flex items-center gap-3 md:gap-legacy-4">
              <span
                aria-hidden="true"
                className="w-3 shrink-0 text-base font-bold tabular-nums text-text-muted"
              >
                {i + 1}
              </span>
              <div className="w-8 h-8 shrink-0 placeholder-asset rounded-md" />
            </div>
            <div className="min-w-0 flex-1 flex flex-col gap-2">
              {/* The score is pushed to the row's right edge on a phone, so it
                  never wraps onto its own line and reads as a column down the
                  list. On desktop it sits beside the name. */}
              <div className="flex items-baseline gap-2 justify-between md:justify-start">
                <h3 className="min-w-0 font-bold text-lg text-text-primary">{operator.name}</h3>
                <span className="shrink-0 font-bold text-sm text-text-primary tabular-nums">
                  <data value={operator.score}>{operator.score.toFixed(1)}</data>
                  /10
                </span>
              </div>
              <p className="text-xs text-text-muted font-medium text-wrap line-clamp-2 md:line-clamp-none">
                {operator.advantages.slice(0, 2).join(" · ")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:flex-col md:w-28 md:shrink-0">
            <PrimaryDomainLink
              linkTier="tier2"
              primaryDomainLink={operator.primaryDomainLink}
              className="flex-1 md:flex-none md:w-full"
            />
            <Link
              href={operator.href}
              className="btn-secondary flex-1 md:flex-none min-h-11 wide:min-h-5 py-1.5 px-3 text-xs leading-heading md:w-full"
            >
              Read review
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
