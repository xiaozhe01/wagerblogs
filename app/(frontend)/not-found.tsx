import Link from "next/link";
import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import AnchorList from "@/components/rail/AnchorList";
import ExploreSection from "@/components/section/ExploreSection";
import LatestStoriesSection from "@/components/section/LatestStoriesSection";
import { getPayload } from "payload";
import config from "@payload-config";
import { publishedFilter } from "@/lib/payload-queries";

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

export default async function NotFound() {
  const payload = await getPayload({ config });
  // Sequential, and both structural-or-published reads only: a 404 renders on
  // any unmatched URL, so it must stay cheap. draftMode() is deliberately not
  // read — a 404 has no draft to preview.
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });
  const { docs: recent } = await payload.find({
    collection: "articles",
    ...publishedFilter(false),
    sort: "-publishedAt",
    limit: 5,
    depth: 0,
    overrideAccess: false,
  });

  const rail = (
    <AnchorList
      title="Recent posts"
      cardClassName="card"
      items={recent.map((post) => ({
        href: `/articles/${post.slug}`,
        label: post.title,
        key: post.slug,
      }))}
    />
  );

  return (
    <PageShell rail={rail}>
      <Breadcrumbs items={[{ label: "Page not found" }]} />

      <section className="flex flex-col items-center text-center gap-3 py-2 md:py-4">
        <h1 className="font-sans font-heavy text-[96px] md:text-[160px] leading-none tracking-[-0.02em] text-text-muted select-none">
          <span aria-hidden="true" className="text-brand">
            404
          </span>
          <span className="sr-only">We couldn&apos;t find that page</span>
        </h1>
        <p className="text-xl md:text-2xl font-medium leading-loose text-text-body text-pretty max-w-160">
          <span className="marker-brand">
            {`The page you're looking for doesn't exist, has moved, or the URL has a typo. Try starting over at our `}
            <Link href="/" className="link-inline link-on-marker">
              Homepage
            </Link>
            .
          </span>
        </p>
      </section>

      <LatestStoriesSection title="Latest news" limit={4} />

      <ExploreSection verticals={verticals} />
    </PageShell>
  );
}
