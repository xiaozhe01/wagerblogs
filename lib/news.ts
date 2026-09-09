import { newsFeed } from "@/lib/mock-data";
import { newsCategories } from "@/lib/site-data";
import type { NewsItem, PostTeaser } from "@/lib/types";
import { chipMatches, chipSlug, resolveChip } from "@/lib/utils";

export type NewsStory = NewsItem & {
  slug: string;
  href: string;
};

/** Tile line for a section: how much is filed, and how recently. */
export function sectionSummary(section: NewsSection) {
  const count = section.stories.length;
  if (count === 0) return "No stories filed yet";
  return `${count} ${count === 1 ? "story" : "stories"} · latest ${section.stories[0].publishedAt}`;
}

/** Feed-row shape for one story. `kicker` only where the heading above the row
 * doesn't already name the section. */
export function storyRow(story: NewsStory, options: { kicker?: string } = {}): PostTeaser {
  return {
    kicker: options.kicker,
    title: story.title,
    excerpt: story.excerpt,
    meta: story.meta,
    // TODO(cms): a real Person record replaces the bracketed byline.
    metaItems: [story.readTime, story.publishedAt, "by [author]"],
    href: story.href,
  };
}

export type NewsSection = {
  category: string;
  slug: string;
  href: string;
  stories: NewsStory[];
};

const ALL_CATEGORIES = newsCategories[0];

/** How many stories the home-page teaser feed shows. */
export const HOME_TEASER_COUNT = 4;

// The news taxonomy is routed, not query-filtered: /news/<section> and
// /news/<section>/<story>.
// TODO(cms): swap newsFeed for the CMS news collection and take the story slug
// from its own field rather than deriving it from the headline.
export const newsSections: NewsSection[] = newsCategories
  .filter((category) => category !== ALL_CATEGORIES)
  .map((category) => {
    const slug = chipSlug(category);
    return {
      category,
      slug,
      href: `/news/${slug}`,
      stories: newsFeed
        .filter((story) => chipMatches(story.category, category))
        .map((story) => ({
          ...story,
          slug: chipSlug(story.title),
          href: `/news/${slug}/${chipSlug(story.title)}`,
        })),
    };
  });

/** The home feed and the rail's "More headlines" are complements, derived
 * together so they cannot disagree — computed apart, only the feed applied the
 * chip filter, and both printed the same story. */
export function homeNewsSplit(categoryParam?: string | string[]) {
  const category = resolveChip(newsCategories, categoryParam, ALL_CATEGORIES);
  const all = newsSections.flatMap((section) => section.stories);
  const shown = (
    category === ALL_CATEGORIES ? all : all.filter((story) => story.category === category)
  ).slice(0, HOME_TEASER_COUNT);
  return { category, shown, rest: all.filter((story) => !shown.includes(story)) };
}

export function findNewsSection(slug: string) {
  return newsSections.find((section) => section.slug === chipSlug(slug));
}

export function findNewsStory(sectionSlug: string, storySlug: string) {
  const section = findNewsSection(sectionSlug);
  if (!section) return undefined;
  const story = section.stories.find((s) => s.slug === chipSlug(storySlug));
  return story ? { section, story } : undefined;
}
