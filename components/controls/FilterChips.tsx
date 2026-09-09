import ChipLink from "@/components/controls/ChipLink";

export type FilterChip = {
  label: string;
  href: string;
  active: boolean;
  key: string;
};

// py-2, not py-1.5: min-h-0 drops .btn-*'s 44px floor, and 6px padding leaves
// the target 0.4px under WCAG 2.5.8's 24px minimum.
const CHIP = "min-h-0 py-2 px-3 text-xs leading-heading";

/** The filter row above a list: real links, so crawlers and no-JS visitors get
 * a normal navigation, with the active value carried in the URL. */
export default function FilterChips({ label, items }: { label: string; items: FilterChip[] }) {
  return (
    <nav aria-label={label}>
      <ul role="list" className="flex gap-2 flex-wrap">
        {items.map((item) => (
          <li key={item.key} className="flex">
            <ChipLink
              href={item.href}
              current={item.active}
              className={`btn-secondary${item.active ? " chip-active" : ""} ${CHIP}`}
            >
              {item.label}
            </ChipLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
