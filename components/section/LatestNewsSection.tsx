import PostRow from "../cards/PostRow";
import { newsFeed } from "@/lib/mock-data";
import LatestNewsCategory from "../cards/LatestNewsCategory";
import ArrowLink from "@/components/ui/ArrowLink";
import EditorialSection from "./EditorialSection";
import { newsCategories } from "@/lib/site-data";
import { chipHref, resolveChip } from "@/lib/utils";

export const NEWS_PARAM = "news";
const ALL_CATEGORY = "All";
/** The id EditorialSection derives from the title, so choosing a category lands
 * on the feed rather than the top of the page. */

export default function LatestNewsSection({
  categoryParam,
}: {
  categoryParam?: string | string[];
}) {
  const category = resolveChip(newsCategories, categoryParam, ALL_CATEGORY);
  const items =
    category === ALL_CATEGORY ? newsFeed : newsFeed.filter((item) => item.category === category);

  return (
    <EditorialSection
      title="Latest news"
      register="comparison"
      toolbar={
        <LatestNewsCategory
          items={newsCategories.map((name) => ({
            label: name,
            key: name,
            href: chipHref({
              basePath: "/",
              param: NEWS_PARAM,
              value: name,
              allValue: ALL_CATEGORY,
            }),
            active: name === category,
          }))}
        />
      }
    >
      {/* Keyed so only the feed replays the fade. */}
      <div key={category} className="route-transition">
        {items.length === 0 ? (
          <p className="text-sm font-medium text-text-meta leading-relaxed">
            No stories filed under {category} yet.
          </p>
        ) : (
          <ul role="list" className="flex flex-col gap-3">
            {items.map((news) => (
              <li key={news.title}>
                {/* NewsItem maps onto PostTeaser — the news category becomes the
                    kicker, which is what the filter chips above filter on. */}
                <PostRow
                  post={{
                    kicker: news.category,
                    title: news.title,
                    meta: news.meta,
                    href: "/news",
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
      <ArrowLink
        href="/about"
        className="inline-flex items-center self-center gap-1 text-md text-text-primary font-semibold group w-fit"
      >
        All news &amp; interviews
      </ArrowLink>
    </EditorialSection>
  );
}
