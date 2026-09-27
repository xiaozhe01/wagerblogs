import type { Metadata } from "next";
import Link from "next/link";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import InfoCard from "@/components/rail/InfoCard";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import MediaImage, { resolveMedia } from "@/components/cards/MediaImage";
import { publishedFilter, resolvePreviewUser } from "@/lib/payload-queries";
import { buildOpenGraph } from "@/lib/og";
import PageNav from "@/components/controls/PageNav";
import { GRID_PAGE_SIZE, PAGE_PARAM, pageHref, paginate } from "@/lib/pagination";
import { headingId } from "@/lib/utils";

// No `revalidate`: this route reads searchParams for the page number, so Next
// renders it per request and the ISR window would never apply.

const SECTION_TITLE = "Editorial team";
const TITLE = "Authors — WagerBlogs";
const DESCRIPTION = "The contributors behind WagerBlogs' reviews, reporting and guides.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: "/authors" }),
  alternates: { canonical: "/authors" },
};

export default async function AuthorsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const { isEnabled: isDraft } = await draftMode();
  const previewUser = isDraft ? await resolvePreviewUser() : null;
  const payload = await getPayload({ config });
  const { docs: authors } = await payload.find({
    collection: "authors",
    ...publishedFilter(isDraft, {}, previewUser),
    sort: "name",
    limit: 200,
    depth: 1,
    overrideAccess: false,
  });

  const authorPage = paginate(authors, query[PAGE_PARAM], GRID_PAGE_SIZE);

  const rail = (
    <InfoCard
      title="Editorial standards"
      body="How we research, source, and correct what we publish."
      cta={{ href: "/about", label: "Read our methodology" }}
    />
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — author directory, no outbound operator links */}
      <Breadcrumbs items={[{ label: "Authors" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Authors
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          Every review, story and guide on WagerBlogs carries a named byline. These are the people
          behind them.
        </p>
      </header>

      <EditorialSection title={SECTION_TITLE} register="editorial">
        {authorPage.total === 0 ? (
          <EmptyState
            title="No authors published yet"
            body="A contributor appears here once their record is published in the admin panel."
          />
        ) : (
          <>
            <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
              {authorPage.items.map((author) => {
                const beats = (author.beats ?? [])
                  .map((entry) => entry.beat)
                  .filter((entry): entry is string => Boolean(entry));
                return (
                  <li key={author.id} className="flex">
                    <Link
                      href={`/authors/${author.slug}`}
                      className="card group grow flex items-start gap-3.5 no-underline transition-colors hover:bg-bg-subtle active:bg-bg-subtle-active"
                    >
                      {/* No photo on the record keeps the skeleton shape. */}
                      {resolveMedia(author.photo) ? (
                        <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden relative">
                          <MediaImage
                            media={author.photo}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          aria-hidden="true"
                          className="w-14 h-14 shrink-0 rounded-full placeholder-asset"
                        />
                      )}
                      <div className="min-w-0 flex flex-col gap-1.5">
                        <h3 className="heading text-lg leading-snug text-pretty transition-colors duration-200 group-hover:text-brand">
                          {author.name}
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed">
                          {author.credentialLine}
                        </p>
                        {beats.length > 0 && (
                          <p className="text-2xs text-text-muted font-medium">
                            {beats.join(" · ")}
                          </p>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <PageNav
              page={authorPage.page}
              totalPages={authorPage.totalPages}
              total={authorPage.total}
              from={authorPage.from}
              to={authorPage.to}
              noun="authors"
              label={SECTION_TITLE}
              hrefFor={(n) =>
                pageHref({
                  basePath: "/authors",
                  page: n,
                  anchor: headingId("section", SECTION_TITLE),
                })
              }
            />
          </>
        )}
      </EditorialSection>
    </PageShell>
  );
}
