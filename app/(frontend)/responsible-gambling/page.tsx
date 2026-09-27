import type { Metadata } from "next";
import { ArrowDown } from "lucide-react";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import InfoCard from "@/components/rail/InfoCard";
import AnchorList from "@/components/rail/AnchorList";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import EditorialSection from "@/components/section/EditorialSection";
import SelfAssessment from "@/components/section/SelfAssessment";
import Prose from "@/components/section/Prose";
import { selfAssessmentSource } from "@/lib/self-assessment";
import { buildOpenGraph } from "@/lib/og";
import { getPayload } from "payload";
import config from "@payload-config";
import EmptyState from "@/components/section/EmptyState";
import { rgWarningSigns, rgTools, rgCommitments, rgToc, helplineNumber } from "@/lib/mock-data";

import { HELP_LINK_REL, contactHref, contactText, displayContact } from "@/lib/help-contacts";

export const revalidate = 3600;

const TITLE = "Responsible Gambling — WagerBlogs";
const DESCRIPTION =
  "How to keep betting in proportion: warning signs, a self-check, deposit and time limits, and where to get help.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({
    title: TITLE,
    description: DESCRIPTION,
    path: "/responsible-gambling",
  }),
  alternates: { canonical: "/responsible-gambling" },
};

export default async function ResponsibleGamblingPage() {
  const payload = await getPayload({ config });
  // isCrisisLine is only settable alongside verified (enforced by a hook on the
  // collection), so this is the one subset that can promise crisis support.
  // Everything else stays on the directory, which this section links to.
  const { docs: crisisLines } = await payload.find({
    collection: "help-directory-entries",
    where: { verified: { equals: true }, isCrisisLine: { equals: true } },
    sort: "name",
    depth: 0,
    pagination: false,
    overrideAccess: false,
  });

  const rail = (
    <>
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
        className="card-inverted lg:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4"
      >
        <div className="min-w-0 flex flex-col gap-2">
          <p className="text-sm font-semibold leading-snug text-pretty">
            If gambling has stopped being fun, help is free and confidential.
          </p>
          <address className="not-italic text-xs font-medium text-text-on-inverted-muted leading-snug">
            Helpline: {helplineNumber} · 24/7 · call or text
          </address>
        </div>
        <a
          href="#get-help"
          className="btn-on-fill group gap-1.5 shrink-0 w-full justify-center lg:w-auto"
        >
          Find help
          <ArrowDown
            strokeWidth={2}
            className="size-3 shrink-0 transition-transform duration-200 group-hover:translate-y-1"
            aria-hidden="true"
          />
        </a>
      </aside>

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Responsible gambling
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
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
        <Prose>
          These ten questions are the {selfAssessmentSource.instrument}, reproduced from the{" "}
          {selfAssessmentSource.organisation}. Answering &ldquo;yes&rdquo; to any of them is a
          reason to talk to someone.
        </Prose>
        <SelfAssessment />
        <p className="text-xs text-text-muted font-medium leading-copy text-pretty">
          Source:{" "}
          <a href={selfAssessmentSource.url} rel="noopener" target="_blank" className="link-inline">
            {selfAssessmentSource.organisation} — Problem Gambling Self-Assessment
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          . Questions are reproduced verbatim; WagerBlogs is not affiliated with the{" "}
          {selfAssessmentSource.organisation} and this tool does not diagnose.
        </p>
      </EditorialSection>

      <EditorialSection id="tools" title="Tools that actually limit play" register="editorial">
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {rgTools.map((t) => (
            <li key={t.title} className="border border-border-divider rounded-md p-4">
              <h3 className="text-lg font-semibold text-text-primary mb-1.5">{t.title}</h3>
              <p className="text-sm text-text-muted font-medium leading-loose">{t.body}</p>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection id="get-help" title="Where to get help" register="editorial">
        {crisisLines.length === 0 ? (
          <EmptyState
            title="No crisis lines published yet"
            body="An organisation appears here once its contact details are checked and it is marked as a crisis line in the admin panel."
            action={{
              href: "/responsible-gambling/help-directory",
              label: "Full worldwide help directory",
            }}
          />
        ) : (
          // One dialable line each. Descriptions, websites, chat routes and the
          // region filter are the directory's job — this is the fast path.
          <ul role="list" className="flex flex-col">
            {crisisLines.map((r) => {
              const phone = displayContact(r.contacts?.phone);
              const phoneHref = contactHref("phone", phone);
              const site = displayContact(r.contacts?.website);
              const siteHref = contactHref("website", site);
              const href = phoneHref ?? siteHref;
              return (
                <li
                  key={r.id}
                  className="flex items-baseline gap-3 py-3 border-b border-border-hairline"
                >
                  <span className="min-w-0 flex-1 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-text-primary truncate">
                      {r.name}
                    </span>
                    <span className="shrink-0 text-2xs text-text-muted font-semibold border border-border-divider rounded-sm px-1.5 py-0.5">
                      {r.country}
                    </span>
                  </span>
                  {href ? (
                    <a
                      href={href}
                      {...(href.startsWith("http") ? { target: "_blank", rel: HELP_LINK_REL } : {})}
                      className="shrink-0 text-sm font-semibold text-text-body tabular-nums hover:text-brand"
                    >
                      {phoneHref ? phone : contactText(site, siteHref)}
                    </a>
                  ) : (
                    <span className="shrink-0 text-xs font-medium text-text-muted">
                      See directory
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        <ArrowLink
          href="/responsible-gambling/help-directory"
          className={`${sectionCtaClassName} min-h-11`}
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
        <Prose>
          [Placeholder — most legal states run their own self-exclusion registers; enrolling bars
          every licensed operator in that state at once.]
        </Prose>
      </EditorialSection>

      <EditorialSection title="If you're worried about someone else" register="editorial">
        <Prose>
          [Placeholder — guidance for friends and family: what tends to help, what tends to
          backfire, and where support exists for you as well as for them.]
        </Prose>
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
                className="text-xs text-text-muted font-bold tabular-nums shrink-0"
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
