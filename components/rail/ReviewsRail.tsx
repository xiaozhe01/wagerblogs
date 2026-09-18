import { getPayload } from "payload";
import config from "@payload-config";
import AnchorList from "./AnchorList";
import InfoCard from "./InfoCard";

// Async server component: it fetches its own list rather than taking it as a
// prop, so every page that renders the rail stays correct without threading
// data through. Verticals is structural taxonomy — no drafts, no _status.
export default async function ReviewsRail({ currentSlug }: { currentSlug?: string }) {
  const payload = await getPayload({ config });
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    where: { hasReviews: { equals: true } },
    sort: "order",
    limit: 100,
    depth: 0,
    overrideAccess: false,
  });

  return (
    <>
      {verticals.length > 0 && (
        <AnchorList
          title="Review sections"
          cardClassName="card"
          items={verticals.map((vertical) => ({
            href: `/reviews/${vertical.slug}`,
            label: `${vertical.name} reviews`,
            key: vertical.slug,
            current: vertical.slug === currentSlug,
          }))}
        />
      )}
      <InfoCard
        title="Editorial standards"
        body="How we research, test with real deposits, and correct our reviews."
        cta={{ href: "/about", label: "Read our methodology" }}
      />
    </>
  );
}
