"use client";

import { Share2 } from "lucide-react";

type ShareButtonProps = {
  /** Shared as the sheet's title, and names the button for screen readers. */
  title: string;
  /** Site-relative canonical path — the same one the route gives Breadcrumbs. */
  path: string;
  className?: string;
};

export default function ShareButton({ title, path, className }: ShareButtonProps) {
  const handleShare = async () => {
    // The canonical path, not location.href: a ?page= or a draft-preview URL
    // must not travel into someone else's feed.
    const url = new URL(path, window.location.origin).toString();

    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        // Dismissing the sheet is a decision, not a failure — falling through
        // to the clipboard would copy a link the reader just declined to share.
        if ((error as Error)?.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard unavailable (permissions/insecure context).
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={`Share: ${title}`}
      className={`btn-secondary gap-1.5 min-h-11 wide:min-h-5 py-1.5 px-3 text-xs leading-heading shrink-0 cursor-pointer${className ? ` ${className}` : ""}`}
    >
      <Share2 size={14} className="shrink-0" aria-hidden="true" />
      Share
    </button>
  );
}
