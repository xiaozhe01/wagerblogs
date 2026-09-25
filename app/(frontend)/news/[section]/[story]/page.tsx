import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PostRow from "@/components/cards/PostRow";
import AnchorList from "@/components/rail/AnchorList";
import NewsRail from "@/components/rail/NewsRail";
import ArticleByline from "@/components/section/ArticleByline";
import EditorialSection from "@/components/section/EditorialSection";
import KeyTakeaways from "@/components/section/KeyTakeaways";
import LatestStoriesSection from "@/components/section/LatestStoriesSection";
import EmptyState from "@/components/section/EmptyState";
import Prose from "@/components/section/Prose";
import MediaImage, { resolveMedia } from "@/components/cards/MediaImage";
import { RichText } from "@/components/rich-text/RichText";
import { publishedFilter, resolvePreviewUser } from "@/lib/payload-queries";
import { storyRow } from "@/lib/news-rows";
import { readTime } from "@/lib/lexical";
import { formatDate } from "@/lib/utils";
import { buildOpenGraph } from "@/lib/og";

type StoryParams = { section: string; story: string };

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

async function findStory(sectionSlug: string, storySlug: string, isDraft: boolean) {
  const section = await findSection(sectionSlug);
  if (!section) return undefined;
  const payload = await getPayload({ config });
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const { where, draft } = publishedFilter(
    isDraft,
    {
      slug: { equals: storySlug },
      section: { equals: section.id },
    },
    previewUser,
  );
  // depth 2: author for the byline, plus enough to resolve rich-text internal
  // links that point at another news story or a review.
  const { docs } = await payload.find({
    collection: "news",
    where,
    draft,
    limit: 1,
    depth: 2,
    overrideAccess: false,
  });
  return docs[0] ? { section, story: docs[0] } : undefined;
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  const { where } = publishedFilter(false);
  const { docs } = await payload.find({
    collection: "news",
    where,
    limit: 500,
    depth: 1,
    overrideAccess: false,
  });
  return docs
    .map((story) => ({
      section: typeof story.section === "object" ? story.section.slug : undefined,
      story: story.slug,
    }))
    .filter((entry): entry is StoryParams => Boolean(entry.section));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<StoryParams>;
}): Promise<Metadata> {
  const { section: sectionSlug, story: storySlug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const found = await findStory(sectionSlug, storySlug, isDraft);
  if (!found) return { title: "News — WagerBlogs" };
  const { story } = found;
  return {
    title: story.seo?.metaTitle,
    description: story.seo?.metaDescription,
    openGraph: buildOpenGraph({
      title: story.seo?.metaTitle,
      description: story.seo?.metaDescription,
      ogImage: story.seo?.ogImage,
      type: "article",
      path: `/news/${sectionSlug}/${story.slug}`,
    }),
    alternates: {
      canonical: story.seo?.canonicalUrl || `/news/${sectionSlug}/${story.slug}`,
    },
  };
}

export default async function NewsStoryPage({ params }: { params: Promise<StoryParams> }) {
  const { section: sectionSlug, story: storySlug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const found = await findStory(sectionSlug, storySlug, isDraft);
  // A headline outside the section is a genuine 404, not a soft one.
  if (!found) notFound();
  const { section, story } = found;

  const payload = await getPayload({ config });
  const { where, draft } = publishedFilter(
    isDraft,
    {
      section: { equals: section.id },
      id: { not_equals: story.id },
    },
    previewUser,
  );
  const { docs: siblings } = await payload.find({
    collection: "news",
    where,
    draft,
    sort: "-publishedAt",
    limit: 20,
    depth: 1,
    overrideAccess: false,
  });

  const hero = resolveMedia(story.heroImage);
  const author = typeof story.author === "object" ? story.author : undefined;
  const takeaways = (story.takeaways ?? [])
    .map((entry) => entry.takeaway)
    .filter((entry): entry is string => Boolean(entry));
  const sources = (story.sources ?? []).filter((entry) => entry.label && entry.url);
  const href = `/news/${section.slug}/${story.slug}`;

  const rail = (
    <NewsRail currentSlug={section.slug}>
      {/* Only the other stories in this section — a card listing just the page
          you are on is not a way out of it. */}
      {siblings.length > 0 && (
        <AnchorList
          title={`More in ${section.name}`}
          cardClassName="card"
          items={siblings.map((entry) => ({
            href: `/news/${section.slug}/${entry.slug}`,
            label: entry.title,
            key: entry.slug,
          }))}
        />
      )}
    </NewsRail>
  );

  return (
    <PageShell activeNavId="news" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — reporting, no outbound operator links */}
      <Breadcrumbs
        currentPath={href}
        items={[
          { label: "News", href: "/news" },
          { label: section.name, href: `/news/${section.slug}` },
          { label: story.title },
        ]}
      />

      <article aria-labelledby="story-title" className="w-full flex flex-col gap-5">
        <header className="flex flex-col gap-3 max-w-header">
          <p className="meta-label-caps">
            <Link
              href={`/news/${section.slug}`}
              className="no-underline hover:underline underline-offset-2"
            >
              {section.name}
            </Link>
          </p>
          <h1
            id="story-title"
            className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty"
          >
            {story.title}
          </h1>
          <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
            {story.excerpt}
          </p>
        </header>

        {author && (
          <ArticleByline
            name={author.name}
            credential={author.credentialLine}
            photo={author.photo}
            profileHref={`/authors/${author.slug}`}
            publishedAt={story.publishedAt ? formatDate(story.publishedAt) : ""}
            readTime={readTime(story.body)}
          />
        )}

        <figure className="w-full">
          {/* No hero on the record keeps the existing skeleton shape. */}
          {hero ? (
            <>
              <div className="relative w-full h-45 md:h-80 rounded-md overflow-hidden">
                <MediaImage
                  media={hero}
                  fill
                  sizes="(min-width: 1024px) 920px, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {(hero.credit || hero.caption) && (
                <figcaption className="text-xs text-text-muted tabular-nums leading-loose mt-2">
                  {hero.caption}
                  {hero.caption && hero.credit ? " " : null}
                  {hero.credit ? `Credit: ${hero.credit}` : null}
                </figcaption>
              )}
            </>
          ) : (
            <div
              aria-hidden="true"
              className="h-45 md:h-80 rounded-md placeholder-asset text-xs text-text-muted tabular-nums"
            >
              [hero image — 16:9, credit line required]
            </div>
          )}
        </figure>

        <RichText data={story.body} />

        {takeaways.length > 0 && <KeyTakeaways items={takeaways} />}

        <EditorialSection title="Sources" register="editorial" tier="supporting">
          {sources.length === 0 ? (
            <EmptyState
              title="No sources filed for this story yet"
              body="Every claim carrying a number needs a citation — publisher, title, link, and the date we retrieved it — before this story publishes."
            />
          ) : (
            <ul role="list" className="flex flex-col gap-2">
              {sources.map((source) => (
                <li key={source.id ?? source.url}>
                  <a href={source.url!} rel="nofollow noopener noreferrer" className="link-inline">
                    {source.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </EditorialSection>

        <EditorialSection title="Corrections" register="editorial" tier="supporting">
          {/* TODO(cms): revisions[] — News has no corrections field. The block
              states their absence rather than inventing one. */}
          <Prose>
            No corrections have been issued for this story. Spotted something wrong?{" "}
            <Link href="/contact" className="link-inline">
              Tell us
            </Link>{" "}
            and we&apos;ll fix it, with the change logged here.
          </Prose>
        </EditorialSection>
      </article>

      {siblings.length > 0 && (
        <EditorialSection
          title={`More in ${section.name}`}
          titleHref={`/news/${section.slug}`}
          register="editorial"
        >
          <ul role="list" className="flex flex-col gap-3">
            {siblings.map((entry) => (
              <li key={entry.id}>
                <PostRow post={storyRow(entry, section.slug)} />
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}

      <LatestStoriesSection title="Elsewhere in news" exclude={section.slug} />
    </PageShell>
  );
}
