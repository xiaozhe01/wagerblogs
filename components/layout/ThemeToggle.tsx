"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
] as const;

// Native radios styled as a segmented control — one tab stop plus arrow keys.
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  // theme is undefined until the client reads storage. Not a setState-in-effect
  // mounted flag — lint rejects that as a cascading render.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return (
    <fieldset className="flex items-center gap-2">
      <legend className="sr-only">Colour theme</legend>
      <div className="flex items-center gap-1 p-1 rounded-md border border-border-divider">
        {OPTIONS.map(({ value, label, Icon }) => (
          <label
            key={value}
            className="relative flex items-center justify-center size-6.5 rounded-sm cursor-pointer text-text-muted transition-colors hover:bg-bg-subtle has-checked:bg-bg-subtle-active has-checked:text-text-primary has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand"
          >
            <input
              type="radio"
              name="theme"
              value={value}
              checked={mounted ? theme === value : value === "system"}
              onChange={() => setTheme(value)}
              className="sr-only peer"
            />
            <Icon strokeWidth={2.5} aria-hidden="true" className="size-3 shrink-0" />
            <span className="sr-only">{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
