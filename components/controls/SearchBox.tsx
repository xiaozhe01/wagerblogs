"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Form from "next/form";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { Search, CornerDownLeft } from "lucide-react";
import { SCOPE_PARAM, SEARCH_PARAM, type SearchScope } from "@/lib/search";

type Hit = { title: string; excerpt: string; kicker: string; href: string; scope: SearchScope };

const DEBOUNCE_MS = 200;
const MIN_CHARS = 2;

// The shell owns the insets now that the icon leads: padding on the input
// would read as an indent between the icon and the text rather than an edge.
const inputShell =
  "flex h-7 w-full min-w-0 items-center gap-2.5 px-3 rounded-md " +
  "border border-border-input bg-bg-subtle/40 transition-colors focus-within:border-brand";
const inputControl =
  "flex-1 min-w-0 bg-transparent border-0 outline-none text-lg text-text-primary " +
  "placeholder:text-text-muted";

export default function SearchBox({
  placeholder = "Search...",
  scope,
  autoFocus = false,
  onNavigate,
}: {
  placeholder?: string;
  scope?: SearchScope;
  autoFocus?: boolean;
  /** Lets the dialog close itself once a result has been chosen. */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  // Hits carry the term they answer, so nothing is mirrored into state and the
  // previous query's results can never show under a newer one.
  const [answered, setAnswered] = useState<{ term: string; hits: Hit[] }>({ term: "", hits: [] });
  const latest = useRef(0);

  const term = query.trim();
  const active = term.length >= MIN_CHARS;
  const hits = active && answered.term === term ? answered.hits : [];
  const pending = active && answered.term !== term;

  useEffect(() => {
    const t = query.trim();
    if (t.length < MIN_CHARS) return;

    const ticket = ++latest.current;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      let found: Hit[] = [];
      try {
        const params = new URLSearchParams({ [SEARCH_PARAM]: t });
        if (scope && scope !== "all") params.set(SCOPE_PARAM, scope);
        const res = await fetch(`/api/search?${params}`, { signal: controller.signal });
        found = (await res.json()).hits ?? [];
      } catch {
        found = [];
      }
      // A slower earlier request must not overwrite a newer one.
      if (ticket === latest.current) setAnswered({ term: t, hits: found });
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, scope]);

  const allResultsHref = () => {
    const params = new URLSearchParams({ [SEARCH_PARAM]: term });
    if (scope && scope !== "all") params.set(SCOPE_PARAM, scope);
    return `/search?${params}`;
  };

  const go = (href: string) => {
    onNavigate?.();
    router.push(href);
  };

  // The list scrolls; the footer does not, or "See all results" scrolls away
  // with the hits on a phone.
  const scrollArea = (
    <div
      tabIndex={0}
      className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      <Autocomplete.List id={listId} className="flex flex-col empty:hidden">
        {(hit: Hit) => (
          <Autocomplete.Item
            key={hit.href + hit.title}
            value={hit}
            onClick={() => go(hit.href)}
            // active: repeats the highlight — a tap drops data-highlighted the
            // moment the finger lifts, leaving the row unpainted.
            className="flex flex-col gap-0.5 rounded-md px-2.5 py-2 cursor-pointer no-underline transition-colors duration-200 data-highlighted:bg-bg-subtle-active data-highlighted:text-brand active:bg-bg-subtle-active active:text-brand"
          >
            <span className="flex items-baseline gap-2 min-w-0">
              <span className="meta-label-caps shrink-0">{hit.kicker}</span>
              <span className="text-lg font-semibold text-pretty line-clamp-1">{hit.title}</span>
            </span>
            <span className="text-xs text-text-body leading-relaxed line-clamp-1">
              {hit.excerpt}
            </span>
          </Autocomplete.Item>
        )}
      </Autocomplete.List>

      {active && hits.length === 0 && (
        <p className="px-2.5 py-3 text-xs text-text-muted">
          {pending ? "Searching\u2026" : `Nothing matched \u201c${term}\u201d`}
        </p>
      )}
    </div>
  );

  // px-3 matches a row's total inset (6px of scroll padding + their own 10px),
  // since this sits outside that padding.
  const footer = hits.length > 0 && (
    <button
      type="button"
      onClick={() => go(allResultsHref())}
      className="flex w-full shrink-0 items-center justify-between gap-2 border-t border-border-divider px-3 py-2.5 text-xs font-semibold text-text-primary cursor-pointer transition-colors duration-200 hover:bg-bg-subtle-active hover:text-brand"
    >
      See all results
      <CornerDownLeft className="size-3 shrink-0" aria-hidden="true" />
    </button>
  );

  return (
    // Flex column so the list takes the dialog's leftover height and scrolls
    // inside it instead of overflowing the panel.
    <div className="flex min-h-0 flex-1 flex-col">
      <Autocomplete.Root
        items={hits}
        value={query}
        onValueChange={setQuery}
        // The server already ranked and filtered; re-filtering here would fight it.
        mode="none"
        autoHighlight
        // The list renders in place, not in a popup. Without this pair base-ui
        // keeps a dismiss layer that swallows the first Escape and backdrop press.
        inline
        open
      >
        {/* Enter with nothing highlighted falls through to the form, so this
          still works as a plain search field, and without JS at all. */}
        <Form action="/search" className="w-full">
          {scope && scope !== "all" && <input type="hidden" name={SCOPE_PARAM} value={scope} />}
          <div className={inputShell}>
            <span className="flex items-center text-text-muted" aria-hidden="true">
              <Search className="size-3 shrink-0" />
            </span>
            <Autocomplete.Input
              name={SEARCH_PARAM}
              type="search"
              autoFocus={autoFocus}
              aria-label="Search the site"
              aria-controls={listId}
              placeholder={placeholder}
              className={inputControl}
            />
          </div>
        </Form>

        {active && (
          <div className="mt-2 flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border border-border-divider">
            {scrollArea}
            {footer}
          </div>
        )}
      </Autocomplete.Root>
    </div>
  );
}
