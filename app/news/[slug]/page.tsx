import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PostRow from "@/components/cards/PostRow";
import NewsRail from "@/components/rail/NewsRail";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import LinkTileGrid from "@/components/cards/LinkTileGrid";
import { findNewsSection, newsSections, sectionSummary, storyRow } from "@/lib/news";
import { PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import { headingId } from "@/lib/utils";
import PageNav from "@/components/controls/PageNav";
import Prose from "@/components/section/Prose";

export function generateStaticParams() {
  return newsSections.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const section = findNewsSection(slug);
  if (!section) return { title: "News — WagerBlogs" };
  return {
    title: `${section.category} news — WagerBlogs`,
    description: `${section.category} betting news, market moves, and analysis.`,
    alternates: { canonical: section.href },
  };
}

export default async function NewsSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const section = findNewsSection(slug);
  // A sport outside the taxonomy is a genuine 404, not an empty section page.
  if (!section) notFound();
  const storyPage = paginate(section.stories, query[PAGE_PARAM]);
  const elsewhere = newsSections
    .filter((s) => s.slug !== section.slug)
    .flatMap((s) => s.stories.slice(0, 1))
    .slice(0, 3);

  return (
    <PageShell
      activeNavId="news"
      register="editorial"
      rail={
        <NewsRail
          searchPlaceholder={`Search ${section.category} news...`}
          currentSlug={section.slug}
        />
      }
    >
      {/* Register: Editorial · Tier 1 — reporting, no outbound operator links */}
      <Breadcrumbs
        currentPath={section.href}
        items={[{ label: "News", href: "/news" }, { label: section.category }]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {section.category}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — what our {section.category.toLowerCase()} desk covers and how
          often it publishes.]
        </p>
      </header>

      <EditorialSection title="Latest stories" register="editorial">
        {section.stories.length === 0 ? (
          <EmptyState
            title={`No ${section.category} stories filed yet`}
            action={{ href: "/news", label: "All news" }}
          />
        ) : (
          <ul role="list" className="flex flex-col gap-3">
            {storyPage.items.map((story) => (
              <li key={story.slug}>
                <PostRow post={storyRow(story)} />
              </li>
            ))}
          </ul>
        )}
        <PageNav
          page={storyPage.page}
          totalPages={storyPage.totalPages}
          label={`Latest ${section.category} stories`}
          hrefFor={(n) =>
            pageHref({
              basePath: section.href,
              page: n,
              anchor: headingId("section", "Latest stories"),
            })
          }
        />
      </EditorialSection>

      <EditorialSection title="What this desk covers" register="editorial" tier="supporting">
        <Prose>
          [Placeholder — the beat: which competitions and markets this desk follows, how often it
          publishes, and what it deliberately leaves to the guides.]
        </Prose>
        <ArrowLink href="/news#section-how-we-report" className={`${sectionCtaClassName} w-fit`}>
          How we report
        </ArrowLink>
      </EditorialSection>

      {elsewhere.length > 0 && (
        <EditorialSection title="More from the newsroom" titleHref="/news" register="editorial">
          <ul role="list" className="flex flex-col gap-3">
            {elsewhere.map((story) => (
              <li key={story.href}>
                <PostRow post={storyRow(story, { kicker: story.category })} />
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}

      <EditorialSection title="Browse all sections" register="editorial" tier="supporting">
        <LinkTileGrid
          items={newsSections.map((s) => ({
            href: s.href,
            title: s.category,
            desc: sectionSummary(s),
            key: s.slug,
            current: s.slug === section.slug,
          }))}
        />
      </EditorialSection>
    </PageShell>
  );
}
