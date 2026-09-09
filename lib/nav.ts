import { categories } from "@/lib/categories";
import { newsSections } from "@/lib/news";
import { reviewGroups } from "@/lib/reviews";

export type NavGroup = {
  id: string;
  label: string;
  href: string;
  /** `icon` is a key, not a component — SideNav maps it to the lucide icon.
   * Required so a new sub-item cannot ship without one. */
  subs: { label: string; href: string; icon: string; trailingIcon?: boolean }[];
};

// Icon keys per registry slug; components fall back, so a new slug is safe.
const newsIcons: Record<string, string> = {
  football: "shield",
  basketball: "circle-dot",
  soccer: "volleyball",
  esports: "gamepad",
  industry: "building",
};

const reviewIcons: Record<string, string> = {
  sportsbooks: "trophy",
  casinos: "dice",
};

const categoryIcons: Record<string, string> = {
  sportsbooks: "trophy",
  "online-casinos": "dice",
  "esports-betting": "gamepad",
  "fantasy-sports": "users",
  "sweepstakes-casinos": "ticket",
  "horse-racing": "medal",
};

/** Built from the registries the routes resolve from, so a row cannot point at
 * a page that doesn't exist — hardcoded, fourteen had drifted onto bare hubs. */
export const navGroups: NavGroup[] = [
  { id: "home", label: "Home", href: "/", subs: [] },
  {
    id: "news",
    label: "News",
    href: "/news",
    subs: [
      ...newsSections.map((section) => ({
        label: section.category,
        href: section.href,
        icon: newsIcons[section.slug] ?? "newspaper",
      })),
      {
        label: "All News",
        href: "/news",
        icon: "newspaper",
        trailingIcon: true,
      },
    ],
  },
  {
    id: "reviews",
    label: "Reviews",
    href: "/reviews",
    subs: [
      ...reviewGroups.map((group) => ({
        label: group.crumb,
        href: group.href,
        icon: reviewIcons[group.slug] ?? "star",
      })),
      {
        label: "All Reviews",
        href: "/reviews",
        icon: "star",
        trailingIcon: true,
      },
    ],
  },
  {
    id: "categories",
    label: "Categories",
    href: "/categories",
    subs: [
      ...categories.map((category) => ({
        label: category.name,
        href: category.href,
        icon: categoryIcons[category.slug] ?? "layers",
      })),
      {
        label: "All Categories",
        href: "/categories",
        icon: "layers",
        trailingIcon: true,
      },
    ],
  },
  // No subs: posts aren't filterable by kicker yet, so a dropdown here would be
  // four rows that all land on /blog.
  // TODO(cms): restore the group once /blog filters on a real taxonomy.
  { id: "blog", label: "Blog", href: "/blog", subs: [] },
  {
    id: "more",
    label: "More",
    href: "/about",
    subs: [
      { label: "About Us", href: "/about#who-we-are", icon: "users" },
      {
        label: "How We Review",
        href: "/about#how-we-review",
        icon: "badge-check",
      },
      { label: "FAQ", href: "/faq", icon: "info" },
      { label: "Contact", href: "/contact", icon: "mail" },
      {
        label: "Responsible Gambling",
        href: "/responsible-gambling",
        icon: "life-buoy",
      },
      { label: "Disclaimer", href: "/legal/terms-of-service", icon: "scale" },
    ],
  },
];
