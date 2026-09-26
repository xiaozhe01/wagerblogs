import type { Payload } from "payload";
import { eyebrow, Panel } from "./ui";
import { t } from "./strings";
import { collectionLabel } from "@/collections/i18n-labels";

const COLLECTIONS = [
  { slug: "reviews", title: "name" },
  { slug: "articles", title: "title" },
  { slug: "news", title: "title" },
  { slug: "authors", title: "name" },
] as const;

type Line = {
  slug: string;
  published: number;
  drafts: number;
  placeholder: number;
};

const headCell: React.CSSProperties = {
  ...eyebrow,
  textAlign: "right",
  whiteSpace: "nowrap",
  padding: "0 0 0.5rem 1.25rem",
  fontWeight: 700,
};

const numCell: React.CSSProperties = {
  fontSize: "0.9375rem",
  fontWeight: 600,
  textAlign: "right",
  fontVariantNumeric: "tabular-nums",
  padding: "0.6rem 0 0.6rem 1.25rem",
  borderTop: "1px solid var(--theme-elevation-100)",
};

export default async function CollectionBreakdown({
  payload,
  lang,
}: {
  payload: Payload;
  lang?: string;
}) {
  const lines: Line[] = [];

  for (const c of COLLECTIONS) {
    const [published, drafts, placeholder] = [
      await payload.find({
        collection: c.slug,
        where: { _status: { equals: "published" } },
        limit: 0,
        depth: 0,
      }),
      await payload.find({
        collection: c.slug,
        where: { _status: { equals: "draft" } },
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
    lines.push({
      slug: c.slug,
      published: published.totalDocs,
      drafts: drafts.totalDocs,
      placeholder: placeholder.totalDocs,
    });
  }

  // A real table, not a grid: the header and the body must share column widths,
  // and two separate CSS grids size their tracks independently — which is
  // exactly how the header drifted out of line with the numbers.
  const dim = (n: number): React.CSSProperties => ({
    ...numCell,
    color: n > 0 ? "var(--theme-elevation-1000)" : "var(--theme-elevation-400)",
  });

  return (
    <Panel title={t("byCollection", lang)}>
      <table
        // Padding lives on the cells: a table element ignores it for the
        // purposes of column alignment.
        style={{ width: "100%", borderCollapse: "collapse", tableLayout: "auto" }}
      >
        <thead>
          <tr>
            <th style={{ ...headCell, textAlign: "left", paddingLeft: "1rem", width: "100%" }}>
              {t("collection", lang)}
            </th>
            <th style={headCell}>{t("live", lang)}</th>
            <th style={headCell}>{t("draft", lang)}</th>
            <th style={{ ...headCell, paddingRight: "1rem" }}>{t("placeholder", lang)}</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((line) => (
            <tr key={line.slug} className="wb-dash__row">
              <td
                style={{
                  ...numCell,
                  textAlign: "left",
                  padding: "0.6rem 0 0.6rem 1rem",
                  maxWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                <a href={`/admin/collections/${line.slug}`}>
                  {collectionLabel(line.slug, lang, "plural")}
                </a>
              </td>
              <td style={numCell}>{line.published}</td>
              {/* Work in flight reads at full strength; a zero is not news. */}
              <td style={dim(line.drafts)}>{line.drafts}</td>
              <td style={{ ...dim(line.placeholder), paddingRight: "1rem" }}>{line.placeholder}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Panel>
  );
}
