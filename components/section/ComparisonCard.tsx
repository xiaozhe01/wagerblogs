import { operators, compareRows } from "@/lib/mock-data";
import PrimaryDomainLink from "../PrimaryDomainLink";
import ArrowLink from "@/components/ui/ArrowLink";
import type { ComparisonOperator } from "@/lib/types";

// The grid this replaced put its 24px edge inset and 16px column gaps *outside*
// the column tracks; a table carries them inside each cell box. 8px on every
// side of a cell reproduces the 16px gaps, and the first cell's pl-4 plus the
// trailing spacer <col> reproduce the 24px edge insets.
const firstCellPadding = "pl-4 pr-2";
const cellPadding = "px-2";

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
      <p className="text-xs text-text-subtle font-mono leading-relaxed">
        text-only comparison
        <br />
        no outbound link
      </p>
    );
  }
  return (
    <p className="text-xs text-text-subtle font-mono">text-only comparison · no outbound link</p>
  );
}

export default function ComparisonCard({ id }: { id?: string } = {}) {
  return (
    <section id={id} className="flex flex-col gap-3">
      <h2 className="heading text-2xl">Compare Sportsbooks Side by Side</h2>
      <div className="hidden lg:block border border-border-divider rounded-md overflow-x-auto bg-bg-card">
        <table className="min-w-150 w-full table-fixed">
          <caption className="sr-only">
            Sportsbooks compared feature by feature. The first column names the feature; each
            remaining column is one sportsbook.
          </caption>
          {/* The trailing 16px <col> has no cells by design: it carries the right-edge
              inset so the three operator columns stay exactly equal. Don't replace it
              with a calc() width — Chrome ignores calc() percentages for table column
              sizing (on <col> and on first-row cells); plain px and plain % do work.
              Insetting the table instead would shorten the header background and the
              row dividers, which have to stay full-bleed. */}
          <colgroup>
            <col className="w-41" />
            <col />
            <col />
            <col />
            <col className="w-[16px]" />
          </colgroup>
          <thead>
            <tr className="bg-bg-subtle border-b border-border-divider">
              <th
                scope="col"
                className={`meta-label ${firstCellPadding} py-4 align-top text-left font-normal`}
              >
                FEATURE
              </th>
              {operators.map((op) => (
                <th
                  scope="col"
                  key={op.name}
                  className={`${cellPadding} py-4 align-top text-left text-sm font-bold text-text-primary`}
                >
                  {op.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareRows.map((row) => (
              <tr key={row.label} className="border-b border-border-hairline">
                <th
                  scope="row"
                  className={`${firstCellPadding} py-4 align-top text-left text-sm font-normal text-text-meta`}
                >
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td
                    key={i}
                    className={`${cellPadding} py-4 align-top text-sm text-text-strong-secondary`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th
                scope="row"
                className={`meta-label ${firstCellPadding} py-4 align-middle text-left font-normal`}
              >
                LINK
              </th>
              {operators.map((op) => (
                <td key={op.name} className={`${cellPadding} py-4 align-middle`}>
                  <ComparisonLinkOrNote operator={op} variant="grid" />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <ul role="list" className="flex flex-col gap-2.5 lg:hidden">
        {operators.map((op, i) => (
          <li key={op.name} className="card">
            <h3 className="text-md font-semibold text-text-primary mb-1.5">{op.name}</h3>
            <dl>
              {compareRows.map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between gap-3 text-sm text-text-muted py-1.5 border-b border-border-hairline-alt"
                >
                  <dt>{r.label}</dt>
                  <dd className="text-text-strong-secondary font-semibold">{r.values[i]}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3">
              <ComparisonLinkOrNote operator={op} variant="card" />
            </div>
          </li>
        ))}
      </ul>
      <ArrowLink
        href="/reviews"
        className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group w-fit"
      >
        Full Comparison Tool
      </ArrowLink>
    </section>
  );
}
