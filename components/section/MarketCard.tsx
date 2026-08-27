import { marketStats } from "@/lib/mock-data";

export default function MarketCard() {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="market-at-a-glance">
      <h2 id="market-at-a-glance" className="heading text-2xl">
        Market at a Glance
      </h2>
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-legacy-4 md:gap-3">
        {marketStats.map((s) => (
          <div key={s.label} className="card text-center flex flex-col gap-1">
            <dt className="order-2 text-xs text-text-meta leading-snug">{s.label}</dt>
            <dd className="order-1 text-3xl font-bold text-text-primary">{s.value}</dd>
            <dd className="order-3 text-2xs text-text-subtle font-mono leading-snug">{s.source}</dd>
            <dd className="order-4 text-2xs text-text-subtle font-mono leading-snug">{s.period}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
