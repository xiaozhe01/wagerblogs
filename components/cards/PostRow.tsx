import Link from "next/link";
import type { PostTeaser } from "@/lib/types";

type PostRowProps = {
  post: PostTeaser;
  as?: "Link" | "div";
  wrapperClassName: string;
  titleClassName: string;
  thumbnailClassName: string;
  itemKey?: string | number;
};

// "Post row" pattern (thumbnail + kicker/title/meta) repeated across
// recent-posts/author-articles/category-articles lists. Every className is
// a required pass-through since call sites differ (py-4 vs py-4.5, text-xl
// vs text-2xl, Link vs non-interactive div) — this only removes the
// repeated JSX shape, not the per-site styling.
export default function PostRow({
  post,
  as = "Link",
  wrapperClassName,
  titleClassName,
  thumbnailClassName,
}: PostRowProps) {
  const content = (
    <>
      <div className="min-w-0">
        <div className="meta-label-caps mb-1.5">{post.kicker}</div>
        <div className={titleClassName}>{post.title}</div>
        <div className="text-xs text-text-subtle font-mono">{post.meta}</div>
      </div>
      <div className={thumbnailClassName}>[img]</div>
    </>
  );

  if (as === "div") {
    return <div className={wrapperClassName}>{content}</div>;
  }

  return (
    <Link href={post.href ?? "#"} className={wrapperClassName}>
      {content}
    </Link>
  );
}
