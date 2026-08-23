import { Check } from "lucide-react";
import type { BonusOffer } from "@/lib/types";
import PrimaryDomainLink from "../PrimaryDomainLink";
import CopyCodeChip from "@/components/ui/CopyCodeChip";

type BonusOfferCardProps = {
  /* Carries the editorial benefit bullets (`offer.benefits`, CMS-sourced).
     Absent → the row simply doesn't render — no placeholder bullets on
     live routes. */
  offer: BonusOffer;
  /* ISO date of the last human verification of the offer terms. Absent →
     an honest "pending" state renders, never a fabricated date. */
  lastVerifiedAt?: string;
  /* Jurisdiction/eligibility small print (CMS-sourced). */
  termsSummary?: string;
};

export default function BonusOfferCard({
  offer,
  lastVerifiedAt,
  termsSummary,
}: BonusOfferCardProps) {
  const benefits = offer.benefits;
  return (
    <div className="card flex flex-col">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-9 h-9 shrink-0 placeholder-asset rounded-md" />
        <div className="text-md font-semibold text-text-primary">{offer.name}</div>
      </div>

      <div className="heading text-lg leading-snug mb-2 text-pretty">{offer.headline}</div>

      {benefits && benefits.length > 0 && (
        <ul className="flex flex-col gap-1 mb-2.5">
          {benefits.map((b) => (
            <li key={b} className="flex items-start gap-1.5 text-xs text-text-body leading-relaxed">
              <Check size={12} className="shrink-0 mt-0.5 text-text-primary" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      )}

      <div className="mb-2.5">
        <CopyCodeChip code={offer.code} />
      </div>

      {offer.isPrimaryDomain ? (
        <PrimaryDomainLink
          linkTier="tier2"
          primaryDomainLink={offer.primaryDomainLink}
          className="w-full"
        />
      ) : (
        <PrimaryDomainLink
          linkTier="tier2"
          primaryDomainLink={{ ...offer.operatorLink, relAttribute: "nofollow" }}
          className="w-full"
        />
      )}

      <div className="mt-2.5 pt-2 border-t border-border-hairline-alt text-2xs text-text-subtle leading-relaxed">
        <span>{termsSummary ?? "[bonus terms small print — wagering, expiry, eligibility]"}</span>{" "}
        <span className="font-mono">
          · Last verified:{" "}
          {lastVerifiedAt ?? <span className="text-text-meta">pending verification</span>}
        </span>
      </div>
    </div>
  );
}
