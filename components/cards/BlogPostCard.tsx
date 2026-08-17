import { blogPosts } from "@/lib/mock-data";
import Link from "next/link";

export default function BlogPostCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3">
      {blogPosts.map((p) => (
        <Link key={p.title} href="/blog/sample-post" className="block no-underline">
          <div className="h-30 rounded-md placeholder-asset text-xs text-text-subtle font-mono mb-3">
            [image]
          </div>
          <div className="heading-serif text-2xl leading-snug mb-2 text-pretty">{p.title}</div>
          <div className="text-sm text-text-meta leading-loose mb-2">{p.excerpt}</div>
          <div className="text-xs text-text-subtle font-mono">{p.byline}</div>
        </Link>
      ))}
    </div>
  );
}
