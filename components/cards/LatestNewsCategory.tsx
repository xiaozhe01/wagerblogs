import { newsCategories } from "@/lib/site-data";
import ChipList from "@/components/ui/ChipList";

export default function LatestNewsCategory() {
  return (
    <ul role="list" className="flex gap-2 flex-wrap -mt-2">
      <ChipList
        as="div"
        inList
        items={newsCategories.map((category, i) => ({ label: category, active: i === 0 }))}
        activeClassName="btn-primary"
        inactiveClassName="btn-secondary"
      />
    </ul>
  );
}
