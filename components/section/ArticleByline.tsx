import Link from "next/link";
import MediaImage, { resolveMedia, type MediaRef } from "@/components/cards/MediaImage";

type ArticleBylineProps = {
  name: string;
  credential: string;
  profileHref: string;
  photo?: MediaRef;
};

// TODO(cms): Article schema requires author.name + author.url — a post cannot
// publish without it.
export default function ArticleByline({
  name,
  credential,
  profileHref,
  photo,
}: ArticleBylineProps) {
  return (
    <div className="flex items-center gap-3 max-w-full">
      {/* No photo on the record keeps the skeleton shape. */}
      {resolveMedia(photo) ? (
        <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden relative">
          <MediaImage media={photo} fill sizes="36px" className="object-cover" />
        </div>
      ) : (
        <div aria-hidden="true" className="w-9 h-9 shrink-0 rounded-full placeholder-asset" />
      )}
      {/* not-italic: preflight doesn't reset <address>'s UA italic. */}
      <address className="not-italic text-sm leading-snug min-w-0 flex-1">
        <Link
          href={profileHref}
          className="font-semibold text-text-primary no-underline hover:underline underline-offset-2"
        >
          {name}
        </Link>
        <span className="text-xs font-medium text-text-muted"> · {credential}</span>
      </address>
    </div>
  );
}
