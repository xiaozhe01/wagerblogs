import type { ReactNode } from "react";

type InfoCardProps = {
  title: string;
  titleClassName?: string;
  body: ReactNode;
  cta: ReactNode;
};

// "title + body copy + one CTA" rail-card shape (Editorial standards,
// Corrections, and siblings). `cta` is a slot rather than a fixed link
// renderer since call sites vary between the ArrowLink icon style and a
// plain underlined link — each keeps its own exact styling.
export default function InfoCard({ title, titleClassName, body, cta }: InfoCardProps) {
  return (
    <div className="card">
      <div className={titleClassName ?? "font-bold text-sm text-text-primary mb-2"}>{title}</div>
      <div className="text-xs text-text-body leading-loose mb-3">{body}</div>
      {cta}
    </div>
  );
}
