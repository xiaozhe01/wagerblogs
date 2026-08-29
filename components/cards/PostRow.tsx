import Link from "next/link";
import type { PostTeaser } from "@/lib/types";

type PostRowProps = {
  post: PostTeaser;
  /** Non-interactive variant for rows with no destination (CMS records without an href). */
  as?: "Link" | "div";
};

const wrapperClassName = "flex flex-col md:flex-row md:items-center gap-3 md:gap-3.5 no-underline";
const titleClassName = "heading text-xl leading-snug mb-1.5 text-pretty";
const thumbnailClassName =
  "w-full md:w-56 lg:w-74 aspect-video shrink-0 rounded-md placeholder-asset text-2xs text-text-subtle tabular-nums text-center";

export default function PostRow({ post, as = "Link" }: PostRowProps) {
  const content = (
    <>
      <div aria-hidden="true" className={thumbnailClassName}>
        [img]
      </div>
      <div className="flex-1 min-w-0">
        <p className="meta-label-caps mb-1.5">{post.kicker}</p>
        <h3 className={titleClassName}>{post.title}</h3>
        {/* TODO(cms): split `meta` into a real date + readTime so the date can render as <time dateTime>. */}
        <p className="text-xs font-medium text-text-subtle tabular-nums">{post.meta}</p>
      </div>
    </>
  );

  if (as === "div") {
    return <article className={`card ${wrapperClassName}`}>{content}</article>;
  }

  // The Link is the card, so the hover fill matches the clickable area.
  return (
    <article>
      <Link
        href={post.href ?? "#"}
        className={`card ${wrapperClassName} transition-colors hover:bg-bg-subtle`}
      >
        {content}
      </Link>
    </article>
  );
}
