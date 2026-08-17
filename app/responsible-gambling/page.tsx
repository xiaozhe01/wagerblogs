import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import HelpLineCard from "@/components/rail/HelpLineCard";
import InfoCard from "@/components/rail/InfoCard";
import AnchorList from "@/components/rail/AnchorList";
import ArrowLink from "@/components/ui/ArrowLink";
import {
  rgWarningSigns,
  rgSelfCheckQuestions,
  rgTools,
  rgResources,
  rgCommitments,
  rgToc,
  helplineNumber,
} from "@/lib/mock-data";

export const metadata: Metadata = { title: "Responsible Gambling — WagerBlogs" };

export default function ResponsibleGamblingPage() {
  const rail = (
    <>
      <HelpLineCard />
      <AnchorList
        title="On this page"
        items={rgToc}
        itemClassName="flex items-center min-h-11 lg:min-h-8 text-sm text-text-body no-underline border-b border-border-hairline-alt leading-snug"
      />
      <InfoCard
        title="Our commitments"
        body="How an affiliate publisher handles responsible gambling honestly."
        cta={
          <ArrowLink
            href="/about"
            className="inline-flex items-center min-h-11 text-xs text-text-primary font-semibold group"
          >
            About WagerBlogs
          </ArrowLink>
        }
      />
      <InfoCard
        title="Corrections"
        body="A resource listed here out of date? Tell us and we'll fix it."
        cta={
          <ArrowLink
            href="/contact"
            className="inline-flex items-center min-h-11 text-xs text-text-primary font-semibold group"
          >
            Report an issue
          </ArrowLink>
        }
      />
    </>
  );

  return (
    <PageShell activeNavId="more" rail={rail}>
      {/* Register: Editorial · Tier 1 — required trust page, no monetization, no operator links */}
      <section className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-bg-dark-block text-white rounded-md p-5">
        <div className="min-w-0">
          <div className="text-md md:text-xl font-bold leading-snug mb-2">
            If gambling has stopped being fun, help is free, confidential, and available now.
          </div>
          <div className="text-sm text-text-on-dark-muted leading-relaxed">
            Helpline: [{helplineNumber} — verify before launch] · 24/7 · call or text
          </div>
        </div>
        <a href="#get-help" className="btn-primary bg-bg-card text-text-primary font-bold shrink-0">
          Find help below ↓
        </a>
      </section>

      <header className="flex flex-col gap-3 max-w-160">
        <h1 className="heading-serif text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Responsible gambling
        </h1>
        <p className="font-serif text-xl leading-lead text-text-body text-pretty">
          [Placeholder standfirst — why this page exists, what readers will find on it, and a plain
          statement that WagerBlogs earns commission from operators and still wants readers to bet
          less, not more, when it stops being entertainment.]
        </p>
      </header>

      <section id="warning-signs">
        <h2 className="heading-serif text-h2-serif leading-heading mb-3.5">
          Warning signs worth taking seriously
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {rgWarningSigns.map((w) => (
            <div
              key={w}
              className="border-t border-border-divider pt-3 text-sm text-text-strong-secondary leading-relaxed"
            >
              {w}
            </div>
          ))}
        </div>
      </section>

      <section id="self-check">
        <h2 className="heading-serif text-h2-serif leading-heading mb-3.5">A quick self-check</h2>
        <p className="font-serif text-xl leading-copy text-text-strong-secondary mb-4 max-w-160 text-pretty">
          [Placeholder intro — these questions are adapted from screening tools used by
          problem-gambling organisations; answering &ldquo;yes&rdquo; to any of them is a reason to
          talk to someone.]
        </p>
        <div className="border border-border-divider rounded-md p-4 md:p-5 max-w-160 flex flex-col gap-1">
          {rgSelfCheckQuestions.map((q) => (
            <div
              key={q}
              className="flex gap-3 items-start py-2.5 border-b border-border-hairline-alt min-h-11"
            >
              <span className="w-5 h-5 shrink-0 border border-border-input rounded-sm" />
              <span className="text-md text-text-strong-secondary leading-relaxed">{q}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="tools">
        <h2 className="heading-serif text-h2-serif leading-heading mb-3.5">
          Tools that actually limit play
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {rgTools.map((t) => (
            <div key={t.title} className="card">
              <div className="text-md font-semibold text-text-primary mb-1.5">{t.title}</div>
              <div className="text-sm text-text-muted leading-loose">{t.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="get-help">
        <h2 className="heading-serif text-h2-serif leading-heading mb-1">Where to get help</h2>
        <div className="flex flex-col mt-2">
          {rgResources.map((r) => (
            <div
              key={r.name}
              className="flex flex-col md:flex-row gap-2 md:gap-6 items-start md:items-center justify-between py-4 border-b border-border-hairline"
            >
              <div className="min-w-0">
                <div className="text-md font-semibold text-text-primary mb-1">{r.name}</div>
                <div className="text-xs text-text-meta leading-relaxed">{r.desc}</div>
              </div>
              <div className="text-sm text-text-subtle font-mono border border-dashed border-border-placeholder rounded-sm px-3 py-2 whitespace-nowrap shrink-0">
                {r.contact}
              </div>
            </div>
          ))}
        </div>
        <ArrowLink
          href="/responsible-gambling/help-directory"
          className="inline-flex items-center min-h-11 mt-2 text-md text-text-primary font-semibold group"
        >
          Full worldwide help directory
        </ArrowLink>
      </section>

      {/* TODO(cms): stateSelfExclusion[] — never link to an unverified registry.
          Required per state: programName, officialUrl, verifiedAt. Finder omitted here. */}
      <section id="self-exclusion">
        <h2 className="heading-serif text-h2-serif leading-heading mb-3">
          Self-exclusion in your state
        </h2>
        <p className="font-serif text-xl leading-copy text-text-strong-secondary max-w-160 text-pretty">
          [Placeholder — most legal states run their own self-exclusion registers; enrolling bars
          every licensed operator in that state at once.]
        </p>
      </section>

      <section>
        <h2 className="heading-serif text-h2-serif leading-heading mb-3">
          If you&apos;re worried about someone else
        </h2>
        <p className="font-serif text-xl leading-copy text-text-strong-secondary max-w-160 text-pretty">
          [Placeholder — guidance for friends and family: what tends to help, what tends to
          backfire, and where support exists for you as well as for them.]
        </p>
      </section>

      <section>
        <h2 className="heading-serif text-h2-serif leading-heading mb-1">What we do on our side</h2>
        <div className="flex flex-col max-w-160">
          {rgCommitments.map((c, i) => (
            <div key={c} className="flex gap-3.5 items-start py-3 border-b border-border-hairline">
              <span className="text-xs text-text-subtle font-mono shrink-0 w-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-md text-text-strong-secondary leading-copy">{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TODO(cms): ExpertReview — no reviewer record connected. Required: fullName,
          clinicalOrCounsellingCredential, reviewedAt, reviewerUrl. The "reviewed by"
          line stays absent until a credentialed reviewer signs off on this page. */}
    </PageShell>
  );
}
