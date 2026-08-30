import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import ArticleByline from "@/components/section/ArticleByline";
import BlogPostCard from "@/components/cards/BlogPostCard";
import EditorialSection from "@/components/section/EditorialSection";
import SearchInput from "@/components/rail/SearchInput";
import {
  mockBlogPost,
  blogToc,
  blogBodyList,
  blogTakeaways,
  blogRelated,
  blogMoreInGuides,
} from "@/lib/mock-data";

// TODO(cms): replace with generateStaticParams() driven by the CMS post list, and
// fetch this specific post's fields by slug. All content below is static placeholder;
// title/kicker/dates/author flow from the single mockBlogPost record into metadata,
// breadcrumbs, H1, and the byline — same pattern as the reviews templates.
export const metadata: Metadata = {
  title: `${mockBlogPost.title} — WagerBlogs`,
};

export default function BlogPostPage() {
  const rail = (
    <>
      <SearchInput />
      <AnchorList title="On this page" cardClassName="card hidden wide:block" items={blogToc} />
      <AnchorList
        title="More in Guides"
        cardClassName="card"
        items={blogMoreInGuides.map((m) => ({
          href: "/blog",
          label: m,
          key: m,
        }))}
      />
    </>
  );

  return (
    <PageShell activeNavId="blog" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — pure authority, no outbound operator links */}
      {/* Page chrome — tracks the column, not the article's measure. */}
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: mockBlogPost.kicker, href: "/blog" },
          { label: mockBlogPost.title },
        ]}
      />

      {/* max-w-prose sits here only, so everything below shares its edges. */}
      <article
        aria-labelledby="post-title"
        className="w-full self-center max-w-article flex flex-col gap-5"
      >
        <header className="flex flex-col gap-3">
          <p className="meta-label-caps self-center">{mockBlogPost.kicker}</p>
          <h1
            id="post-title"
            className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty"
          >
            {mockBlogPost.title}
          </h1>
          <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
            [Placeholder standfirst — one or two sentences that state the article&apos;s argument
            plainly, written to be readable on its own in search results and social previews.]
          </p>
        </header>

        <ArticleByline
          name={mockBlogPost.author.name}
          credential={mockBlogPost.author.credential}
          profileHref={mockBlogPost.author.profileHref}
          publishedAt={mockBlogPost.publishedAt}
          readTime={mockBlogPost.readTime}
        />

        <figure className="w-full">
          {/* TODO(cms): real <Image> + a <figcaption> credit line; both required before publish. */}
          <div
            aria-hidden="true"
            className="h-45 md:h-80 rounded-md placeholder-asset text-xs text-text-subtle tabular-nums"
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
            <Link
              href="/blog"
              className="text-text-body underline underline-offset-2 transition-colors hover:text-text-primary"
            >
              our guide to odds formats
            </Link>{" "}
            or the{" "}
            <Link
              href="/reviews"
              className="text-text-body underline underline-offset-2 transition-colors hover:text-text-primary"
            >
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
              className="h-40 md:h-65 rounded-md placeholder-asset text-xs text-text-subtle tabular-nums"
            >
              [diagram / chart placeholder]
            </div>
            <figcaption className="text-xs text-text-subtle tabular-nums leading-loose mt-2">
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

        <section
          className="flex flex-col gap-3 border-l-2 border-text-primary pl-4 md:pl-5"
          aria-labelledby="key-takeaways"
        >
          <h2 id="key-takeaways" className="meta-label-caps">
            Key takeaways
          </h2>
          <ol role="list" className="flex flex-col gap-2.5">
            {blogTakeaways.map((k, i) => (
              <li key={k} className="flex gap-2.5 items-start">
                <span
                  aria-hidden="true"
                  className="w-legacy-6 h-legacy-6 shrink-0 rounded-full bg-bg-accent text-text-on-accent flex items-center justify-center text-2xs font-bold"
                >
                  {i + 1}
                </span>
                <span className="text-lg leading-relaxed text-text-strong-secondary">{k}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* TODO(cms): Sources[] — every claim with a number needs a citation (publisher,
          title, url, retrievedAt) or it is cut from the body copy. Omitted here. */}
      </article>

      {/* Shares the article's measure so the two keep one right edge. */}
      <EditorialSection
        title="Related reading"
        register="editorial"
        className="max-w-prose self-center"
      >
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {blogRelated.map((r) => (
            <li key={r.title}>
              <BlogPostCard
                href={r.href ?? "#"}
                kicker={r.kicker}
                title={r.title}
                byline={r.meta}
              />
            </li>
          ))}
        </ul>
      </EditorialSection>
    </PageShell>
  );
}
