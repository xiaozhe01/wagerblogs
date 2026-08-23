import Link from "next/link";
import type { PostTeaser } from "@/lib/types";

type TeaserCardGridProps = {
  items: PostTeaser[];
  titleClassName: string;
  gridClassName?: string;
};

const defaultGridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3";

export default function TeaserCardGrid({
  items,
  titleClassName,
  gridClassName = defaultGridClassName,
}: TeaserCardGridProps) {
  return (
    <div className={gridClassName}>
      {items.map((item) => (
        <Link
          key={item.title}
          href={item.href ?? "#"}
          className="card block transition-colors hover:bg-bg-subtle"
        >
          <div className="meta-label-caps mb-1.5">{item.kicker}</div>
          <div className={titleClassName}>{item.title}</div>
          <div className="text-xs text-text-meta leading-relaxed">{item.meta}</div>
        </Link>
      ))}
    </div>
  );
}
