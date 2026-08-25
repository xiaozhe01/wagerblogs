import AnchorList from "./AnchorList";

type OtherBook = { name: string; score: string };

type OtherBooksCardProps = {
  books: OtherBook[];
};

export default function OtherBooksCard({ books }: OtherBooksCardProps) {
  return (
    <AnchorList
      title="Other books compared"
      cardClassName="card pb-0"
      items={books.map((o) => ({
        href: "/reviews",
        key: o.name,
        label: (
          <>
            <span className="font-semibold">{o.name}</span>
            <span className="text-text-primary font-bold">{o.score}</span>
          </>
        ),
      }))}
      itemClassName="flex justify-between items-center min-h-11 lg:min-h-9.5 gap-2.5 text-sm text-text-body py-1.5 border-b border-border-hairline-alt [li:last-child_&]:border-b-0 no-underline"
    />
  );
}
