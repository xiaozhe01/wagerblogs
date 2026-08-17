import Link from "next/link";
import type { NewsItem } from "@/lib/types";

type NewsCardProps = {
  news: NewsItem;
};

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <Link
      key={news.title}
      href="/news"
      className="flex gap-3.5 items-center py-4 border-b border-border-hairline no-underline last:border-0"
    >
      <div className="w-18 h-13.5 shrink-0 rounded-sm placeholder-asset text-2xs text-text-subtle font-mono">
        [img]
      </div>
      <div className="min-w-0">
        <div className="heading-serif text-lg leading-snug mb-1.5 text-pretty">{news.title}</div>
        <div className="text-xs text-text-subtle font-mono">{news.meta}</div>
      </div>
    </Link>
  );
}
