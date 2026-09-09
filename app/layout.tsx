import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import { JsonLd, siteUrl, webSiteJsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  // Resolves relative canonicals to absolute; MetadataRoute needs it too.
  metadataBase: new URL(siteUrl),
  title: "WagerBlogs",
  description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
  alternates: { canonical: "/" },
  // TODO(cms): per-route openGraph images once the asset pipeline is settled.
  // Without og:type, share scrapers (and any script reading it) get null.
  openGraph: {
    type: "website",
    siteName: "WagerBlogs",
    title: "WagerBlogs",
    description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
  },
  // Safari's data detectors rewrite matched text into links before hydration,
  // which fails hydration and makes React regenerate the tree on the client.
  // Dates and addresses are covered as well as phone numbers: the placeholder
  // copy is full of bracketed dates.
  // TODO(cms): add explicit tel: links once a verified number exists.
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // data-scroll-behavior lets the router override smooth scroll on navigation.
    // next-themes' blocking script writes to <html> before hydration.
    <html lang="en" className="font-sans" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {/* Sitewide identity — Organization stays absent, see webSiteJsonLd. */}
        <JsonLd data={webSiteJsonLd()} />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
