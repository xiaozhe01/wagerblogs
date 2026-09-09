import type { ReactNode } from "react";
import ArrowLink from "@/components/controls/ArrowLink";

export const railCtaClassName =
  "inline-flex items-center gap-1 min-h-4 text-sm link-cta font-semibold group w-fit";

type InfoCardProps = {
  title: string;
  body: ReactNode;
  cta: { href: string; label: string };
};

// Unnamed <section> on purpose: a named one is a region landmark, and a rail
// card titled "Corrections" collided with the page section of the same name.
// Unnamed it maps to generic; the heading still carries the outline.
export default function InfoCard({ title, body, cta }: InfoCardProps) {
  return (
    <section className="card flex flex-col gap-2.5">
      <h2 className="heading text-sm">{title}</h2>
      <p className="text-xs text-text-body font-medium leading-loose">{body}</p>
      <ArrowLink href={cta.href} className={railCtaClassName}>
        {cta.label}
      </ArrowLink>
    </section>
  );
}
