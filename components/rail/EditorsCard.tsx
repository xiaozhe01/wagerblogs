import Link from "next/link";

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
      <Link href={`/reviews/${"peakwager"}`} className="btn-primary">
        Read our review
      </Link>
    </section>
  );
}
