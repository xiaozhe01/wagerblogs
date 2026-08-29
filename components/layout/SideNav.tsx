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
  Shield,
  CircleDot,
  Volleyball,
  Gamepad2,
  Building2,
  Trophy,
  Dices,
  Ticket,
  Gift,
  Medal,
  MapPin,
  Layers,
  Search,
  BookOpen,
  Target,
  FlaskConical,
  ScrollText,
  Users,
  BadgeCheck,
  Info,
  Mail,
  LifeBuoy,
  Scale,
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

// Keyed by NavGroup.subs[].icon so the taxonomy in site-data stays free of
// component imports.
const subNavIcons: Record<string, LucideIcon> = {
  shield: Shield,
  "circle-dot": CircleDot,
  volleyball: Volleyball,
  gamepad: Gamepad2,
  building: Building2,
  newspaper: Newspaper,
  trophy: Trophy,
  dice: Dices,
  ticket: Ticket,
  gift: Gift,
  star: Star,
  medal: Medal,
  "map-pin": MapPin,
  layers: Layers,
  search: Search,
  book: BookOpen,
  target: Target,
  flask: FlaskConical,
  scroll: ScrollText,
  users: Users,
  "badge-check": BadgeCheck,
  info: Info,
  mail: Mail,
  "life-buoy": LifeBuoy,
  scale: Scale,
};

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
                      <ul role="list" className="flex flex-col gap-px min-w-40">
                        {g.subs.map((s: NavGroup["subs"][number]) => {
                          const SubIcon = subNavIcons[s.icon] ?? CircleDot;
                          return (
                            <li key={s.label}>
                              <NavigationMenuLink
                                href={s.href}
                                className="group w-full gap-2 text-sm text-text-primary font-medium"
                              >
                                <SubIcon
                                  strokeWidth={2.5}
                                  className="size-3 shrink-0 text-text-muted"
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
