import type { ReactNode } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

function CountRow({ children, nav }: { children: ReactNode; nav?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-2 border-t border-border-hairline pt-3 sm:flex-row sm:justify-between">
      <p className="text-sm font-medium text-text-muted">{children}</p>
      {nav}
    </div>
  );
}

/** For lists that must never split across pages. Takes no page state, so it
 * cannot acquire paging later by accident — a caller that wants paging has to
 * switch to PageNav deliberately. Used by the help directory, where a second
 * page could hide the organisation someone needs, and by the FAQ, whose
 * FAQPage JSON-LD describes every entry on the page. */
export function ListTotal({ total, noun }: { total: number; noun: string }) {
  if (total === 0) return null;
  return (
    <CountRow>
      All {total} {noun}
    </CountRow>
  );
}

/** Sits under the list it pages. The count line renders even on a single page,
 * so a list that was never wired to paginate() is visibly missing one rather
 * than looking identical to a list that happens to fit. The numbered arms
 * appear only when there is somewhere to go, and are absent at the ends rather
 * than present-but-dead. */
export default function PageNav({
  page,
  totalPages,
  hrefFor,
  label,
  total,
  from,
  to,
  noun = "items",
}: {
  page: number;
  totalPages: number;
  hrefFor: (page: number) => string;
  /** Names which list this pages, since a route can hold more than one. */
  label: string;
  total: number;
  from: number;
  to: number;
  /** Plural, lowercase — "articles", "reviews", "stories". */
  noun?: string;
}) {
  if (total === 0) return null;
  if (totalPages === 1) return <ListTotal total={total} noun={noun} />;

  return (
    <CountRow
      nav={
        <Pagination aria-label={label} className="mx-0 w-auto justify-center sm:justify-end">
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
      }
    >
      {from}–{to} of {total} {noun}
    </CountRow>
  );
}
