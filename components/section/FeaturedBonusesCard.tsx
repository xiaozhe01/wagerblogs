import BonusOfferCard, { type BonusOfferCardData } from "@/components/cards/BonusOfferCard";
import EmptyState from "./EmptyState";
import { TIER_CLASSNAME } from "./heading-tiers";

export default function FeaturedBonusesCard({ offers }: { offers: BonusOfferCardData[] }) {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="featured-bonuses">
      <h2 id="featured-bonuses" className={TIER_CLASSNAME.section}>
        Featured Bonuses This Week
      </h2>
      {offers.length === 0 ? (
        <EmptyState
          title="No active bonus offers"
          body="An offer appears here once it is published and marked active in the admin panel."
        />
      ) : (
        <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
          {offers.map((offer) => (
            <li key={offer.name}>
              <BonusOfferCard offer={offer} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
