"use client";

import Link from "next/link";
import type { NavGroup } from "@/lib/nav";
import { Ellipsis, ChevronRight, CircleDot, User, type LucideIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { navIcons, subNavIcons } from "./nav-icons";
import { NAV_INTERACTION as NAV_ROW } from "./nav-styles";
import SearchTrigger from "./SearchTrigger";

function NavIconLabel({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <>
      <span className="w-6.5 h-6.5 shrink-0 flex items-center justify-center text-text-muted">
        <Icon strokeWidth={2.5} className="size-3" aria-hidden="true" />
      </span>
      <span className="flex-1 text-left font-semibold">{label}</span>
    </>
  );
}

// Desktop-only rail nav (lg+). Mobile/tablet uses TopHeader instead — see globals.css
// breakpoint doc block: side-nav replaces top-header only at lg (1024px+).
export default function SideNav({ activeId, groups }: { activeId?: string; groups: NavGroup[] }) {
  return (
    <section
      aria-label="Sidebar"
      className="hidden wide:flex gap-3 wide:flex-col wide:sticky wide:top-container-desktop"
    >
      <div className="flex items-start h-10">
        <Link
          href="/"
          className="font-sans font-heavy text-3xl tracking-[-0.02em] text-text-primary no-underline"
        >
          WagerBlogs
        </Link>
      </div>

      <SearchTrigger variant="row" />

      <NavigationMenu
        side="right"
        aria-label="Main"
        className="max-w-none flex-1 items-stretch justify-start"
      >
        <NavigationMenuList className="flex-col items-stretch justify-start gap-2">
          {groups.map((g: NavGroup) => {
            const expandable = g.subs.length > 0;
            const Icon = navIcons[g.id] ?? Ellipsis;
            return (
              <NavigationMenuItem key={g.id}>
                {expandable ? (
                  <>
                    <NavigationMenuTrigger
                      className={`${NAV_ROW} w-full h-auto justify-start gap-2.5 px-2.5 py-2 text-md text-text-strong-secondary font-medium ${g.id === activeId ? "text-brand font-semibold" : ""}`}
                    >
                      <NavIconLabel icon={Icon} label={g.label} />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul role="list" className="flex flex-col gap-px min-w-40">
                        {g.subs.map((s: NavGroup["subs"][number]) => {
                          const SubIcon = subNavIcons[s.icon] ?? CircleDot;
                          return (
                            <li key={s.label}>
                              <NavigationMenuLink
                                href={s.href}
                                className={`${NAV_ROW} group w-full gap-2 text-sm text-text-primary font-medium`}
                              >
                                <SubIcon
                                  strokeWidth={2.5}
                                  className="size-3 shrink-0 text-text-muted transition-colors group-hover:text-brand"
                                  aria-hidden="true"
                                />
                                <span className="flex-1 text-left">{s.label}</span>
                                {s.trailingIcon && (
                                  <ChevronRight
                                    strokeWidth={2.5}
                                    className="size-3 shrink-0 transition duration-300 group-hover:translate-x-1"
                                    aria-hidden="true"
                                  />
                                )}
                              </NavigationMenuLink>
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    href={g.href}
                    aria-current={g.id === activeId ? "page" : undefined}
                    className={`${NAV_ROW} w-full gap-2.5 px-2.5 py-2 text-md text-text-strong-secondary font-medium ${g.id === activeId ? "text-brand font-semibold" : ""}`}
                  >
                    <NavIconLabel icon={Icon} label={g.label} />
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>

      {/* TODO(clerk): /login lands when Clerk is wired; swap this for real auth state. */}
      <Link
        href="/login"
        prefetch={false}
        className={`${NAV_ROW} group w-full min-h-5 px-2.5 py-1.5 flex items-center justify-start gap-2.5 rounded-md text-sm font-semibold leading-snug text-text-primary no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand`}
      >
        <span className="w-6.5 h-6.5 shrink-0 flex items-center justify-center">
          <User strokeWidth={2.5} aria-hidden="true" className="size-3" />
        </span>
        Log In
      </Link>
    </section>
  );
}
