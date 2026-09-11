import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import ArticleByline from "@/components/section/ArticleByline";
import BlogPostCard from "@/components/cards/BlogPostCard";
import EditorialSection from "@/components/section/EditorialSection";
import KeyTakeaways from "@/components/section/KeyTakeaways";
import { blogToc, blogBodyList, blogTakeaways, blogRelated } from "@/lib/mock-data";
import { blogAuthor, blogParams, blogPosts, findBlogPost } from "@/lib/blog";

export function generateStaticParams() {
  return blogParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findBlogPost(slug);
  if (!post) return { title: "Blog — WagerBlogs" };
  return {
    title: `${post.title} — WagerBlogs`,
    description: post.excerpt,
    alternates: { canonical: post.href },
  };
}

// TODO(cms): the body below is static placeholder; only the record fields
// (title, kicker, dates, byline) resolve per post today.
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findBlogPost(slug);
  // A slug we haven't published is a genuine 404, not this template on someone
  // else's post.
  if (!post) notFound();
  const siblings = blogPosts.filter((entry) => entry.slug !== post.slug);
  const rail = (
    <>
      <AnchorList title="On this page" cardClassName="card hidden wide:block" items={blogToc} />
      {siblings.length > 0 && (
        <AnchorList
          title={`More in ${post.kicker}`}
          cardClassName="card"
          items={siblings.map((p) => ({
            href: p.href,
            label: p.title,
            key: p.slug,
          }))}
        />
      )}
    </>
  );

  return (
    <PageShell activeNavId="blog" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — pure authority, no outbound operator links */}
      {/* Page chrome — tracks the column, not the article's measure. */}
      <Breadcrumbs
        currentPath={post.href}
        items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
      />

      <article aria-labelledby="post-title" className="w-full flex flex-col gap-5">
        <header className="flex flex-col gap-3 max-w-header">
          <p className="meta-label-caps">{post.kicker}</p>
          <h1
            id="post-title"
            className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty"
          >
            {post.title}
          </h1>
          <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
            [Placeholder standfirst — one or two sentences that state the article&apos;s argument
            plainly, written to be readable on its own in search results and social previews.]
          </p>
        </header>

        <ArticleByline
          name={blogAuthor.name}
          credential={blogAuthor.credential}
          profileHref={blogAuthor.profileHref}
          publishedAt={post.publishedAt}
          readTime={post.readTime}
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

        {/* Body elements carry no margin — only headings add a top step. */}
        <div className="flex flex-col gap-5">
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder opening paragraph — sets up the question the piece answers, in plain
            language. Editorial register: long-form measure, serif body, no promotional language and
            no operator links anywhere in this template.]
          </p>

          {/* Mobile TOC sits after the intro, before the first H2 — the standard
            placement for in-article jump links (content first, then navigation
            at the point where a reader decides to jump). Desktop uses the rail
            TOC instead. */}
          <nav aria-labelledby="blog-toc-heading" className="card wide:hidden">
            <h2 id="blog-toc-heading" className="heading text-sm mb-2.5">
              On this page
            </h2>
            <AnchorList items={blogToc} />
          </nav>

          <h2 id="reading-the-number" className="heading text-h2 leading-heading mt-4">
            Reading the number
          </h2>
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder body paragraph.] Internal links go to our own explainers and comparison
            surfaces — for example{" "}
            <Link href="/blog" className="link-inline">
              our guide to odds formats
            </Link>{" "}
            or the{" "}
            <Link href="/reviews" className="link-inline">
              sportsbook comparison
            </Link>
            . Tier 1 posts link inward to Tier 2/3 pages; they never link out to an operator.
          </p>
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder body paragraph — second beat of the explanation, with the worked example
            introduced below.]
          </p>

          <figure>
            <div
              aria-hidden="true"
              className="h-40 md:h-65 rounded-md placeholder-asset text-xs text-text-muted tabular-nums"
            >
              [diagram / chart placeholder]
            </div>
            <figcaption className="text-xs text-text-muted tabular-nums leading-loose mt-2">
              Fig. 1 — [caption placeholder]. Source: [named source required before publish].
            </figcaption>
          </figure>

          <h2 id="the-worked-example" className="heading text-h2 leading-heading mt-4">
            The worked example
          </h2>
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder body paragraph introducing the list below.]
          </p>
          <ul role="list" className="pl-5 flex flex-col gap-2 list-disc">
            {blogBodyList.map((li) => (
              <li key={li} className="text-article text-text-strong-secondary">
                {li}
              </li>
            ))}
          </ul>

          <blockquote className="italic text-2xl leading-relaxed text-text-primary pl-5 border-l-2 border-text-primary text-pretty">
            [Placeholder pull quote — a line from the piece worth setting apart. Attributed only if
            it belongs to a named, real person.]
          </blockquote>

          <h3 id="common-mistakes" className="heading text-2xl leading-heading mt-3">
            Common mistakes
          </h3>
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder body paragraph.]
          </p>

          <h2 id="what-this-means" className="heading text-h2 leading-heading mt-4">
            What this means for your bets
          </h2>
          <p className="text-article text-text-strong-secondary text-pretty">
            [Placeholder closing section — restates the practical takeaway without recommending an
            operator.]
          </p>
        </div>

        <KeyTakeaways items={blogTakeaways} />

        {/* TODO(cms): Sources[] — every claim with a number needs a citation (publisher,
          title, url, retrievedAt) or it is cut from the body copy. Omitted here. */}
      </article>

      {/* Shares the article's measure so the two keep one right edge. */}
      <EditorialSection title="Related reading" register="editorial">
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {blogRelated.map((r) => (
            <li key={r.title}>
              <BlogPostCard href={r.href} kicker={r.kicker} title={r.title} byline={r.meta} />
            </li>
          ))}
        </ul>
      </EditorialSection>
    </PageShell>
  );
}
