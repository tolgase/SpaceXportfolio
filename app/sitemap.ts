import type { MetadataRoute } from "next";

import { SITE_URL } from "@/config";
import { getAllExperienceSlugs } from "@/lib/experience";

// Next.js picks this up automatically and serves it at /sitemap.xml —
// there was no sitemap at all before this, so search engines had no map
// of the experience detail pages beyond whatever they could crawl from
// on-page links.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const experiencePages = getAllExperienceSlugs().map((slug) => ({
    url: `${SITE_URL}/experience/${slug}`,
    lastModified: now,
  }));

  return [
    { url: SITE_URL, lastModified: now },
    { url: `${SITE_URL}/experience`, lastModified: now },
    ...experiencePages,
  ];
}
