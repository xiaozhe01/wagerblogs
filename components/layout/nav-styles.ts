/** Shared by SideNav rows, the drawer rows and the header icon buttons.
 * active: repeats hover: because the drawer's widths have no hover. The
 * data-open variants must be named or shadcn's hover:bg-muted wins. */
export const NAV_INTERACTION =
  "transition-colors duration-200 hover:bg-bg-subtle-active hover:text-brand " +
  // focus-visible:, not focus: — the drawer autofocuses its Close on open, and
  // focus: left that button painted as though it were hovered.
  "active:bg-bg-subtle-active active:text-brand focus-visible:bg-bg-subtle-active " +
  "data-open:bg-bg-subtle-active data-open:hover:bg-bg-subtle-active " +
  "data-open:focus:bg-bg-subtle-active data-popup-open:bg-bg-subtle-active " +
  "data-popup-open:hover:bg-bg-subtle-active";

const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

/** A drawer row. SideNav's rows get their box from the shadcn primitives, so
 * only the drawer needs the layout half spelled out. */
export const NAV_ROW = `flex items-center gap-2.5 min-h-11 px-2.5 rounded-md no-underline ${NAV_INTERACTION} ${FOCUS_RING}`;

/** 44px square in the header chrome — Search, Menu, and the drawer's Close.
 * text-text-primary is load-bearing: without it the icon inherits shadcn's
 * chroma-0 --foreground off body and reads cool against the warm ink. */
export const NAV_ICON_BUTTON =
  `w-11 h-11 shrink-0 flex items-center justify-center rounded-md cursor-pointer ` +
  `text-text-primary ${NAV_INTERACTION} ${FOCUS_RING}`;

export const NAV_ICON_BUTTON_BORDERED = `${NAV_ICON_BUTTON} border border-border-default hover:border-brand active:border-brand`;
