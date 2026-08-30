import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
import SearchInput from "@/components/rail/SearchInput";
import TeaserCardBody from "@/components/cards/TeaserCardBody";
import EditorialSection from "@/components/section/EditorialSection";
import RecentPublishedSection from "@/components/section/RecentPublishedSection";
import { categories } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Betting Categories — WagerBlogs",
  description: "Browse every betting and casino vertical WagerBlogs covers.",
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
      <HelpLineCard />
    </>
  );

  return (
    <PageShell activeNavId="categories" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — category navigation, no outbound operator links */}
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <header className="flex flex-col gap-3">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Betting categories
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — every vertical WagerBlogs covers, and how coverage is
          organized.]
        </p>
      </header>

      <EditorialSection title="All categories" register="editorial">
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3"
        >
          {categories.map((c) => (
            <li key={c.name}>
              <Link href="/categories/sample" className="editorial-link-card min-h-11 lg:min-h-0">
                <TeaserCardBody title={c.name} desc={c.desc} />
              </Link>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <RecentPublishedSection register="editorial" />
    </PageShell>
  );
}
