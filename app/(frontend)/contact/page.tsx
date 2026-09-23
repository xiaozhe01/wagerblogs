import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import InfoCard from "@/components/rail/InfoCard";
import EditorialSection from "@/components/section/EditorialSection";
import Prose from "@/components/section/Prose";
import { buildOpenGraph } from "@/lib/og";

const TITLE = "Contact — WagerBlogs";
const DESCRIPTION = "How to reach WagerBlogs about corrections, press, and partnerships.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: "/contact" }),
  alternates: { canonical: "/contact" },
};

// TODO(cms): contactChannels[] — each needs purpose, address, and a real
// responseWindow before it publishes. Addresses stay bracketed until verified;
// a wrong contact route on a corrections page is worse than none.
const contactChannels = [
  {
    purpose: "Corrections and factual errors",
    detail: "The fastest route for anything inaccurate on a page.",
    address: "[corrections@wagerblogs.com]",
  },
  {
    purpose: "Editorial and press",
    detail: "Story tips, data requests, and interview enquiries.",
    address: "[editorial@wagerblogs.com]",
  },
  {
    purpose: "Partnerships",
    detail: "Commercial enquiries. Handled separately from editorial.",
    address: "[partnerships@wagerblogs.com]",
  },
];

export default function ContactPage() {
  const rail = (
    <>
      <InfoCard
        title="Editorial standards"
        body="How we research, source, and correct what we publish."
        cta={{ href: "/about", label: "About WagerBlogs" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — trust page, no monetization, no operator links */}
      <Breadcrumbs items={[{ label: "Contact" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Contact
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — which enquiries go where, and what to expect back. Editorial and
          commercial enquiries are handled by different people on purpose.]
        </p>
      </header>

      <EditorialSection title="Where to write" register="editorial">
        <ul role="list" className="flex flex-col">
          {contactChannels.map((c) => (
            <li
              key={c.purpose}
              className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center justify-between py-4 border-b border-border-hairline"
            >
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-text-primary mb-1.5">{c.purpose}</h3>
                <p className="text-xs text-text-muted leading-relaxed">{c.detail}</p>
              </div>
              <address className="text-sm not-italic text-text-muted tabular-nums border border-dashed border-border-placeholder rounded-sm px-3 py-2 whitespace-nowrap shrink-0">
                {c.address}
              </address>
            </li>
          ))}
        </ul>
      </EditorialSection>

      {/* TODO(cms): the contact form needs a real submission endpoint and spam
          handling before it ships. A form that silently drops a correction is
          worse than an address the reader can copy. */}
      <EditorialSection title="Before you write" register="editorial">
        <Prose>
          [Placeholder — what to include in a correction: the page, the claim, and a source we can
          check. Corrections are recorded on the page they affect.]
        </Prose>
      </EditorialSection>

      <EditorialSection title="What we can't help with" register="editorial">
        <Prose>
          [Placeholder — WagerBlogs is a publisher, not an operator. We cannot access accounts,
          resolve deposits or withdrawals, or intervene in a dispute with a sportsbook. For
          gambling-harm support, use the helpline resources instead.]
        </Prose>
      </EditorialSection>
    </PageShell>
  );
}
