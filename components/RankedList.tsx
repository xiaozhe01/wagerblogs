import type { Operator } from "@/lib/types";
import Link from "next/link";
import PrimaryDomainLink from "./PrimaryDomainLink";

export default function RankedList({ operators }: { operators: Operator[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      {operators.map((operator, i) => (
        <div
          key={operator.id}
          className={`rounded-md p-4 bg-bg-card ${operator.isPrimaryDomain ? "border border-text-primary" : "border border-border-divider"}`}
        >
          <div className="grid grid-cols-1 wide:grid-cols-[40px_1fr_128px] gap-3.5 items-center">
            <div className="w-10 h-10 shrink-0 placeholder-asset rounded-sm text-xs text-text-meta font-mono">
              #{i + 1}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                <span className="font-bold text-md text-text-primary">{operator.name}</span>
                <span className="text-sm font-bold text-text-strong-secondary">
                  {operator.score}/10
                </span>
              </div>
              {operator.advantages.map((a) => (
                <div key={a} className="text-xs text-text-muted leading-relaxed">
                  • {a}
                </div>
              ))}
              <div className="text-xs text-text-body leading-relaxed mt-1.5">{operator.terms}</div>
            </div>
            <div className="grid grid-cols-2 wide:flex wide:flex-col gap-2.5">
              <PrimaryDomainLink linkTier="tier2" primaryDomainLink={operator.primaryDomainLink} />
              <Link href="/reviews/sample-operator" className="btn-secondary">
                Read Review
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
