import type { ReactNode } from "react";
import { headingId } from "@/lib/utils";

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
  const titleId = headingId("section", title);

  return (
    <section className={className} aria-labelledby={titleId}>
      <h2 id={titleId} className="heading text-h2 leading-heading">
        {title}
      </h2>
      {children}
    </section>
  );
}
