import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
import SearchInput from "@/components/rail/SearchInput";
import ArrowLink from "@/components/ui/ArrowLink";
import TeaserCardBody from "@/components/cards/TeaserCardBody";
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
      <div className="card">
        <SearchInput placeholder="Search categories..." />
      </div>
      <InfoCard
        title="Editorial standards"
        body="How we research, source, and correct our category coverage."
        cta={
          <ArrowLink
            href="/about"
            className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
          >
            Read our methodology
          </ArrowLink>
        }
      />
      <HelpLineCard />
    </>
  );

  return (
    <PageShell activeNavId="categories" rail={rail}>
      {/* Register: Editorial · Tier 1 — category navigation, no outbound operator links */}
      <Breadcrumbs items={[{ label: "Categories" }]} />

      <header className="flex flex-col gap-3 max-w-160">
        <h1 className="heading-serif text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Betting categories
        </h1>
        <p className="font-serif text-xl leading-copy text-text-body text-pretty">
          [Placeholder standfirst — every vertical WagerBlogs covers, and how coverage is
          organized.]
        </p>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="heading-serif text-h2-serif leading-heading">All categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <Link key={c.name} href="/categories/sample" className="editorial-link-card">
              <TeaserCardBody title={c.name} desc={c.desc} />
            </Link>
          ))}
        </div>
      </section>

      <RecentPublishedSection />
    </PageShell>
  );
}
