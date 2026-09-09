import SearchInput from "./SearchInput";
import AnchorList from "./AnchorList";
import InfoCard from "./InfoCard";
import { reviewGroups } from "@/lib/reviews";

export default function ReviewsRail({
  searchPlaceholder = "Search reviews...",
  currentSlug,
}: {
  searchPlaceholder?: string;
  currentSlug?: string;
}) {
  return (
    <>
      <SearchInput placeholder={searchPlaceholder} />
      <AnchorList
        title="Review sections"
        cardClassName="card"
        items={reviewGroups.map((group) => ({
          href: group.href,
          label: group.title,
          key: group.slug,
          current: group.slug === currentSlug,
        }))}
      />
      <InfoCard
        title="Editorial standards"
        body="How we research, test with real deposits, and correct our reviews."
        cta={{ href: "/about", label: "Read our methodology" }}
      />
    </>
  );
}
