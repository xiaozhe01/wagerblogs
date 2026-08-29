import { ReactNode } from "react";
import SideNav from "./SideNav";
import TopHeader from "./TopHeader";
import SiteFooter from "./SiteFooter";

const shellTracks =
  "max-w-240 mx-auto wide:max-w-none wide:grid wide:grid-cols-[var(--grid-nav-width)_1fr_var(--grid-rail-width)] wide:gap-x-(--grid-gap-desktop)";

// <main> owns the space between top-level blocks; children contribute internal
// gaps only. Editorial (Tier 1) gets the wider step per docs/02 §5.
const MAIN_GAP = {
  editorial: "gap-7",
  comparison: "gap-5",
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
    <div className="max-w-(--grid-max-width) mx-auto px-container-mobile md:px-container-tablet lg:px-container-desktop pt-container-mobile md:pt-container-tablet lg:pt-container-desktop pb-10">
      <div className={`${shellTracks} wide:items-start`}>
        <SideNav activeId={activeNavId} />
        <div className="min-w-0">
          <TopHeader />
          <main className={`flex flex-col ${MAIN_GAP[register]} mt-4 wide:mt-0`}>{children}</main>
        </div>
        {rail && (
          <aside className="hidden wide:flex flex-col gap-3 wide:sticky wide:top-container-desktop wide:max-h-[calc(100dvh-(var(--spacing-container-desktop)*2))] wide:overflow-y-auto overscroll-contain">
            {rail}
          </aside>
        )}
      </div>
      <div className={shellTracks}>
        <div className="min-w-0 wide:col-start-2">
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
