import { Check } from "lucide-react";
import type { PrimaryDomainLinkData } from "@/lib/types";
import PrimaryDomainLink from "@/components/controls/PrimaryDomainLink";
import CopyCodeChip from "@/components/controls/CopyCodeChip";

/** A BonusOffers record, flattened for render. primaryDomainLink and
 * operatorLink are both optional because Payload stores them that way; an
 * offer carrying neither renders no CTA rather than a dead button. */
export type BonusOfferCardData = {
  name: string;
  headline: string;
  /** Optional in the schema: not every offer has a promo code. */
  code?: string;
  benefits?: string[];
  isPrimaryDomain: boolean;
  primaryDomainLink?: PrimaryDomainLinkData;
  operatorLink?: { anchorText: string; url: string };
};

type BonusOfferCardProps = {
  /* Carries the editorial benefit bullets (`offer.benefits`, CMS-sourced).
     Absent → the row simply doesn't render — no placeholder bullets on
     live routes. */
  offer: BonusOfferCardData;
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
  // Competitor links are nofollow at this layer, never from stored data.
  const cta = offer.isPrimaryDomain
    ? offer.primaryDomainLink
    : offer.operatorLink && { ...offer.operatorLink, relAttribute: "nofollow" as const };
  return (
    <article className="card flex flex-col gap-2 h-full">
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-6 h-6 shrink-0 placeholder-asset rounded-md" />
        <span className="text-md font-semibold text-text-primary">{offer.name}</span>
      </div>

      <h3 className="heading text-lg leading-snug text-pretty">{offer.headline}</h3>

      {benefits && benefits.length > 0 && (
        <ul role="list" className="flex flex-col gap-1 mb-2.5">
          {benefits.map((b) => (
            <li
              key={b}
              className="flex items-start gap-1.5 text-xs text-text-body font-medium leading-relaxed"
            >
              <Check size={12} className="shrink-0 mt-1 text-text-primary" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      )}

      {/* No code on the record means no chip — never a placeholder one. */}
      <div className="mt-auto mb-2.5">{offer.code && <CopyCodeChip code={offer.code} />}</div>

      <PrimaryDomainLink linkTier="tier2" primaryDomainLink={cta} className="w-full" />

      <p className="mt-2.5 pt-2 border-t border-border-hairline-alt text-2xs text-text-muted font-medium leading-relaxed">
        <span>{termsSummary ?? "[bonus terms small print — wagering, expiry, eligibility]"}</span>{" "}
        <span className="font-medium">
          · Last verified:{" "}
          {lastVerifiedAt ? (
            <time dateTime={lastVerifiedAt}>{lastVerifiedAt}</time>
          ) : (
            <span>pending verification</span>
          )}
        </span>
      </p>
    </article>
  );
}
