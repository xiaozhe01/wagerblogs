import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import InfoCard from "@/components/rail/InfoCard";
import SearchInput from "@/components/rail/SearchInput";
import LinkTileGrid from "@/components/cards/LinkTileGrid";
import EditorialSection from "@/components/section/EditorialSection";
import RecentPublishedSection from "@/components/section/RecentPublishedSection";
import { categories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Betting Categories — WagerBlogs",
  description: "Browse every betting and casino vertical WagerBlogs covers.",
  alternates: { canonical: "/categories" },
};

// Minimal categories index — every category from lib/site-data.ts as a card.
// Individual category pages live at /categories/[slug].
export default function CategoriesIndexPage() {
  const rail = (
    <>
      <SearchInput placeholder="Search categories..." />
      <InfoCard
        title="Editorial standards"
        body="How we research, source, and correct our category coverage."
        cta={{ href: "/about", label: "Read our methodology" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="categories" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — category navigation, no outbound operator links */}
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Betting categories
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — every vertical WagerBlogs covers, and how coverage is
          organized.]
        </p>
      </header>

      <EditorialSection title="All categories" register="editorial">
        <LinkTileGrid
          items={categories.map((category) => ({
            href: category.href,
            title: category.name,
            desc: category.desc,
            key: category.slug,
          }))}
        />
      </EditorialSection>

      <RecentPublishedSection register="editorial" />
    </PageShell>
  );
}
