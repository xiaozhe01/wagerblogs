import { Fragment } from "react";
import Link from "next/link";
import ChipLink from "@/components/ui/ChipLink";

type ChipListItem = {
  label: string;
  active: boolean;
  href?: string;
  key?: string | number;
};

type ChipListProps = {
  items: ChipListItem[];
  activeClassName: string;
  inactiveClassName: string;
  as?: "div" | "button" | "Link";
  inList?: boolean;
  filter?: boolean;
  scroll?: boolean;
};

// "Pill list, one item highlighted" pattern (category filters, region/doc
// nav). Each call site decides which item is active and supplies its own
// active/inactive className, since exact chip styling (rounded-full vs
// rounded-lg, cursor-pointer, etc.) varies per site. Doesn't own the
// surrounding wrapper (<ul> vs <nav>) — callers keep that. Only wrap in <nav>
// where the chips are real links (as="Link", e.g. legal/[doc]); the static
// as="div" chips are not navigation, so <ul role="list"> is the ceiling until
// filtering is wired.
export default function ChipList({
  items,
  activeClassName,
  inactiveClassName,
  as = "div",
  inList = false,
  filter = false,
}: ChipListProps) {
  return (
    <>
      {items.map((item, i) => {
        const className = item.active ? activeClassName : inactiveClassName;
        const key = item.key ?? i;
        const chipClassName = `${className} min-h-0 py-1.5 px-3 text-xs leading-heading`;
        let chip;
        if (as === "Link") {
          chip = filter ? (
            <ChipLink href={item.href ?? "#"} className={chipClassName}>
              {item.label}
            </ChipLink>
          ) : (
            <Link href={item.href ?? "#"} className={chipClassName}>
              {item.label}
            </Link>
          );
        } else if (as === "button") {
          chip = (
            <button type="button" className={chipClassName}>
              {item.label}
            </button>
          );
        } else {
          // Static display variant — same chrome, no interactivity. Use this
          // (not as="button") until a real handler exists: a focusable button
          // that does nothing is worse than a plain chip. cursor-default beats
          // .btn-*'s cursor:pointer; the hover/active shifts are scoped to
          // a/button in globals.css so a static chip never signals clickability.
          chip = <span className={`${chipClassName} cursor-default`}>{item.label}</span>;
        }
        return inList ? (
          <li key={key} className="flex">
            {chip}
          </li>
        ) : (
          <Fragment key={key}>{chip}</Fragment>
        );
      })}
    </>
  );
}
