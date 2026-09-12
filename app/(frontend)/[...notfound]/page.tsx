import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Unmatched URLs never enter a route group, so without a route to land on they
// get Next's built-in 404 instead of the editorial page. Metadata lives here
// because notFound() resolves it from this segment, not from not-found.tsx.
export const metadata: Metadata = {
  title: "We couldn't find that page — WagerBlogs",
  robots: { index: false, follow: true },
};

export default function NotFoundCatchAll(): never {
  notFound();
}
