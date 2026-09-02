import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import BlogPostCard from "@/components/cards/BlogPostCard";
import AnchorList from "@/components/rail/AnchorList";
import InfoCard from "@/components/rail/InfoCard";
import SearchInput from "@/components/rail/SearchInput";
import EditorialSection from "@/components/section/EditorialSection";
import RecentPublishedSection from "@/components/section/RecentPublishedSection";
import { blogPosts, blogMoreInGuides } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Blog — WagerBlogs",
  description: "Guides, strategy, and research on sports betting and casino play.",
};

// TODO(cms): replace blogPosts with the CMS post list, paginated. Individual
// posts live at /blog/[slug]; every card here links at the same placeholder.
export default function BlogIndexPage() {
  const rail = (
    <>
      <SearchInput placeholder="Search the blog..." />
      <AnchorList
        title="Browse by topic"
        cardClassName="card"
        items={blogMoreInGuides.map((m) => ({ href: "/blog", label: m, key: m }))}
      />
      <InfoCard
        title="Editorial standards"
        body="How we research, source, and correct what we publish."
        cta={{ href: "/about", label: "Read our methodology" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="blog" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — pure authority, no outbound operator links */}
      <Breadcrumbs items={[{ label: "Blog" }]} />

      <header className="flex flex-col gap-3">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Blog
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — guides, strategy, and research written to stand on their own,
          with no operator recommendations anywhere in this section.]
        </p>
      </header>

      <EditorialSection title="All posts" register="editorial">
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {blogPosts.map((p) => (
            <li key={p.title}>
              <BlogPostCard
                href="/blog/sample-post"
                title={p.title}
                excerpt={p.excerpt}
                byline={p.byline}
              />
            </li>
          ))}
        </ul>
      </EditorialSection>

      <RecentPublishedSection register="editorial" />
    </PageShell>
  );
}
