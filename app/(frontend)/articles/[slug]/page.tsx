import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import ArticleByline from "@/components/section/ArticleByline";
import BlogPostCard from "@/components/cards/BlogPostCard";
import EditorialSection from "@/components/section/EditorialSection";
import KeyTakeaways from "@/components/section/KeyTakeaways";
import { RichText } from "@/components/rich-text/RichText";
import { publishedFilter } from "@/lib/payload-queries";
import { deriveHeadings, readTime } from "@/lib/lexical";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/payload-types";

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only.
export const revalidate = 3600;

async function findArticle(slug: string, isDraft: boolean) {
  const payload = await getPayload({ config });
  const { where, draft } = publishedFilter(isDraft, { slug: { equals: slug } });
  // depth 2: the author for the byline, and enough to resolve rich-text
  // internal links that point at a news story or review.
  const { docs } = await payload.find({
    collection: "articles",
    where,
    draft,
    limit: 1,
    depth: 2,
    overrideAccess: false,
  });
  return docs[0];
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  // No draftMode context at build time — published only, explicitly.
  const { where } = publishedFilter(false);
  const { docs } = await payload.find({
    collection: "articles",
    where,
    limit: 500,
    depth: 0,
    overrideAccess: false,
  });
  return docs.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const article = await findArticle(slug, isDraft);
  if (!article) return { title: "Articles — WagerBlogs" };
  // Straight from the seo group, placeholders included.
  return {
    title: article.seo?.metaTitle,
    description: article.seo?.metaDescription,
    alternates: { canonical: article.seo?.canonicalUrl || `/articles/${article.slug}` },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const article = await findArticle(slug, isDraft);
  // A slug we haven't published is a genuine 404, not this template on someone
  // else's post.
  if (!article) notFound();

  const author = typeof article.author === "object" ? article.author : undefined;
  const related = (article.related ?? []).filter(
    (entry): entry is Article => typeof entry === "object",
  );
  // Retires the hand-authored blogToc: the rail and the mobile nav now read the
  // same headings the converter renders ids for, so they cannot drift.
  const toc = deriveHeadings(article.body).map((heading) => ({
    href: `#${heading.id}`,
    label: heading.label,
    key: heading.id,
  }));
  const takeaways = (article.takeaways ?? [])
    .map((entry) => entry.takeaway)
    .filter((entry): entry is string => Boolean(entry));

  const rail = (
    <>
      {toc.length > 0 && (
        <AnchorList title="On this page" cardClassName="card hidden wide:block" items={toc} />
      )}
      {related.length > 0 && (
        <AnchorList
          title="More like this"
          cardClassName="card"
          items={related.map((entry) => ({
            href: `/articles/${entry.slug}`,
            label: entry.title,
            key: entry.slug,
          }))}
        />
      )}
    </>
  );

  return (
    <PageShell activeNavId="articles" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — pure authority, no outbound operator links */}
      <Breadcrumbs
        currentPath={`/articles/${article.slug}`}
        items={[{ label: "Articles", href: "/articles" }, { label: article.title }]}
      />

      <article aria-labelledby="post-title" className="w-full flex flex-col gap-5">
        <header className="flex flex-col gap-3 max-w-header">
          <p className="meta-label-caps">{article.type}</p>
          <h1
            id="post-title"
            className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty"
          >
            {article.title}
          </h1>
          <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
            {article.excerpt}
          </p>
        </header>

        {author && (
          <ArticleByline
            name={author.name}
            credential={author.credentialLine}
            profileHref={`/authors/${author.slug}`}
            publishedAt={article.publishedAt ? formatDate(article.publishedAt) : ""}
            readTime={readTime(article.body)}
          />
        )}

        <figure className="w-full">
          {/* TODO Phase 4 hold — heroImage is on the schema but image rendering
              needs the Media upload wiring, which is not in FW-1. */}
          <div
            aria-hidden="true"
            className="h-45 md:h-80 rounded-md placeholder-asset text-xs text-text-muted tabular-nums"
          >
            [hero image — 16:9, credit line required]
          </div>
        </figure>

        {toc.length > 0 && (
          // Mobile TOC sits after the intro, before the first H2 — the standard
          // placement for in-article jump links. Desktop uses the rail instead.
          <nav aria-labelledby="article-toc-heading" className="card wide:hidden">
            <h2 id="article-toc-heading" className="heading text-sm mb-2.5">
              On this page
            </h2>
            <AnchorList items={toc} />
          </nav>
        )}

        <RichText data={article.body} />

        {takeaways.length > 0 && <KeyTakeaways items={takeaways} />}

        {/* TODO(cms): Sources[] — Articles has no sources field; News does.
            Omitted rather than faked. */}
      </article>

      {related.length > 0 && (
        <EditorialSection title="Related reading" register="editorial">
          <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
            {related.map((entry) => (
              <li key={entry.slug}>
                <BlogPostCard
                  href={`/articles/${entry.slug}`}
                  kicker={entry.type}
                  title={entry.title}
                  byline={entry.publishedAt ? formatDate(entry.publishedAt) : ""}
                />
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}
    </PageShell>
  );
}
