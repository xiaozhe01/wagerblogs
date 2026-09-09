import ArrowLink from "@/components/controls/ArrowLink";
import { mockPeakWagerReview } from "@/lib/mock-data";
import { reviewPath } from "@/lib/reviews";
import { railCtaClassName } from "@/components/rail/InfoCard";

// Unnamed section — see InfoCard: rail cards are not region landmarks.
export default function EditorsCard() {
  return (
    <section className="card">
      <h2 className="heading text-sm mb-2.5">Editor&apos;s Pick</h2>
      <p className="text-sm font-semibold text-text-primary mb-1.5">PeakWager Sportsbook</p>
      <p className="text-xs text-text-muted font-medium leading-loose mb-3">
        [Placeholder editorial claim — must be backed by real score history before publish]
      </p>
      <ArrowLink href={reviewPath(mockPeakWagerReview)} className={railCtaClassName}>
        Read our review
      </ArrowLink>
    </section>
  );
}
