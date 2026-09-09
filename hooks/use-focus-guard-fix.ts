"use client";

import { useEffect } from "react";

// @base-ui/react inserts focus-guard sentinel spans (data-base-ui-focus-guard)
// with aria-hidden="true" tabindex="0" while the popup is open — Tab needs to
// land on them (that's the library's redirect mechanism), but aria-hidden +
// focusable together trips axe's aria-hidden-focus rule (WCAG 4.1.2). No
// upstream fix exists at 1.7.0 (current latest) — the closest related issue,
// mui/base-ui#4678, covers a different case (Dialog background) and its own
// accepted workaround explicitly leaves focus-guard tabindex untouched,
// since removing it breaks the redirect. Verified via
// tests/a11y/focus-guard-investigation.mjs that stripping only aria-hidden
// clears the violation with a byte-identical Tab order and zero new
// violations. Guards are portaled to document.body, so a MutationObserver
// scoped to this one attribute is the only way to catch them wherever they
// render — not a global override, just narrowly targeted by attribute.
export function useFocusGuardAriaHiddenFix() {
  useEffect(() => {
    const stripIfGuard = (el: Element) => {
      if (el.hasAttribute("data-base-ui-focus-guard")) {
        el.removeAttribute("aria-hidden");
        // Dialog's guards also carry role="button". With aria-hidden gone they
        // read as unnamed ARIA commands (axe: aria-command-name, WCAG 4.1.2).
        // The redirect works off tabindex, not the role, so dropping it costs
        // nothing — verified in tests/a11y/focus-guard-dialog-investigation.mjs.
        el.removeAttribute("role");
      }
    };

    document.querySelectorAll("[data-base-ui-focus-guard]").forEach(stripIfGuard);

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          stripIfGuard(node);
          node.querySelectorAll("[data-base-ui-focus-guard]").forEach(stripIfGuard);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
}
