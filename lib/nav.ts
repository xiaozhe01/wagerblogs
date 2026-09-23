import type { NewsSection, Vertical } from "@/payload-types";

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
  "online-casinos": "dice",
};

const categoryIcons: Record<string, string> = {
  sportsbooks: "trophy",
  "online-casinos": "dice",
  "esports-betting": "gamepad",
  "fantasy-sports": "users",
  "sweepstakes-casinos": "ticket",
  "horse-racing": "medal",
};

/** Built from the records the routes resolve from, so a row cannot point at a
 * page that doesn't exist. Pure: PageShell does the querying and passes the
 * rows in, because SideNav and MobileNav are client components. */
export function buildNavGroups({
  verticals,
  newsSections,
}: {
  verticals: Pick<Vertical, "slug" | "name" | "crumb" | "hasReviews">[];
  newsSections: Pick<NewsSection, "slug" | "name">[];
}): NavGroup[] {
  return [
    { id: "home", label: "Home", href: "/", subs: [] },
    {
      id: "news",
      label: "News",
      href: "/news",
      subs: [
        ...newsSections.map((section) => ({
          label: section.name,
          href: `/news/${section.slug}`,
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
        ...verticals
          .filter((vertical) => vertical.hasReviews)
          .map((vertical) => ({
            label: vertical.crumb,
            href: `/reviews/${vertical.slug}`,
            icon: reviewIcons[vertical.slug] ?? "star",
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
        ...verticals.map((vertical) => ({
          label: vertical.name,
          href: `/categories/${vertical.slug}`,
          icon: categoryIcons[vertical.slug] ?? "layers",
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
    // four rows that all land on /articles.
    // TODO(cms): restore the group once /articles filters on a real taxonomy.
    { id: "articles", label: "Articles", href: "/articles", subs: [] },
    {
      id: "more",
      label: "More",
      href: "/about",
      subs: [
        { label: "About Us", href: "/about#who-we-are", icon: "users" },
        { label: "Authors", href: "/authors", icon: "authors" },
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
}
