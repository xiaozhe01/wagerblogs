import { operators, compareRows } from "@/lib/mock-data";
import PrimaryDomainLink from "@/components/controls/PrimaryDomainLink";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import { headingId } from "@/lib/utils";
import type { ComparisonOperator, LinkTier } from "@/lib/types";
import { TIER_CLASSNAME } from "./heading-tiers";

// Cell padding carries the column gaps and edge insets, which a table holds
// inside the cell box rather than outside the track.
const firstCellPadding = "pl-4 pr-2";
const cellPadding = "px-2";

function ComparisonActions({
  operator,
  linkTier,
}: {
  operator: ComparisonOperator;
  linkTier: LinkTier;
}) {
  return operator.isPrimaryDomain ? (
    <PrimaryDomainLink
      linkTier={linkTier}
      primaryDomainLink={operator.primaryDomainLink}
      className="w-full"
    />
  ) : (
    <PrimaryDomainLink
      linkTier={linkTier}
      primaryDomainLink={{ ...operator.operatorLink, relAttribute: "nofollow" }}
      className="w-full"
    />
  );
}

const TITLE = "Compare Sportsbooks Side by Side";

export default function ComparisonCard({ linkTier = "tier2" }: { linkTier?: LinkTier } = {}) {
  const titleId = headingId("section", TITLE);
  return (
    <section aria-labelledby={titleId} className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <h2 id={titleId} className={TIER_CLASSNAME.section}>
          {TITLE}
        </h2>
        <ArrowLink href="/reviews" className={`${sectionCtaClassName} ml-auto w-fit shrink-0`}>
          Full Comparison Tool
        </ArrowLink>
      </div>
      <div className="hidden lg:block border border-border-divider rounded-md overflow-x-auto bg-bg-card">
        <table className="min-w-150 w-full table-fixed">
          <caption className="sr-only">
            Sportsbooks compared feature by feature. The first column names the feature; each
            remaining column is one sportsbook.
          </caption>
          {/* The trailing <col> has no cells by design — it carries the right-edge
              inset so the operator columns stay equal. Don't swap it for a calc()
              width: Chrome ignores calc() percentages when sizing table columns. */}
          <colgroup>
            <col className="w-41" />
            <col />
            <col />
            <col />
          </colgroup>
          <thead className="bg-bg-subtle">
            <tr className="border-b border-border-divider">
              <th
                scope="col"
                className={`${firstCellPadding} py-4 align-top text-left font-bold text-text-primary`}
              >
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
                  className={`${firstCellPadding} py-4 align-top text-left text-sm font-medium text-text-muted`}
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
          <tfoot>
            <tr>
              <th
                scope="row"
                className={`${firstCellPadding} py-4 align-top text-left text-sm font-medium text-text-muted`}
              >
                Visit site
              </th>
              {operators.map((op) => (
                <td key={op.name} className={`${cellPadding} py-4 align-top text-center`}>
                  <ComparisonActions operator={op} linkTier={linkTier} />
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
      <ul role="list" className="flex flex-col gap-2.5 lg:hidden">
        {operators.map((op, i) => (
          <li key={op.name} className="card">
            <h3 className="text-lg font-semibold text-text-primary mb-1.5">{op.name}</h3>
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
              <ComparisonActions operator={op} linkTier={linkTier} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
