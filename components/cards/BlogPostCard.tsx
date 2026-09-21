import Link from "next/link";
import MediaImage, { resolveMedia, type MediaRef } from "@/components/cards/MediaImage";

type BlogPostCardProps = {
  href: string;
  title: string;
  kicker?: string;
  excerpt?: string;
  byline?: string;
  thumbnail?: MediaRef;
};

// Measured: 325px at 390, and at md+ 367px in the two-column feed / 296px in
// the homepage's three-column grid. Both land on the same 384px source step,
// so one value covers every grid this card sits in.
const thumbnailSizes = "(min-width: 768px) 384px, 100vw";

export default function BlogPostCard({
  href,
  title,
  kicker,
  excerpt,
  byline,
  thumbnail,
}: BlogPostCardProps) {
  return (
    // flex/h-full/grow keep the card matching its grid row's height.
    <article className="flex h-full">
      <Link
        href={href}
        className="block grow no-underline px-2 py-2 border rounded-sm transition-colors hover:bg-bg-subtle active:bg-bg-subtle-active"
      >
        {/* No heroImage on the record keeps the skeleton shape. */}
        {resolveMedia(thumbnail) ? (
          <div className="aspect-video w-full rounded-md overflow-hidden relative mb-3">
            <MediaImage media={thumbnail} fill sizes={thumbnailSizes} className="object-cover" />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="aspect-video w-full rounded-md placeholder-asset text-2xs text-text-muted tabular-nums flex items-center justify-center mb-3"
          >
            [image]
          </div>
        )}
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
