import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/env/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = getAppUrl();

  return [
    {
      url: appUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${appUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
