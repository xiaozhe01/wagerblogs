import PostRow from "../cards/PostRow";
import FilterChips from "@/components/controls/FilterChips";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import EditorialSection from "./EditorialSection";
import EmptyState from "./EmptyState";
import { chipHref } from "@/lib/utils";
import type { PostTeaser } from "@/lib/types";

export const NEWS_PARAM = "news";
/** Chip value for "no filter". Section chips carry the news-sections slug, so
 * the chip, the URL and the stored value are one string. */
export const ALL_NEWS = "all";

export default function LatestNewsSection({
  sections,
  stories,
  activeSection,
}: {
  sections: { slug: string; name: string }[];
  stories: PostTeaser[];
  activeSection: string;
}) {
  const sectionHref = (value: string) =>
    chipHref({ basePath: "/", param: NEWS_PARAM, value, allValue: ALL_NEWS });
  const activeName =
    sections.find((section) => section.slug === activeSection)?.name ?? "this section";

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
          items={[{ slug: ALL_NEWS, name: "All" }, ...sections].map((section) => ({
            label: section.name,
            key: section.slug,
            href: sectionHref(section.slug),
            active: section.slug === activeSection,
          }))}
        />
      }
    >
      {/* Keyed so only the feed replays the fade. */}
      <div key={activeSection} className="route-transition">
        {stories.length === 0 ? (
          <EmptyState
            title={`No stories filed under ${activeName} yet`}
            action={{ href: sectionHref(ALL_NEWS), label: "Show all stories" }}
          />
        ) : (
          <ul role="list" className="flex flex-col gap-3">
            {stories.map((story) => (
              <li key={story.href}>
                <PostRow post={story} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </EditorialSection>
  );
}
