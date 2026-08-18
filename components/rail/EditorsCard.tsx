import Link from "next/link";

export default function EditorsCard() {
  return (
    <div className="card">
      <div className="font-bold text-sm text-text-primary mb-2.5">Editor&apos;s Pick</div>
      <div className="font-bold text-md text-text-primary mb-1.5">PeakWager Sportsbook</div>
      <div className="text-xs text-text-muted leading-loose mb-3">
        Highest overall score for the third month running.
      </div>
      <Link href={`/reviews/${"peakwager"}`} className="btn-primary">
        Read our review
      </Link>
    </div>
  );
}
