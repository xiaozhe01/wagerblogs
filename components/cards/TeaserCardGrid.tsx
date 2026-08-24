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
    <ul role="list" className={gridClassName}>
      {items.map((item) => (
        <li key={item.title} className="flex">
          <article className="flex grow">
            <Link
              href={item.href ?? "#"}
              className="card block grow transition-colors hover:bg-bg-subtle"
            >
              <p className="meta-label-caps mb-1.5">{item.kicker}</p>
              <h3 className={titleClassName}>{item.title}</h3>
              <p className="text-xs text-text-meta leading-relaxed">{item.meta}</p>
            </Link>
          </article>
        </li>
      ))}
    </ul>
  );
}
