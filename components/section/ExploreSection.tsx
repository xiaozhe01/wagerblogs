import LinkTileGrid from "@/components/cards/LinkTileGrid";
import EditorialSection from "./EditorialSection";
import { categories } from "@/lib/categories";

export default function ExploreSection() {
  return (
    <EditorialSection title="Browse by category" register="editorial" tier="supporting">
      <LinkTileGrid
        items={categories.map((category) => ({
          href: category.href,
          title: category.name,
          desc: category.desc,
          key: category.slug,
        }))}
      />
    </EditorialSection>
  );
}
