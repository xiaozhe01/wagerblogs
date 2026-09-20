import Link from "next/link";
import MediaImage, { resolveMedia, type MediaRef } from "@/components/cards/MediaImage";

type ArticleBylineProps = {
  name: string;
  credential: string;
  profileHref: string;
  publishedAt: string;
  readTime: string;
  photo?: MediaRef;
};

// TODO(cms): Article schema requires author.name + author.url — a post cannot
// publish without it.
export default function ArticleByline({
  name,
  credential,
  profileHref,
  publishedAt,
  readTime,
  photo,
}: ArticleBylineProps) {
  // Placeholder dates ("[Jul 18, 2026]") must not become a fabricated machine-readable
  // timestamp — <time> renders only once publishedAt is a real ISO date from the CMS.
  const isoDate = /^\d{4}-\d{2}-\d{2}/.test(publishedAt) ? publishedAt : undefined;

  return (
    <div className="flex items-center gap-3 py-3 border-t border-b border-border-divider max-w-full">
      {/* No photo on the record keeps the skeleton shape. */}
      {resolveMedia(photo) ? (
        <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden relative">
          <MediaImage media={photo} fill sizes="36px" className="object-cover" />
        </div>
      ) : (
        <div aria-hidden="true" className="w-9 h-9 shrink-0 rounded-full placeholder-asset" />
      )}
      <div className="min-w-0">
        {/* not-italic: preflight doesn't reset <address>'s UA italic. */}
        <address className="not-italic text-sm leading-snug">
          <Link
            href={profileHref}
            className="font-semibold text-text-primary no-underline hover:underline underline-offset-2"
          >
            {name}
          </Link>
          <span className="text-xs font-medium text-text-muted"> · {credential}</span>
        </address>
        <p className="text-xs font-medium text-text-muted tabular-nums leading-relaxed mt-2">
          Published {isoDate ? <time dateTime={isoDate}>{publishedAt}</time> : publishedAt} ·{" "}
          {readTime}
        </p>
      </div>
    </div>
  );
}
