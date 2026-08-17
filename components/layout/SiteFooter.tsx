import Link from "next/link";
import { footerCols, legalLinks, legalParagraphs } from "@/lib/site-data";
import { helplineNumber } from "@/lib/mock-data";
import ArrowLink from "@/components/ui/ArrowLink";

// RG banner + footer nav + extended legal strip. Present at the bottom of every route.
export default function SiteFooter() {
  return (
    <>
      <section className="mt-4">
        <div className="rounded-md bg-bg-accent text-text-on-accent p-legacy-6 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="text-md font-semibold leading-relaxed text-text-on-accent">
            Gambling problem? Call [{helplineNumber}] or visit our Responsible Gambling resources.
          </div>
          <ArrowLink
            href="/responsible-gambling/help-directory"
            className="btn-primary bg-bg-card text-text-primary font-bold gap-1 group"
          >
            Get Help
          </ArrowLink>
        </div>
      </section>

      <footer className="mt-4 rounded-md bg-bg-dark-block text-text-on-dark-muted p-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-legacy-4 md:gap-3 mb-4">
          {footerCols.map((col) => (
            <div key={col.heading}>
              <div className="text-sm font-bold text-white uppercase tracking-wide mb-3">
                {col.heading}
              </div>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className="flex items-center min-h-11 lg:min-h-0 lg:mb-2 text-sm text-text-on-dark-muted no-underline"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-border-on-dark pt-4 text-xs text-text-on-dark-muted leading-loose">
          <p className="mb-2">
            WagerBlogs is an independent media and affiliate publisher. We may earn commission from
            partner links. 21+. Gambling involves risk — please play responsibly.
          </p>
          <p>© 2026 WagerBlogs. All rights reserved.</p>
        </div>
      </footer>

      <section className="mt-4">
        <div className="flex gap-3.5 flex-wrap mb-3.5">
          {legalLinks.map((l) => (
            <Link key={l.label} href={l.href} className="text-xs text-text-body underline">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {legalParagraphs.map((p, i) => (
            <p key={i} className="text-xs text-text-meta leading-lead">
              {p}
            </p>
          ))}
        </div>
        <p className="text-xs text-text-body leading-lead mt-3">
          Publisher: WagerBlogs Media Ltd · Company No. [00000000] · [Registered address
          placeholder] · [contact@wagerblogs.com]
        </p>
        {/* TODO(cms): ComplianceBadge[] — intentionally omitted. Render only once real, verifiable
            certifications exist (name, issuer, reference, verifyUrl). Never ship placeholder badges. */}
        <div className="border-t border-border-divider mt-4 pt-3.5 text-xs text-text-subtle leading-lead">
          © 2026 WagerBlogs Media Ltd. All rights reserved. All trademarks are the property of their
          respective owners and are used for identification purposes only.
        </div>
      </section>
    </>
  );
}
