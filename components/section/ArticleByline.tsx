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
  return (
    <div className="flex items-center gap-3 py-3 border-t border-b border-border-divider max-w-full">
      <div className="w-9 h-9 shrink-0 rounded-full placeholder-asset" />
      <div className="min-w-0">
        <div className="text-sm leading-snug">
          <Link
            href={profileHref}
            className="font-semibold text-text-primary no-underline hover:underline underline-offset-2"
          >
            {name}
          </Link>
          <span className="text-xs text-text-meta"> · {credential}</span>
        </div>
        <div className="text-xs font-medium text-text-subtle font-mono leading-relaxed mt-2">
          Published {publishedAt} · {readTime}
        </div>
      </div>
    </div>
  );
}
