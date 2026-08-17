import { ReactNode } from "react";
import SideNav from "./SideNav";
import TopHeader from "./TopHeader";
import SiteFooter from "./SiteFooter";

// Shared three-column shell (side-nav / content / rail) used by every content route.
// Responsive behavior matches globals.css's documented breakpoints: mobile stacks
// everything in one column, tablet adds a second column for the rail, desktop adds
// the side-nav as a third track and swaps out TopHeader.
export default function PageShell({
  activeNavId,
  rail,
  children,
}: {
  activeNavId?: string;
  rail?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="max-w-(--grid-max-width) mx-auto px-container-mobile md:px-container-tablet lg:px-container-desktop pt-container-mobile md:pt-container-tablet lg:pt-container-desktop pb-10">
      <div className="md:grid md:grid-cols-[1fr_260px] md:gap-(--grid-gap-tablet) md:items-start lg:grid-cols-[var(--grid-nav-width)_1fr_var(--grid-rail-width)] lg:gap-(--grid-gap-desktop)">
        <SideNav activeId={activeNavId} />
        <div className="flex flex-col gap-6 lg:gap-8 min-w-0">
          <TopHeader />
          {children}
        </div>
        {rail && (
          <aside className="flex flex-col gap-3 mt-4 md:mt-0 md:sticky md:top-(--spacing-container-tablet) lg:top-(--spacing-container-desktop)">
            {rail}
          </aside>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
