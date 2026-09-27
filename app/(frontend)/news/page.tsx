import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { publishedFilter, resolvePreviewUser } from "@/lib/payload-queries";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PostRow from "@/components/cards/PostRow";
import NewsRail from "@/components/rail/NewsRail";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import Prose from "@/components/section/Prose";
import { storyRow } from "@/lib/news-rows";
import { buildOpenGraph } from "@/lib/og";

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only.
export const revalidate = 3600;

const TITLE = "News — WagerBlogs";
const DESCRIPTION = "Betting and casino industry news, regulation, and market coverage.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: "/news" }),
  alternates: { canonical: "/news" },
};

/** How many stories each section shows on the index before "More X news". */
const PER_SECTION = 4;

export default async function NewsIndexPage() {
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const payload = await getPayload({ config });

  // news-sections has no _status — structural (no lifecycle).
  const { docs: sections } = await payload.find({
    collection: "news-sections",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  // news filters _status — editorial (drafts enabled). One query for every
  // section, grouped in memory: five sequential per-section queries would be
  // five round-trips for the same rows.
  const { docs: stories } = await payload.find({
    collection: "news",
    ...publishedFilter(isDraft, {}, previewUser),
    sort: "-publishedAt",
    limit: 500,
    depth: 1,
    overrideAccess: false,
  });

  const bySection = new Map<number, typeof stories>();
  for (const story of stories) {
    const id = typeof story.section === "object" ? story.section.id : story.section;
    bySection.set(id, [...(bySection.get(id) ?? []), story]);
  }

  // A section with nothing filed is omitted rather than rendered as an empty
  // card — same behaviour the lib-backed page had.
  const populated = sections
    .map((section) => ({
      section,
      stories: (bySection.get(section.id) ?? []).slice(0, PER_SECTION),
    }))
    .filter((entry) => entry.stories.length > 0);

  return (
    <PageShell activeNavId="news" register="editorial" rail={<NewsRail />}>
      {/* Register: Editorial · Tier 1 — reporting, no outbound operator links */}
      <Breadcrumbs items={[{ label: "News" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          News
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          Regulation, market moves and the business of betting. What changed, and who it affects.
        </p>
      </header>

      {populated.length === 0 ? (
        <EmptyState
          title="No stories filed yet"
          body="Stories appear here once they are published in the admin panel."
        />
      ) : (
        populated.map(({ section, stories: sectionStories }) => (
          <EditorialSection
            key={section.id}
            id={section.slug}
            title={section.name}
            titleHref={`/news/${section.slug}`}
            register="editorial"
            className="card"
          >
            <ul role="list" className="flex flex-col gap-3">
              {sectionStories.map((story) => (
                <li key={story.id}>
                  <PostRow post={storyRow(story, section.slug)} bleed="card" />
                </li>
              ))}
            </ul>
            <ArrowLink
              href={`/news/${section.slug}`}
              className={`${sectionCtaClassName} self-center min-h-4`}
            >
              More {section.name} news
            </ArrowLink>
          </EditorialSection>
        ))
      )}

      <EditorialSection title="How we report" register="editorial">
        <Prose>
          We source stories from regulators, company filings and people on the record. If a claim
          rests on one source, we say so. Corrections go on the story itself. No commercial
          relationship has ever decided whether we run something.
        </Prose>
      </EditorialSection>
    </PageShell>
  );
}
