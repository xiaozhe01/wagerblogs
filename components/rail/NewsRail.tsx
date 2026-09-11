import type { ReactNode } from "react";
import AnchorList from "./AnchorList";
import InfoCard from "./InfoCard";
import { newsSections } from "@/lib/news";

export default function NewsRail({
  currentSlug,
  children,
}: {
  currentSlug?: string;
  /** Extra cards for one route, between the section list and the standing tail. */
  children?: ReactNode;
}) {
  return (
    <>
      <AnchorList
        title="Sections"
        cardClassName="card"
        items={newsSections.map((section) => ({
          href: section.href,
          label: section.category,
          key: section.slug,
          current: section.slug === currentSlug,
        }))}
      />
      {children}
      <InfoCard
        title="Corrections"
        body="Spotted something wrong? Tell us and we'll fix it."
        cta={{ href: "/contact", label: "Report an issue" }}
      />
    </>
  );
}
