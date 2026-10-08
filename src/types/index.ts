export type Plan = "free" | "pro" | "business";

export type PaidPlan = Exclude<Plan, "free">;

export type SubscriptionStatus =
  | "none"
  | "incomplete"
  | "active"
  | "past_due"
  | "canceled"
  | "expired";

export type BillingProvider = "razorpay";

export type UserSubscription = {
  status: SubscriptionStatus;
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  provider: BillingProvider | null;
};

export type Platform =
  | "twitter"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "blog"
  | "youtube"
  | "email"
  | "tiktok";

export type GeneratorPlatform = Exclude<Platform, "tiktok">;

export type ContentType =
  | "caption"
  | "post"
  | "reel_script"
  | "video_script"
  | "blog_post"
  | "product_description"
  | "advertisement_copy";

export type ContentTone =
  | "professional"
  | "friendly"
  | "funny"
  | "creative"
  | "motivational"
  | "sales";

export type ContentLanguage = "english" | "hindi" | "hinglish";

export type ContentLength = "short" | "medium" | "long";

export type GeneratorInput = {
  platform: GeneratorPlatform;
  contentType: ContentType;
  topic: string;
  audience: string;
  tone: ContentTone;
  language: ContentLanguage;
  length: ContentLength;
};

export type GeneratorDraft = {
  id: string;
  input: GeneratorInput;
  body: string;
  createdAt: string;
  saved: boolean;
};

export type GenerateContentSuccess = {
  content: string;
  plan: Plan;
  creditsRemaining: number;
  creditsLimit: number;
  creditsUsed: number;
  creditsResetAt: string;
};

export type GenerateContentError = {
  error: string;
};

export type GeneratedContent = {
  id: string;
  title: string;
  platform: Platform;
  preview: string;
  createdAt: string;
  creditsUsed: number;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  plan: Plan;
  creditsRemaining: number;
  creditsLimit: number;
  creditsUsed: number;
  creditsResetAt: string;
  creditsTracked: boolean;
  subscription: UserSubscription;
};

export type CreditSnapshot = {
  plan: Plan;
  creditsRemaining: number;
  creditsLimit: number;
  creditsUsed: number;
  creditsResetAt: string;
};

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  hint: string;
  trend?: {
    direction: "up" | "down";
    label: string;
  };
};
