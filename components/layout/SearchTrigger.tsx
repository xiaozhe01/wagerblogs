"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Search } from "lucide-react";
import { NAV_ICON_BUTTON } from "./nav-styles";

/** Two shapes, one dialog: an icon button in the mobile header, and a field-
 * shaped row in SideNav where a bare icon would read as a nav item. Must render
 * inside SearchDialogProvider, which owns the Dialog.Root it reads from. */
export default function SearchTrigger({ variant = "icon" }: { variant?: "icon" | "row" }) {
  if (variant === "row") {
    return (
      <Dialog.Trigger className="flex w-full items-center gap-2.5 px-2.5 py-2 rounded-md border border-border-input bg-bg-subtle/40 text-sm text-text-muted cursor-pointer transition-colors duration-200 hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
        {/* NavIconLabel's 26px box, so the placeholder starts on the same left
            edge as every nav label below it. */}
        <span className="w-6.5 h-6.5 shrink-0 flex items-center justify-center">
          <Search strokeWidth={2.5} className="size-3" aria-hidden="true" />
        </span>
        <span className="flex-1 text-left">Search...</span>
        {/* Two spans, not "⌘K": the glyph and the letter collide as one string. */}
        <kbd className="inline-flex items-center gap-1 text-2xs font-semibold border border-border-default rounded-sm px-2 py-0.5">
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </Dialog.Trigger>
    );
  }

  return (
    <Dialog.Trigger aria-label="Search" className={NAV_ICON_BUTTON}>
      <Search strokeWidth={2.5} className="size-3 shrink-0" aria-hidden="true" />
    </Dialog.Trigger>
  );
}
