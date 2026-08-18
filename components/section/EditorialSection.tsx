import type { ReactNode } from "react";

type EditorialSectionProps = {
  title: string;
  className?: string;
  children: ReactNode;
};

// Editorial-register "<section><h2>title</h2>{children}</section>" wrapper
// repeated across the homepage sections. `className` stays a full literal
// override (not a computed gap-${n} string) so Tailwind's JIT scanner can
// still see each exact class name used.
export default function EditorialSection({
  title,
  className = "flex flex-col gap-5",
  children,
}: EditorialSectionProps) {
  return (
    <section className={className}>
      <h2 className="heading text-h2 leading-heading">{title}</h2>
      {children}
    </section>
  );
}
