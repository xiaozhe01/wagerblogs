import { formatDate } from "@/lib/utils";

type PublishMetaProps = {
  /** Raw ISO off the record, not a formatted string — formatting happens here
   * so the <time> value and the visible text cannot drift. */
  publishedAt?: string | null;
  readTime: string;
  className?: string;
};

// Placeholder dates ("[Jul 18, 2026]") must not become a fabricated
// machine-readable timestamp — <time> renders only on a real ISO date.
export default function PublishMeta({ publishedAt, readTime, className }: PublishMetaProps) {
  const iso = publishedAt && /^\d{4}-\d{2}-\d{2}/.test(publishedAt) ? publishedAt : undefined;

  return (
    <p
      className={`text-xs font-medium text-text-muted tabular-nums leading-relaxed${className ? ` ${className}` : ""}`}
    >
      {iso ? (
        <>
          Published <time dateTime={iso}>{formatDate(iso)}</time> ·{" "}
        </>
      ) : publishedAt ? (
        <>Published {publishedAt} · </>
      ) : null}
      {readTime}
    </p>
  );
}
