import BlogPostCard from "../cards/BlogPostCard";
import EditorialSection from "./EditorialSection";
import EmptyState from "./EmptyState";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";

export type ArticleTeaser = {
  slug: string;
  href: string;
  kicker?: string;
  title: string;
  excerpt?: string;
  byline?: string;
};

export default function BlogSection({ posts }: { posts: ArticleTeaser[] }) {
  return (
    <EditorialSection
      title="Latest articles"
      register="editorial"
      action={
        <ArrowLink href="/articles" className={`${sectionCtaClassName} w-fit shrink-0`}>
          All articles
        </ArrowLink>
      }
    >
      {posts.length === 0 ? (
        <EmptyState
          title="No articles published yet"
          body="An article appears here once it is published in the admin panel."
          action={{ href: "/articles", label: "All articles" }}
        />
      ) : (
        <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {posts.map((post) => (
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
      )}
    </EditorialSection>
  );
}
