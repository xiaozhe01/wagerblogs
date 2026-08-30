import BlogPostCard from "../cards/BlogPostCard";
import EditorialSection from "./EditorialSection";
import { blogPosts } from "@/lib/mock-data";
import ArrowLink from "../ui/ArrowLink";

export default function BlogSection() {
  return (
    <EditorialSection title="From the blog" register="comparison">
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
      <ArrowLink
        href="/blog"
        className="inline-flex items-center self-center gap-1 text-md text-text-primary font-semibold group w-fit"
      >
        All blogs
      </ArrowLink>
    </EditorialSection>
  );
}
