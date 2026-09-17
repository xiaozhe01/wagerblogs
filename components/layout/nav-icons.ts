import {
  BadgeCheck,
  Building2,
  CircleDot,
  Dices,
  Ellipsis,
  FileText,
  Gamepad2,
  Home,
  Info,
  Layers,
  LayoutGrid,
  LifeBuoy,
  Mail,
  Medal,
  Newspaper,
  Scale,
  Shield,
  Star,
  Ticket,
  Trophy,
  Users,
  Volleyball,
  type LucideIcon,
} from "lucide-react";

// Keyed by NavGroup.id and NavGroup.subs[].icon so the taxonomy in lib/nav.ts
// stays free of component imports. Shared by SideNav and the mobile drawer.
export const navIcons: Record<string, LucideIcon> = {
  home: Home,
  news: Newspaper,
  reviews: Star,
  categories: LayoutGrid,
  articles: FileText,
  more: Ellipsis,
};

// Keyed by NavGroup.subs[].icon so the taxonomy in lib/nav.ts stays free of
// component imports.
export const subNavIcons: Record<string, LucideIcon> = {
  shield: Shield,
  "circle-dot": CircleDot,
  volleyball: Volleyball,
  gamepad: Gamepad2,
  building: Building2,
  newspaper: Newspaper,
  trophy: Trophy,
  dice: Dices,
  ticket: Ticket,
  star: Star,
  medal: Medal,
  layers: Layers,
  users: Users,
  "badge-check": BadgeCheck,
  info: Info,
  mail: Mail,
  "life-buoy": LifeBuoy,
  scale: Scale,
};
