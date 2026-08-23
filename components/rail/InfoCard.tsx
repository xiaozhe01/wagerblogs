import type { ReactNode } from "react";
import ArrowLink from "@/components/ui/ArrowLink";

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
  return (
    <div className="card flex flex-col gap-2.5">
      <div className="font-bold text-sm text-text-primary">{title}</div>
      <div className="text-xs text-text-body leading-loose">{body}</div>
      <ArrowLink href={cta.href} className={railCtaClassName}>
        {cta.label}
      </ArrowLink>
    </div>
  );
}
