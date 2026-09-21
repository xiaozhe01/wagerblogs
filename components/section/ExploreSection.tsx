import LinkTileGrid from "@/components/cards/LinkTileGrid";
import EditorialSection from "./EditorialSection";

export type ExploreTile = { slug: string; name: string; description: string };

export default function ExploreSection({ verticals }: { verticals: ExploreTile[] }) {
  return (
    <EditorialSection title="Browse by category" register="editorial" tier="supporting">
      <LinkTileGrid
        items={verticals.map((vertical) => ({
          href: `/categories/${vertical.slug}`,
          title: vertical.name,
          desc: vertical.description,
          key: vertical.slug,
        }))}
      />
    </EditorialSection>
  );
}
