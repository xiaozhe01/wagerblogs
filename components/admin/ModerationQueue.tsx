import type { Payload, Where } from "payload";
import { Chip, EmptyNote, Panel, relativeTime } from "./ui";
import { t } from "./strings";
import { collectionLabel } from "@/collections/i18n-labels";

// Each UGC collection carries its own moderation vocabulary — see
// collections/access/read-rules.ts, which filters on exactly these values.
const QUEUES = [
  { slug: "comments", where: { status: { equals: "pending" } } },
  { slug: "reader-reviews", where: { status: { equals: "pending" } } },
  { slug: "forum-threads", where: { status: { equals: "pending" } } },
  { slug: "forum-replies", where: { flagged: { equals: true } } },
] as const satisfies ReadonlyArray<{ slug: string; where: Where }>;

type Pending = { id: string | number; slug: string; body: string; at: string };

export default async function ModerationQueue({
  payload,
  lang,
}: {
  payload: Payload;
  lang?: string;
}) {
  const items: Pending[] = [];

  for (const queue of QUEUES) {
    try {
      const { docs } = await payload.find({
        collection: queue.slug,
        where: queue.where,
        sort: "-createdAt",
        limit: 8,
        depth: 0,
      });
      for (const raw of docs as unknown as Record<string, unknown>[]) {
        const body = String(raw.body ?? raw.title ?? raw.review ?? "")
          .replace(/\s+/g, " ")
          .trim();
        items.push({
          id: raw.id as number,
          slug: queue.slug,
          body: body || t("noText", lang),
          at: String(raw.createdAt ?? raw.updatedAt ?? ""),
        });
      }
    } catch {
      // A queue that cannot be read must not take the dashboard with it.
    }
  }

  items.sort((a, b) => b.at.localeCompare(a.at));

  return (
    <Panel title={t("awaitingModeration", lang)} count={items.length}>
      {items.length === 0 ? (
        <EmptyNote>{t("nothingHeld", lang)}</EmptyNote>
      ) : (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {items.map((item) => (
            <li
              key={`${item.slug}-${item.id}`}
              className="wb-dash__row"
              style={{
                display: "grid",
                gridTemplateColumns: "auto minmax(0, 1fr) auto",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.6rem 1rem",
                borderTop: "1px solid var(--theme-elevation-100)",
              }}
            >
              <Chip>{collectionLabel(item.slug, lang)}</Chip>
              <a
                href={`/admin/collections/${item.slug}/${item.id}`}
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 500,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.body}
              </a>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  color: "var(--theme-elevation-600)",
                  whiteSpace: "nowrap",
                }}
              >
                {item.at ? relativeTime(item.at, lang) : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
