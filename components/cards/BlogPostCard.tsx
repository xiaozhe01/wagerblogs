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
    <Link href={href} className="card block no-underline transition-colors hover:bg-bg-subtle">
      <div className="h-30 rounded-md placeholder-asset text-2xs text-text-subtle font-mono mb-3">
        [image]
      </div>
      {kicker && <div className="meta-label-caps mb-1.5">{kicker}</div>}
      <div className="heading text-2xl leading-snug mb-2 text-pretty">{title}</div>
      {excerpt && (
        <div className="text-md font-medium text-text-meta leading-loose mb-2">{excerpt}</div>
      )}
      {byline && <div className="text-xs font-medium text-text-subtle font-mono">{byline}</div>}
    </Link>
  );
}
