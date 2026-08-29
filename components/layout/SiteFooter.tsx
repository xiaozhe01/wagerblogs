import Link from "next/link";
import { footerCols, legalLinks, legalParagraphs } from "@/lib/site-data";
import { helplineNumber } from "@/lib/mock-data";
import ArrowLink from "@/components/ui/ArrowLink";

// RG banner + footer nav + extended legal strip. Present at the bottom of every route.
// The RG banner and legal strip must stay INSIDE this <footer> or the publisher and
// copyright block falls outside the contentinfo landmark. The dark block below is a
// <div> and must remain one — <footer> may not contain another <footer>.
export default function SiteFooter() {
  return (
    <footer className="mt-4">
      <section aria-label="Responsible gambling">
        <div className="rounded-md bg-bg-accent text-text-on-accent p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <p className="text-md font-semibold leading-relaxed text-text-on-accent">
            Gambling problem? Call [{helplineNumber}] or visit our Responsible Gambling resources.
          </p>
          <ArrowLink
            href="/responsible-gambling/help-directory"
            className="btn-primary bg-bg-card text-text-primary font-bold gap-1 group"
          >
            Get Help
          </ArrowLink>
        </div>
      </section>

      <div className="mt-4 rounded-md bg-bg-dark-block text-text-on-dark-muted p-4">
        <nav aria-label="Footer" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-3 mb-4">
          {footerCols.map((col) => (
            <div key={col.heading}>
              <h3 className="text-2xs font-bold text-text-on-dark uppercase tracking-wide mb-3">
                {col.heading}
              </h3>
              <ul role="list" className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="group flex items-center min-h-0 text-2xs text-text-on-dark-muted font-medium no-underline"
                    >
                      <span className="relative after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out after:content-[''] group-hover:after:scale-x-100">
                        {l.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="border-t border-border-on-dark pt-4 text-2xs text-text-on-dark-muted leading-copy">
          <p className="mb-2 font-medium">
            WagerBlogs is an independent media and affiliate publisher. We may earn commission from
            partner links. 21+. Gambling involves risk — please play responsibly.
          </p>
        </div>
      </div>

      <section aria-label="Legal" className="mt-4">
        {/* `flex` on each <li> keeps the anchor a flex item; as inline content the <li>
            would size its line box from its own inherited 16px strut, not the link's
            text-xs, and every route grows by ~18px. */}
        <ul role="list" className="flex gap-3.5 flex-wrap mb-3.5">
          {legalLinks.map((l) => (
            <li key={l.label} className="flex">
              <Link
                href={l.href}
                className="relative text-2xs text-text-body font-medium after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:ease-out after:content-[''] hover:after:scale-x-100"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2.5">
          {legalParagraphs.map((p, i) => (
            <p key={i} className="text-2xs text-text-meta font-medium leading-copy">
              {p}
            </p>
          ))}
        </div>
        <p className="text-2xs text-text-body font-medium leading-copy mt-3">
          Publisher: WagerBlogs Media Ltd · Company No. [00000000] · [Registered address
          placeholder] · [contact@wagerblogs.com]
        </p>
        {/* TODO(cms): ComplianceBadge[] — intentionally omitted. Render only once real, verifiable
            certifications exist (name, issuer, reference, verifyUrl). Never ship placeholder badges. */}
        <p className="border-t border-border-divider mt-4 pt-3.5 text-2xs text-text-subtle font-medium leading-copy">
          © 2026 WagerBlogs Media Ltd. All rights reserved. All trademarks are the property of their
          respective owners and are used for identification purposes only.
        </p>
      </section>
    </footer>
  );
}
