import BlogPostCard from "../cards/BlogPostCard";
import EditorialSection from "./EditorialSection";
import { blogPosts } from "@/lib/blog";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";

export default function BlogSection() {
  return (
    <EditorialSection
      title="From the blog"
      register="editorial"
      action={
        <ArrowLink href="/blog" className={`${sectionCtaClassName} w-fit shrink-0`}>
          All blogs
        </ArrowLink>
      }
    >
      <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {blogPosts.map((post) => (
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
    </EditorialSection>
  );
}
