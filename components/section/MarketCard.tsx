import EmptyState from "./EmptyState";

/** MarketStats stores source and period bare; the "Source:" / "Period:" labels
 * are display, added here rather than baked into the stored value. */
export type MarketStat = {
  value: string;
  label: string;
  source: string;
  period: string;
};

export default function MarketCard({ stats }: { stats: MarketStat[] }) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="market-at-a-glance">
      <h2 id="market-at-a-glance" className="heading text-2xl">
        Market at a Glance
      </h2>
      {stats.length === 0 ? (
        <EmptyState
          title="No market figures published yet"
          body="Each figure needs a named source and reporting period before it can run."
        />
      ) : (
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-legacy-4 md:gap-3">
          {stats.map((s) => (
            <div key={s.label} className="card text-center flex flex-col gap-1">
              <dt className="order-2 text-xs text-text-muted font-medium leading-snug">
                {s.label}
              </dt>
              <dd className="order-1 text-3xl font-medium text-text-primary">{s.value}</dd>
              <dd className="order-3 text-2xs font-medium leading-snug text-text-muted">
                Source: {s.source}
              </dd>
              <dd className="order-4 text-2xs font-medium leading-snug text-text-muted">
                Period: {s.period}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
