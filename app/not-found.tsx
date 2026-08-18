import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import HelpLineCard from "@/components/rail/HelpLineCard";
import ExploreSection from "@/components/section/ExploreSection";
import RecentPublishedSection from "@/components/section/RecentPublishedSection";
import ArrowLink from "@/components/ui/ArrowLink";
import InfoCard from "@/components/rail/InfoCard";
import SearchInput from "@/components/rail/SearchInput";
import { popular } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "We couldn't find that page — WagerBlogs",
  robots: { index: false, follow: true },
};

// TODO(dev): this file must be served with an actual HTTP 404 status, not a 200 with
// a 404-looking page — Next.js's not-found.tsx convention handles this automatically
// when reached via notFound() or an unmatched route. Verify in production with:
//   curl -sI https://wagerblogs.com/does-not-exist | head -1   → expect HTTP/2 404
// Also confirm this route is excluded from sitemap.xml and carries no canonical
// pointing at the homepage.

export default function NotFound() {
  const rail = (
    <>
      <div className="card">
        <div className="font-bold text-sm text-text-primary mb-2.5">Popular right now</div>
        {popular.map((p, i) => (
          <Link
            key={i}
            href="#"
            className="flex items-center min-h-11 lg:min-h-9.5 text-sm text-text-body no-underline border-b border-border-hairline-alt leading-relaxed"
          >
            {p}
          </Link>
        ))}
      </div>
      <InfoCard
        title="Start from the top"
        body="Our latest coverage, guides, and category directory in one place."
        cta={
          <ArrowLink
            href="/"
            className="inline-flex items-center gap-1 text-xs text-text-primary font-semibold group w-fit"
          >
            Go to the homepage
          </ArrowLink>
        }
      />
      <HelpLineCard />
    </>
  );

  return (
    <PageShell rail={rail}>
      <section className="flex items-center gap-3 flex-wrap">
        <span className="font-mono text-2xs tracking-wide px-2.5 py-1 rounded-sm bg-bg-accent text-text-on-accent">
          HTTP 404
        </span>
        <span className="font-mono text-xs text-text-subtle leading-relaxed">
          requested path: [/the-path-that-was-requested]
        </span>
      </section>

      <header className="flex flex-col gap-3 max-w-155">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          We couldn&apos;t find that page
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          The link may be out of date, or the page may have moved. Everything below is a way back to
          what you were probably looking for.
        </p>
      </header>

      <section className="">
        <div className="meta-label-caps mb-2.5">Search the site</div>
        <div className="flex  flex-col md:flex-row gap-2.5">
          <SearchInput />
          <Link href="#" className="btn-primary min-h-12 px-5">
            Search
          </Link>
        </div>
      </section>

      <ExploreSection />

      <RecentPublishedSection />

      <section className="flex flex-col items-start gap-1 max-w-full border-t border-border-divider pt-4">
        <div className="text-sm text-text-body leading-relaxed">
          Landed here from a link on our own site? That&apos;s a bug on our side — tell us and
          we&apos;ll fix it.
        </div>
        <ArrowLink
          href="/contact"
          className="inline-flex items-center center gap-1 min-h-11 text-xs text-text-primary font-semibold group w-fit"
        >
          Report a broken link
        </ArrowLink>
      </section>
    </PageShell>
  );
}
