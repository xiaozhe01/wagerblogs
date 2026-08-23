"use client";

import Link from "next/link";
import { navGroups, type NavGroup } from "@/lib/site-data";
import {
  Home,
  Newspaper,
  Star,
  LayoutGrid,
  PenLine,
  Ellipsis,
  type LucideIcon,
  ChevronRight,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navIcons: Record<string, LucideIcon> = {
  home: Home,
  news: Newspaper,
  reviews: Star,
  categories: LayoutGrid,
  blog: PenLine,
  more: Ellipsis,
};

function NavIconLabel({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <>
      <span className="w-6.5 h-6.5 shrink-0 flex items-center justify-center text-text-muted">
        <Icon className="size-3" aria-hidden="true" />
      </span>
      <span className="flex-1 text-left">{label}</span>
    </>
  );
}

// Desktop-only rail nav (lg+). Mobile/tablet uses TopHeader instead — see globals.css
// breakpoint doc block: side-nav replaces top-header only at lg (1024px+).
export default function SideNav({ activeId }: { activeId?: string }) {
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

      <NavigationMenu side="right" className="max-w-none flex-1 items-stretch justify-start">
        <NavigationMenuList className="flex-col items-stretch justify-start gap-2">
          {navGroups.map((g: NavGroup) => {
            const expandable = g.subs.length > 0;
            const Icon = navIcons[g.id] ?? Ellipsis;
            return (
              <NavigationMenuItem key={g.id}>
                {expandable ? (
                  <>
                    <NavigationMenuTrigger
                      className={`w-full h-auto justify-start gap-2.5 px-2.5 py-2 text-md text-text-strong-secondary font-medium ${g.id === activeId ? "bg-bg-subtle" : ""}`}
                    >
                      <NavIconLabel icon={Icon} label={g.label} />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="flex flex-col gap-px min-w-40">
                        {g.subs.map((s: NavGroup["subs"][number]) => (
                          <NavigationMenuLink
                            key={s.label}
                            href={s.href}
                            className="group text-sm text-text-primary font-medium"
                          >
                            {s.label}
                            {s.trailingIcon && (
                              <ChevronRight
                                strokeWidth={2.5}
                                className="size-3 shrink-0 transition duration-300 group-hover:translate-x-1"
                                aria-hidden="true"
                              />
                            )}
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    href={g.href}
                    className={`w-full gap-2.5 px-2.5 py-2 text-md text-text-strong-secondary font-medium ${g.id === activeId ? "bg-bg-subtle" : ""}`}
                  >
                    <NavIconLabel icon={Icon} label={g.label} />
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>

      {/* TODO(cms): swap for real auth state — this is a static Log In link */}
      <Link href="/login" className="btn-primary w-full">
        Log In
      </Link>
    </section>
  );
}
