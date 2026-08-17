import ExploreCategoryCard from "../cards/ExploreCategoryCard";
import EditorialSection from "./EditorialSection";

export default function ExploreSection() {
  return (
    <EditorialSection title="Browse by category" className="flex flex-col gap-4">
      <ExploreCategoryCard />
    </EditorialSection>
  );
}
