"use client";

import { useEffect, useState } from "react";
import type { Lock } from "@/lib/editing-now";
import { Chip, EmptyNote, eyebrow, relativeTime } from "./ui";
import { t } from "./strings";
import { collectionLabel } from "@/collections/i18n-labels";

const POLL_MS = 10_000;

// Locks come and go in seconds, so the panel polls rather than waiting for a
// navigation. Payload exposes no event stream for them — its own lock UI polls
// too — so this is the mechanism available, not a shortcut.
export default function NowEditingLive({ initial, lang }: { initial: Lock[]; lang?: string }) {
  const [locks, setLocks] = useState(initial);

  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      // A background tab has nobody watching it; polling it just bills the
      // connection pool.
      if (document.visibilityState !== "visible") return;
      try {
        const res = await fetch("/next/editing-now", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { locks: Lock[] };
        if (!cancelled) setLocks(data.locks);
      } catch {
        // A failed poll keeps the last good list rather than blanking it.
      }
    };

    const timer = setInterval(poll, POLL_MS);
    document.addEventListener("visibilitychange", poll);
    return () => {
      cancelled = true;
      clearInterval(timer);
      document.removeEventListener("visibilitychange", poll);
    };
  }, []);

  if (locks.length === 0) return <EmptyNote>{t("nobodyEditing", lang)}</EmptyNote>;

  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {locks.map((lock) => (
        <li
          key={`${lock.collection}-${lock.id}`}
          className="wb-dash__row"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) auto auto",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.6rem 1rem",
            borderTop: "1px solid var(--theme-elevation-100)",
          }}
        >
          <span style={{ minWidth: 0 }}>
            <a
              href={`/admin/collections/${lock.collection}/${lock.id}`}
              style={{
                display: "block",
                fontSize: "0.9375rem",
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {lock.title}
            </a>
            <span style={{ ...eyebrow, fontSize: "0.6875rem" }}>
              {collectionLabel(lock.collection, lang)}
            </span>
          </span>
          <Chip tone="warn">{lock.user || t("unknownUser", lang)}</Chip>
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: "var(--theme-elevation-600)",
              whiteSpace: "nowrap",
            }}
          >
            {relativeTime(lock.since, lang)}
          </span>
        </li>
      ))}
    </ul>
  );
}
