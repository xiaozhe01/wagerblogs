import type { Operator } from "@/lib/types";
import Link from "next/link";
import PrimaryDomainLink from "./PrimaryDomainLink";

export default function RankedList({ operators }: { operators: Operator[] }) {
  return (
    <div className="rounded-md border border-border-divider bg-bg-card">
      {operators.map((operator, i) => (
        <div
          key={operator.id}
          className={`flex flex-col md:flex-row md:items-center gap-legacy-4 p-4 ${i < operators.length - 1 ? "border-b border-border-divider" : ""}`}
        >
          <div className="flex items-center gap-legacy-4">
            <span className="w-3 shrink-0 text-base font-bold text-border-placeholder">
              {i + 1}
            </span>
            <div className="w-6 h-6 shrink-0 placeholder-asset rounded-md" />
          </div>
          <div className="min-w-0 flex-1 flex flex-col gap-2">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="font-bold text-md text-text-primary">{operator.name}</span>
              <span className="font-bold text-sm text-text-primary">{operator.score}/10</span>
            </div>
            <div className="text-xs text-text-muted text-wrap">
              {operator.advantages.slice(0, 2).join(" · ")}
            </div>
          </div>
          <div className="flex items-center gap-2 md:flex-col md:w-28 md:shrink-0">
            <PrimaryDomainLink
              linkTier="tier2"
              primaryDomainLink={operator.primaryDomainLink}
              className="md:w-full"
            />
            <Link
              href="/reviews/sample-operator"
              className="btn-secondary min-h-5 py-1.5 px-3 text-xs md:w-full"
            >
              Read review
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
