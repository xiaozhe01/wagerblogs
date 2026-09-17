import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/schema";
import { newsSections } from "@/lib/news";
import { reviewGroups } from "@/lib/reviews";
import { categories } from "@/lib/categories";
import { blogPosts } from "@/lib/blog";
import { legalDocs, mockAuthor } from "@/lib/mock-data";

// Built from the registries generateStaticParams resolves from, so it cannot
// list a URL the router would 404. Excludes /login (a stub that 404s).
// TODO(cms): lastModified is build time until records carry a real updatedAt —
// do not put it on a schedule, Google ignores lastmod it judges unreliable.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${siteUrl}${path}`;

  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/news", priority: 0.9 },
    { path: "/reviews", priority: 0.9 },
    { path: "/articles", priority: 0.8 },
    { path: "/categories", priority: 0.8 },
    { path: "/about", priority: 0.6 },
    { path: "/faq", priority: 0.6 },
    { path: "/contact", priority: 0.5 },
    { path: "/responsible-gambling", priority: 0.6 },
    { path: "/responsible-gambling/help-directory", priority: 0.5 },
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: url(path),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...newsSections.flatMap((section) => [
      {
        url: url(section.href),
        lastModified: now,
        changeFrequency: "daily" as const,
        priority: 0.7,
      },
      ...section.stories.map((story) => ({
        url: url(story.href),
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ]),
    ...reviewGroups.flatMap((group) => [
      {
        url: url(group.href),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      ...group.operators.map((operator) => ({
        url: url(`${group.href}/${operator.slug}`),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ]),
    ...categories.map((category) => ({
      url: url(category.href),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: url(post.href),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...Object.keys(legalDocs).map((slug) => ({
      url: url(`/legal/${slug}`),
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    {
      url: url(`/authors/${mockAuthor.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    },
  ];
}
