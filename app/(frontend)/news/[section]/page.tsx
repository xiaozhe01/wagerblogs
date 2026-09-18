import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getPayload, type Where } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PostRow from "@/components/cards/PostRow";
import NewsRail from "@/components/rail/NewsRail";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import LinkTileGrid from "@/components/cards/LinkTileGrid";
import { storyRow } from "@/lib/news-rows";
import { PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import { formatDate, headingId } from "@/lib/utils";
import PageNav from "@/components/controls/PageNav";
import Prose from "@/components/section/Prose";

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only.
export const revalidate = 3600;

/** news-sections has no _status — structural (no lifecycle). */
async function findSection(slug: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "news-sections",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    overrideAccess: false,
  });
  return docs[0];
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "news-sections",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });
  return docs.map((section) => ({ section: section.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}): Promise<Metadata> {
  const { section: sectionSlug } = await params;
  const section = await findSection(sectionSlug);
  if (!section) return { title: "News — WagerBlogs" };
  // Straight from the seo group, placeholders included.
  return {
    title: section.seo?.metaTitle,
    description: section.seo?.metaDescription,
    alternates: { canonical: section.seo?.canonicalUrl || `/news/${section.slug}` },
  };
}

export default async function NewsSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { section: sectionSlug } = await params;
  const query = await searchParams;
  const { isEnabled: isDraft } = await draftMode();

  const section = await findSection(sectionSlug);
  // A sport outside the taxonomy is a genuine 404, not an empty section page.
  if (!section) notFound();

  const payload = await getPayload({ config });
  const published: Where = isDraft ? {} : { _status: { equals: "published" } };

  // news filters _status — editorial (drafts enabled).
  const { docs: stories } = await payload.find({
    collection: "news",
    where: { section: { equals: section.id }, ...published },
    draft: isDraft,
    sort: "-publishedAt",
    limit: 500,
    depth: 1,
    overrideAccess: false,
  });

  // news-sections has no _status — structural.
  const { docs: sections } = await payload.find({
    collection: "news-sections",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  // "Elsewhere in the newsroom": one story from each other section. Queried per
  // section rather than as a single sorted query, because a single query gives
  // no per-section distribution guarantee — this mirrors what the lib version did.
  const others = sections.filter((entry) => entry.id !== section.id);
  const elsewhere = (
    await Promise.all(
      others.map(async (entry) => {
        const { docs } = await payload.find({
          collection: "news",
          where: { section: { equals: entry.id }, ...published },
          draft: isDraft,
          sort: "-publishedAt",
          limit: 1,
          depth: 1,
          overrideAccess: false,
        });
        return docs[0] ? { story: docs[0], section: entry } : undefined;
      }),
    )
  )
    .filter((entry) => entry !== undefined)
    .slice(0, 3);

  const storyPage = paginate(stories, query[PAGE_PARAM]);
  const href = `/news/${section.slug}`;

  /** Tile line for a section: how much is filed, and how recently. */
  const summaryFor = (id: number, name: string) => {
    if (id === section.id) {
      const latest = stories[0]?.publishedAt;
      return stories.length === 0
        ? "No stories filed yet"
        : `${stories.length} ${stories.length === 1 ? "story" : "stories"} · latest ${formatDate(latest!)}`;
    }
    return `Browse ${name} coverage`;
  };

  return (
    <PageShell
      activeNavId="news"
      register="editorial"
      rail={<NewsRail currentSlug={section.slug} />}
    >
      {/* Register: Editorial · Tier 1 — reporting, no outbound operator links */}
      <Breadcrumbs
        currentPath={href}
        items={[{ label: "News", href: "/news" }, { label: section.name }]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {section.name}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          {section.description}
        </p>
      </header>

      <EditorialSection title="Latest stories" register="editorial">
        {storyPage.items.length === 0 ? (
          <EmptyState
            title={`No ${section.name} stories filed yet`}
            body="Stories appear here once they are published in the admin panel."
            action={{ href: "/news", label: "All news" }}
          />
        ) : (
          <ul role="list" className="flex flex-col gap-3">
            {storyPage.items.map((story) => (
              <li key={story.id}>
                <PostRow post={storyRow(story, section.slug)} />
              </li>
            ))}
          </ul>
        )}
        <PageNav
          page={storyPage.page}
          totalPages={storyPage.totalPages}
          label={`Latest ${section.name} stories`}
          hrefFor={(n) =>
            pageHref({ basePath: href, page: n, anchor: headingId("section", "Latest stories") })
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
            {elsewhere.map(({ story, section: entry }) => (
              <li key={story.id}>
                <PostRow post={storyRow(story, entry.slug, { kicker: entry.name })} />
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}

      <EditorialSection title="Browse all sections" register="editorial" tier="supporting">
        <LinkTileGrid
          items={sections.map((entry) => ({
            href: `/news/${entry.slug}`,
            title: entry.name,
            desc: summaryFor(entry.id, entry.name),
            key: entry.slug,
            current: entry.id === section.id,
          }))}
        />
      </EditorialSection>
    </PageShell>
  );
}
