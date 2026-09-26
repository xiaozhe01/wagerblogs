import { Gutter } from "@payloadcms/ui";
import type { Payload } from "payload";
import { Chip, EmptyNote, eyebrow, panel, Panel, relativeTime } from "./ui";
import NowEditing from "./NowEditing";
import ModerationQueue from "./ModerationQueue";
import CoverageByVertical from "./CoverageByVertical";
import CollectionBreakdown from "./CollectionBreakdown";
import { dateLocale, t } from "./strings";
import { collectionLabel } from "@/collections/i18n-labels";

const COLLECTIONS = [
  { slug: "reviews", title: "name" },
  { slug: "articles", title: "title" },
  { slug: "news", title: "title" },
  { slug: "authors", title: "name" },
] as const;

type Item = {
  id: number | string;
  title: string;
  collection: string;
  updatedAt: string;
  placeholder: boolean;
  draft: boolean;
};

const href = (collection: string, id: Item["id"]) => `/admin/collections/${collection}/${id}`;

async function gather(payload: Payload) {
  const drafts: Item[] = [];
  const recent: Item[] = [];
  let placeholderCount = 0;
  let publishedCount = 0;

  for (const c of COLLECTIONS) {
    const toItem = (input: object): Item => {
      const doc = input as Record<string, unknown>;
      const title = String(doc[c.title] ?? "Untitled");
      return {
        id: doc.id as number,
        title,
        collection: c.slug,
        updatedAt: String(doc.updatedAt),
        placeholder: title.includes("["),
        draft: doc._status === "draft",
      };
    };

    const [draftDocs, recentDocs, published, placeholder] = [
      await payload.find({
        collection: c.slug,
        where: { _status: { equals: "draft" } },
        sort: "-updatedAt",
        limit: 10,
        depth: 0,
      }),
      await payload.find({ collection: c.slug, sort: "-updatedAt", limit: 8, depth: 0 }),
      await payload.find({
        collection: c.slug,
        where: { _status: { equals: "published" } },
        limit: 0,
        depth: 0,
      }),
      await payload.find({
        collection: c.slug,
        where: { [c.title]: { like: "[" } },
        limit: 0,
        depth: 0,
      }),
    ];

    drafts.push(...draftDocs.docs.map(toItem));
    recent.push(...recentDocs.docs.map(toItem));
    publishedCount += published.totalDocs;
    placeholderCount += placeholder.totalDocs;
  }

  const byNewest = (a: Item, b: Item) => b.updatedAt.localeCompare(a.updatedAt);
  return {
    drafts: drafts.sort(byNewest),
    recent: recent.sort(byNewest).slice(0, 10),
    publishedCount,
    placeholderCount,
  };
}

/** One grid per list, so type / title / chips / time line up as real columns
 * instead of each row negotiating its own flex. */
const ROW_GRID = "5.5rem minmax(0, 1fr) auto 4.5rem";

function Row({ item, showDraft, lang }: { item: Item; showDraft?: boolean; lang?: string }) {
  return (
    <li
      style={{
        display: "grid",
        gridTemplateColumns: ROW_GRID,
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.6rem 1rem",
        borderTop: "1px solid var(--theme-elevation-100)",
      }}
      className="wb-dash__row"
    >
      <span style={eyebrow}>{collectionLabel(item.collection, lang)}</span>
      <a
        href={href(item.collection, item.id)}
        style={{
          fontSize: "0.9375rem",
          fontWeight: 500,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {item.title}
      </a>
      <span style={{ display: "flex", gap: "0.35rem" }}>
        {showDraft && item.draft && <Chip tone="solid">{t("draft", lang)}</Chip>}
        {item.placeholder && <Chip>{t("placeholder", lang)}</Chip>}
      </span>
      <span
        style={{
          fontSize: "0.8125rem",
          fontWeight: 500,
          color: "var(--theme-elevation-600)",
          fontVariantNumeric: "tabular-nums",
          textAlign: "right",
        }}
      >
        {relativeTime(item.updatedAt, lang)}
      </span>
    </li>
  );
}

export default async function Dashboard({
  payload,
  i18n,
}: {
  payload: Payload;
  i18n?: { language?: string };
}) {
  const lang = i18n?.language;
  const { drafts, recent, publishedCount, placeholderCount } = await gather(payload);
  const today = new Date().toLocaleDateString(dateLocale(lang), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    { value: drafts.length, label: t("awaitingPublication", lang) },
    { value: publishedCount, label: t("publishedRecords", lang) },
    { value: placeholderCount, label: t("carryingPlaceholder", lang) },
  ];

  return (
    <Gutter>
      <div className="wb-dash">
        <header
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
            padding: "1.5rem 0 1.25rem",
            borderBottom: "1px solid var(--theme-elevation-150)",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {t("newsroom", lang)}
          </h1>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--theme-elevation-600)" }}>
            {today}
          </p>
        </header>

        <div className="wb-dash__stats">
          {stats.map((stat) => (
            <div key={stat.label} style={{ ...panel, padding: "1rem" }}>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 700,
                  lineHeight: 1.1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {stat.value}
              </div>
              <div style={{ ...eyebrow, marginTop: "0.3rem" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Left column is what needs a decision, right column is what is
            happening. Reading order follows urgency, not collection order. */}
        <div className="wb-dash__main">
          <div className="wb-dash__stack">
            <Panel title={t("awaitingPublication", lang)} count={drafts.length}>
              {drafts.length ? (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {drafts.map((item) => (
                    <Row key={`${item.collection}-${item.id}`} item={item} lang={lang} />
                  ))}
                </ul>
              ) : (
                <EmptyNote>{t("allPublished", lang)}</EmptyNote>
              )}
            </Panel>
            <ModerationQueue payload={payload} lang={lang} />
            <CollectionBreakdown payload={payload} lang={lang} />
          </div>

          <div className="wb-dash__stack">
            <Panel title={t("recentlyEdited", lang)}>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {recent.map((item) => (
                  <Row key={`${item.collection}-${item.id}`} item={item} showDraft lang={lang} />
                ))}
              </ul>
            </Panel>
            <NowEditing payload={payload} lang={lang} />
          </div>
        </div>

        <div style={{ marginTop: "0.75rem", paddingBottom: "2rem" }}>
          <CoverageByVertical payload={payload} lang={lang} />
        </div>
      </div>
    </Gutter>
  );
}
