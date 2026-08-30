import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink from "@/components/ui/ArrowLink";
import AnchorList from "@/components/rail/AnchorList";
import ChipList from "@/components/ui/ChipList";
import { legalDocs, type DocSlug } from "@/lib/mock-data";

// TODO(cms): swap for generateStaticParams() returning the real set of legal docs.
export function generateStaticParams() {
  return Object.keys(legalDocs).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc: docSlug } = await params;
  const doc = legalDocs[docSlug as DocSlug];
  return { title: doc ? `${doc.title} — WagerBlogs` : "WagerBlogs" };
}

export default async function LegalPage({ params }: { params: Promise<{ doc: string }> }) {
  const { doc: docSlug } = await params;
  const doc = legalDocs[docSlug as DocSlug];
  if (!doc) notFound();
  const sections = doc.sections.map((s, i) => ({
    ...s,
    num: String(i + 1).padStart(2, "0"),
    anchorId: `section-${i + 1}`,
  }));

  const rail = (
    <>
      <AnchorList
        title="In this document"
        cardClassName="card"
        items={sections.map((s) => ({
          href: `#${s.anchorId}`,
          label: `${s.num} · ${s.title}`,
          key: s.anchorId,
        }))}
      />
      <AnchorList
        title="All legal documents"
        cardClassName="card"
        items={Object.entries(legalDocs).map(([slug, d]) => ({
          href: `/legal/${slug}`,
          label: d.title,
          key: slug,
          current: slug === docSlug,
        }))}
      />
      <section className="card" aria-labelledby="rail-change-log">
        <h2 id="rail-change-log" className="heading text-sm mb-2.5">
          Change log
        </h2>
        {/* TODO(cms): revisions[] — every published change appends a dated entry here. */}
        <p className="text-xs text-text-subtle tabular-nums leading-loose">
          No revisions recorded yet.
        </p>
      </section>
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — legal document, no monetization, no operator links */}
      <Breadcrumbs
        items={[{ label: "Legal", href: "/legal/terms-of-service" }, { label: doc.title }]}
      />

      <header className="flex flex-col gap-3">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {doc.title}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">{doc.intro}</p>
        <p className="flex gap-4 flex-wrap text-xs text-text-subtle tabular-nums">
          <span>Effective [date required]</span>
          <span>Last updated [date required]</span>
          <span>Version [n]</span>
        </p>
      </header>

      <section
        className="bg-bg-subtle border border-border-divider rounded-md p-3 md:p-5"
        aria-labelledby="plain-language-summary"
      >
        <h2 id="plain-language-summary" className="meta-label-caps mb-1.5">
          Plain-language summary
        </h2>
        <p className="text-lg leading-copy text-text-strong-secondary text-pretty">{doc.summary}</p>
        <p className="text-xs font-medium text-text-subtle leading-relaxed mt-2.5">
          This summary is a courtesy; the numbered sections below are the binding text.
        </p>
      </section>

      <section aria-label="Numbered sections" className="flex flex-col gap-3">
        <nav aria-label="Legal documents">
          <ul role="list" className="flex gap-2 flex-wrap">
            <ChipList
              as="Link"
              inList
              filter
              items={Object.entries(legalDocs).map(([slug, d]) => ({
                href: `/legal/${slug}`,
                label: d.title,
                active: slug === docSlug,
                key: slug,
              }))}
              activeClassName="btn-primary"
              inactiveClassName="btn-secondary"
            />
          </ul>
        </nav>
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
              <div className="text-sm text-text-subtle tabular-nums pt-0.5">#{s.num}</div>
              <div className="min-w-0">
                <h2 id={`${s.anchorId}-title`} className="heading text-2xl leading-heading mb-2.5">
                  {s.title}
                </h2>
                <p className="text-xl leading-loose text-text-strong-secondary text-pretty max-w-[68ch]">
                  {s.body}
                </p>
              </div>
            </section>
          ))}
        </div>
      </section>

      {/* TODO(cms): LegalReview — no counsel sign-off connected. Required: reviewerName,
          firmOrBar, reviewedAt, documentVersion. Document must stay in draft until then. */}

      <section className="flex flex-col gap-3" aria-labelledby="legal-questions">
        <h2 id="legal-questions" className="text-md font-semibold text-text-primary">
          Questions about this document
        </h2>
        <address className="not-italic text-sm text-text-body leading-relaxed">
          WagerBlogs Media Ltd · Company No. [00000000] · [Registered address placeholder]
        </address>
        <ArrowLink
          href="/contact"
          className="inline-flex items-center gap-1 min-h-11 text-md text-text-primary font-semibold group w-fit"
        >
          Contact us
        </ArrowLink>
      </section>
    </PageShell>
  );
}
