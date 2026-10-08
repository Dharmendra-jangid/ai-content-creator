import { getAppUrl } from "@/lib/env/app-url";

export const siteConfig = {
  name: "Aurateria",
  company: "Aurateria Technologies",
  website: "https://aurateria.com",
  tagline: "AI Content Creator",
  description:
    "Generate Instagram captions, LinkedIn posts, YouTube scripts, blog ideas, product copy, and email — ready to publish.",
  url: getAppUrl(),
} as const;
