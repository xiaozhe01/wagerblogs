import Link from "next/link";

type ArticleBylineProps = {
  name: string;
  credential: string;
  profileHref: string;
  publishedAt: string;
  readTime: string;
};

// TODO(cms): requires a real Person record (photo, fullName, credential, authorUrl).
// Article schema requires author.name + author.url — a post cannot publish without it.
export default function ArticleByline({
  name,
  credential,
  profileHref,
  publishedAt,
  readTime,
}: ArticleBylineProps) {
  // Placeholder dates ("[Jul 18, 2026]") must not become a fabricated machine-readable
  // timestamp — <time> renders only once publishedAt is a real ISO date from the CMS.
  const isoDate = /^\d{4}-\d{2}-\d{2}/.test(publishedAt) ? publishedAt : undefined;

  return (
    <div className="flex items-center gap-3 py-3 border-t border-b border-border-divider max-w-full">
      <div className="w-9 h-9 shrink-0 rounded-full placeholder-asset" />
      <div className="min-w-0">
        {/* not-italic: preflight doesn't reset <address>'s UA italic. */}
        <address className="not-italic text-sm leading-snug">
          <Link
            href={profileHref}
            className="font-semibold text-text-primary no-underline hover:underline underline-offset-2"
          >
            {name}
          </Link>
          <span className="text-xs font-medium text-text-meta"> · {credential}</span>
        </address>
        <p className="text-xs font-medium text-text-subtle tabular-nums leading-relaxed mt-2">
          Published {isoDate ? <time dateTime={isoDate}>{publishedAt}</time> : publishedAt} ·{" "}
          {readTime}
        </p>
      </div>
    </div>
  );
}
