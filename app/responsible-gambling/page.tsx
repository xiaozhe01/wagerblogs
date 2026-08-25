import type { Metadata } from "next";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
import AnchorList from "@/components/rail/AnchorList";
import ArrowLink from "@/components/ui/ArrowLink";
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
      <AnchorList
        title="On this page"
        cardClassName="card pb-1"
        items={rgToc}
        itemClassName="flex items-center min-h-11 lg:min-h-9.5 text-sm text-text-body no-underline border-b border-border-hairline-alt [li:last-child_&]:border-b-0 leading-snug"
      />
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
    <PageShell activeNavId="more" rail={rail}>
      <Breadcrumbs items={[{ label: "Responsible Gambling" }]} />

      {/* Register: Editorial · Tier 1 — required trust page, no monetization, no operator links */}
      <aside
        role="note"
        aria-label="Immediate help"
        className="card-dark p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
      >
        <div className="min-w-0">
          <p className="text-md md:text-xl font-bold leading-snug mb-2">
            If gambling has stopped being fun, help is free, confidential, and available now.
          </p>
          <address className="not-italic text-sm text-text-on-dark-muted leading-relaxed">
            Helpline: [{helplineNumber} — verify before launch] · 24/7 · call or text
          </address>
        </div>
        <Link
          href="#get-help"
          className="btn-primary bg-bg-card text-text-primary font-bold gap-1.5 shrink-0 group"
        >
          Find help below
          <ArrowDown
            strokeWidth={2}
            className="size-3 shrink-0 transition duration-300 group-hover:translate-y-1"
            aria-hidden="true"
          />
        </Link>
      </aside>

      <header className="flex flex-col gap-3 max-w-160">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet  leading-snug text-pretty">
          Responsible gambling
        </h1>
        <p className="text-lg font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — why this page exists, what readers will find on it, and a plain
          statement that WagerBlogs earns commission from operators and still wants readers to bet
          less, not more, when it stops being entertainment.]
        </p>
      </header>

      <section id="warning-signs" className="flex flex-col gap-3">
        <h2 className="heading text-h2 leading-heading">Warning signs worth taking seriously</h2>
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
      </section>

      <section id="self-check" className="max-w-160">
        <h2 className="heading text-h2 leading-heading mb-3">A quick self-check</h2>
        <p className="text-lg font-medium leading-copy text-text-strong-secondary mb-4 text-pretty">
          These ten questions are the {selfAssessmentSource.instrument}, reproduced from the{" "}
          {selfAssessmentSource.organisation}. Answering &ldquo;yes&rdquo; to any of them is a
          reason to talk to someone.
        </p>
        <SelfAssessment />
        <p className="text-xs text-text-meta font-medium leading-lead mt-3 text-pretty">
          Source:{" "}
          <a href={selfAssessmentSource.url} rel="noopener" target="_blank" className="underline">
            {selfAssessmentSource.organisation} — Problem Gambling Self-Assessment
          </a>
          . Questions are reproduced verbatim; WagerBlogs is not affiliated with the{" "}
          {selfAssessmentSource.organisation} and this tool does not diagnose.
        </p>
      </section>

      <section id="tools" className="flex flex-col gap-3">
        <h2 className="heading text-h2 leading-heading">Tools that actually limit play</h2>
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {rgTools.map((t) => (
            <li key={t.title} className="card">
              <h3 className="text-md font-semibold text-text-primary mb-1.5">{t.title}</h3>
              <p className="text-sm text-text-muted leading-loose">{t.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="get-help">
        <h2 className="heading text-h2 leading-heading mb-3">Where to get help</h2>
        <ul role="list" className="flex flex-col mt-2">
          {rgResources.map((r) => (
            <li
              key={r.name}
              className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center justify-between py-4 border-b border-border-hairline"
            >
              <div className="min-w-0">
                <h3 className="text-md font-semibold text-text-primary mb-1.5">{r.name}</h3>
                <p className="text-xs text-text-meta leading-relaxed">{r.desc}</p>
              </div>
              <address className="text-sm not-italic text-text-subtle font-mono border border-dashed border-border-placeholder rounded-sm px-3 py-2 whitespace-nowrap shrink-0">
                {r.contact}
              </address>
            </li>
          ))}
        </ul>
        <ArrowLink
          href="/responsible-gambling/help-directory"
          className="inline-flex items-center gap-1 min-h-11 mt-2 text-md text-text-primary font-semibold group"
        >
          Full worldwide help directory
        </ArrowLink>
      </section>

      {/* TODO(cms): stateSelfExclusion[] — never link to an unverified registry.
          Required per state: programName, officialUrl, verifiedAt. Finder omitted here. */}
      <section id="self-exclusion">
        <h2 className="heading text-h2 leading-heading mb-3">Self-exclusion in your state</h2>
        <p className="text-lg font-medium leading-copy text-text-strong-secondary max-w-160 text-pretty">
          [Placeholder — most legal states run their own self-exclusion registers; enrolling bars
          every licensed operator in that state at once.]
        </p>
      </section>

      <section>
        <h2 className="heading text-h2 leading-heading mb-3">
          If you&apos;re worried about someone else
        </h2>
        <p className="text-lg font-medium leading-copy text-text-strong-secondary max-w-160 text-pretty">
          [Placeholder — guidance for friends and family: what tends to help, what tends to
          backfire, and where support exists for you as well as for them.]
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="heading text-h2 leading-heading">What we do on our side</h2>
        <ol role="list" className="flex flex-col max-w-160">
          {rgCommitments.map((c, i) => (
            <li
              key={c}
              className="flex gap-3.5 items-baseline py-3 border-b border-border-hairline"
            >
              <span aria-hidden="true" className="text-xs text-text-subtle font-mono shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-md text-text-strong-secondary leading-copy">{c}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* TODO(cms): ExpertReview — no reviewer record connected. Required: fullName,
          clinicalOrCounsellingCredential, reviewedAt, reviewerUrl. The "reviewed by"
          line stays absent until a credentialed reviewer signs off on this page. */}
    </PageShell>
  );
}
