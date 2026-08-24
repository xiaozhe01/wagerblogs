import type { ReactNode } from "react";
import ArrowLink from "@/components/ui/ArrowLink";
import { headingId } from "@/lib/utils";

export const railCtaClassName =
  "inline-flex items-center gap-1 min-h-4 text-sm text-text-primary font-semibold group w-fit";
export const railCtaOnDarkClassName =
  "inline-flex items-center gap-1 min-h-4 text-sm text-text-on-dark font-semibold group w-fit";

type InfoCardProps = {
  title: string;
  body: ReactNode;
  cta: { href: string; label: string };
};

export default function InfoCard({ title, body, cta }: InfoCardProps) {
  const titleId = headingId("rail", title);

  return (
    <section className="card flex flex-col gap-2.5" aria-labelledby={titleId}>
      <h2 id={titleId} className="font-bold text-sm text-text-primary">
        {title}
      </h2>
      <p className="text-xs text-text-body leading-loose">{body}</p>
      <ArrowLink href={cta.href} className={railCtaClassName}>
        {cta.label}
      </ArrowLink>
    </section>
  );
}
