import NewsCard from "../cards/NewsCard";
import { newsFeed } from "@/lib/mock-data";
import LatestNewsCategory from "../cards/LatestNewsCategory";
import ArrowLink from "@/components/ui/ArrowLink";
import EditorialSection from "./EditorialSection";

export default function LatestNewsSection() {
  return (
    <EditorialSection title="Latest news">
      <LatestNewsCategory />
      <div className="flex flex-col">
        {newsFeed.map((news) => (
          <NewsCard news={news} key={news.title} />
        ))}
      </div>
      <ArrowLink
        href="/about"
        className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group w-fit"
      >
        All news &amp; interviews
      </ArrowLink>
    </EditorialSection>
  );
}
