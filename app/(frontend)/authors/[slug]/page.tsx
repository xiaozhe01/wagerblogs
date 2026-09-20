import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import PostRow from "@/components/cards/PostRow";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import InfoCard from "@/components/rail/InfoCard";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import MediaImage, { resolveMedia } from "@/components/cards/MediaImage";
import { RichText } from "@/components/rich-text/RichText";
import { publishedFilter } from "@/lib/payload-queries";
import { readTime } from "@/lib/lexical";
import { formatDate } from "@/lib/utils";
import type { PostTeaser } from "@/lib/types";

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only.
export const revalidate = 3600;

async function findAuthor(slug: string, isDraft: boolean) {
  const payload = await getPayload({ config });
  const { where, draft } = publishedFilter(isDraft, { slug: { equals: slug } });
  const { docs } = await payload.find({
    collection: "authors",
    where,
    draft,
    limit: 1,
    depth: 1,
    overrideAccess: false,
  });
  return docs[0];
}

export async function generateStaticParams() {
  const payload = await getPayload({ config });
  // No draftMode context at build time — published only, explicitly.
  const { where } = publishedFilter(false);
  const { docs } = await payload.find({
    collection: "authors",
    where,
    limit: 500,
    depth: 0,
    overrideAccess: false,
  });
  return docs.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const author = await findAuthor(slug, isDraft);
  if (!author) return { title: "Authors — WagerBlogs" };
  // Straight from the seo group, placeholders included.
  return {
    title: author.seo?.metaTitle,
    description: author.seo?.metaDescription,
    alternates: { canonical: author.seo?.canonicalUrl || `/authors/${author.slug}` },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { isEnabled: isDraft } = await draftMode();
  const author = await findAuthor(slug, isDraft);
  // No Person record is a genuine 404 — this page never renders with a
  // placeholder name, stock headshot, or invented credential.
  if (!author) notFound();

  const payload = await getPayload({ config });
  const byAuthor = { author: { equals: author.id } };
  // Three sequential queries — one per editorial collection this author can
  // appear in. Sequential rather than parallel to stay inside the pool budget
  // documented in STRUCTURE.md.
  const articles = await payload.find({
    collection: "articles",
    ...publishedFilter(isDraft, byAuthor),
    sort: "-publishedAt",
    limit: 10,
    depth: 1,
    overrideAccess: false,
  });
  const news = await payload.find({
    collection: "news",
    ...publishedFilter(isDraft, byAuthor),
    sort: "-publishedAt",
    limit: 10,
    depth: 1,
    overrideAccess: false,
  });
  const reviews = await payload.find({
    collection: "reviews",
    ...publishedFilter(isDraft, byAuthor),
    sort: "-lastVerified",
    limit: 10,
    depth: 1,
    overrideAccess: false,
  });

  const photo = resolveMedia(author.photo);
  const beats = (author.beats ?? [])
    .map((entry) => entry.beat)
    .filter((entry): entry is string => Boolean(entry));
  const standards = (author.standards ?? [])
    .map((entry) => entry.standard)
    .filter((entry): entry is string => Boolean(entry));
  const sameAs = (author.sameAs ?? []).filter((entry) => entry.url);

  const recent: PostTeaser[] = [
    ...articles.docs.map((doc) => ({
      kicker: doc.type,
      title: doc.title,
      excerpt: doc.excerpt,
      meta: [doc.publishedAt ? formatDate(doc.publishedAt) : undefined, readTime(doc.body)]
        .filter(Boolean)
        .join(" · "),
      href: `/articles/${doc.slug}`,
    })),
    ...news.docs.map((doc) => ({
      kicker: "News",
      title: doc.title,
      excerpt: doc.excerpt,
      meta: [doc.publishedAt ? formatDate(doc.publishedAt) : undefined, readTime(doc.body)]
        .filter(Boolean)
        .join(" · "),
      href: typeof doc.section === "object" ? `/news/${doc.section.slug}/${doc.slug}` : `/news`,
    })),
    ...reviews.docs.map((doc) => ({
      kicker: "Review",
      title: `${doc.name} review`,
      meta: `Last verified ${formatDate(doc.lastVerified)}`,
      href:
        typeof doc.vertical === "object" ? `/reviews/${doc.vertical.slug}/${doc.slug}` : `/reviews`,
    })),
  ];

  const rail = (
    <>
      {beats.length > 0 && (
        <section className="card" aria-labelledby="rail-coverage-areas">
          <h2 id="rail-coverage-areas" className="heading text-sm mb-2.5">
            Coverage areas
          </h2>
          {/* TODO(cms): these become links once an author-filtered archive exists. */}
          <ul role="list" className="flex gap-2 flex-wrap">
            {beats.map((beat) => (
              <li
                key={beat}
                className="btn-secondary min-h-0 py-2 px-3 text-xs leading-heading cursor-default"
              >
                {beat}
              </li>
            ))}
          </ul>
        </section>
      )}
      <InfoCard
        title="Editorial standards"
        body="How we research, source, and correct what we publish."
        cta={{ href: "/about", label: "Read our methodology" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — author identity surface, no outbound operator links */}
      <Breadcrumbs
        currentPath={`/authors/${author.slug}`}
        items={[{ label: "Authors", href: "/authors" }, { label: author.name }]}
      />

      <header className="flex flex-col gap-4 md:gap-5 max-w-header border-t border-border-divider border-b py-4 md:py-5">
        <div className="flex flex-col md:flex-row items-start gap-4 md:gap-5">
          {/* No photo on the record keeps the existing skeleton shape rather
              than rendering a broken or invented image. */}
          {photo ? (
            <div className="w-24 h-24 md:w-30 md:h-30 rounded-full overflow-hidden shrink-0 relative">
              <MediaImage media={photo} fill sizes="120px" className="object-cover" priority />
            </div>
          ) : (
            <div className="w-24 h-24 md:w-30 md:h-30 rounded-full placeholder-asset shrink-0" />
          )}
          <div className="min-w-0 flex flex-col gap-3">
            <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
              {author.name}
            </h1>
            <p className="text-sm font-medium text-text-muted">{author.credentialLine}</p>
            {author.bio && <RichText data={author.bio} />}
          </div>
        </div>
      </header>

      <EditorialSection title="Recent work" register="editorial">
        {recent.length === 0 ? (
          <EmptyState
            title={`Nothing published by ${author.name} yet`}
            body="Articles, news and reviews credited to this author appear here once published."
          />
        ) : (
          <ul role="list" className="flex flex-col gap-3">
            {recent.map((post) => (
              <li key={post.href}>
                <PostRow post={post} />
              </li>
            ))}
          </ul>
        )}
      </EditorialSection>

      {standards.length > 0 && (
        <EditorialSection title="How this author works" register="editorial">
          <ul role="list" className="flex flex-col gap-2">
            {standards.map((standard) => (
              <li
                key={standard}
                className="border-t border-border-hairline pt-3 text-sm text-text-muted leading-loose"
              >
                {standard}
              </li>
            ))}
          </ul>
          <ArrowLink href="/about" className={sectionCtaClassName}>
            Read our full editorial standards
          </ArrowLink>
        </EditorialSection>
      )}

      {sameAs.length > 0 && (
        <EditorialSection title="Elsewhere" register="editorial" tier="supporting">
          <ul role="list" className="flex flex-col gap-2">
            {sameAs.map((entry) => (
              <li key={entry.id ?? entry.url}>
                <a href={entry.url!} rel="nofollow noopener noreferrer" className="link-inline">
                  {entry.label || entry.url}
                </a>
              </li>
            ))}
          </ul>
        </EditorialSection>
      )}

      <section aria-label="Contact this author" className="flex flex-col items-start gap-1">
        <p className="text-sm text-text-body font-medium leading-relaxed">
          Questions about this author&apos;s work?
        </p>
        <ArrowLink href="/contact" className={sectionCtaClassName}>
          Contact the editorial desk
        </ArrowLink>
      </section>
    </PageShell>
  );
}
