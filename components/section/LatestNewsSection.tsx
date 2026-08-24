import NewsCard from "../cards/NewsCard";
import { newsFeed } from "@/lib/mock-data";
import LatestNewsCategory from "../cards/LatestNewsCategory";
import ArrowLink from "@/components/ui/ArrowLink";
import EditorialSection from "./EditorialSection";

export default function LatestNewsSection() {
  return (
    <EditorialSection title="Latest news">
      <LatestNewsCategory />
      <ul role="list" className="flex flex-col">
        {newsFeed.map((news) => (
          <li key={news.title}>
            <NewsCard news={news} />
          </li>
        ))}
      </ul>
      <ArrowLink
        href="/about"
        className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group w-fit"
      >
        All news &amp; interviews
      </ArrowLink>
    </EditorialSection>
  );
}
