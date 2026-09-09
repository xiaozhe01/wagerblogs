import PostRow from "../cards/PostRow";
import { homeNewsSplit, storyRow } from "@/lib/news";
import FilterChips from "@/components/controls/FilterChips";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import EditorialSection from "./EditorialSection";
import EmptyState from "./EmptyState";
import { newsCategories } from "@/lib/site-data";
import { chipHref } from "@/lib/utils";

export const NEWS_PARAM = "news";
const ALL_CATEGORY = "All";

export default function LatestNewsSection({
  categoryParam,
}: {
  categoryParam?: string | string[];
}) {
  // Same records the /news sections render, so a row here links to the story
  // itself rather than back to the index. The split is shared with the rail's
  // "More headlines" so the two cannot show the same story twice.
  // TODO(cms): the newest few, once the feed is ordered and paginated server-side.
  const { category, shown: items } = homeNewsSplit(categoryParam);

  return (
    <EditorialSection
      title="Latest news"
      register="editorial"
      action={
        <ArrowLink href="/news" className={`${sectionCtaClassName} w-fit shrink-0`}>
          All news &amp; interviews
        </ArrowLink>
      }
      toolbar={
        <FilterChips
          label="News categories"
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
          <EmptyState
            title={`No stories filed under ${category} yet`}
            action={{
              href: chipHref({
                basePath: "/",
                param: NEWS_PARAM,
                value: ALL_CATEGORY,
                allValue: ALL_CATEGORY,
              }),
              label: "Show all stories",
            }}
          />
        ) : (
          <ul role="list" className="flex flex-col gap-3">
            {items.map((news) => (
              <li key={news.slug}>
                {/* The category becomes the kicker, which is what the filter
                    chips above filter on. */}
                <PostRow post={storyRow(news, { kicker: news.category })} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </EditorialSection>
  );
}
