import { mockAuthor } from "@/lib/mock-data";

export type BlogPost = {
  slug: string;
  href: string;
  kicker: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  readTime: string;
  /** One-line byline for index cards. */
  byline: string;
};

// One record per post, keyed by the slug the route resolves. The index cards,
// the post page, its metadata and its breadcrumb all read from here.
// TODO(cms): swap for the CMS post collection; author comes from the Person record.
export const blogPosts: BlogPost[] = [
  {
    slug: "how-odds-boosts-actually-work",
    href: "/articles/how-odds-boosts-actually-work",
    kicker: "Guides",
    title: "[Placeholder] How odds boosts actually work — and when they're worth it",
    excerpt: "A plain-language breakdown of boosted-odds promos and the math behind them.",
    publishedAt: "[Jul 18, 2026]",
    updatedAt: "[Jul 24, 2026]",
    readTime: "9 min read",
    byline: "by [author] · 07/18/2026",
  },
  {
    slug: "bankroll-management-101",
    href: "/articles/bankroll-management-101",
    kicker: "Guides",
    title: "[Placeholder] Bankroll management 101",
    excerpt: "Simple rules for staking that keep betting sustainable.",
    publishedAt: "[Jul 12, 2026]",
    updatedAt: "[Jul 12, 2026]",
    readTime: "7 min read",
    byline: "by [author] · 07/12/2026",
  },
  {
    slug: "parlays-vs-straight-bets",
    href: "/articles/parlays-vs-straight-bets",
    kicker: "Analysis",
    title: "[Placeholder] Parlays vs straight bets",
    excerpt: "When each bet type makes sense, and what the math says about the trade.",
    publishedAt: "[Jul 05, 2026]",
    updatedAt: "[Jul 05, 2026]",
    readTime: "6 min read",
    byline: "by [author] · 07/05/2026",
  },
];

export const blogAuthor = {
  name: mockAuthor.name,
  credential: mockAuthor.credentialLine,
  profileHref: `/authors/${mockAuthor.slug}`,
};

export function findBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export const blogParams = blogPosts.map((post) => ({ slug: post.slug }));
