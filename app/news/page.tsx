import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PostRow from "@/components/cards/PostRow";
import NewsRail from "@/components/rail/NewsRail";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import Prose from "@/components/section/Prose";
import { newsSections, storyRow } from "@/lib/news";

export const metadata: Metadata = {
  title: "News — WagerBlogs",
  description: "Betting and casino industry news, regulation, and market coverage.",
  alternates: { canonical: "/news" },
};

// TODO(cms): cap each section at the newest few stories once the feed is
// paginated, and give each story a real href.
export default function NewsIndexPage() {
  const sections = newsSections.filter((section) => section.stories.length > 0);

  return (
    <PageShell activeNavId="news" register="editorial" rail={<NewsRail />}>
      {/* Register: Editorial · Tier 1 — reporting, no outbound operator links */}
      <Breadcrumbs items={[{ label: "News" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          News
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — regulation, market moves, and industry reporting, written to be
          useful whether or not you bet.]
        </p>
      </header>

      {sections.length === 0 ? (
        <EmptyState title="No stories filed yet" />
      ) : (
        sections.map(({ category, slug, href, stories }) => (
          <EditorialSection
            key={slug}
            id={slug}
            title={category}
            titleHref={href}
            register="editorial"
            className="card"
          >
            <ul role="list" className="flex flex-col gap-3">
              {stories.map((story) => (
                <li key={story.slug}>
                  <PostRow post={storyRow(story)} bleed="card" />
                </li>
              ))}
            </ul>
            <ArrowLink href={href} className={`${sectionCtaClassName} self-center min-h-4`}>
              More {category} news
            </ArrowLink>
          </EditorialSection>
        ))
      )}

      <EditorialSection title="How we report" register="editorial">
        <Prose>
          [Placeholder — sourcing policy: what we verify before publishing, how corrections are
          handled, and why commercial partnerships never affect coverage.]
        </Prose>
      </EditorialSection>
    </PageShell>
  );
}
