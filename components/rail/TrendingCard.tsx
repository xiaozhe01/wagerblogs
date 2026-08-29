import AnchorList from "@/components/rail/AnchorList";
import { trendingHeadlines } from "@/lib/mock-data";

export default function TrendingCard() {
  return (
    <section className="card" aria-labelledby="rail-trending-now">
      <h2 id="rail-trending-now" className="heading text-sm mb-2.5">
        Trending Now
      </h2>
      <AnchorList
        items={trendingHeadlines.map((t) => ({
          href: "/news",
          label: t,
          key: t,
        }))}
      />
    </section>
  );
}
