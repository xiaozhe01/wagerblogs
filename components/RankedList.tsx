import type { Operator } from "@/lib/types";
import Link from "next/link";
import PrimaryDomainLink from "./PrimaryDomainLink";

export default function RankedList({ operators }: { operators: Operator[] }) {
  return (
    <ol role="list" className="rounded-md border border-border-divider bg-bg-card">
      {operators.map((operator, i) => (
        <li
          key={operator.id}
          className={`flex flex-col md:flex-row md:items-center gap-legacy-4 p-4 ${i < operators.length - 1 ? "border-b border-border-divider" : ""}`}
        >
          <div className="flex items-center gap-legacy-4">
            <span
              aria-hidden="true"
              className="w-3 shrink-0 text-base font-bold tabular-nums text-text-subtle"
            >
              {i + 1}
            </span>
            <div className="w-8 h-8 shrink-0 placeholder-asset rounded-md" />
          </div>
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <h3 className="font-bold text-md text-text-primary">{operator.name}</h3>
              <span className="font-bold text-sm text-text-primary">
                <data value={operator.score}>{operator.score}</data>/10
              </span>
            </div>
            <p className="text-xs text-text-muted font-medium text-wrap">
              {operator.advantages.slice(0, 2).join(" · ")}
            </p>
          </div>
          <div className="flex items-center gap-2 md:flex-col md:w-28 md:shrink-0">
            <PrimaryDomainLink
              linkTier="tier2"
              primaryDomainLink={operator.primaryDomainLink}
              className="md:w-full"
            />
            <Link
              href="/reviews/sample-operator"
              className="btn-secondary min-h-5 py-1.5 px-3 text-xs leading-heading md:w-full"
            >
              Read review
            </Link>
          </div>
        </li>
      ))}
    </ol>
  );
}
