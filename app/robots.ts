import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/schema";

// /login is not listed: it 404s today, and a Disallow would only stop the
// crawler learning that. Revisit when Clerk lands.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Filter/pagination permutations are the same records reordered.
      disallow: ["/*?*type=", "/*?*news=", "/*?*region=", "/*?*page="],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
