import { Search, Menu } from "lucide-react";
import Link from "next/link";

// Mobile/tablet header (below lg). Replaced by SideNav at lg+.
export default function TopHeader() {
  return (
    <header className="flex wide:hidden items-center justify-between gap-3 pb-4 border-b border-border-divider">
      <Link
        href="/"
        className="font-sans font-heavy text-2xl tracking-[-0.02em] text-text-primary no-underline"
      >
        WagerBlogs
      </Link>
      <div className="flex items-center gap-2.5">
        {/* TODO: wire up real search + mobile nav drawer */}
        <button
          aria-label="Search"
          className="w-11 h-11 border border-border-default rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-bg-subtle hover:border-text-primary"
        >
          <Search size={24} className="shrink-0" aria-hidden="true" />
        </button>
        <button
          aria-label="Menu"
          className="w-11 h-11 border border-border-default rounded-md flex items-center justify-center cursor-pointer transition-colors hover:bg-bg-subtle hover:border-text-primary"
        >
          <Menu size={24} className="shrink-0" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
