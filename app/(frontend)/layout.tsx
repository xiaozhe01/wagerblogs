import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/layout/ThemeProvider";
import { JsonLd, siteUrl, webSiteJsonLd } from "@/lib/schema";
import { DEFAULT_OG_IMAGE, SITE_NAME, buildTwitter } from "@/lib/og";

export const metadata: Metadata = {
  // Resolves relative canonicals to absolute; MetadataRoute needs it too.
  metadataBase: new URL(siteUrl),
  title: "WagerBlogs",
  description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
  alternates: { canonical: "/" },
  // The fallback for routes that emit no openGraph of their own. Routes that
  // do — every generateMetadata calling buildOpenGraph — REPLACE this block
  // wholesale rather than merging with it, which is why lib/og.ts restates
  // type and siteName and carries its own image default.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "WagerBlogs",
    description: "Independent reviews, odds comparisons, and state-by-state legal betting guides.",
    // Shares DEFAULT_OG_IMAGE with buildOpenGraph so the two cannot drift.
    // metadataBase above makes the relative url absolute.
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: buildTwitter(),
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
