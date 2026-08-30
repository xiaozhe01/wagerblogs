import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import ExploreSection from "@/components/section/ExploreSection";
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
      {/* TODO(cms): hrefs must come from the same dynamic popular-posts data as the labels */}
      <AnchorList
        title="Popular right now"
        cardClassName="card"
        items={popular.map((p, i) => ({
          href: "/blog/sample-post",
          label: p,
          key: i,
        }))}
      />
    </>
  );

  return (
    <PageShell rail={rail}>
      <Breadcrumbs items={[{ label: "Page not found" }]} />

      <section className="flex flex-col items-center text-center gap-3 py-2 md:py-4">
        <h1 className="font-sans font-heavy text-[96px] md:text-[160px] leading-none tracking-[-0.02em] text-text-subtle select-none">
          <span aria-hidden="true">404</span>
          <span className="sr-only">We couldn&apos;t find that page</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium leading-copy text-text-body text-pretty max-w-160">
          {`The page you're looking for doesn't exist, has moved, or the URL has a typo. Try starting over at our `}
          <Link
            href="/"
            className="text-text-body underline underline-offset-6 transition-colors hover:text-text-primary"
          >
            Homepage
          </Link>
          .
        </p>
      </section>

      <ExploreSection />
    </PageShell>
  );
}
