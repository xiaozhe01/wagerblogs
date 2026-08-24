import Link from "next/link";

type BlogPostCardProps = {
  href: string;
  title: string;
  kicker?: string;
  excerpt?: string;
  byline?: string;
};

export default function BlogPostCard({ href, title, kicker, excerpt, byline }: BlogPostCardProps) {
  return (
    // flex/h-full/grow are load-bearing: <article> is the grid item now, so without
    // them the card collapses to content height and stops matching its row.
    <article className="flex h-full">
      <Link
        href={href}
        className="card block grow no-underline transition-colors hover:bg-bg-subtle"
      >
        <div
          aria-hidden="true"
          className="h-30 rounded-md placeholder-asset text-2xs text-text-subtle font-mono mb-3"
        >
          [image]
        </div>
        {kicker && <p className="meta-label-caps mb-1.5">{kicker}</p>}
        <h3 className="heading text-2xl leading-snug mb-2 text-pretty">{title}</h3>
        {excerpt && (
          <p className="text-md font-medium text-text-meta leading-loose mb-2">{excerpt}</p>
        )}
        {byline && <p className="text-xs font-medium text-text-subtle font-mono">{byline}</p>}
      </Link>
    </article>
  );
}
