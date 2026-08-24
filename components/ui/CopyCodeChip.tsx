"use client";

import { useState, useRef, useEffect } from "react";
import { Check, Copy } from "lucide-react";

// Click-to-copy promo-code chip (comparison register). The code text is
// server-rendered — only the copy interaction hydrates on the client.
export default function CopyCodeChip({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (permissions/insecure context) — leave the
      // code selectable as plain text; no fake "Copied!" feedback.
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy bonus code ${code}`}
      className="flex items-center justify-between gap-2 w-full min-h-11 px-3 py-2 border border-dashed border-border-placeholder rounded-md bg-bg-subtle cursor-pointer transition-colors hover:border-text-primary"
    >
      <span className="text-xs text-text-subtle font-mono">
        code: <code className="font-bold tracking-wide text-text-primary">{code}</code>
      </span>
      <span
        aria-live="polite"
        className="flex items-center gap-1 text-2xs font-semibold text-text-primary"
      >
        {copied ? (
          <>
            <Check size={12} className="shrink-0" aria-hidden="true" />
            Copied!
          </>
        ) : (
          <>
            <Copy size={12} className="shrink-0" aria-hidden="true" />
            Copy
          </>
        )}
      </span>
    </button>
  );
}
