import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { publishedFilter, resolvePreviewUser } from "@/lib/payload-queries";
import { getPayload, type Where } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import FilterChips from "@/components/controls/FilterChips";
import PostRow from "@/components/cards/PostRow";
import TeaserCardGrid from "@/components/cards/TeaserCardGrid";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import InfoCard from "@/components/rail/InfoCard";
// TODO Phase 4 hold — no Payload source for this field yet.
import { categoryCompareLinks } from "@/lib/mock-data";
import { ALL_TYPES, TYPE_PARAM, categoryFilters } from "@/lib/site-data";
import { chipHref, chipMatches, chipSlug, formatDate, headingId, resolveChip } from "@/lib/utils";
import { readTime } from "@/lib/lexical";
import { articleRow } from "@/lib/article-rows";
import MediaImage, { resolveMedia } from "@/components/cards/MediaImage";
import { PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import { buildOpenGraph } from "@/lib/og";
import PageNav from "@/components/controls/PageNav";
import type { Article } from "@/payload-types";

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only.
export const revalidate = 3600;

/** The article-type enum on Articles. The "News" chip has no member here — news
 * lives in its own collection with no vertical relationship — so selecting it
 * can only produce an empty feed. That is the honest answer, not a bug. */
const ARTICLE_TYPES = ["guide", "analysis", "research", "blog"] as const;

/** verticals has no _status — structural (no lifecycle). */
async function findVertical(slug: string) {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "verticals",
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
    collection: "verticals",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });
  return docs.map((vertical) => ({ slug: vertical.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vertical = await findVertical(slug);
  if (!vertical) return { title: "Categories — WagerBlogs" };
  // Straight from the seo group, placeholders included — composing a title from
  // vertical.name would hide an unwritten record instead of showing it.
  return {
    title: vertical.seo?.metaTitle,
    description: vertical.seo?.metaDescription,
    openGraph: buildOpenGraph({
      title: vertical.seo?.metaTitle,
      description: vertical.seo?.metaDescription,
      ogImage: vertical.seo?.ogImage,
      path: `/categories/${vertical.slug}`,
    }),
    alternates: { canonical: vertical.seo?.canonicalUrl || `/categories/${vertical.slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const vertical = await findVertical(slug);
  // A vertical we don't cover is a genuine 404, not another category's page.
  if (!vertical) notFound();

  const query = await searchParams;
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const payload = await getPayload({ config });

  const activeType = resolveChip(categoryFilters, query[TYPE_PARAM], ALL_TYPES);
  const typeHref = (value: string) =>
    chipHref({ basePath: `/categories/${slug}`, param: TYPE_PARAM, value, allValue: ALL_TYPES });

  const matchedType = ARTICLE_TYPES.find((type) => chipMatches(type, activeType));
  // A chip that names no article type filters to nothing rather than silently
  // falling back to every article.
  const chipHasNoType = activeType !== ALL_TYPES && !matchedType;

  // articles filters _status — editorial (drafts enabled). depth 1 resolves the
  // author relationship for the byline.
  const forVertical: Where = { vertical: { equals: vertical.id } };

  const { docs: articles } = chipHasNoType
    ? { docs: [] as Article[] }
    : await payload.find({
        collection: "articles",
        ...publishedFilter(
          isDraft,
          matchedType ? { ...forVertical, type: { equals: matchedType } } : forVertical,
          previewUser,
        ),
        sort: "-publishedAt",
        limit: 500,
        depth: 1,
        overrideAccess: false,
      });

  // The Editor's lead: the newest published article in THIS vertical. No
  // fallback — if the vertical has nothing, the section is absent entirely.
  const { docs: leadDocs } = await payload.find({
    collection: "articles",
    ...publishedFilter(isDraft, forVertical, previewUser),
    sort: "-publishedAt",
    limit: 1,
    depth: 1,
    overrideAccess: false,
  });
  const lead = leadDocs[0];

  const { totalDocs: guideCount } = await payload.find({
    collection: "articles",
    ...publishedFilter(isDraft, { ...forVertical, type: { equals: "guide" } }, previewUser),
    limit: 0,
    depth: 0,
    overrideAccess: false,
  });

  // verticals has no _status — structural.
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  // Changing the chip drops the page param, so a filter always opens on page 1.
  const articlePage = paginate(articles, query[PAGE_PARAM]);
  const sectionTitle = `Latest in ${vertical.name}`;

  const rail = (
    <>
      <section className="card" aria-labelledby="rail-all-categories">
        <h2 id="rail-all-categories" className="heading text-sm mb-2.5">
          All categories
        </h2>
        <AnchorList
          items={verticals.map((entry) => ({
            href: `/categories/${entry.slug}`,
            label: entry.name,
            key: entry.slug,
            current: entry.slug === vertical.slug,
          }))}
        />
      </section>
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
      <Breadcrumbs
        currentPath={`/categories/${vertical.slug}`}
        items={[{ label: "Categories", href: "/categories" }, { label: vertical.name }]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {vertical.name}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          {vertical.description}
        </p>
        <p className="flex gap-4 flex-wrap text-xs text-text-muted tabular-nums">
          <span>
            {guideCount} {guideCount === 1 ? "guide" : "guides"}
          </span>
          {/* TODO Phase 4 hold — review count and a last-updated stamp have no
              wired source on this route yet. */}
          <span>[n] reviews</span>
          <span>Updated [date required]</span>
        </p>
      </header>

      {lead && (
        <article aria-labelledby="editors-lead">
          <Link
            href={`/articles/${lead.slug}`}
            className="flex flex-col md:flex-row gap-3.5 md:gap-4 items-stretch md:items-center no-underline border-t border-b border-border-divider py-4 md:py-5"
          >
            {/* No heroImage on the record keeps the skeleton shape.
                Measured: 343px at 390, 320px from md up. */}
            {resolveMedia(lead.heroImage) ? (
              <div className="w-full md:w-80 h-45 md:h-50 shrink-0 rounded-md overflow-hidden relative">
                <MediaImage
                  media={lead.heroImage}
                  fill
                  sizes="(min-width: 768px) 320px, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                aria-hidden="true"
                className="w-full md:w-80 h-45 md:h-50 shrink-0 rounded-md placeholder-asset text-2xs text-text-muted tabular-nums text-center"
              >
                [lead image — credit line required]
              </div>
            )}
            <div className="min-w-0 flex flex-col gap-2">
              <p className="meta-label-caps">Editor&apos;s lead</p>
              <h2 id="editors-lead" className="heading text-4xl leading-heading text-pretty">
                {lead.title}
              </h2>
              <p className="text-lg leading-copy text-text-muted text-pretty">{lead.excerpt}</p>
              <p className="text-xs font-medium text-text-muted tabular-nums">
                {lead.publishedAt && (
                  <time dateTime={lead.publishedAt}>{formatDate(lead.publishedAt)}</time>
                )}{" "}
                · {readTime(lead.body)}
              </p>
            </div>
          </Link>
        </article>
      )}

      <EditorialSection
        title={sectionTitle}
        register="editorial"
        toolbar={
          <FilterChips
            label="Filter by article type"
            items={categoryFilters.map((filter) => ({
              label: filter,
              key: filter,
              href: typeHref(filter),
              active: filter === activeType,
            }))}
          />
        }
      >
        {/* Keyed so only the feed replays the fade. */}
        <div key={activeType} className="route-transition">
          {articlePage.items.length === 0 ? (
            <EmptyState
              title={
                activeType === ALL_TYPES
                  ? `Nothing filed under ${vertical.name} yet`
                  : `No ${activeType.toLowerCase()} filed under ${vertical.name} yet`
              }
              body="Articles appear here once they are published in the admin panel."
              action={{ href: typeHref(ALL_TYPES), label: "Show all" }}
            />
          ) : (
            <ul role="list" className="flex flex-col gap-3">
              {articlePage.items.map((article) => (
                <li key={article.id}>
                  <PostRow post={articleRow(article)} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <PageNav
          page={articlePage.page}
          totalPages={articlePage.totalPages}
          label={sectionTitle}
          hrefFor={(n) =>
            pageHref({
              basePath: `/categories/${slug}`,
              page: n,
              params: {
                [TYPE_PARAM]: activeType === ALL_TYPES ? undefined : chipSlug(activeType),
              },
              anchor: headingId("section", sectionTitle),
            })
          }
        />
      </EditorialSection>

      {/* TODO(cms): a "browse by title" grid returns when sub-categories carry
          their own collections and routes — six tiles that navigate nowhere and
          count nothing are worse than no section. */}
      <EditorialSection title="Compare operators in this category" register="editorial">
        {/* TODO Phase 4 hold — no Payload source for this field yet. */}
        <TeaserCardGrid
          items={categoryCompareLinks}
          titleClassName="text-lg font-semibold text-text-primary mb-1.5 leading-snug"
        />
      </EditorialSection>

      {/* TODO(cms): SourcedStat[] — category market data needs a real source + period
          per figure, or the strip stays absent. Omitted here. */}
    </PageShell>
  );
}
