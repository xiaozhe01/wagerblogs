"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import SearchBox from "@/components/controls/SearchBox";
import { useFocusGuardAriaHiddenFix } from "@/hooks/use-focus-guard-fix";
import { NAV_ICON_BUTTON } from "./nav-styles";

/** Wraps the shell so every SearchTrigger shares one dialog. A dialog per
 * trigger gave each its own ⌘K listener and scroll lock: the shortcut opened
 * both at once, and their locks restored out of order, leaving the body pinned. */
export default function SearchDialogProvider({ children }: { children: ReactNode }) {
  useFocusGuardAriaHiddenFix();
  const [open, setOpen] = useState(false);
  const restoreY = useRef(0);

  // Tracked while closed, not captured on open: by then base-ui's
  // `overflow: hidden` has already collapsed the offset to 0 on mobile.
  useLayoutEffect(() => {
    if (open) return;
    restoreY.current = window.scrollY;
    const onScroll = () => {
      restoreY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // iOS ignores base-ui's `overflow: hidden` lock — the keyboard opening scrolls
  // the page to reveal the input, dragging it out from under the dialog.
  useEffect(() => {
    if (!open) return;
    const y = restoreY.current;
    const { style } = document.body;
    const previous = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
    };
    Object.assign(style, {
      position: "fixed",
      top: `-${y}px`,
      left: "0",
      right: "0",
      width: "100%",
    });
    return () => {
      Object.assign(style, previous);
      window.scrollTo(0, y);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {children}
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 touch-none overscroll-contain bg-scrim/70 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-[7vh] z-50 flex max-h-[84vh] w-[min(56rem,94vw)] -translate-x-1/2 touch-none flex-col overflow-hidden overscroll-contain rounded-md border border-border-divider bg-bg-card p-3 shadow-frame transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 data-starting-style:-translate-y-2">
          <div className="flex items-center justify-between gap-3 mb-3">
            <Dialog.Title className="heading text-2xl leading-heading">Search</Dialog.Title>
            <Dialog.Close aria-label="Close search" className={`${NAV_ICON_BUTTON} -mr-2`}>
              <X strokeWidth={2.5} className="size-3 shrink-0" aria-hidden="true" />
            </Dialog.Close>
          </div>
          <SearchBox
            placeholder="Search reviews, news and guides..."
            autoFocus
            onNavigate={() => setOpen(false)}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
