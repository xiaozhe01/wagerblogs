"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

// Roughly one screen. Below this the page top is still close enough that the
// control is clutter rather than help.
const SHOW_AFTER_PX = 700;

// The rail's BackToTop is a labelled row and desktop-only; below wide: there is
// no rail, so this is the mobile/tablet counterpart. Fixed rather than sticky —
// sticky needs a scroll container to stick within, and this belongs to the
// viewport. It is the only fixed element on the site.
export default function BackToTopFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only while scrolling up. Parked at the corner it sat over an interactive
    // element at 26% of scroll positions — including "Claim Offer" on / and a
    // self-assessment radio on /responsible-gambling. Scrolling up is also the
    // direction that precedes wanting the top, so it appears when it is wanted.
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
