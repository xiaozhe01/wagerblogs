import { bonusOffers } from "@/lib/mock-data";
import BonusOfferCard from "@/components/cards/BonusOfferCard";

export default function FeaturedBonusesCard() {
  return (
    <section className="flex flex-col gap-3" aria-labelledby="featured-bonuses">
      <h2 id="featured-bonuses" className="heading text-2xl">
        Featured Bonuses This Week
      </h2>
      <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        {bonusOffers.map((o) => (
          <li key={o.name}>
            <BonusOfferCard offer={o} />
          </li>
        ))}
      </ul>
    </section>
  );
}
