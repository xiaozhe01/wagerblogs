import { Search } from "lucide-react";
import Link from "next/link";
import MobileNav from "./MobileNav";
import { NAV_ICON_BUTTON_BORDERED } from "./nav-styles";

// Mobile/tablet header (below wide:). Replaced by SideNav above it.
export default function TopHeader({ activeNavId }: { activeNavId?: string }) {
  return (
    <header className="flex wide:hidden items-center justify-between gap-3 pb-4 mb-6 lg:mb-7 border-b border-border-divider">
      <Link
        href="/"
        className="flex items-center min-h-11 font-sans font-heavy text-2xl tracking-[-0.02em] text-text-primary no-underline"
      >
        WagerBlogs
      </Link>
      <div className="flex items-center gap-2.5">
        {/* TODO: wire up real search */}
        <button aria-label="Search" className={NAV_ICON_BUTTON_BORDERED}>
          <Search size={24} className="shrink-0" aria-hidden="true" />
        </button>
        <MobileNav activeId={activeNavId} />
      </div>
    </header>
  );
}
