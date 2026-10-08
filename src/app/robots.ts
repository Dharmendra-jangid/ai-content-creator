import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/env/app-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/generate",
        "/history",
        "/billing",
        "/settings",
        "/login",
        "/signup",
        "/auth/",
        "/api/",
      ],
    },
    sitemap: `${getAppUrl()}/sitemap.xml`,
  };
}
