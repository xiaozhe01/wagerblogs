"use client";

import { useState } from "react";
import Link from "next/link";
import { Dialog } from "@base-ui/react/dialog";
import { Menu, X, ChevronRight, CircleDot, Ellipsis, User } from "lucide-react";
import { navGroups, type NavGroup } from "@/lib/nav";
import { navIcons, subNavIcons } from "./nav-icons";
import { useFocusGuardAriaHiddenFix } from "@/hooks/use-focus-guard-fix";
import { NAV_ICON_BUTTON, NAV_ICON_BUTTON_BORDERED, NAV_ROW as ROW } from "./nav-styles";

/** The nav SideNav carries at wide:, for the widths where SideNav is hidden.
 * Groups are flattened rather than put behind dropdowns — a drawer has the room,
 * and a second tap to reach a section is a tap too many on a phone. */
export default function MobileNav({ activeId }: { activeId?: string }) {
  useFocusGuardAriaHiddenFix();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger aria-label="Menu" className={NAV_ICON_BUTTON_BORDERED}>
        <Menu size={24} className="shrink-0" aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-bg-inverted/40 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup className="fixed inset-y-0 right-0 z-50 w-[min(20rem,86vw)] flex flex-col gap-3 overflow-y-auto overscroll-contain bg-bg-card border-l border-border-divider p-4 transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full">
          <div className="flex items-center justify-between gap-3 pb-3 border-b border-border-divider">
            <Dialog.Title className="heading text-2xl leading-heading">Menu</Dialog.Title>
            <Dialog.Close aria-label="Close menu" className={`${NAV_ICON_BUTTON} -mr-2`}>
              <X size={20} className="shrink-0" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <nav aria-label="Main">
            <ul role="list" className="flex flex-col gap-3">
              {navGroups.map((group: NavGroup) => {
                const Icon = navIcons[group.id] ?? Ellipsis;
                const current = group.id === activeId;
                return (
                  <li key={group.id} className="flex flex-col gap-px">
                    <Link
                      href={group.href}
                      onClick={close}
                      aria-current={current ? "page" : undefined}
                      className={`${ROW} text-md ${current ? "text-brand font-semibold" : "text-text-strong-secondary font-medium"}`}
                    >
                      <Icon
                        strokeWidth={2.5}
                        className="size-3 shrink-0 text-text-muted"
                        aria-hidden="true"
                      />
                      {group.label}
                    </Link>
                    {group.subs.length > 0 && (
                      <ul role="list" className="flex flex-col gap-px pl-5">
                        {group.subs.map((sub) => {
                          const SubIcon = subNavIcons[sub.icon] ?? CircleDot;
                          return (
                            <li key={sub.label}>
                              <Link
                                href={sub.href}
                                onClick={close}
                                className={`${ROW} group text-sm font-medium text-text-primary`}
                              >
                                <SubIcon
                                  strokeWidth={2.5}
                                  className="size-3 shrink-0 text-text-muted transition-colors group-hover:text-brand group-active:text-brand"
                                  aria-hidden="true"
                                />
                                <span className="flex-1">{sub.label}</span>
                                {sub.trailingIcon && (
                                  <ChevronRight
                                    strokeWidth={2.5}
                                    className="size-3 shrink-0 transition duration-300 group-hover:translate-x-1 group-active:translate-x-1"
                                    aria-hidden="true"
                                  />
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* TODO(clerk): /login lands when Clerk is wired; swap this for real auth state. */}
          {/* Rule on the wrapper so the row keeps its rounded press highlight. */}
          <div className="mt-auto pt-3 border-t border-border-divider">
            <Link
              href="/login"
              prefetch={false}
              onClick={close}
              className={`${ROW} text-sm font-semibold text-text-primary`}
            >
              <User strokeWidth={2.5} className="size-3 shrink-0" aria-hidden="true" />
              Log In
            </Link>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
