import { dateLocale, t } from "./strings";
// Shared primitives for the dashboard panels. Every colour is a
// --theme-elevation-* so the panels follow the admin theme rather than
// carrying their own palette.

export const panel: React.CSSProperties = {
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "4px",
  background: "var(--theme-elevation-0)",
  overflow: "hidden",
};

export const eyebrow: React.CSSProperties = {
  fontSize: "0.75rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--theme-elevation-600)",
};

export function Chip({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "solid" | "warn";
  children: React.ReactNode;
}) {
  const palette = {
    neutral: { color: "var(--theme-elevation-700)", background: "var(--theme-elevation-100)" },
    solid: { color: "var(--theme-elevation-0)", background: "var(--theme-elevation-800)" },
    warn: { color: "var(--theme-elevation-0)", background: "var(--theme-elevation-650)" },
  }[tone];

  return (
    <span
      style={{
        ...palette,
        fontSize: "0.75rem",
        fontWeight: 600,
        lineHeight: 1,
        padding: "0.25rem 0.45rem",
        borderRadius: "3px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

export function Panel({
  title,
  count,
  children,
}: {
  title: string;
  count?: number | string;
  children: React.ReactNode;
}) {
  return (
    <section style={panel}>
      <header
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "0.75rem",
          padding: "0.85rem 1rem",
        }}
      >
        <h2 style={{ ...eyebrow, margin: 0 }}>{title}</h2>
        {count !== undefined && (
          <span
            style={{
              ...eyebrow,
              color: "var(--theme-elevation-500)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count}
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

export function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        padding: "0 1rem 1rem",
        fontSize: "0.9375rem",
        color: "var(--theme-elevation-600)",
      }}
    >
      {children}
    </p>
  );
}

export const relativeTime = (iso: string, language?: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (mins < 1) return t("justNow", language);
  if (mins < 60) return t("minutesAgo", language, mins);
  const days = Math.floor(mins / 1440);
  if (days < 1) return t("hoursAgo", language, Math.floor(mins / 60));
  if (days === 1) return t("yesterday", language);
  if (days < 30) return t("daysAgo", language, days);
  return new Date(iso).toLocaleDateString(dateLocale(language), {
    day: "numeric",
    month: "short",
  });
};
