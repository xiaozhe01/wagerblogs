import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import AnchorList from "@/components/rail/AnchorList";
import FilterChips from "@/components/controls/FilterChips";
import { RichText } from "@/components/rich-text/RichText";
import { formatDate } from "@/lib/utils";
import { buildOpenGraph } from "@/lib/og";

// ISR. Draft mode coexists with this: the __prerender_bypass cookie makes Next
// skip the cache for that request only.
export const revalidate = 3600;

// LegalDocuments carries no seo group — the set is four documents with stable
// copy, so the metadata lives here rather than as schema plumbing.
const DOC_META: Record<string, { title: string; description: string }> = {
  "privacy-policy": {
    title: "Privacy Policy — WagerBlogs",
    description:
      "What WagerBlogs collects, why, how long it is kept, and the rights readers have over it.",
  },
  "terms-of-service": {
    title: "Terms of Service — WagerBlogs",
    description:
      "The terms governing use of WagerBlogs: acceptable use, liability, and the law that applies.",
  },
  "affiliate-disclosure": {
    title: "Affiliate Disclosure — WagerBlogs",
    description:
      "Which links earn WagerBlogs commission, and how that is kept out of editorial scoring.",
  },
  "cookie-policy": {
    title: "Cookie Policy — WagerBlogs",
    description:
      "The cookies and analytics WagerBlogs runs, what each records, and how to opt out.",
  },
};

/** LegalDocuments is a global — no drafts, so no _status filter. depth 2 so an
 * internal link inside a section body can resolve: news and reviews need their
 * parent section/vertical slug to build an href. */
async function findLegalDocuments() {
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug: "legal-documents", depth: 2, overrideAccess: false });
}

export async function generateStaticParams() {
  const legal = await findLegalDocuments();
  return (legal.documents ?? []).map((doc) => ({ doc: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc: docSlug } = await params;
  const meta = DOC_META[docSlug];
  if (!meta) return { title: "WagerBlogs" };
  return {
    title: meta.title,
    description: meta.description,
    // article, not website: a legal document is editorial prose with its own
    // revision history, not a section landing page.
    openGraph: buildOpenGraph({
      title: meta.title,
      description: meta.description,
      type: "article",
      path: `/legal/${docSlug}`,
    }),
    alternates: { canonical: `/legal/${docSlug}` },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc: docSlug } = await params;
  const legal = await findLegalDocuments();
  const documents = legal.documents ?? [];
  const doc = documents.find((entry) => entry.slug === docSlug);
  if (!doc) notFound();

  // Anchors stay positional: renaming a heading must not break a link someone
  // has already shared.
  const sections = doc.sections.map((section, i) => ({
    ...section,
    num: String(i + 1).padStart(2, "0"),
    anchorId: `section-${i + 1}`,
  }));
  const revisions = doc.revisions ?? [];
  const lastUpdated = revisions
    .map((revision) => revision.date)
    .sort()
    .at(-1);

  const rail = (
    <>
      <AnchorList
        title="In this document"
        cardClassName="card"
        items={sections.map((s) => ({
          href: `#${s.anchorId}`,
          label: `${s.num} · ${s.heading}`,
          key: s.anchorId,
        }))}
      />
      <AnchorList
        title="All legal documents"
        cardClassName="card"
        items={documents.map((entry) => ({
          href: `/legal/${entry.slug}`,
          label: entry.title,
          key: entry.slug,
          current: entry.slug === docSlug,
        }))}
      />
      <section className="card" aria-labelledby="rail-change-log">
        <h2 id="rail-change-log" className="heading text-sm mb-2.5">
          Change log
        </h2>
        {revisions.length === 0 ? (
          <p className="text-xs text-text-muted tabular-nums leading-loose">
            No revisions recorded yet.
          </p>
        ) : (
          <ol className="flex flex-col gap-2.5">
            {revisions.map((revision) => (
              <li key={revision.id ?? revision.version} className="text-xs leading-loose">
                <p className="font-semibold text-text-body tabular-nums">
                  {revision.version} ·{" "}
                  <time dateTime={revision.date}>{formatDate(revision.date)}</time>
                </p>
                <p className="text-text-muted">{revision.summary}</p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — legal document, no monetization, no operator links */}
      {/* No /legal index exists, so the trail is Home › <document>. */}
      <Breadcrumbs currentPath={`/legal/${docSlug}`} items={[{ label: doc.title }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {doc.title}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">{doc.intro}</p>
        <p className="flex gap-4 flex-wrap text-xs text-text-muted tabular-nums">
          <span>Effective [date required]</span>
          <span>
            Last updated{" "}
            {lastUpdated ? (
              <time dateTime={lastUpdated}>{formatDate(lastUpdated)}</time>
            ) : (
              "[date required]"
            )}
          </span>
          <span>Version {doc.currentVersion}</span>
        </p>
      </header>

      <section
        className="bg-bg-subtle border border-border-divider rounded-md p-3 md:p-5"
        aria-labelledby="plain-language-summary"
      >
        {/* A <p>, not a heading — see KeyTakeaways. */}
        <p id="plain-language-summary" className="meta-label-caps mb-1.5">
          Plain-language summary
        </p>
        <p className="text-lg leading-copy text-text-strong-secondary text-pretty">{doc.summary}</p>
        <p className="text-xs font-medium text-text-muted leading-relaxed mt-2.5">
          This summary is a courtesy; the numbered sections below are the binding text.
        </p>
      </section>

      <section aria-label="Numbered sections" className="flex flex-col gap-3">
        <FilterChips
          label="Legal documents"
          items={documents.map((entry) => ({
            href: `/legal/${entry.slug}`,
            label: entry.title,
            active: entry.slug === docSlug,
            key: entry.slug,
          }))}
        />
        {/* Keyed so only the clauses replay the fade. Depends on the shared
            /legal key in app/template.tsx; without it this node is torn down. */}
        <div key={docSlug} className="flex flex-col route-transition">
          {sections.map((s) => (
            <section
              key={s.anchorId}
              id={s.anchorId}
              aria-labelledby={`${s.anchorId}-title`}
              className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[4.5rem_1fr] gap-x-3 border-t border-border-hairline py-3.5"
            >
              <div className="text-sm text-text-muted tabular-nums pt-0.5">#{s.num}</div>
              <div className="min-w-0">
                <h2 id={`${s.anchorId}-title`} className="heading text-2xl leading-heading mb-2.5">
                  {s.heading}
                </h2>
                <div className="max-w-[68ch]">
                  <RichText data={s.body} />
                </div>
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* TODO(cms): LegalReview — no counsel sign-off connected. Required: reviewerName,
          firmOrBar, reviewedAt, documentVersion. Document must stay in draft until then. */}

      <section className="flex flex-col gap-3" aria-labelledby="legal-questions">
        <h2 id="legal-questions" className="heading text-2xl leading-heading">
          Questions about this document
        </h2>
        <address className="not-italic text-sm text-text-body leading-relaxed">
          WagerBlogs Media Ltd · Company No. [company number — verify] · [Registered address
          placeholder]
        </address>
        <ArrowLink href="/contact" className={`${sectionCtaClassName} min-h-11 w-fit`}>
          Contact us
        </ArrowLink>
      </section>
    </PageShell>
  );
}
