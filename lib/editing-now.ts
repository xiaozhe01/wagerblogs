import type { Payload } from "payload";

/** Payload's lock is 300s and refreshes while a tab is open, so anything older
 * is a session that ended without releasing rather than someone still typing. */
export const STALE_AFTER_MS = 15 * 60 * 1000;

/** The field carrying a human title, per collection. */
const TITLE_FIELD: Record<string, string> = {
  reviews: "name",
  authors: "name",
  articles: "title",
  news: "title",
  verticals: "name",
  "news-sections": "name",
  media: "filename",
};

export type Lock = {
  user: string;
  collection: string;
  id: string | number;
  title: string;
  since: string;
};

/** Shared by the server render and the polling endpoint, so the panel cannot
 * drift from what the poll returns. */
export async function gatherLocks(payload: Payload): Promise<Lock[]> {
  const { docs } = await payload.find({
    collection: "payload-locked-documents" as never,
    limit: 20,
    depth: 2,
    sort: "-updatedAt",
  });

  const now = Date.now();
  const fresh = (docs as unknown as Record<string, unknown>[]).filter(
    (d) => now - new Date(String(d.updatedAt)).getTime() < STALE_AFTER_MS,
  );

  return Promise.all(
    fresh.map(async (d) => {
      const doc = d.document as { relationTo?: string; value?: unknown } | undefined;
      const user = d.user as { value?: { email?: string } } | undefined;
      const collection = doc?.relationTo ?? "";
      const raw = doc?.value;
      const id = (typeof raw === "object" && raw !== null ? (raw as { id: number }).id : raw) as
        string | number;

      // The polymorphic relationship returns a bare id even at depth 2, so the
      // title needs its own read. Locks are few, so N+1 is the cheaper trade.
      let title = String(id ?? "");
      if (collection && id !== undefined) {
        try {
          const record = (await payload.findByID({
            collection: collection as never,
            id,
            depth: 0,
          })) as Record<string, unknown>;
          title = String(record[TITLE_FIELD[collection] ?? "id"] ?? id);
        } catch {
          // Deleted while locked — fall back to the id.
        }
      }

      return {
        user: user?.value?.email ?? "",
        collection,
        id,
        title,
        since: String(d.updatedAt),
      };
    }),
  );
}
