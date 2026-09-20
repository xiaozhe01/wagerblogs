import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import AnchorList from "@/components/rail/AnchorList";
import InfoCard from "@/components/rail/InfoCard";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import Prose from "@/components/section/Prose";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { JsonLd, faqPageJsonLd } from "@/lib/schema";

export const revalidate = 3600;

// The FAQ global carries no seo group — one page, stable copy.
export const metadata: Metadata = {
  title: "FAQ — WagerBlogs",
  description: "How we review operators, how we make money, and what we do when we get it wrong.",
  alternates: { canonical: "/faq" },
};

const relatedPages = [
  { href: "/about", label: "About WagerBlogs", key: "about" },
  {
    href: "/about#how-we-review",
    label: "How we review",
    key: "how-we-review",
  },
  {
    href: "/legal/affiliate-disclosure",
    label: "Affiliate disclosure",
    key: "disclosure",
  },
  { href: "/responsible-gambling", label: "Responsible gambling", key: "rg" },
];

export default async function FaqPage() {
  const payload = await getPayload({ config });
  // FAQ is a global — no drafts. The per-entry `status` is the entry's own
  // moderation state, not the editorial _status lifecycle.
  const faq = await payload.findGlobal({ slug: "faq", depth: 0, overrideAccess: false });
  const entries = (faq.entries ?? []).filter((entry) => entry.status === "published");
  // faqPageJsonLd drops bracketed placeholders on top of this: a published
  // entry whose answer is still a placeholder renders, but stays out of the
  // rich result.
  const faqSchema = faqPageJsonLd(entries.map((entry) => ({ q: entry.question, a: entry.answer })));

  const rail = (
    <>
      <AnchorList title="Read further" cardClassName="card" items={relatedPages} />
      <InfoCard
        title="Not answered here?"
        body="Corrections and editorial questions reach a person, not a queue."
        cta={{ href: "/contact", label: "Contact us" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — trust page, no monetization, no operator links */}
      <Breadcrumbs items={[{ label: "FAQ" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Frequently asked questions
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          How reviews are produced, how the site earns, and what happens when we get something
          wrong. Each answer summarises a section of{" "}
          <span className="whitespace-nowrap">About WagerBlogs</span> and links to it in full.
        </p>
      </header>

      {faqSchema && <JsonLd data={faqSchema} />}

      <EditorialSection title="Questions readers ask" register="editorial">
        {entries.length === 0 ? (
          <EmptyState
            title="No questions published yet"
            body="An entry appears here once it is marked published in the admin panel."
            action={{ href: "/about", label: "About WagerBlogs" }}
          />
        ) : (
          /* multiple: a reader comparing two answers shouldn't lose the first
             one to open the second. */
          <Accordion multiple>
            {entries.map((entry) => (
              <AccordionItem key={entry.id ?? entry.question}>
                <AccordionTrigger>{entry.question}</AccordionTrigger>
                <AccordionContent>
                  {/* answer is a textarea, not rich text — whitespace-pre-line
                      keeps an editor's line breaks without inviting markup. */}
                  <p className="text-sm font-semibold text-text-muted leading-relaxed text-pretty whitespace-pre-line">
                    {entry.answer}
                  </p>
                  {entry.sourceLink?.href && (
                    <ArrowLink
                      href={entry.sourceLink.href}
                      className={`${sectionCtaClassName} min-h-11 w-fit`}
                    >
                      {entry.sourceLink.label || "Read the full answer"}
                    </ArrowLink>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </EditorialSection>

      <EditorialSection title="Still stuck?" register="editorial">
        <Prose>
          WagerBlogs is a publisher, not an operator — we can&apos;t access accounts or resolve a
          dispute with a sportsbook. For anything factual on a page, tell us and we&apos;ll fix it,
          with the change logged where it happened.
        </Prose>
        <ArrowLink href="/contact" className={`${sectionCtaClassName} min-h-11 w-fit`}>
          Report an issue
        </ArrowLink>
      </EditorialSection>
    </PageShell>
  );
}
