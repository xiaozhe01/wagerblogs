import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ReviewsRail from "@/components/rail/ReviewsRail";
import ReviewDirectorySection from "@/components/section/ReviewDirectorySection";
import ReviewCard from "@/components/section/ReviewCard";
import { reviewGroups } from "@/lib/reviews";

export const metadata: Metadata = {
  title: "Sportsbook & Casino Reviews — WagerBlogs",
  description: "Independent, tested reviews of legal sportsbooks and online casinos.",
  alternates: { canonical: "/reviews" },
};

// Reviews hub: a directory of the reviews we've published, then the method that
// produced the scores. Ranked lists, the comparison table and bonus offers are
// the home page's job — the hub links inward and carries no operator CTAs.
export default function ReviewsIndexPage() {
  return (
    <PageShell activeNavId="reviews" rail={<ReviewsRail />}>
      {/* Register: Comparison · Tier 2/3 — internal links only, no operator CTAs */}
      <Breadcrumbs items={[{ label: "Reviews" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Sportsbook & casino reviews
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — every operator we&apos;ve reviewed, what each was scored on, and
          when the review was last re-verified.]
        </p>
      </header>

      {reviewGroups.map((group) => (
        <ReviewDirectorySection
          key={group.slug}
          title={group.title}
          operators={group.operators}
          limit={4}
          allHref={group.href}
          allLabel={`All ${group.noun} reviews`}
        />
      ))}

      <ReviewCard />
    </PageShell>
  );
}
