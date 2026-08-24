import AnchorList from "@/components/rail/AnchorList";
import { trendingHeadlines } from "@/lib/mock-data";

export default function TrendingCard() {
  return (
    <section className="card pb-0" aria-labelledby="rail-trending-now">
      <h2 id="rail-trending-now" className="font-bold text-sm text-text-primary mb-2.5">
        Trending Now
      </h2>
      <AnchorList
        items={trendingHeadlines.map((t) => ({
          href: "/news",
          label: t,
          key: t,
        }))}
        itemClassName="block text-sm text-text-body py-3 border-b border-border-hairline-alt [li:last-child_&]:border-b-0 leading-snug no-underline"
      />
    </section>
  );
}
