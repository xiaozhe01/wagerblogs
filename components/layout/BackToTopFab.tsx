"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Roughly one screen. Below this the page top is still close enough that the
// control is clutter rather than help.
const SHOW_AFTER_PX = 700;

// Mobile/tablet counterpart to the rail's BackToTop, which is desktop-only.
// Fixed, not sticky: it belongs to the viewport, not a scroll container.
export default function BackToTopFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only while scrolling up: parked at the corner it covered an interactive
    // element at a quarter of all scroll positions.
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y > SHOW_AFTER_PX && y < last);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      // No `behavior` — it resolves to the CSS scroll-behavior, which the
      // reduced-motion block already switches to auto.
      onClick={() => window.scrollTo({ top: 0 })}
      aria-label="Back to top"
      // Kept in the DOM and hidden with opacity so the transition can run;
      // inert + aria-hidden keep it off the tab order and out of the a11y tree
      // while it is invisible.
      inert={!visible}
      aria-hidden={!visible}
      className={`wide:hidden fixed right-4 bottom-[max(var(--spacing-4),env(safe-area-inset-bottom))] z-50 size-11 grid place-items-center rounded-full border border-border-divider bg-bg-card text-text-primary shadow-frame cursor-pointer transition-opacity duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <ArrowUp strokeWidth={2.5} aria-hidden="true" className="size-3 shrink-0" />
    </button>
  );
}
