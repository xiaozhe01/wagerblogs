import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink from "@/components/ui/ArrowLink";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
import AnchorList from "@/components/rail/AnchorList";
import BylineCard from "@/components/section/BylineCard";
import SearchInput from "@/components/rail/SearchInput";
import {
  blogToc,
  blogBodyList,
  blogTakeaways,
  blogRelated,
  blogMoreInGuides,
} from "@/lib/mock-data";

// TODO(cms): replace with generateStaticParams() driven by the CMS post list, and
// fetch this specific post's fields by slug. All content below is static placeholder.
export const metadata: Metadata = {
  title: "[Placeholder] How moneylines actually work — WagerBlogs",
};

const tocItemClassName =
  "flex items-center min-h-11 lg:min-h-8 text-sm text-text-body no-underline border-b border-border-hairline-alt leading-snug";

const postTitle =
  "[Placeholder] How moneylines actually work — and what the numbers are telling you";

export default function BlogPostPage() {
  const rail = (
    <>
      <AnchorList
        title="On this page"
        cardClassName="card hidden lg:block"
        items={blogToc}
        itemClassName={tocItemClassName}
        wrapperClassName="flex flex-col"
      />
      <div className="card">
        <SearchInput />
      </div>
      <AnchorList
        title="More in Guides"
        as="Link"
        items={blogMoreInGuides.map((m) => ({ href: "/blog", label: m, key: m }))}
        itemClassName="block text-sm text-text-body py-3 border-b border-border-hairline-alt leading-snug no-underline"
      />
      <InfoCard
        title="Editorial standards"
        body="How we research, source, and correct our guides."
        cta={
          <ArrowLink
            href="/about"
            className="inline-flex items-center gap-1 text-md text-text-primary font-semibold group"
          >
            Read our methodology
          </ArrowLink>
        }
      />
      <HelpLineCard />
    </>
  );

  return (
    <PageShell activeNavId="blog" rail={rail}>
      {/* Register: Editorial · Tier 1 — pure authority, no outbound operator links */}
      <Breadcrumbs
        items={[
          { label: "Blog", href: "/blog" },
          { label: "Guides", href: "/blog" },
          { label: postTitle },
        ]}
      />

      <header className="flex flex-col gap-3.5 max-w-prose">
        <div className="meta-label-caps">Guides</div>
        <h1 className="heading-serif text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {postTitle}
        </h1>
        <p className="font-serif text-xl md:text-2xl leading-copy text-text-body text-pretty">
          [Placeholder standfirst — one or two sentences that state the article&apos;s argument
          plainly, written to be readable on its own in search results and social previews.]
        </p>
      </header>

      {/* TODO(cms): ArticleByline — requires a real Person record (photo, fullName,
          credential, authorUrl). Article schema requires author.name + author.url —
          this post cannot publish without it. Sample fixture for layout reference only. */}
      <BylineCard
        wrapperClassName="card max-w-prose flex gap-4 items-center"
        profileHref="/authors/jane-placeholder"
      >
        <div className="text-sm font-semibold text-text-primary mb-1">Jane Placeholder</div>
        <div className="text-xs text-text-meta mb-1">Example Analyst, Example Credential Body</div>
      </BylineCard>

      <div className="flex gap-4 flex-wrap items-center py-3 border-t border-b border-border-divider text-xs text-text-subtle font-mono max-w-prose">
        <div>Published [Jul 18, 2026]</div>
        <div>Updated [Jul 24, 2026]</div>
        <div>9 min read</div>
      </div>

      <div className="w-full h-45 md:h-80 rounded-md placeholder-asset text-xs text-text-subtle font-mono">
        [hero image — 16:9, credit line required]
      </div>

      <nav className="card max-w-prose lg:hidden">
        <div className="font-bold text-sm text-text-primary mb-2.5">On this page</div>
        <AnchorList
          items={blogToc}
          itemClassName={tocItemClassName}
          wrapperClassName="flex flex-col"
        />
      </nav>

      <div className="flex flex-col max-w-prose">
        <p className="font-serif text-xl leading-copy text-text-strong-secondary mb-5 text-pretty">
          [Placeholder opening paragraph — sets up the question the piece answers, in plain
          language. Editorial register: long-form measure, serif body, no promotional language and
          no operator links anywhere in this template.]
        </p>

        <h2 id="reading-the-number" className="heading-serif text-3xl leading-heading mt-4 mb-3">
          Reading the number
        </h2>
        <p className="font-serif text-xl leading-copy text-text-strong-secondary mb-5 text-pretty">
          [Placeholder body paragraph.] Internal links go to our own explainers and comparison
          surfaces — for example{" "}
          <Link href="/blog" className="text-text-primary underline underline-offset-2">
            our guide to odds formats
          </Link>{" "}
          or the{" "}
          <Link href="/reviews" className="text-text-primary underline underline-offset-2">
            sportsbook comparison
          </Link>
          . Tier 1 posts link inward to Tier 2/3 pages; they never link out to an operator.
        </p>
        <p className="font-serif text-xl leading-copy text-text-strong-secondary mb-5 text-pretty">
          [Placeholder body paragraph — second beat of the explanation, with the worked example
          introduced below.]
        </p>

        <figure className="my-2 mb-6">
          <div className="h-40 md:h-65 rounded-md placeholder-asset text-xs text-text-subtle font-mono">
            [diagram / chart placeholder]
          </div>
          <figcaption className="text-xs text-text-subtle font-mono leading-loose mt-2">
            Fig. 1 — [caption placeholder]. Source: [named source required before publish].
          </figcaption>
        </figure>

        <h2 id="the-worked-example" className="heading-serif text-3xl leading-heading mt-4 mb-3">
          The worked example
        </h2>
        <p className="font-serif text-xl leading-copy text-text-strong-secondary mb-5 text-pretty">
          [Placeholder body paragraph introducing the list below.]
        </p>
        <ul className="mb-5 pl-5 flex flex-col gap-2 list-disc">
          {blogBodyList.map((li) => (
            <li key={li} className="font-serif text-xl leading-lead text-text-strong-secondary">
              {li}
            </li>
          ))}
        </ul>

        <blockquote className="font-serif italic text-2xl leading-relaxed text-text-primary my-2 mb-6 pl-5 border-l-2 border-text-primary text-pretty">
          [Placeholder pull quote — a line from the piece worth setting apart. Attributed only if it
          belongs to a named, real person.]
        </blockquote>

        <h3 id="common-mistakes" className="heading-serif text-xl leading-heading mt-3 mb-2.5">
          Common mistakes
        </h3>
        <p className="font-serif text-xl leading-copy text-text-strong-secondary mb-5 text-pretty">
          [Placeholder body paragraph.]
        </p>

        <h2 id="what-this-means" className="heading-serif text-3xl leading-heading mt-4 mb-3">
          What this means for your bets
        </h2>
        <p className="font-serif text-xl leading-copy text-text-strong-secondary mb-5 text-pretty">
          [Placeholder closing section — restates the practical takeaway without recommending an
          operator.]
        </p>
      </div>

      <section className="card max-w-prose">
        <div className="meta-label-caps mb-3">Key takeaways</div>
        <div className="flex flex-col gap-2.5">
          {blogTakeaways.map((k) => (
            <div key={k} className="font-serif text-lg leading-relaxed text-text-strong-secondary">
              — {k}
            </div>
          ))}
        </div>
      </section>

      {/* TODO(cms): Sources[] — every claim with a number needs a citation (publisher,
          title, url, retrievedAt) or it is cut from the body copy. Omitted here. */}

      <section>
        <h2 className="heading-serif text-h2-serif leading-heading mb-1">Related reading</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3 mt-3">
          {blogRelated.map((r) => (
            <Link key={r.title} href={r.href ?? "#"} className="editorial-link-card">
              <div className="meta-label-caps mb-2">{r.kicker}</div>
              <div className="heading-serif text-xl leading-snug mb-1.5 text-pretty">{r.title}</div>
              <div className="text-xs text-text-meta leading-relaxed">{r.meta}</div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
