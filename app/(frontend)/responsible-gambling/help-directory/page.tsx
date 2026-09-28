import type { Metadata } from "next";
import { getPayload } from "payload";
import config from "@payload-config";
import type { HelpDirectoryEntry } from "@/payload-types";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink, { sectionCtaClassName } from "@/components/controls/ArrowLink";
import AnchorList from "@/components/rail/AnchorList";
import InfoCard from "@/components/rail/InfoCard";
import EditorialSection from "@/components/section/EditorialSection";
import EmptyState from "@/components/section/EmptyState";
import FilterChips from "@/components/controls/FilterChips";
import Prose from "@/components/section/Prose";
import { ALL_REGIONS, REGION_PARAM } from "@/lib/site-data";
import { helpRegionLabel, helpRegionValues, helpRegions } from "@/lib/help-regions";
import {
  CONTACT_KINDS,
  HELP_LINK_REL,
  contactHref,
  contactText,
  displayContact,
} from "@/lib/help-contacts";
import { buildOpenGraph } from "@/lib/og";
import { chipHref, formatDate, headingId, resolveChip } from "@/lib/utils";

// No `revalidate`: this route reads searchParams for the region chip, so Next
// renders it per request and the ISR window would never apply.

// HelpDirectoryEntries carries no seo group — one page, stable copy.
const TITLE = "Gambling-Help Directory — WagerBlogs";
const DESCRIPTION =
  "Free, confidential gambling-help organisations worldwide, listed by region with the contact routes each one offers.";
const PATH = "/responsible-gambling/help-directory";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: buildOpenGraph({ title: TITLE, description: DESCRIPTION, path: PATH }),
  alternates: { canonical: PATH },
};

const DIRECTORY_ANCHOR = "directory";

const regionHref = (region: string) =>
  chipHref({
    basePath: "/responsible-gambling/help-directory",
    param: REGION_PARAM,
    value: region,
    allValue: ALL_REGIONS,
  });

export default async function RGDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const activeRegion = resolveChip(helpRegionValues, query[REGION_PARAM], ALL_REGIONS);

  const payload = await getPayload({ config });
  // HelpDirectoryEntries is structural — no drafts, so no _status filter. The
  // verified gate is CLAUDE.md rule 3: an unchecked organisation is not a real
  // one, and a help directory is the worst place to guess.
  const { docs: entries } = await payload.find({
    collection: "help-directory-entries",
    where: { verified: { equals: true } },
    sort: "name",
    depth: 0,
    pagination: false,
    overrideAccess: false,
  });

  // Grouped in the taxonomy's own order, not the order records happen to load.
  const visibleGroups = helpRegionValues
    .filter((region) => region !== ALL_REGIONS)
    .filter((region) => activeRegion === ALL_REGIONS || region === activeRegion)
    .map((region) => ({
      region,
      entries: entries.filter((entry) => entry.region === region),
    }))
    .filter((group) => group.entries.length > 0);

  const rail = (
    <>
      <nav aria-label="Regions" className="card">
        <AnchorList
          items={helpRegions.map((region) => ({
            href: regionHref(region.value),
            label: region.label,
            key: region.value,
            current: region.value === activeRegion,
          }))}
        />
      </nav>
      <InfoCard
        title="Understanding the risks"
        body="Warning signs, self-checks, and the tools that limit play."
        cta={{
          href: "/responsible-gambling",
          label: "Responsible gambling guide",
        }}
      />
      <InfoCard
        title="Corrections"
        body="A contact detail out of date? Tell us — these listings only work if they're current."
        cta={{ href: "/contact", label: "Report an issue" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="more" register="editorial" rail={rail}>
      {/* Register: Editorial · Tier 1 — help directory, no monetization, no operator links */}
      <Breadcrumbs
        items={[
          { label: "Responsible Gambling", href: "/responsible-gambling" },
          { label: "Help directory" },
        ]}
      />

      <header className="flex flex-col gap-3 max-w-header">
        <h1 className="heading text-5xl-mobile md:text-5xl-tablet lg:text-5xl-desktop leading-snug text-pretty">
          Worldwide Gambling-help organizations
        </h1>
        <p className="text-2xl font-medium leading-copy text-text-body text-pretty">
          Every organization here offers free, confidential support. We check each contact detail
          against the organization&apos;s own published information before it appears, and re-check
          it on a schedule.
        </p>
      </header>

      {/* A caveat about the list below it, so it sits with the list rather than
          in a rail a phone never renders. No CTA: the action it names is local
          emergency services, which has no single number to link. */}
      <section className="card-inverted" aria-labelledby="immediate-danger">
        <h2
          id="immediate-danger"
          className="heading text-2xl leading-heading text-text-on-inverted mb-2.5"
        >
          In immediate danger?
        </h2>
        <p className="text-xs font-semibold text-text-on-inverted-muted leading-loose">
          Contact your local emergency services. The organizations on this page support gambling
          harm; they are not crisis lines unless marked.
        </p>
      </section>

      {/* Chips and the list they filter are one unit. */}
      <section aria-label="Gambling-help organizations" className="flex flex-col gap-3">
        <FilterChips
          label="Filter by region"
          items={helpRegions.map((region) => ({
            label: region.label,
            key: region.value,
            href: regionHref(region.value),
            active: region.value === activeRegion,
          }))}
        />

        {/* Keyed so only the directory replays the fade. */}
        <div
          key={activeRegion}
          id={DIRECTORY_ANCHOR}
          className="route-transition flex flex-col gap-5"
        >
          {visibleGroups.length === 0 && (
            <section aria-labelledby={headingId("region", activeRegion)}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap pt-3.5 mb-3">
                <h2
                  id={headingId("region", activeRegion)}
                  className="heading text-h2 leading-heading"
                >
                  {helpRegionLabel(activeRegion)}
                </h2>
                <span className="text-xs text-text-muted font-semibold tabular-nums">
                  0 Organizations
                </span>
              </div>
              {/* min-h-80 so an empty region holds the rhythm a populated one does. */}
              <EmptyState
                className="min-h-80"
                title={`No verified organizations for ${helpRegionLabel(activeRegion)} yet`}
                body="Entries appear here only after their contact details are checked against the organization's own published information."
                action={{
                  href: regionHref(ALL_REGIONS),
                  label: "Show all regions",
                }}
              />
            </section>
          )}
          {visibleGroups.map((grp) => (
            <section key={grp.region} aria-labelledby={headingId("region", grp.region)}>
              <div className="flex items-baseline justify-between gap-4 flex-wrap pt-3.5 mb-3">
                <h2
                  id={headingId("region", grp.region)}
                  className="heading text-h2 leading-heading"
                >
                  {helpRegionLabel(grp.region)}
                </h2>
                <span className="text-xs text-text-muted font-semibold tabular-nums">
                  {grp.entries.length} Organizations
                </span>
              </div>
              <ul
                role="list"
                className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3 items-stretch"
              >
                {grp.entries.map((e) => (
                  <li key={e.id} className="min-w-0 flex">
                    <article
                      aria-labelledby={headingId("org", e.name)}
                      className="grow min-w-0 border border-border-divider rounded-md p-4 flex flex-col"
                    >
                      <div className="flex items-start justify-between gap-2.5 mb-2.5">
                        <h3
                          id={headingId("org", e.name)}
                          className="min-w-0 heading text-xl leading-snug text-pretty"
                        >
                          {e.name}
                        </h3>
                        <div className="shrink-0 flex items-center gap-1.5">
                          {e.isCrisisLine && (
                            <span className="text-2xs font-semibold uppercase tracking-wide bg-bg-accent text-text-on-fill rounded-sm px-1.5 py-1 whitespace-nowrap">
                              Crisis line
                            </span>
                          )}
                          <span className="text-2xs text-text-muted font-semibold tabular-nums border border-border-divider rounded-sm px-1.5 py-1 whitespace-nowrap">
                            {e.country}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed mb-3">
                        {e.description}
                      </p>
                      <dl className="flex flex-col gap-1.5 mb-3.5">
                        {CONTACT_KINDS.map((kind) => {
                          const value = displayContact(e.contacts?.[kind]);
                          const href = contactHref(kind, value);
                          return (
                            <div key={kind} className="flex gap-2.5 items-center">
                              <dt className="w-16 shrink-0 text-2xs font-semibold text-text-muted uppercase tracking-wide">
                                {kind}
                              </dt>
                              <dd className="text-xs font-medium tabular-nums border border-dashed border-border-placeholder rounded-sm px-2 py-1 min-w-0 flex-1 truncate">
                                {!value ? (
                                  <span className="text-text-muted">
                                    Not offered by this service
                                  </span>
                                ) : href ? (
                                  <a
                                    href={href}
                                    {...(href.startsWith("http")
                                      ? { target: "_blank", rel: HELP_LINK_REL }
                                      : {})}
                                    className="text-text-body hover:text-brand"
                                  >
                                    {contactText(value, href)}
                                    {href.startsWith("http") && (
                                      <span className="sr-only"> (opens in a new tab)</span>
                                    )}
                                  </a>
                                ) : (
                                  <span className="text-text-body">{value}</span>
                                )}
                              </dd>
                            </div>
                          );
                        })}
                      </dl>
                      <p className="meta-label border-t border-dashed border-border-input pt-2.5 mt-auto leading-relaxed">
                        {verifiedStamp(e)} · entry does not publish without this stamp
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>

      <EditorialSection title="Missing an organization?" register="editorial">
        <Prose>
          To be listed here, an organization has to be free to use, confidential, and run by a
          non-profit or a public health body. We don&apos;t list commercial treatment providers, and
          no one can pay to appear.
        </Prose>
        <Prose>
          Know one we&apos;ve missed? Send it over with a link to its own contact page and
          we&apos;ll check it.
        </Prose>
        <ArrowLink href="/contact" className={`${sectionCtaClassName} min-h-11 w-fit`}>
          Suggest an addition
        </ArrowLink>
      </EditorialSection>
    </PageShell>
  );
}

/** verified gates the query; verifiedAt is the date behind the claim. An entry
 * can be verified without one, and the stamp says so rather than inventing a
 * date. */
function verifiedStamp(entry: HelpDirectoryEntry) {
  if (!entry.verifiedAt) return "Verified — [date pending]";
  return `Verified — ${formatDate(entry.verifiedAt)}`;
}
