import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import AnchorList from "@/components/rail/AnchorList";
import InfoCard from "@/components/rail/InfoCard";
import EditorialSection from "@/components/section/EditorialSection";
import Prose from "@/components/section/Prose";
import ReviewCard from "@/components/section/ReviewCard";
import { authorStandards } from "@/lib/mock-data";
import { buildOpenGraph } from "@/lib/og";

const TITLE = "About — WagerBlogs";
const DESCRIPTION = "Who publishes WagerBlogs, how we review, and how we make money.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: "/about" }),
  alternates: { canonical: "/about" },
};

const aboutToc = [
  { href: "#who-we-are", label: "Who we are" },
  { href: "#how-we-review", label: "How we review" },
  { href: "#how-we-make-money", label: "How we make money" },
  { href: "#corrections", label: "Corrections" },
];

// TODO(cms): Organisation record — legalName, foundingDate, registeredAddress,
// editorialPolicyUrl. TODO(cms): teamMembers[] with credentials; the masthead
// stays absent until real, named people with verifiable roles exist. No
// Organization/Person JSON-LD until those records are real.
export default function AboutPage() {
  const rail = (
    <>
      <AnchorList
        title="On this page"
        cardClassName="card"
        items={aboutToc.map((t) => ({ ...t, key: t.href }))}
      />
      <InfoCard
        title="Corrections"
        body="Something here out of date or wrong? Tell us and we'll fix it."
        cta={{ href: "/contact", label: "Report an issue" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — trust page, no monetization, no operator links */}
      <Breadcrumbs items={[{ label: "About" }]} />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          About WagerBlogs
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          WagerBlogs reviews sportsbooks and online casinos. We earn commission when someone signs
          up through our links. That pays for the testing. It doesn&apos;t buy a better score.
        </p>
      </header>

      <EditorialSection id="who-we-are" title="Who we are" register="editorial">
        <Prose>
          WagerBlogs is an independent publisher. We&apos;re not an operator, we take no bets and we
          hold no gambling licence. It makes no difference to us which site you pick.
        </Prose>
        <Prose>
          We cover what we can check: licensed sportsbooks and casinos, the bonuses they advertise
          and the terms attached. Every review runs against the same criteria. Scores come from
          testing, not from an operator&apos;s press pack.
        </Prose>
        <Prose>
          Bylines and credentials go here once there are real people attached to real records. Until
          then it stays empty.
        </Prose>
      </EditorialSection>

      {/* No CTA: this page is the full methodology, so the link led back here. */}
      <ReviewCard showCta={false} />

      <EditorialSection id="how-we-review" title="What we hold ourselves to" register="editorial">
        <ul
          role="list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-legacy-4 md:gap-3"
        >
          {authorStandards.map((s) => (
            <li key={s.title} className="border-t border-border-hairline pt-3">
              <h3 className="text-lg font-semibold text-text-primary mb-1.5">{s.title}</h3>
              <p className="text-sm text-text-muted leading-loose">{s.body}</p>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection id="how-we-make-money" title="How we make money" register="editorial">
        <Prose>
          Some operator links here are affiliate links. Follow one, open an account and deposit, and
          the operator pays us — usually a cut of revenue or a flat fee. That&apos;s the whole
          model, and it funds the accounts we deposit into to test withdrawals.
        </Prose>
        <Prose>
          It doesn&apos;t move a score. Ranking order comes from the published criteria, and money
          isn&apos;t one of them. Nobody can buy a position, a higher rating, or the removal of a
          criticism.
        </Prose>
        <ArrowLink
          href="/legal/affiliate-disclosure"
          className={`${sectionCtaClassName} min-h-11 w-fit`}
        >
          Full affiliate disclosure
        </ArrowLink>
      </EditorialSection>

      <EditorialSection id="corrections" title="Corrections" register="editorial">
        <Prose>
          Found a mistake? Send us the page and what&apos;s wrong. We fix factual errors and note
          the change on the page itself.
        </Prose>
        <Prose>
          Odds and bonus terms change often. Every review shows when it was last checked, and we
          re-check or pull the ones that fall out of date.
        </Prose>
        <ArrowLink href="/contact" className={`${sectionCtaClassName} min-h-11 w-fit`}>
          Report an issue
        </ArrowLink>
      </EditorialSection>
    </PageShell>
  );
}
