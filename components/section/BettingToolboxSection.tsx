import LinkTileGrid from "@/components/cards/LinkTileGrid";
import EditorialSection from "./EditorialSection";
import { toolboxItems } from "@/lib/mock-data";

export default function BettingToolboxSection() {
  return (
    <EditorialSection title="Betting toolbox" register="editorial" tier="supporting">
      <LinkTileGrid
        columns="two"
        items={toolboxItems.map((item) => ({
          href: item.href,
          title: item.title,
          desc: item.desc,
        }))}
      />
    </EditorialSection>
  );
}
