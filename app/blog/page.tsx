import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import BlogPostCard from "@/components/cards/BlogPostCard";
import InfoCard from "@/components/rail/InfoCard";
import SearchInput from "@/components/rail/SearchInput";
import EditorialSection from "@/components/section/EditorialSection";
import RecentPublishedSection from "@/components/section/RecentPublishedSection";
import { blogPosts } from "@/lib/blog";
import { PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import { headingId } from "@/lib/utils";
import PageNav from "@/components/controls/PageNav";

export const metadata: Metadata = {
  title: "Blog — WagerBlogs",
  description: "Guides, strategy, and research on sports betting and casino play.",
  alternates: { canonical: "/blog" },
};

// TODO(cms): replace lib/blog.ts with the CMS post list, paginated.
export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const postPage = paginate(blogPosts, query[PAGE_PARAM]);
  const rail = (
    <>
      <SearchInput placeholder="Search the blog..." />
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

      <header className="flex flex-col gap-3 max-w-header">
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
          {postPage.items.map((post) => (
            <li key={post.slug}>
              <BlogPostCard
                href={post.href}
                kicker={post.kicker}
                title={post.title}
                excerpt={post.excerpt}
                byline={post.byline}
              />
            </li>
          ))}
        </ul>
        <PageNav
          page={postPage.page}
          totalPages={postPage.totalPages}
          label="All posts"
          hrefFor={(n) =>
            pageHref({
              basePath: "/blog",
              page: n,
              anchor: headingId("section", "All posts"),
            })
          }
        />
      </EditorialSection>

      <RecentPublishedSection register="editorial" />
    </PageShell>
  );
}
