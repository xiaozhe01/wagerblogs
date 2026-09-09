import AnchorList from "@/components/rail/AnchorList";
import { homeNewsSplit } from "@/lib/news";

// The headlines the teaser feed doesn't show. Takes the active chip so it stays
// the feed's complement — computed apart it duplicated the feed's own rows.
export default function TrendingCard({ categoryParam }: { categoryParam?: string | string[] }) {
  const { rest } = homeNewsSplit(categoryParam);
  if (rest.length === 0) return null;

  return (
    // Unnamed section — see InfoCard: rail cards are not region landmarks.
    <section className="card">
      <h2 className="heading text-sm mb-2.5">More headlines</h2>
      <AnchorList
        items={rest.map((story) => ({ href: story.href, label: story.title, key: story.slug }))}
      />
    </section>
  );
}
