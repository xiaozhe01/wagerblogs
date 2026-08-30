import { operators, compareRows } from "@/lib/mock-data";
import PrimaryDomainLink from "../PrimaryDomainLink";
import ArrowLink from "@/components/ui/ArrowLink";
import { headingId } from "@/lib/utils";
import type { ComparisonOperator } from "@/lib/types";

// The grid this replaced put its 24px edge inset and 16px column gaps *outside*
// the column tracks; a table carries them inside each cell box. 8px on every
// side of a cell reproduces the 16px gaps, and the first cell's pl-4 plus the
// trailing spacer <col> reproduce the 24px edge insets.
const firstCellPadding = "pl-4 pr-2";
const cellPadding = "px-2";

function ComparisonLinkOrNote({ operator }: { operator: ComparisonOperator }) {
  if (operator.isPrimaryDomain) {
    return <PrimaryDomainLink linkTier="tier2" primaryDomainLink={operator.primaryDomainLink} />;
  }
  return (
    <p className="text-2xs text-text-subtle font-medium leading-relaxed">
      text-only comparison · no outbound link
    </p>
  );
}

const TITLE = "Compare Sportsbooks Side by Side";

// `id` is the caller's anchor target; the heading carries its own.
export default function ComparisonCard({ id }: { id?: string } = {}) {
  const titleId = headingId("section", TITLE);
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      className="flex flex-col gap-3 bg-bg-subtle border border-border-divider rounded-md p-3"
    >
      <h2 id={titleId} className="heading text-2xl">
        {TITLE}
      </h2>
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
          </colgroup>
          <thead className="bg-bg-subtle">
            <tr className=" border-b border-border-divider">
              <th scope="col" className={`${firstCellPadding} py-4 align-top text-left font-bold`}>
                Feature
              </th>
              {operators.map((op) => (
                <th
                  scope="col"
                  key={op.name}
                  className={`${cellPadding} py-4 align-top text-center text-sm font-bold text-text-primary`}
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
                  className={`${firstCellPadding} py-4 align-top text-left text-sm font-medium text-text-meta`}
                >
                  {row.label}
                </th>
                {row.values.map((v, i) => (
                  <td
                    key={i}
                    className={`${cellPadding} py-4 align-top text-sm text-center font-medium text-text-strong-secondary`}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
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
                  className="flex justify-between gap-3 text-sm font-bold text-text-muted py-1.5 border-b border-border-hairline-alt"
                >
                  <dt>{r.label}</dt>
                  <dd className="text-text-strong-secondary font-medium">{r.values[i]}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3">
              <ComparisonLinkOrNote operator={op} />
            </div>
          </li>
        ))}
      </ul>
      <ArrowLink
        href="/reviews"
        className="inline-flex items-center self-center gap-1 text-md text-text-primary font-semibold group w-fit"
      >
        Full Comparison Tool
      </ArrowLink>
    </section>
  );
}
