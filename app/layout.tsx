import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "WagerBlogs",
  description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn(newsreader.variable, "font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  );
}
