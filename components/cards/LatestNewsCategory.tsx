import { newsCategories } from "@/lib/site-data";
import ChipList from "@/components/ui/ChipList";

export default function LatestNewsCategory() {
  return (
    <div className="flex gap-2 flex-wrap -mt-2">
      <ChipList
        as="div"
        items={newsCategories.map((category, i) => ({ label: category, active: i === 0 }))}
        activeClassName="btn-primary"
        inactiveClassName="btn-secondary"
      />
    </div>
  );
}
