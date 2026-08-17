import Link from "next/link";

type OtherBook = { name: string; score: string };

type OtherBooksCardProps = {
  books: OtherBook[];
};

// "Other books compared" rail card — byte-identical between the two
// reviews templates (DRY-21); both already shared the same otherBooksCompared
// data (DRY-6), just re-rendered the same JSX independently.
export default function OtherBooksCard({ books }: OtherBooksCardProps) {
  return (
    <div className="card">
      <div className="font-bold text-sm text-text-primary mb-2.5">Other books compared</div>
      {books.map((o) => (
        <Link
          key={o.name}
          href="/reviews"
          className="flex justify-between gap-2.5 text-sm text-text-body py-2 border-b border-border-hairline-alt no-underline"
        >
          <span>{o.name}</span>
          <span className="text-text-primary font-bold">{o.score}</span>
        </Link>
      ))}
    </div>
  );
}
