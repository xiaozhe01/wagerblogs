import type { Article } from "@/payload-types";
import type { PostTeaser } from "@/lib/types";
import { readTime } from "@/lib/lexical";
import { formatDate } from "@/lib/utils";

/** Feed-row shape for one article. The type enum doubles as the kicker. Read
 * time is derived from the body — no record stores one. */
export function articleRow(article: Article): PostTeaser {
  const typeLabel = article.type.charAt(0).toUpperCase() + article.type.slice(1);
  const author = typeof article.author === "object" ? article.author?.name : undefined;
  const published = article.publishedAt ? formatDate(article.publishedAt) : undefined;
  const minutes = readTime(article.body);
  return {
    kicker: typeLabel,
    title: article.title,
    excerpt: article.excerpt,
    meta: [typeLabel, published, minutes].filter(Boolean).join(" · "),
    metaItems: [minutes, published, author ? `by ${author}` : undefined].filter(
      (part): part is string => Boolean(part),
    ),
    href: `/articles/${article.slug}`,
    thumbnail: article.heroImage,
  };
}
