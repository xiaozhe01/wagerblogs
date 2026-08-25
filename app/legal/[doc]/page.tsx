import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink from "@/components/ui/ArrowLink";
import AnchorList from "@/components/rail/AnchorList";
import ChipList from "@/components/ui/ChipList";
import { legalDocs } from "@/lib/mock-data";

const anchorListItemClassName =
  "flex items-center min-h-11 lg:min-h-9.5 text-sm text-text-body no-underline border-b border-border-hairline-alt [li:last-child_&]:border-b-0 leading-snug";

type DocSlug = keyof typeof legalDocs;

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
        cardClassName="card pb-0"
        items={sections.map((s) => ({
          href: `#${s.anchorId}`,
          label: `${s.num} · ${s.title}`,
          key: s.anchorId,
        }))}
        itemClassName={anchorListItemClassName}
      />
      <AnchorList
        title="All legal documents"
        cardClassName="card pb-0"
        items={Object.entries(legalDocs).map(([slug, d]) => ({
          href: `/legal/${slug}`,
          label: d.title,
          key: slug,
        }))}
        itemClassName={(item) =>
          `flex items-center min-h-11 lg:min-h-9.5 text-sm no-underline border-b border-border-hairline-alt [li:last-child_&]:border-b-0 leading-snug ${item.key === docSlug ? "text-text-primary font-bold" : "text-text-body"}`
        }
      />
      <section className="card" aria-labelledby="rail-change-log">
        <h2 id="rail-change-log" className="font-bold text-sm text-text-primary mb-2.5">
          Change log
        </h2>
        {/* TODO(cms): revisions[] — every published change appends a dated entry here. */}
        <p className="text-xs text-text-subtle font-mono leading-loose">
          No revisions recorded yet.
        </p>
      </section>
    </>
  );

  return (
    <PageShell activeNavId="more" rail={rail}>
      {/* Register: Editorial · Tier 1 — legal document, no monetization, no operator links */}
      <Breadcrumbs
        items={[{ label: "Legal", href: "/legal/terms-of-service" }, { label: doc.title }]}
      />

      <header className="flex flex-col gap-3">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          {doc.title}
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">{doc.intro}</p>
        <p className="flex gap-4 flex-wrap text-xs text-text-subtle font-mono">
          <span>Effective [date required]</span>
          <span>Last updated [date required]</span>
          <span>Version [n]</span>
        </p>
      </header>

      <nav aria-label="Legal documents" className="flex gap-2 flex-wrap">
        <ChipList
          as="Link"
          items={Object.entries(legalDocs).map(([slug, d]) => ({
            href: `/legal/${slug}`,
            label: d.title,
            active: slug === docSlug,
            key: slug,
          }))}
          activeClassName="btn-primary"
          inactiveClassName="btn-secondary"
        />
      </nav>

      <section
        className="bg-bg-subtle border border-border-divider rounded-md p-4 md:p-5"
        aria-labelledby="plain-language-summary"
      >
        <h2 id="plain-language-summary" className="meta-label-caps mb-1.5">
          Plain-language summary
        </h2>
        <p className="text-lg leading-copy text-text-strong-secondary text-pretty">{doc.summary}</p>
        <p className="text-xs text-text-subtle leading-relaxed mt-2.5">
          This summary is a courtesy; the numbered sections below are the binding text.
        </p>
      </section>

      <div className="flex flex-col">
        {sections.map((s) => (
          <section
            key={s.anchorId}
            id={s.anchorId}
            className="grid grid-cols-[3.5rem_1fr] md:grid-cols-[4.5rem_1fr] gap-x-3 border-t border-border-hairline py-3.5"
          >
            <div className="text-sm text-text-subtle font-mono pt-0.5">#{s.num}</div>
            <div className="min-w-0">
              <h2 className="heading text-xl leading-heading mb-2.5">{s.title}</h2>
              <p className="text-xl leading-loose text-text-strong-secondary text-pretty max-w-[68ch]">
                {s.body}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* TODO(cms): LegalReview — no counsel sign-off connected. Required: reviewerName,
          firmOrBar, reviewedAt, documentVersion. Document must stay in draft until then. */}

      <section className="border-t border-border-hairline pt-5" aria-labelledby="legal-questions">
        <h2 id="legal-questions" className="text-md font-semibold text-text-primary mb-1.5">
          Questions about this document
        </h2>
        <address className="not-italic text-sm text-text-body leading-relaxed mb-3">
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
