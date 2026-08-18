import Link from "next/link";
import type { PostTeaser } from "@/lib/types";

type TeaserCardGridProps = {
  items: PostTeaser[];
  titleClassName: string;
  gridClassName?: string;
};

const defaultGridClassName = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3";

// "Compare further" / related-card grid duplicated across both reviews
// templates and the category page. `titleClassName` stays a required prop
// since the two reviews templates use text-sm/font-bold while categories
// uses text-md/font-semibold.
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
