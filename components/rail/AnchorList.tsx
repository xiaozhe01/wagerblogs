import Link from "next/link";
import type { ReactNode } from "react";

const rowHoverClassName = "-mx-3 px-3 transition-colors hover:bg-bg-subtle";

type AnchorListItem = {
  href: string;
  label: ReactNode;
  key?: string | number;
};

type AnchorListProps = {
  items: AnchorListItem[];
  itemClassName: string | ((item: AnchorListItem, index: number) => string);
  wrapperClassName?: string;
  /** When set, AnchorList owns its own `<div className="card">` + title
   * header, matching sibling rail cards like AtAGlanceCard/OtherBooksCard
   * instead of leaving the card+title hand-typed around each call site. */
  title?: string;
  cardClassName?: string;
};

export default function AnchorList({
  items,
  itemClassName,
  wrapperClassName,
  title,
  cardClassName = "card",
}: AnchorListProps) {
  const content = items.map((item, i) => {
    const className = typeof itemClassName === "function" ? itemClassName(item, i) : itemClassName;
    const key = item.key ?? i;
    return (
      <Link key={key} href={item.href} className={`${className} ${rowHoverClassName}`}>
        {item.label}
      </Link>
    );
  });

  const list =
    wrapperClassName !== undefined ? (
      <div className={wrapperClassName}>{content}</div>
    ) : (
      <>{content}</>
    );

  if (title === undefined) {
    return list;
  }

  return (
    <div className={`${cardClassName}`}>
      <div className="font-bold text-sm text-text-primary mb-2.5">{title}</div>
      {list}
    </div>
  );
}
