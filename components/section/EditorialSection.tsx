import type { ReactNode } from "react";

type EditorialSectionProps = {
  title: string;
  className?: string;
  children: ReactNode;
};

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
