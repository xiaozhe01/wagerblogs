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
    // flex/h-full/grow keep the card matching its grid row's height.
    <article className="flex h-full">
      <Link
        href={href}
        className="block grow no-underline px-2 py-2 border rounded-sm transition-colors hover:bg-bg-subtle active:bg-bg-subtle-active"
      >
        <div
          aria-hidden="true"
          className="aspect-video w-full rounded-md placeholder-asset text-2xs text-text-muted tabular-nums flex items-center justify-center mb-3"
        >
          [image]
        </div>
        {kicker && <p className="meta-label-caps mb-1.5">{kicker}</p>}
        <h3 className="heading text-2xl leading-snug mb-2 text-pretty">{title}</h3>
        {excerpt && (
          <p className="text-md font-medium text-text-muted leading-loose mb-2">{excerpt}</p>
        )}
        {byline && <p className="text-xs font-medium text-text-muted tabular-nums">{byline}</p>}
      </Link>
    </article>
  );
}
