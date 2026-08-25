import NewsCard from "../cards/NewsCard";
import { newsFeed } from "@/lib/mock-data";
import LatestNewsCategory from "../cards/LatestNewsCategory";
import ArrowLink from "@/components/ui/ArrowLink";
import EditorialSection from "./EditorialSection";
import { newsCategories } from "@/lib/site-data";
import { chipHref, resolveChip } from "@/lib/utils";

export const NEWS_PARAM = "news";
const ALL_CATEGORY = "All";
/** Matches the id EditorialSection derives from the title, so choosing a category
 * returns the reader to the feed instead of the top of the page. */
const NEWS_ANCHOR = "section-latest-news";

export default function LatestNewsSection({
  categoryParam,
}: {
  categoryParam?: string | string[];
}) {
  const category = resolveChip(newsCategories, categoryParam, ALL_CATEGORY);
  const items =
    category === ALL_CATEGORY ? newsFeed : newsFeed.filter((item) => item.category === category);

  return (
    <EditorialSection title="Latest news">
      <LatestNewsCategory
        items={newsCategories.map((name) => ({
          label: name,
          key: name,
          href: chipHref({
            basePath: "/",
            param: NEWS_PARAM,
            value: name,
            allValue: ALL_CATEGORY,
            anchor: NEWS_ANCHOR,
          }),
          active: name === category,
        }))}
      />
      {items.length === 0 ? (
        <p className="text-sm text-text-meta leading-relaxed">
          No stories filed under {category} yet.
        </p>
      ) : (
        <ul role="list" className="flex flex-col">
          {items.map((news) => (
            <li key={news.title}>
              <NewsCard news={news} />
            </li>
          ))}
        </ul>
      )}
      <ArrowLink
        href="/about"
        className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group w-fit"
      >
        All news &amp; interviews
      </ArrowLink>
    </EditorialSection>
  );
}
