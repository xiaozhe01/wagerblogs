import type { News } from "@/payload-types";
import type { PostTeaser } from "@/lib/types";
import { readTime } from "@/lib/lexical";
import { formatDate } from "@/lib/utils";

/** Feed-row shape for one story. `kicker` only where the heading above the row
 * doesn't already name the section. Read time is derived from the body — no
 * record stores one. */
export function storyRow(
  story: News,
  sectionSlug: string,
  options: { kicker?: string } = {},
): PostTeaser {
  const author = typeof story.author === "object" ? story.author?.name : undefined;
  const published = story.publishedAt ? formatDate(story.publishedAt) : undefined;
  const minutes = readTime(story.body);
  return {
    kicker: options.kicker,
    title: story.title,
    excerpt: story.excerpt,
    meta: [options.kicker, published, minutes].filter(Boolean).join(" · "),
    metaItems: [minutes, published, author ? `by ${author}` : undefined].filter(
      (part): part is string => Boolean(part),
    ),
    href: `/news/${sectionSlug}/${story.slug}`,
  };
}
