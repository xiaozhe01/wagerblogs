import type { ReactNode } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import AnchorList from "./AnchorList";
import InfoCard from "./InfoCard";

// Async server component: it fetches its own list rather than taking it as a
// prop, so every page that renders the rail stays correct without threading
// data through.
export default async function NewsRail({
  currentSlug,
  children,
}: {
  currentSlug?: string;
  /** Extra cards for one route, between the section list and the standing tail. */
  children?: ReactNode;
}) {
  const payload = await getPayload({ config });
  // news-sections has no _status — structural (no lifecycle).
  const { docs: sections } = await payload.find({
    collection: "news-sections",
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  return (
    <>
      {sections.length > 0 && (
        <AnchorList
          title="Sections"
          cardClassName="card"
          items={sections.map((section) => ({
            href: `/news/${section.slug}`,
            label: section.name,
            key: section.slug,
            current: section.slug === currentSlug,
          }))}
        />
      )}
      {children}
    </>
  );
}

/** The standing tail for the two news indexes. Not part of NewsRail: the story
 * template carries its own Corrections section in main, so a rail card there
 * would say the same thing twice. */
export function NewsCorrectionsCard() {
  return (
    <InfoCard
      title="Corrections"
      body="Spotted something wrong? Tell us and we'll fix it."
      cta={{ href: "/contact", label: "Report an issue" }}
    />
  );
}
