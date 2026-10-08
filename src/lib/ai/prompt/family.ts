import type { ContentType, GeneratorPlatform } from "@/types";

import type { ContentFamily } from "@/lib/ai/prompt/types";

export function resolveContentFamily(
  platform: GeneratorPlatform,
  contentType: ContentType,
): ContentFamily {
  if (
    contentType === "product_description" ||
    contentType === "advertisement_copy"
  ) {
    return "marketing";
  }

  if (platform === "email") {
    return "email";
  }

  if (contentType === "blog_post" || platform === "blog") {
    return "editorial";
  }

  if (platform === "youtube") {
    if (contentType === "post") {
      return "social";
    }

    return "youtube";
  }

  if (contentType === "reel_script" || contentType === "video_script") {
    return "short_video";
  }

  return "social";
}
