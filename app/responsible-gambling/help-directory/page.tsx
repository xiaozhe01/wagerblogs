import type { Metadata } from "next";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink from "@/components/ui/ArrowLink";
import InfoCard from "@/components/rail/InfoCard";
import ChipList from "@/components/ui/ChipList";
import { regions } from "@/lib/site-data";
import { helpDirectory } from "@/lib/mock-data";
import { chipHref, resolveChip } from "@/lib/utils";

export const metadata: Metadata = { title: "Gambling-Help Directory — WagerBlogs" };

const REGION_PARAM = "region";
const ALL_REGIONS = "All regions";
const DIRECTORY_ANCHOR = "directory";

const regionHref = (region: string) =>
  chipHref({
    basePath: "/responsible-gambling/help-directory",
    param: REGION_PARAM,
    value: region,
    allValue: ALL_REGIONS,
    anchor: DIRECTORY_ANCHOR,
  });

export default async function RGDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  const activeRegion = resolveChip(regions, query[REGION_PARAM], ALL_REGIONS);
  const visibleGroups =
    activeRegion === ALL_REGIONS
      ? helpDirectory
      : helpDirectory.filter((g) => g.region === activeRegion);
  const rail = (
    <>
      <section className="card-dark" aria-labelledby="rail-immediate-danger">
        <h2 id="rail-immediate-danger" className="font-bold text-sm mb-2.5">
          In immediate danger?
        </h2>
        <p className="text-xs text-text-on-dark-muted leading-loose">
          Contact your local emergency services. The organizations on this page support gambling
          harm; they are not crisis lines unless marked.
        </p>
      </section>
      <nav aria-label="Regions" className="card">
        <ul role="list">
          {regions.map((r) => (
            <li key={r} className="flex">
              <Link
                href={regionHref(r)}
                className={`grow flex items-center min-h-11 lg:min-h-6 text-sm no-underline border-b border-border-hairline-alt [li:last-child_&]:border-0 leading-snug ${r === activeRegion ? "text-text-primary font-bold" : "text-text-body"}`}
              >
                {r}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <InfoCard
        title="Understanding the risks"
        body="Warning signs, self-checks, and the tools that limit play."
        cta={{ href: "/responsible-gambling", label: "Responsible gambling guide" }}
      />
      <InfoCard
        title="Corrections"
        body="A contact detail out of date? Tell us — these listings only work if they're current."
        cta={{ href: "/contact", label: "Report an issue" }}
      />
    </>
  );

  return (
    <PageShell activeNavId="more" rail={rail}>
      {/* Register: Editorial · Tier 1 — help directory, no monetization, no operator links */}
      <Breadcrumbs
        items={[
          { label: "Responsible Gambling", href: "/responsible-gambling" },
          { label: "Help directory" },
        ]}
      />

      <header className="flex flex-col gap-3 max-w-160">
        <h1 className="heading text-4xl leading-snug text-pretty">
          Gambling-help organizations, worldwide
        </h1>
        <p className="text-lg font-medium leading-copy text-text-body text-pretty">
          [Placeholder standfirst — every organization listed here offers free, confidential
          support. Entries are checked against the organization&apos;s own published contact details
          before they appear, and re-checked on a schedule.]
        </p>
      </header>

      <nav aria-label="Filter by region">
        <ul role="list" className="flex gap-2 flex-wrap">
          <ChipList
            as="Link"
            inList
            items={regions.map((r) => ({
              label: r,
              key: r,
              href: regionHref(r),
              active: r === activeRegion,
            }))}
            activeClassName="btn-primary"
            inactiveClassName="btn-secondary"
          />
        </ul>
      </nav>

      <div id={DIRECTORY_ANCHOR} className="flex flex-col gap-5">
        {visibleGroups.length === 0 && (
          /* Chips are a fixed taxonomy, so a region can legitimately have no listings
             yet — say so rather than rendering an empty page. */
          <p className="text-sm text-text-meta leading-relaxed">
            No organizations listed for {activeRegion} yet.{" "}
            <Link href={regionHref(ALL_REGIONS)} className="underline">
              Show all regions
            </Link>
          </p>
        )}
        {visibleGroups.map((grp) => (
          <section key={grp.region}>
            <div className="flex items-baseline justify-between gap-4 flex-wrap border-t border-border-divider pt-3.5 mb-3">
              <h2 className="heading text-h2 leading-heading">{grp.region}</h2>
              <span className="text-xs text-text-subtle font-mono">
                {grp.entries.length} organizations
              </span>
            </div>
            <ul
              role="list"
              className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3 items-stretch"
            >
              {grp.entries.map((e) => (
                <li key={e.name} className="min-w-0 flex">
                  <article className="grow border border-border-divider rounded-md p-4 flex flex-col">
                    <div className="flex items-start justify-between gap-2.5 mb-2.5">
                      <h3 className="min-w-0 heading text-xl leading-snug text-pretty">{e.name}</h3>
                      <span className="shrink-0 text-2xs text-text-meta font-mono border border-border-divider rounded-sm px-1.5 py-1 whitespace-nowrap">
                        {e.country}
                      </span>
                    </div>
                    <p className="text-xs text-text-meta leading-relaxed mb-3">{e.desc}</p>
                    <dl className="flex flex-col gap-1.5 mb-3.5">
                      {e.contacts.map((c) => (
                        <div key={c.kind} className="flex gap-2.5 items-center">
                          <dt className="w-11 shrink-0 text-2xs text-text-subtle font-mono uppercase tracking-wide">
                            {c.kind}
                          </dt>
                          <dd className="text-xs text-text-subtle font-mono border border-dashed border-border-placeholder rounded-sm px-2 py-1 min-w-0 flex-1">
                            {c.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                    <p className="border-t border-dashed border-border-input pt-2.5 mt-auto text-2xs text-text-subtle font-mono leading-relaxed">
                      Verified — [pending] · entry does not publish without this stamp
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section>
        <h2 className="heading leading-heading mb-3">Missing an organization?</h2>
        <p className="text-lg font-medium leading-copy text-text-strong-secondary max-w-160 mb-2 text-pretty">
          [Placeholder — inclusion criteria: free to use, confidential, and operated by a non-profit
          or public-health body. Commercial treatment providers are out of scope.]
        </p>
        <ArrowLink
          href="/contact"
          className="inline-flex items-center gap-1 min-h-11 text-md text-text-primary font-semibold group w-fit"
        >
          Suggest an addition
        </ArrowLink>
      </section>
    </PageShell>
  );
}
