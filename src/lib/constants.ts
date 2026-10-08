import type {
  ContentLanguage,
  ContentTone,
  ContentType,
  GeneratorPlatform,
  Platform,
} from "@/types";

export const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/generate", label: "Generate", icon: "generate" },
  { href: "/history", label: "History", icon: "history" },
  { href: "/billing", label: "Billing", icon: "billing" },
  { href: "/settings", label: "Settings", icon: "settings" },
] as const;

export type NavIcon = (typeof DASHBOARD_NAV)[number]["icon"];

export const PLATFORMS: Record<
  Platform,
  { label: string; description: string }
> = {
  twitter: {
    label: "X / Twitter",
    description: "Hooks, threads, and short posts",
  },
  linkedin: {
    label: "LinkedIn",
    description: "Thought leadership and carousels",
  },
  instagram: {
    label: "Instagram",
    description: "Captions and reel scripts",
  },
  facebook: {
    label: "Facebook",
    description: "Community posts and ads",
  },
  blog: {
    label: "Blog",
    description: "Long-form articles and outlines",
  },
  youtube: {
    label: "YouTube",
    description: "Titles, descriptions, and scripts",
  },
  email: {
    label: "Email",
    description: "Newsletters and sequences",
  },
  tiktok: {
    label: "TikTok",
    description: "Hooks and short-form scripts",
  },
};

export const PLATFORM_ORDER: Platform[] = [
  "twitter",
  "linkedin",
  "instagram",
  "tiktok",
  "youtube",
  "blog",
  "email",
  "facebook",
];

export const GENERATOR_PLATFORMS: {
  value: GeneratorPlatform;
  label: string;
  hint: string;
}[] = [
  { value: "instagram", label: "Instagram", hint: "Captions and reels" },
  { value: "linkedin", label: "LinkedIn", hint: "Professional posts" },
  { value: "youtube", label: "YouTube", hint: "Scripts and titles" },
  { value: "facebook", label: "Facebook", hint: "Feed and ads" },
  { value: "twitter", label: "X / Twitter", hint: "Short posts" },
  { value: "blog", label: "Blog", hint: "Articles and ideas" },
  { value: "email", label: "Email", hint: "Newsletters" },
];

export const CONTENT_TYPES: {
  value: ContentType;
  label: string;
}[] = [
  { value: "caption", label: "Caption" },
  { value: "post", label: "Post" },
  { value: "reel_script", label: "Reel Script" },
  { value: "video_script", label: "Video Script" },
  { value: "blog_post", label: "Blog Post" },
  { value: "product_description", label: "Product Description" },
  { value: "advertisement_copy", label: "Advertisement Copy" },
];

export const TONES: { value: ContentTone; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "funny", label: "Funny" },
  { value: "creative", label: "Creative" },
  { value: "motivational", label: "Motivational" },
  { value: "sales", label: "Sales" },
];

export const LANGUAGES: { value: ContentLanguage; label: string }[] = [
  { value: "english", label: "English" },
  { value: "hindi", label: "Hindi" },
  { value: "hinglish", label: "Hinglish" },
];

export const LENGTHS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
] as const;

export const FREE_MONTHLY_CREDITS = 10;
export const PRO_MONTHLY_CREDITS = 500;
export const BUSINESS_MONTHLY_CREDITS = 2500;

export function isGeneratorPlatform(
  value: string | undefined,
): value is GeneratorPlatform {
  return GENERATOR_PLATFORMS.some((item) => item.value === value);
}
