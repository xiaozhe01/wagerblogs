import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/** Sits under the list it pages. Renders nothing on a single page, and the
 * prev/next arms are absent at the ends rather than present-but-dead. */
export default function PageNav({
  page,
  totalPages,
  hrefFor,
  label,
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  /** Names which list this pages, since a route can hold more than one. */
  label: string;
}) {
  if (totalPages <= 1) return null;

  return (
    <Pagination aria-label={label} className="pt-1">
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href={hrefFor(page - 1)} size="xs" />
          </PaginationItem>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <PaginationItem key={n}>
            <PaginationLink href={hrefFor(n)} isActive={n === page} size="icon-xs">
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        {page < totalPages && (
          <PaginationItem>
            <PaginationNext href={hrefFor(page + 1)} size="xs" />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
