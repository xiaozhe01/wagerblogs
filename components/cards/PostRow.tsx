import Link from "next/link";
import type { PostTeaser } from "@/lib/types";

type PostRowProps = {
  post: PostTeaser;
  /** Non-interactive variant for rows with no destination (CMS records without an href). */
  as?: "Link" | "div";
};

const wrapperClassName = "flex gap-4 items-start py-4 border-b border-border-hairline no-underline";
const titleClassName = "heading text-xl leading-snug mb-1.5 text-pretty";
const thumbnailClassName =
  "w-24 sm:w-32 md:w-40 lg:w-56 aspect-[2/1] shrink-0 rounded-md placeholder-asset text-2xs text-text-subtle font-mono text-center";

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
        <p className="text-xs font-medium text-text-subtle font-mono">{post.meta}</p>
      </div>
    </>
  );

  if (as === "div") {
    return <article className={wrapperClassName}>{content}</article>;
  }

  return (
    <Link
      href={post.href ?? "#"}
      className={`${wrapperClassName} -mx-3 px-3 [li:last-child_&]:border-b-0 transition-colors hover:bg-bg-subtle`}
    >
      {content}
    </Link>
  );
}
