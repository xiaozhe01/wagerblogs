import Link from "next/link";
import MediaImage, { resolveMedia } from "@/components/cards/MediaImage";
import type { PostTeaser } from "@/lib/types";

// Inner padding only. A bordered row must not bleed past its container, or its
// border sits wider than the section heading above it.
const BLEED = {
  column: "px-2",
  card: "px-3",
} as const;

type PostRowProps = {
  post: PostTeaser;
  bleed?: keyof typeof BLEED;
};

const wrapperClassName =
  "flex flex-col md:flex-row md:items-center gap-3 md:gap-3.5 no-underline py-3 rounded-sm border border-border-input";
const titleClassName = "heading text-xl leading-snug mb-1.5 text-pretty";
const excerptClassName =
  "text-sm font-medium leading-relaxed text-text-muted text-pretty line-clamp-2 mb-2";
const metaListClassName =
  "flex flex-wrap items-center gap-2 text-xs font-medium text-text-muted tabular-nums";
const thumbnailClassName =
  "w-full md:w-56 lg:w-74 aspect-video shrink-0 rounded-md placeholder-asset text-2xs text-text-muted tabular-nums text-center";
// Measured: 275px at 390, 224px at md (w-56), 296px at lg (w-74).
const thumbnailSizes = "(min-width: 1024px) 296px, (min-width: 768px) 224px, 100vw";

export default function PostRow({ post, bleed = "column" }: PostRowProps) {
  const shell = `${wrapperClassName} ${BLEED[bleed]}`;
  const content = (
    <>
      {/* No heroImage on the record keeps the skeleton shape. */}
      {resolveMedia(post.thumbnail) ? (
        <div className="w-full md:w-56 lg:w-74 aspect-video shrink-0 rounded-md overflow-hidden relative">
          <MediaImage
            media={post.thumbnail}
            fill
            sizes={thumbnailSizes}
            className="object-cover"
          />
        </div>
      ) : (
        <div aria-hidden="true" className={thumbnailClassName}>
          [img]
        </div>
      )}
      <div className="flex-1 min-w-0">
        {post.kicker && <p className="meta-label-caps mb-1.5">{post.kicker}</p>}
        <h3 className={titleClassName}>{post.title}</h3>
        {post.excerpt && <p className={excerptClassName}>{post.excerpt}</p>}
        {/* TODO(cms): metaItems carry a real ISO date so it can render as <time dateTime>. */}
        {post.metaItems?.length ? (
          <ul role="list" className={metaListClassName}>
            {post.metaItems.map((item, i) => (
              <li key={item} className="flex items-center gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-border-divider">
                    |
                  </span>
                )}
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs font-medium text-text-muted tabular-nums">{post.meta}</p>
        )}
      </div>
    </>
  );

  // The Link owns the padded box, so the hover fill matches the clickable area.
  return (
    <article>
      <Link
        href={post.href}
        className={`${shell} transition-colors hover:bg-bg-subtle active:bg-bg-subtle-active`}
      >
        {content}
      </Link>
    </article>
  );
}
