import AnchorList from "@/components/rail/AnchorList";

// The headlines the teaser feed doesn't show. The page computes the split so
// the two cannot render the same story twice.
export default function TrendingCard({
  items,
}: {
  items: { href: string; label: string; key: string }[];
}) {
  if (items.length === 0) return null;

  return (
    // Unnamed section — see InfoCard: rail cards are not region landmarks.
    <section className="card">
      <h2 className="heading text-sm mb-2.5">More headlines</h2>
      <AnchorList items={items} />
    </section>
  );
}
