import { marketStats } from "@/lib/mock-data";

export default function MarketCard() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="heading text-2xl">Market at a Glance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-legacy-4 md:gap-3">
        {marketStats.map((s) => (
          <div key={s.label} className="card text-center">
            <div className="text-3xl font-bold text-text-primary mb-1">{s.value}</div>
            <div className="text-xs text-text-meta leading-snug">{s.label}</div>
            <div className="text-2xs text-text-subtle font-mono mt-1.5 leading-snug">
              {s.source}
            </div>
            <div className="text-2xs text-text-subtle font-mono leading-snug">{s.period}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
