import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { newsStoryAuthor, newsStoryTakeaways } from "@/lib/mock-data";
import { findNewsStory, newsSections, storyRow } from "@/lib/news";

type StoryParams = { slug: string; story: string };

export function generateStaticParams() {
  return newsSections.flatMap((section) =>
    section.stories.map((story) => ({ slug: section.slug, story: story.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<StoryParams>;
}): Promise<Metadata> {
  const { slug, story: storySlug } = await params;
  const found = findNewsStory(slug, storySlug);
  if (!found) return { title: "News — WagerBlogs" };
  return {
    title: `${found.story.title} — WagerBlogs`,
    description: found.story.excerpt,
    alternates: { canonical: found.story.href },
  };
}

export default async function NewsStoryPage({ params }: { params: Promise<StoryParams> }) {
  const { slug, story: storySlug } = await params;
  const found = findNewsStory(slug, storySlug);
  // A headline outside the section is a genuine 404, not a soft one.
  if (!found) notFound();
  const { section, story } = found;
  const siblings = section.stories.filter((s) => s.slug !== story.slug);

  const rail = (
    <NewsRail currentSlug={section.slug}>
      {/* Only the other stories in this section — a card listing just the page
          you are on is not a way out of it. */}
      {siblings.length > 0 && (
        <AnchorList
          title={`More in ${section.category}`}
          cardClassName="card"
          items={siblings.map((s) => ({
            href: s.href,
            label: s.title,
            key: s.slug,
          }))}
        />
      )}
    </NewsRail>
  );

  return (
    <PageShell activeNavId="news" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — reporting, no outbound operator links */}
      <Breadcrumbs
        currentPath={story.href}
        items={[
          { label: "News", href: "/news" },
          { label: section.category, href: section.href },
          { label: story.title },
        ]}
      />

      <article aria-labelledby="story-title" className="w-full flex flex-col gap-5">
        <header className="flex flex-col gap-3 max-w-header">
          <p className="meta-label-caps">
            <Link href={section.href} className="no-underline hover:underline underline-offset-2">
              {section.category}
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

        <ArticleByline
          name={newsStoryAuthor.name}
          credential={newsStoryAuthor.credential}
          profileHref={newsStoryAuthor.profileHref}
          publishedAt={story.publishedAt}
          readTime={story.readTime}
        />

        <figure className="w-full">
          {/* TODO(cms): real <Image> + a <figcaption> credit line; both required before publish. */}
          <div
            aria-hidden="true"
            className="h-45 md:h-80 rounded-md placeholder-asset text-xs text-text-muted tabular-nums"
          >
            [hero image — 16:9, credit line required]
          </div>
        </figure>

        <div className="flex flex-col gap-5">
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder opening paragraph — the news in the first two sentences, then the context
            that makes it matter. Editorial register: reporting only, no operator links anywhere in
            this template.]
          </p>

          <h2 id="what-happened" className="heading text-h2 leading-heading mt-4">
            What happened
          </h2>
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder body paragraph.] Internal links go to our own explainers — for example{" "}
            <Link href="/blog" className="link-inline">
              our betting guides
            </Link>{" "}
            or the{" "}
            <Link href={section.href} className="link-inline">
              rest of our {section.category.toLowerCase()} coverage
            </Link>
            .
          </p>

          <h2 id="what-it-means" className="heading text-h2 leading-heading mt-4">
            What it means
          </h2>
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder closing section — the practical read for a bettor, without recommending an
            operator.]
          </p>
        </div>

        <KeyTakeaways items={newsStoryTakeaways} />

        {/* TODO(cms): Sources[] — publisher, title, url, retrievedAt per entry.
            Until the desk files them the section states their absence rather
            than rendering plausible-looking citations. */}
        <EditorialSection title="Sources" register="editorial" tier="supporting">
          <EmptyState
            title="No sources filed for this story yet"
            body="Every claim carrying a number needs a citation — publisher, title, link, and the date we retrieved it — before this story publishes."
          />
        </EditorialSection>

        <EditorialSection title="Corrections" register="editorial" tier="supporting">
          {/* TODO(cms): revisions[] — a published correction appends a dated entry here. */}
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
          title={`More in ${section.category}`}
          titleHref={section.href}
          register="editorial"
        >
          <ul role="list" className="flex flex-col gap-3">
            {siblings.map((s) => (
              <li key={s.slug}>
                <PostRow post={storyRow(s)} />
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}

      <LatestStoriesSection title="Elsewhere in news" exclude={section.slug} />
    </PageShell>
  );
}
