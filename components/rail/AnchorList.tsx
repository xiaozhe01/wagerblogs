import Link from "next/link";
import type { ReactNode } from "react";
import { headingId } from "@/lib/utils";

// Every anchor is the only child of its <li>, so `last:` would match all of them.
// Row styling that should apply to the final row only must be scoped through the
// <li> instead — call sites use `[li:last-child_&]:border-b-0` for the same reason.
const rowHoverClassName =
  "-mx-3 px-3 transition-colors hover:bg-bg-subtle [li:last-child>&]:hover:rounded-b-md";

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
      <li key={key}>
        <Link href={item.href} className={`${className} ${rowHoverClassName}`}>
          {item.label}
        </Link>
      </li>
    );
  });

  const list = (
    <ul role="list" className={wrapperClassName}>
      {content}
    </ul>
  );

  if (title === undefined) {
    return list;
  }

  const titleId = headingId("rail", title);

  return (
    <section className={`${cardClassName}`} aria-labelledby={titleId}>
      <h2 id={titleId} className="font-bold text-sm text-text-primary mb-2.5">
        {title}
      </h2>
      {list}
    </section>
  );
}
