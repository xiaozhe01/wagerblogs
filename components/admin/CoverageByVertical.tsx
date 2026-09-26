import type { Payload } from "payload";
import { Chip, eyebrow, Panel } from "./ui";
import { t } from "./strings";

type Coverage = {
  id: number | string;
  name: string;
  reviews: number;
  articles: number;
  hasReviews: boolean;
};

function Count({ value, unit }: { value: number; unit: string }) {
  return (
    <span style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
      <span
        style={{
          fontSize: "1.25rem",
          fontWeight: 700,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          color: value === 0 ? "var(--theme-elevation-400)" : "var(--theme-elevation-1000)",
        }}
      >
        {value}
      </span>
      <span style={{ ...eyebrow, fontSize: "0.6875rem" }}>{unit}</span>
    </span>
  );
}

export default async function CoverageByVertical({
  payload,
  lang,
}: {
  payload: Payload;
  lang?: string;
}) {
  const { docs: verticals } = await payload.find({
    collection: "verticals",
    sort: "order",
    limit: 50,
    depth: 0,
  });

  const rows: Coverage[] = [];
  for (const vertical of verticals) {
    const [reviews, articles] = [
      await payload.find({
        collection: "reviews",
        where: { vertical: { equals: vertical.id }, _status: { equals: "published" } },
        limit: 0,
        depth: 0,
      }),
      await payload.find({
        collection: "articles",
        where: { vertical: { equals: vertical.id }, _status: { equals: "published" } },
        limit: 0,
        depth: 0,
      }),
    ];
    rows.push({
      id: vertical.id,
      name: vertical.name,
      reviews: reviews.totalDocs,
      articles: articles.totalDocs,
      hasReviews: Boolean(vertical.hasReviews),
    });
  }

  const covered = rows.filter((row) => row.reviews > 0 || row.articles > 0).length;

  return (
    <Panel title={t("coverage", lang)} count={`${covered}/${rows.length} ${t("covered", lang)}`}>
      {/* Cards rather than rows: at full width a row leaves the counts stranded
          an inch from the name. */}
      <div className="wb-dash__cards">
        {rows.map((row) => {
          // hasReviews publishes /reviews/<slug>. With no reviews behind it that
          // route is live and empty — a defect, not merely thin coverage.
          const liveButEmpty = row.hasReviews && row.reviews === 0;
          return (
            <a
              key={row.id}
              href={`/admin/collections/verticals/${row.id}`}
              className="wb-dash__row"
              style={{
                display: "grid",
                gap: "0.6rem",
                padding: "0.85rem",
                border: "1px solid var(--theme-elevation-150)",
                borderRadius: "4px",
                alignContent: "start",
              }}
            >
              <span
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row.name}
              </span>
              <span style={{ display: "flex", gap: "1rem" }}>
                <Count value={row.reviews} unit={t("reviewsShort", lang)} />
                <Count value={row.articles} unit={t("articlesShort", lang)} />
              </span>
              {liveButEmpty && (
                <span>
                  <Chip tone="warn">{t("emptyIndex", lang)}</Chip>
                </span>
              )}
            </a>
          );
        })}
      </div>
    </Panel>
  );
}
