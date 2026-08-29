import AnchorList from "./AnchorList";

type OtherBook = { name: string; score: string };

type OtherBooksCardProps = {
  books: OtherBook[];
};

export default function OtherBooksCard({ books }: OtherBooksCardProps) {
  return (
    <AnchorList
      title="Other books compared"
      cardClassName="card"
      items={books.map((o) => ({
        href: "/reviews",
        key: o.name,
        label: (
          <>
            <span className="font-semibold">{o.name}</span>
            <span className="text-text-primary font-bold">
              <data value={o.score}>{o.score}</data>
            </span>
          </>
        ),
      }))}
    />
  );
}
