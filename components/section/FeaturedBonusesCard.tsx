import { bonusOffers } from "@/lib/mock-data";
import PrimaryDomainLink from "../PrimaryDomainLink";

export default function FeaturedBonusesCard() {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl text-text-primary tracking-tight">Featured Bonuses This Week</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 cards-wide:grid-cols-2! gap-legacy-4 md:gap-3">
        {bonusOffers.map((o) => (
          <div key={o.name} className="card bg-bg-card">
            <div className="font-bold text-sm text-text-primary mb-1.5">{o.name}</div>
            <div className="text-sm text-text-body leading-relaxed mb-2">{o.headline}</div>
            <div className="text-xs text-text-subtle font-mono mb-2">code: {o.code}</div>
            <div className="text-xs text-text-body leading-relaxed mb-2.5">
              [bonus terms small print — wagering, expiry, eligibility]
            </div>
            {o.isPrimaryDomain ? (
              <PrimaryDomainLink linkTier="tier2" primaryDomainLink={o.primaryDomainLink} />
            ) : (
              <div className="text-xs text-text-subtle font-mono">text-only · no outbound link</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
