import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
import AnchorList from "@/components/rail/AnchorList";
import ArrowLink from "@/components/ui/ArrowLink";
import EditorialSection from "@/components/section/EditorialSection";
import SelfAssessment from "@/components/section/SelfAssessment";
import { selfAssessmentSource } from "@/lib/self-assessment";
import {
  rgWarningSigns,
  rgTools,
  rgResources,
  rgCommitments,
  rgToc,
  helplineNumber,
} from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Responsible Gambling — WagerBlogs",
};

export default function ResponsibleGamblingPage() {
  const rail = (
    <>
      <HelpLineCard />
      <AnchorList title="On this page" cardClassName="card" items={rgToc} />
      <InfoCard
        title="Our commitments"
        body="How an affiliate publisher handles responsible gambling honestly."
        cta={{ href: "/about", label: "About WagerBlogs" }}
      />
      <InfoCard
        title="Corrections"
        body="A resource listed here out of date? Tell us and we'll fix it."
        cta={{ href: "/contact", label: "Report an issue" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      <Breadcrumbs items={[{ label: "Responsible Gambling" }]} />

      {/* Register: Editorial · Tier 1 — required trust page, no monetization, no operator links */}
      <aside
        role="note"
        aria-label="Immediate help"
        className="card-dark md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4"
      >
        <div className="min-w-0 flex flex-col gap-2">
          <p className="text-sm font-semibold leading-snug text-pretty">
            If gambling has stopped being fun, help is free and confidential.
          </p>
          <address className="not-italic text-xs font-medium text-text-on-dark-muted leading-snug">
            Helpline: [{helplineNumber} — verify before launch] · 24/7 · call or text
          </address>
        </div>
        <Link
          href="#get-help"
          className="group inline-flex items-center justify-center gap-1.5 shrink-0 self-start md:self-auto min-h-11 px-3 rounded-md bg-bg-card text-text-primary text-base leading-heading font-semibold no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-on-dark"
        >
          Find help
          <ArrowDown
            strokeWidth={2}
            className="size-3 shrink-0 transition-transform duration-200 group-hover:translate-y-1"
            aria-hidden="true"
          />
        </Link>
      </aside>

      <header className="flex flex-col gap-3 max-w-none">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Responsible gambling
        </h1>
        <p className="text-lg font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — why this page exists, what readers will find on it, and a plain
          statement that WagerBlogs earns commission from operators and still wants readers to bet
          less, not more, when it stops being entertainment.]
        </p>
      </header>

      <EditorialSection
        id="warning-signs"
        title="Warning signs worth taking seriously"
        register="editorial"
      >
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {rgWarningSigns.map((w) => (
            <li
              key={w}
              className="border-t border-border-divider pt-3 text-sm text-text-strong-secondary leading-relaxed"
            >
              {w}
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection id="self-check" title="A quick self-check" register="editorial">
        <p className="text-lg font-medium leading-copy text-text-strong-secondary text-pretty">
          These ten questions are the {selfAssessmentSource.instrument}, reproduced from the{" "}
          {selfAssessmentSource.organisation}. Answering &ldquo;yes&rdquo; to any of them is a
          reason to talk to someone.
        </p>
        <SelfAssessment />
        <p className="text-xs text-text-meta font-medium leading-copy text-pretty">
          Source:{" "}
          <a href={selfAssessmentSource.url} rel="noopener" target="_blank" className="underline">
            {selfAssessmentSource.organisation} — Problem Gambling Self-Assessment
          </a>
          . Questions are reproduced verbatim; WagerBlogs is not affiliated with the{" "}
          {selfAssessmentSource.organisation} and this tool does not diagnose.
        </p>
      </EditorialSection>

      <EditorialSection id="tools" title="Tools that actually limit play" register="editorial">
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {rgTools.map((t) => (
            <li key={t.title} className="border border-border-divider rounded-md p-4">
              <h3 className="text-md font-semibold text-text-primary mb-1.5">{t.title}</h3>
              <p className="text-sm text-text-muted font-medium leading-loose">{t.body}</p>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection id="get-help" title="Where to get help" register="editorial">
        <ul role="list" className="flex flex-col">
          {rgResources.map((r) => (
            <li
              key={r.name}
              className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center justify-between py-4 border-b border-border-hairline"
            >
              <div className="min-w-0">
                <h3 className="text-md font-semibold text-text-primary mb-1.5">{r.name}</h3>
                <p className="text-xs text-text-meta leading-relaxed">{r.desc}</p>
              </div>
              <address className="text-sm not-italic text-text-subtle tabular-nums border border-dashed border-border-placeholder rounded-sm px-3 py-2 whitespace-nowrap shrink-0">
                {r.contact}
              </address>
            </li>
          ))}
        </ul>
        <ArrowLink
          href="/responsible-gambling/help-directory"
          className="inline-flex items-center self-center gap-1 min-h-11 text-md text-text-primary font-semibold group"
        >
          Full worldwide help directory
        </ArrowLink>
      </EditorialSection>

      {/* TODO(cms): stateSelfExclusion[] — never link to an unverified registry.
          Required per state: programName, officialUrl, verifiedAt. Finder omitted here. */}
      <EditorialSection
        id="self-exclusion"
        title="Self-exclusion in your state"
        register="editorial"
      >
        <p className="text-lg font-medium leading-copy text-text-strong-secondary max-w-none text-pretty">
          [Placeholder — most legal states run their own self-exclusion registers; enrolling bars
          every licensed operator in that state at once.]
        </p>
      </EditorialSection>

      <EditorialSection title="If you're worried about someone else" register="editorial">
        <p className="text-lg font-medium leading-copy text-text-strong-secondary max-w-none text-pretty">
          [Placeholder — guidance for friends and family: what tends to help, what tends to
          backfire, and where support exists for you as well as for them.]
        </p>
      </EditorialSection>

      <EditorialSection title="What we do on our side" register="editorial">
        <ol role="list" className="flex flex-col max-w-none">
          {rgCommitments.map((c, i) => (
            <li
              key={c}
              className="flex gap-3.5 items-baseline py-3 border-b border-border-hairline"
            >
              <span
                aria-hidden="true"
                className="text-xs text-text-subtle font-bold tabular-nums shrink-0"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-md text-text-strong-secondary font-medium leading-copy">
                {c}
              </span>
            </li>
          ))}
        </ol>
      </EditorialSection>

      {/* TODO(cms): ExpertReview — no reviewer record connected. Required: fullName,
          clinicalOrCounsellingCredential, reviewedAt, reviewerUrl. The "reviewed by"
          line stays absent until a credentialed reviewer signs off on this page. */}
    </PageShell>
  );
}
