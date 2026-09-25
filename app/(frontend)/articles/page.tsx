import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Article } from "@/payload-types";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import BlogPostCard from "@/components/cards/BlogPostCard";
import InfoCard from "@/components/rail/InfoCard";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import FilterChips from "@/components/controls/FilterChips";
import PageNav from "@/components/controls/PageNav";
import { resolveMedia } from "@/components/cards/MediaImage";
import { publishedFilter, resolvePreviewUser } from "@/lib/payload-queries";
import { ALL_TYPES, TYPE_PARAM, categoryFilters } from "@/lib/site-data";
import { PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import { readTime } from "@/lib/lexical";
import { chipHref, chipMatches, formatDate, headingId } from "@/lib/utils";
import { buildOpenGraph } from "@/lib/og";

const TITLE = "Articles — WagerBlogs";
const DESCRIPTION =
  "Guides, analysis, and research on sports betting and casino play — written to stand on their own, with no operator recommendations.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: "/articles" }),
  alternates: { canonical: "/articles" },
};

// No `revalidate`: this route reads searchParams for the type chip and the page
// number, so Next renders it per request and the ISR window would never apply.

/** Articles.type, the enum the chips map onto. "News" is deliberately absent —
 * News is its own collection, so a News chip could only ever filter to nothing.
 * See MIGRATION.md D7. */
const ARTICLE_TYPES = ["guide", "analysis", "research", "blog"] as const;

const SECTION_TITLE = "All articles";

export default async function ArticlesIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const payload = await getPayload({ config });

  const activeType = resolveType(query[TYPE_PARAM]);
  const typeHref = (value: string) =>
    chipHref({ basePath: "/articles", param: TYPE_PARAM, value, allValue: ALL_TYPES });

  const matchedType = ARTICLE_TYPES.find((type) => chipMatches(type, activeType));
  // A chip that names no article type filters to nothing rather than silently
  // falling back to every article.
  const chipHasNoType = activeType !== ALL_TYPES && !matchedType;

  // articles filters _status — editorial (drafts enabled). depth 1 resolves the
  // author relationship for the byline.
  const { docs: articles } = chipHasNoType
    ? { docs: [] as Article[] }
    : await payload.find({
        collection: "articles",
        ...publishedFilter(
          isDraft,
          matchedType ? { type: { equals: matchedType } } : {},
          previewUser,
        ),
        sort: "-publishedAt",
        limit: 500,
        depth: 1,
        overrideAccess: false,
      });

  // Changing the chip drops the page param, so a filter always opens on page 1.
  const postPage = paginate(articles, query[PAGE_PARAM]);
  // The LCP candidate is the first card that actually has a thumbnail, not
  // simply the first card — a leading card with no image never paints large.
  const lcpIndex = postPage.items.findIndex((post) => resolveMedia(post.heroImage));

  const rail = (
    <InfoCard
      title="Editorial standards"
      body="How we research, source, and correct what we publish."
      cta={{ href: "/about", label: "Read our methodology" }}
    />
  );

  return (
    <PageShell activeNavId="articles" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — pure authority, no outbound operator links */}
      <Breadcrumbs items={[{ label: "Articles" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Articles
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — guides, strategy, and research written to stand on their own,
          with no operator recommendations anywhere in this section.]
        </p>
      </header>

      <EditorialSection
        title={SECTION_TITLE}
        register="editorial"
        toolbar={
          <FilterChips
            label="Article types"
            items={categoryFilters.map((type) => ({
              label: type,
              key: type,
              href: typeHref(type),
              active: type === activeType,
            }))}
          />
        }
      >
        {/* Keyed so only the feed replays the fade. */}
        <div key={activeType} className="route-transition flex flex-col gap-3">
          {postPage.items.length === 0 ? (
            <EmptyState
              title={`No ${activeType === ALL_TYPES ? "" : `${activeType.toLowerCase()} `}articles published yet`}
              body="An article appears here once it is published in the admin panel."
              action={{ href: typeHref(ALL_TYPES), label: "Show all articles" }}
            />
          ) : (
            <>
              <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
                {postPage.items.map((post, i) => {
                  const author = typeof post.author === "object" ? post.author : undefined;
                  const published = post.publishedAt ? formatDate(post.publishedAt) : undefined;
                  return (
                    <li key={post.id}>
                      <BlogPostCard
                        href={`/articles/${post.slug}`}
                        kicker={post.type}
                        title={post.title}
                        excerpt={post.excerpt}
                        byline={[
                          author ? `by ${author.name}` : undefined,
                          published,
                          readTime(post.body),
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                        thumbnail={post.heroImage}
                        priority={i === lcpIndex}
                      />
                    </li>
                  );
                })}
              </ul>
              <PageNav
                page={postPage.page}
                totalPages={postPage.totalPages}
                label={SECTION_TITLE}
                hrefFor={(n) =>
                  pageHref({
                    basePath: "/articles",
                    page: n,
                    anchor: headingId("section", SECTION_TITLE),
                    params: activeType === ALL_TYPES ? undefined : { [TYPE_PARAM]: activeType },
                  })
                }
              />
            </>
          )}
        </div>
      </EditorialSection>
    </PageShell>
  );
}

/** Unknown or absent chip falls back to "All" rather than an empty list. */
function resolveType(param: string | string[] | undefined) {
  const value = Array.isArray(param) ? param[0] : param;
  if (!value) return ALL_TYPES;
  return categoryFilters.find((type) => chipMatches(type, value)) ?? value;
}
