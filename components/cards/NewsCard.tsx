import Link from "next/link";
import type { NewsItem } from "@/lib/types";

type NewsCardProps = {
  news: NewsItem;
};

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <article>
      <Link
        href="/news"
        className="flex gap-3.5 items-center py-4 no-underline border-b border-border-hairline [li:last-child_&]:border-0 -mx-3 px-3  transition-colors hover:bg-bg-subtle hover:rounded-md"
      >
        <div
          aria-hidden="true"
          className="w-18 h-13.5 shrink-0 rounded-md placeholder-asset text-2xs text-text-subtle font-mono"
        >
          [img]
        </div>
        <div className="min-w-0">
          <h3 className="heading text-lg leading-snug mb-1.5 text-pretty">{news.title}</h3>
          {/* TODO(cms): split `meta` so the date can render as <time dateTime>. */}
          <p className="text-xs font-medium text-text-subtle font-mono">{news.meta}</p>
        </div>
      </Link>
    </article>
  );
}
