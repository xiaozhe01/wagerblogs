import PostRow from "@/components/cards/PostRow";
import EditorialSection from "./EditorialSection";
import { newsSections, storyRow } from "@/scripts/fixtures/news";

/** The newest story from each section, kickered so the sport is legible when
 * the rows are read out of their own section. */
export default function LatestStoriesSection({
  title,
  titleHref = "/news",
  /** Section to leave out — the one the reader is already in. */
  exclude,
  limit = 3,
}: {
  title: string;
  titleHref?: string;
  exclude?: string;
  limit?: number;
}) {
  const stories = newsSections
    .filter((section) => section.slug !== exclude)
    .flatMap((section) => section.stories.slice(0, 1))
    .slice(0, limit);

  if (stories.length === 0) return null;

  return (
    <EditorialSection title={title} titleHref={titleHref} register="editorial">
      <ul role="list" className="flex flex-col gap-3">
        {stories.map((story) => (
          <li key={story.href}>
            <PostRow post={storyRow(story, { kicker: story.category })} />
          </li>
        ))}
      </ul>
    </EditorialSection>
  );
}
