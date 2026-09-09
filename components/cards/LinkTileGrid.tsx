import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TeaserCardBody from "@/components/cards/TeaserCardBody";

export type LinkTile = {
  href: string;
  title: string;
  desc: string;
  key?: string;
  /** The tile for the page being viewed. */
  current?: boolean;
};

const COLUMNS = {
  two: "md:grid-cols-2",
  three: "md:grid-cols-2 lg:grid-cols-3",
} as const;

export default function LinkTileGrid({
  items,
  columns = "three",
}: {
  items: LinkTile[];
  columns?: keyof typeof COLUMNS;
}) {
  return (
    <ul role="list" className={`grid grid-cols-1 ${COLUMNS[columns]} gap-legacy-4 md:gap-3`}>
      {items.map((item) => (
        <li key={item.key ?? item.title}>
          {/* One column of these read as a single ruled list, so on a phone each
              one is a navigation row with its own affordance; from md: they are
              tiles again. */}
          <Link
            href={item.href}
            aria-current={item.current ? "page" : undefined}
            className={`editorial-link-card min-h-11 lg:min-h-0 flex items-center justify-between gap-3 md:block${item.current ? " border-t-text-primary" : ""}`}
          >
            <div className="min-w-0">
              <TeaserCardBody title={item.title} desc={item.desc} />
            </div>
            <ChevronRight
              aria-hidden="true"
              className="size-3 shrink-0 text-text-muted md:hidden"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
