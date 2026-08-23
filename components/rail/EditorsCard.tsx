import Link from "next/link";

export default function EditorsCard() {
  return (
    <div className="card">
      <div className="font-bold text-sm text-text-primary mb-2.5">Editor&apos;s Pick</div>
      <div className="text-md font-semibold text-text-primary mb-1.5">PeakWager Sportsbook</div>
      <div className="text-xs text-text-muted leading-loose mb-3">
        [Placeholder editorial claim — must be backed by real score history before publish]
      </div>
      <Link href={`/reviews/${"peakwager"}`} className="btn-primary">
        Read our review
      </Link>
    </div>
  );
}
