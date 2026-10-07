import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config";

// Next.js picks this up automatically and serves it at /robots.txt,
// pointing crawlers at the new sitemap below.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
