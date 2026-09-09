import Link from "next/link";
import type { ReactNode } from "react";

// min-h-5 is 32px: --spacing-1..8 are named 4/8/16/24/32/40/48/60.
const rowClassName =
  "px-2 py-1.5 min-h-11 wide:min-h-5 flex items-center justify-between gap-2.5 rounded-sm text-sm font-medium leading-snug no-underline transition-colors hover:bg-bg-subtle active:bg-bg-subtle-active";
const rowRestClassName = "text-text-body";
const rowCurrentClassName = "text-brand font-bold";
const rowBleedClassName = "-mx-2";

type AnchorListItem = {
  href: string;
  label: ReactNode;
  key?: string | number;
  /** The row for the document/category being viewed. Bolds it and carries the
   * state to assistive tech. */
  current?: boolean;
};

type AnchorListProps = {
  items: AnchorListItem[];
  /** State/colour only — geometry belongs to the component. */
  itemClassName?: string | ((item: AnchorListItem, index: number) => string);
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
  wrapperClassName = "flex flex-col gap-2",
  title,
  cardClassName = "card",
}: AnchorListProps) {
  const content = items.map((item, i) => {
    const extra =
      (typeof itemClassName === "function" ? itemClassName(item, i) : itemClassName) ?? "";
    const state = item.current ? rowCurrentClassName : rowRestClassName;
    const key = item.key ?? i;
    return (
      <li key={key} className={rowBleedClassName}>
        {/* TOC rows are #fragments, region/filter rows are ?query links. Only
            the latter is a route change; a fragment needs a native <a> or a
            repeat click after scrolling away does nothing. */}
        {item.href.startsWith("#") ? (
          <a
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={`${rowClassName} ${state} ${extra}`.trim()}
          >
            {item.label}
          </a>
        ) : (
          <Link
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={`${rowClassName} ${state} ${extra}`.trim()}
          >
            {item.label}
          </Link>
        )}
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

  // Unnamed on purpose — see InfoCard: rail cards are not region landmarks.
  return (
    <section className={`${cardClassName}`}>
      <h2 className="heading text-sm mb-2.5">{title}</h2>
      {list}
    </section>
  );
}
