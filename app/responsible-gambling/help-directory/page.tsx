import type { Metadata } from "next";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import ArrowLink from "@/components/ui/ArrowLink";
import InfoCard from "@/components/rail/InfoCard";
import ChipList from "@/components/ui/ChipList";
import { regions } from "@/lib/site-data";
import { helpDirectory } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Gambling-Help Directory — WagerBlogs" };

export default function RGDirectoryPage() {
  const rail = (
    <>
      <div className="card-dark">
        <p className="font-bold text-sm mb-2.5">In immediate danger?</p>
        <p className="text-xs text-text-on-dark-muted leading-loose">
          Contact your local emergency services. The organizations on this page support gambling
          harm; they are not crisis lines unless marked.
        </p>
      </div>
      <div className="card">
        {/* TODO: static display only — wire up real region filtering in the app build */}
        {regions.map((r) => (
          <div
            key={r}
            className={`flex items-center min-h-6 text-sm border-b border-border-hairline-alt last:border-0 leading-snug ${r === "All regions" ? "text-text-primary font-bold" : "text-text-body"}`}
          >
            {r}
          </div>
        ))}
      </div>
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

      <div className="flex gap-2 flex-wrap">
        <ChipList
          as="div"
          items={regions.map((r) => ({ label: r, active: r === "All regions" }))}
          activeClassName="btn-primary"
          inactiveClassName="btn-secondary"
        />
      </div>

      <div className="flex flex-col gap-5">
        {helpDirectory.map((grp) => (
          <section key={grp.region}>
            <div className="flex items-baseline justify-between gap-4 flex-wrap border-t border-border-divider pt-3.5 mb-3">
              <h2 className="heading text-h2 leading-heading">{grp.region}</h2>
              <div className="text-xs text-text-subtle font-mono">
                {grp.entries.length} organizations
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3 items-stretch">
              {grp.entries.map((e) => (
                <div
                  key={e.name}
                  className="min-w-0 border border-border-divider rounded-md p-4 flex flex-col"
                >
                  <div className="flex items-start justify-between gap-2.5 mb-2.5">
                    <div className="min-w-0 heading text-xl leading-snug text-pretty">{e.name}</div>
                    <div className="shrink-0 text-2xs text-text-meta font-mono border border-border-divider rounded-sm px-1.5 py-1 whitespace-nowrap">
                      {e.country}
                    </div>
                  </div>
                  <div className="text-xs text-text-meta leading-relaxed mb-3">{e.desc}</div>
                  <div className="flex flex-col gap-1.5 mb-3.5">
                    {e.contacts.map((c) => (
                      <div key={c.kind} className="flex gap-2.5 items-center">
                        <span className="w-11 shrink-0 text-2xs text-text-subtle font-mono uppercase tracking-wide">
                          {c.kind}
                        </span>
                        <span className="text-xs text-text-subtle font-mono border border-dashed border-border-placeholder rounded-sm px-2 py-1 min-w-0 flex-1">
                          {c.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-border-input pt-2.5 mt-auto text-2xs text-text-subtle font-mono leading-relaxed">
                    Verified — [pending] · entry does not publish without this stamp
                  </div>
                </div>
              ))}
            </div>
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
