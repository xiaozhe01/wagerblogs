import ArrowLink from "@/components/ui/ArrowLink";
import { railCtaClassName } from "@/components/rail/InfoCard";

export default function EditorsCard() {
  return (
    <section className="card" aria-labelledby="rail-editors-pick">
      <h2 id="rail-editors-pick" className="font-bold text-sm text-text-primary mb-2.5">
        Editor&apos;s Pick
      </h2>
      <h3 className="text-md font-semibold text-text-primary mb-1.5">PeakWager Sportsbook</h3>
      <p className="text-xs text-text-muted leading-loose mb-3">
        [Placeholder editorial claim — must be backed by real score history before publish]
      </p>
      <ArrowLink href={`/reviews/${"peakwager"}`} className={railCtaClassName}>
        Read our review
      </ArrowLink>
    </section>
  );
}
