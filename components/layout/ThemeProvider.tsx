"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";

// attribute="class" is what @custom-variant dark and the .dark block key off.
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemeProvider>
  );
}
