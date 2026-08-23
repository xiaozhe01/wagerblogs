import AnchorList from "@/components/rail/AnchorList";
import { trendingHeadlines } from "@/lib/mock-data";

export default function TrendingCard() {
  return (
    <div className="card pb-0">
      <div className="font-bold text-sm text-text-primary mb-2.5">Trending Now</div>
      <AnchorList
        items={trendingHeadlines.map((t) => ({ href: "/news", label: t, key: t }))}
        itemClassName="block text-sm text-text-body py-3 border-b border-border-hairline-alt last:border-b-0 leading-snug no-underline"
      />
    </div>
  );
}
