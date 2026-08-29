import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WagerBlogs",
  description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior lets the router override smooth scroll on navigation.
    <html lang="en" className="font-sans" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
