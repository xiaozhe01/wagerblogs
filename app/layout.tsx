import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";

export const metadata: Metadata = {
  title: "WagerBlogs",
  description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
  // Safari auto-links bare numbers to tel: before hydration, breaking it.
  // TODO(cms): add explicit tel: links once a verified number exists.
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior lets the router override smooth scroll on navigation.
    // next-themes' blocking script writes to <html> before hydration.
    <html lang="en" className="font-sans" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
