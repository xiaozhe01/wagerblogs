"use client";

import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0 })}
      className="group px-2 py-1.5 min-h-5 w-full flex items-center justify-between self-center gap-2.5 rounded-sm bg-bg-subtle text-sm font-semibold leading-snug text-text-body cursor-pointer transition-colors duration-300 hover:bg-bg-subtle-active hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      Back to Top
      <ArrowUp
        strokeWidth={2}
        aria-hidden="true"
        className="size-3 shrink-0 transition duration-300 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
