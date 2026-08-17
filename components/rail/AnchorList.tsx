import Link from "next/link";
import type { ReactNode } from "react";

type AnchorListItem = {
  href: string;
  label: ReactNode;
  key?: string | number;
};

type AnchorListProps = {
  items: AnchorListItem[];
  itemClassName: string | ((item: AnchorListItem, index: number) => string);
  as?: "a" | "Link";
  wrapperClassName?: string;
  /** When set, AnchorList owns its own `<div className="card">` + title
   * header, matching sibling rail cards like AtAGlanceCard/OtherBooksCard
   * instead of leaving the card+title hand-typed around each call site. */
  title?: string;
  cardClassName?: string;
};

// Vertical link-list pattern repeated as TOC/"jump to" cards, plain nav-link
// lists, and active-state category/doc lists. `itemClassName` is a full
// pass-through (string or per-item function for active-state variants) so
// each call site's exact existing styling carries over unchanged; `as`
// preserves same-page `<a href="#...">` vs client-routed `<Link>` behavior.
export default function AnchorList({
  items,
  itemClassName,
  as = "a",
  wrapperClassName,
  title,
  cardClassName = "card",
}: AnchorListProps) {
  const content = items.map((item, i) => {
    const className = typeof itemClassName === "function" ? itemClassName(item, i) : itemClassName;
    const key = item.key ?? i;
    return as === "Link" ? (
      <Link key={key} href={item.href} className={className}>
        {item.label}
      </Link>
    ) : (
      <a key={key} href={item.href} className={className}>
        {item.label}
      </a>
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
    <div className={cardClassName}>
      <div className="font-bold text-sm text-text-primary mb-2.5">{title}</div>
      {list}
    </div>
  );
}
