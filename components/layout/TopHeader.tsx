import Link from "next/link";
import MobileNav from "./MobileNav";
import type { NavGroup } from "@/lib/nav";
import SearchTrigger from "./SearchTrigger";

// Mobile/tablet header (below wide:). Replaced by SideNav above it.
export default function TopHeader({
  activeNavId,
  navGroups,
}: {
  activeNavId?: string;
  navGroups: NavGroup[];
}) {
  return (
    <header className="flex wide:hidden items-center justify-between gap-3 pb-4 mb-6 lg:mb-7 border-b border-border-divider">
      <Link
        href="/"
        className="flex items-center min-h-11 font-sans font-heavy text-2xl tracking-[-0.02em] text-text-primary no-underline"
      >
        WagerBlogs
      </Link>
      <div className="flex items-center gap-2.5">
        <SearchTrigger />
        <MobileNav activeId={activeNavId} groups={navGroups} />
      </div>
    </header>
  );
}
