import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ReviewsRail from "@/components/rail/ReviewsRail";
import ReviewDirectorySection from "@/components/section/ReviewDirectorySection";
import ReviewCard from "@/components/section/ReviewCard";
import { findReviewGroup, reviewGroups } from "@/lib/reviews";
import { PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import { headingId } from "@/lib/utils";
import PageNav from "@/components/controls/PageNav";

type VerticalParams = { vertical: string };

export function generateStaticParams() {
  return reviewGroups.map((group) => ({ vertical: group.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<VerticalParams>;
}): Promise<Metadata> {
  const { vertical: verticalSlug } = await params;
  const group = findReviewGroup(verticalSlug);
  if (!group) return { title: "Reviews — WagerBlogs" };
  return {
    title: `${group.title} — WagerBlogs`,
    description: `Every ${group.noun} we've reviewed, scored on the same criteria and re-verified on a schedule.`,
    alternates: { canonical: group.href },
  };
}

export default async function ReviewGroupPage({
  params,
  searchParams,
}: {
  params: Promise<VerticalParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { vertical: verticalSlug } = await params;
  const query = await searchParams;
  const group = findReviewGroup(verticalSlug);
  // Anything outside the two groups is a genuine 404 — /reviews/<operator> now
  // lives one level deeper, so an old flat link lands here.
  if (!group) notFound();
  const operatorPage = paginate(group.operators, query[PAGE_PARAM]);

  return (
    <PageShell activeNavId="reviews" rail={<ReviewsRail currentSlug={group.slug} />}>
      {/* Register: Comparison · Tier 2/3 — internal links only, no operator CTAs */}
      <Breadcrumbs
        currentPath={group.href}
        items={[{ label: "Reviews", href: "/reviews" }, { label: group.crumb }]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {group.title}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — every {group.noun} we&apos;ve reviewed, scored on the same
          criteria, with the date each was last re-verified.]
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <ReviewDirectorySection
          title={`All ${group.noun} reviews`}
          operators={operatorPage.items}
        />
        <PageNav
          page={operatorPage.page}
          totalPages={operatorPage.totalPages}
          label={`All ${group.noun} reviews`}
          hrefFor={(n) =>
            pageHref({
              basePath: group.href,
              page: n,
              anchor: headingId("section", `All ${group.noun} reviews`),
            })
          }
        />
      </div>

      <ReviewCard />
    </PageShell>
  );
}
