import Link from "next/link";
import { searchScopes, type SearchHit, type SearchScope } from "@/lib/search";
import { headingId } from "@/lib/utils";

// Not a feed: PostRow's 16:9 thumbnail and 217px height are wasted on a FAQ
// answer, and it omits the one thing a result needs — the path it leads to.
function ResultRow({ hit }: { hit: SearchHit }) {
  return (
    <li className="divider-row">
      <Link
        href={hit.href}
        className="group flex flex-col gap-1 py-3 px-2 rounded-sm no-underline transition-colors duration-200 hover:bg-bg-subtle active:bg-bg-subtle-active"
      >
        <span className="meta-label-caps">{hit.kicker}</span>
        <span className="text-lg font-semibold leading-snug text-text-primary text-pretty transition-colors duration-200 group-hover:text-brand group-active:text-brand">
          {hit.title}
        </span>
        <span className="text-sm text-text-muted leading-relaxed text-pretty line-clamp-2">
          {hit.excerpt}
        </span>
        <span className="text-xs text-text-muted tabular-nums">{hit.href}</span>
      </Link>
    </li>
  );
}

/** Grouped only when the reader hasn't already narrowed the scope. */
export default function SearchResultList({
  hits,
  scope,
}: {
  hits: SearchHit[];
  scope: SearchScope;
}) {
  if (scope !== "all") {
    return (
      <ul role="list" className="flex flex-col">
        {hits.map((hit) => (
          <ResultRow key={hit.href + hit.title} hit={hit} />
        ))}
      </ul>
    );
  }

  const groups = (Object.keys(searchScopes) as SearchScope[])
    .filter((key) => key !== "all")
    .map((key) => ({ key, label: searchScopes[key], rows: hits.filter((h) => h.scope === key) }))
    .filter((group) => group.rows.length > 0);

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => {
        const id = headingId("results", group.label);
        return (
          <section key={group.key} aria-labelledby={id} className="flex flex-col gap-2">
            <h3 id={id} className="heading text-2xl leading-heading">
              {group.label}
              <span className="ml-2 text-sm font-medium text-text-muted tabular-nums">
                {group.rows.length}
              </span>
            </h3>
            <ul role="list" className="flex flex-col">
              {group.rows.map((hit) => (
                <ResultRow key={hit.href + hit.title} hit={hit} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
