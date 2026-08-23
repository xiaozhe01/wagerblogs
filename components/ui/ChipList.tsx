import Link from "next/link";

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
};

// "Pill list, one item highlighted" pattern (category filters, region/doc
// nav). Each call site decides which item is active and supplies its own
// active/inactive className, since exact chip styling (rounded-full vs
// rounded-lg, cursor-pointer, etc.) varies per site. Doesn't own the
// surrounding wrapper (<nav> vs <div>) — callers keep that.
export default function ChipList({
  items,
  activeClassName,
  inactiveClassName,
  as = "div",
}: ChipListProps) {
  return (
    <>
      {items.map((item, i) => {
        const className = item.active ? activeClassName : inactiveClassName;
        const key = item.key ?? i;
        // .btn-primary/.btn-secondary own the hover treatment — no extra
        // opacity fade stacked on top.
        const chipClassName = `${className} min-h-0 py-1.5 px-3 text-xs`;
        if (as === "Link") {
          return (
            <Link key={key} href={item.href ?? "#"} className={chipClassName}>
              {item.label}
            </Link>
          );
        }
        if (as === "button") {
          return (
            <button key={key} type="button" className={chipClassName}>
              {item.label}
            </button>
          );
        }
        // Static display variant — same chrome, no interactivity. Use this
        // (not as="button") until a real handler exists: a focusable button
        // that does nothing is worse than a plain chip. cursor-default beats
        // .btn-*'s cursor:pointer; the hover/active shifts are scoped to
        // a/button in globals.css so a div never signals clickability.
        return (
          <div key={key} className={`${chipClassName} cursor-default`}>
            {item.label}
          </div>
        );
      })}
    </>
  );
}
