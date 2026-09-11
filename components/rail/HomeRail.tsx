import TrendingCard from "./TrendingCard";
import EditorsCard from "./EditorsCard";

// categoryParam is threaded through so "More headlines" can exclude whatever
// the teaser feed is currently showing — see homeNewsSplit in lib/news.ts.
export default function HomeRail({ categoryParam }: { categoryParam?: string | string[] }) {
  return (
    <>
      <TrendingCard categoryParam={categoryParam} />
      <EditorsCard />
    </>
  );
}
