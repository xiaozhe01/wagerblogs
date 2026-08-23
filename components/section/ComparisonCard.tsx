import { operators, compareRows } from "@/lib/mock-data";
import PrimaryDomainLink from "../PrimaryDomainLink";
import ArrowLink from "@/components/ui/ArrowLink";
import type { ComparisonOperator } from "@/lib/types";

function ComparisonLinkOrNote({
  operator,
  variant,
}: {
  operator: ComparisonOperator;
  variant: "grid" | "card";
}) {
  if (operator.isPrimaryDomain) {
    return <PrimaryDomainLink linkTier="tier2" primaryDomainLink={operator.primaryDomainLink} />;
  }
  if (variant === "grid") {
    return (
      <div className="text-xs text-text-subtle font-mono leading-relaxed">
        text-only comparison
        <br />
        no outbound link
      </div>
    );
  }
  return (
    <div className="text-xs text-text-subtle font-mono">
      text-only comparison · no outbound link
    </div>
  );
}

export default function ComparisonCard({ id }: { id?: string } = {}) {
  return (
    <section id={id} className="flex flex-col gap-3">
      <h2 className="heading text-2xl">Compare Sportsbooks Side by Side</h2>
      <div className="hidden lg:block border border-border-divider rounded-md overflow-x-auto bg-bg-card">
        <div className="min-w-150">
          <div className="grid grid-cols-[132px_repeat(3,minmax(110px,1fr))] gap-3 bg-bg-subtle border-b border-border-divider p-4">
            <div className="text-2xs text-text-subtle font-mono">FEATURE</div>
            {operators.map((op) => (
              <div key={op.name} className="text-sm font-bold text-text-primary">
                {op.name}
              </div>
            ))}
          </div>
          {compareRows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[132px_repeat(3,minmax(110px,1fr))] gap-3 p-4 border-b border-border-hairline"
            >
              <div className="text-sm text-text-meta">{row.label}</div>
              {row.values.map((v, i) => (
                <div key={i} className="text-sm text-text-strong-secondary">
                  {v}
                </div>
              ))}
            </div>
          ))}
          <div className="grid grid-cols-[132px_repeat(3,minmax(110px,1fr))] gap-3 p-4 items-center">
            <div className="text-2xs text-text-subtle font-mono">LINK</div>
            {operators.map((op) => (
              <ComparisonLinkOrNote key={op.name} operator={op} variant="grid" />
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2.5 lg:hidden">
        {operators.map((op, i) => (
          <div key={op.name} className="card">
            <div className="text-md font-semibold text-text-primary mb-1.5">{op.name}</div>
            {compareRows.map((r) => (
              <div
                key={r.label}
                className="flex justify-between gap-3 text-sm text-text-muted py-1.5 border-b border-border-hairline-alt"
              >
                <span>{r.label}</span>
                <span className="text-text-strong-secondary font-semibold">{r.values[i]}</span>
              </div>
            ))}
            <div className="mt-3">
              <ComparisonLinkOrNote operator={op} variant="card" />
            </div>
          </div>
        ))}
      </div>
      <ArrowLink
        href="/reviews"
        className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group w-fit"
      >
        Full Comparison Tool
      </ArrowLink>
    </section>
  );
}
