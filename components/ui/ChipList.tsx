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
        if (as === "Link") {
          return (
            <Link
              key={key}
              href={item.href ?? "#"}
              className={`${className} min-h-0 py-1.5 px-3 text-xs transition-opacity hover:opacity-80`}
            >
              {item.label}
            </Link>
          );
        }
        if (as === "button") {
          return (
            <button
              key={key}
              type="button"
              className={`${className} min-h-0 py-1.5 px-3 text-xs transition-opacity hover:opacity-80`}
            >
              {item.label}
            </button>
          );
        }
        return (
          <div key={key} className={className}>
            {item.label}
          </div>
        );
      })}
    </>
  );
}
