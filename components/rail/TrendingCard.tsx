import AnchorList from "@/components/rail/AnchorList";

const trendingHeadlines = [
  "NFL Week 1 lines set",
  "New sweepstakes casino launches in TX",
  "Two books add same-game parlay boosts",
  "Editor's Pick updated for August",
];

export default function TrendingCard() {
  return (
    <div className="card">
      <div className="font-bold text-sm text-text-primary mb-2.5">Trending Now</div>
      <AnchorList
        as="Link"
        items={trendingHeadlines.map((t) => ({ href: "/news", label: t, key: t }))}
        itemClassName="block text-sm text-text-body py-3 border-b border-border-hairline-alt leading-snug no-underline"
      />
    </div>
  );
}
