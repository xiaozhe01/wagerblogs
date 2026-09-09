import { ReactNode } from "react";
import BackToTop from "./BackToTop";
import BackToTopFab from "./BackToTopFab";
import SideNav from "./SideNav";
import TopHeader from "./TopHeader";
import SiteFooter from "./SiteFooter";

const shellTracks =
  "max-w-240 mx-auto wide:max-w-none wide:grid wide:grid-cols-[var(--grid-nav-width)_1fr_var(--grid-rail-width)] wide:gap-x-(--grid-gap-desktop)";

// <main> owns the space between top-level blocks; children contribute internal
// gaps only. Editorial (Tier 1) gets the wider step per docs/02 §5.
// Stays wider than the 32px step inside a group, so <main>'s gap reads as the
// break between role groups rather than as more of the same rhythm — 40px below
// lg:, where 48px costs a phone a screen of scroll across a page of sections.
// Both registers share it today; the key is kept so a register can diverge
// without a callsite sweep.
const MAIN_GAP = {
  editorial: "gap-6 lg:gap-7",
  comparison: "gap-6 lg:gap-7",
} as const;

export default function PageShell({
  activeNavId,
  register = "comparison",
  rail,
  children,
}: {
  activeNavId?: string;
  register?: keyof typeof MAIN_GAP;
  rail?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="max-w-(--grid-max-width) mx-auto px-container-mobile md:px-container-tablet lg:px-container-desktop pt-container-mobile md:pt-container-tablet lg:pt-container-desktop">
      {/* WCAG 2.4.1 — the sidebar puts nine tab stops before <main>. Must stay
          the first focusable element in the DOM. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-3 focus:left-3 focus:rounded-md focus:border focus:border-border-default focus:bg-bg-card focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-text-primary focus:no-underline focus:outline-2 focus:outline-offset-2 focus:outline-brand"
      >
        Skip to content
      </a>
      <div className={`${shellTracks} wide:items-start`}>
        <SideNav activeId={activeNavId} />
        <div className="min-w-0">
          <TopHeader activeNavId={activeNavId} />
          {/* tabIndex -1 so the skip link moves focus, not just scroll. */}
          <main id="main-content" tabIndex={-1} className={`flex flex-col ${MAIN_GAP[register]}`}>
            {children}
          </main>
        </div>
        {rail && (
          <aside className="hidden wide:flex flex-col justify-between gap-3 wide:sticky wide:top-container-desktop wide:h-[calc(100dvh-(var(--spacing-container-desktop)*2))] wide:overflow-y-auto overscroll-contain">
            <div className="flex flex-col gap-3">{rail}</div>
            <BackToTop />
          </aside>
        )}
        {/* pb-10 sits here, not on the shell wrapper: as wrapper padding it put
            the grid container's bottom 40px above the document's, so at max
            scroll the sticky rail had 8px too little room and jumped up 16px. */}
        <div className="min-w-0 wide:col-start-2 pb-10">
          <SiteFooter />
        </div>
      </div>
      {/* Outside the grid: it is fixed to the viewport, not a track. Rendered
          regardless of `rail`, since it answers page length, not rail presence. */}
      <BackToTopFab />
    </div>
  );
}
