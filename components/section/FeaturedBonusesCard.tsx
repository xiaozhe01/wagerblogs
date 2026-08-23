import { bonusOffers } from "@/lib/mock-data";
import BonusOfferCard from "@/components/cards/BonusOfferCard";

export default function FeaturedBonusesCard() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="heading text-2xl">Featured Bonuses This Week</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-legacy-4 md:gap-3">
        {bonusOffers.map((o) => (
          <BonusOfferCard key={o.name} offer={o} />
        ))}
      </div>
    </section>
  );
}
