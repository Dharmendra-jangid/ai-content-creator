import type { DashboardStat, GeneratedContent, UserProfile } from "@/types";

export const mockUser: UserProfile = {
  id: "user_preview",
  name: "Alex Rivera",
  email: "alex@studio.local",
  plan: "free",
  creditsRemaining: 7,
  creditsLimit: 10,
  creditsUsed: 3,
  creditsResetAt: "2026-10-01T00:00:00.000Z",
  creditsTracked: true,
  subscription: {
    status: "none",
    periodEnd: null,
    cancelAtPeriodEnd: false,
    provider: null,
  },
};

export const mockStats: DashboardStat[] = [
  {
    id: "credits",
    label: "Credits left",
    value: "7",
    hint: "Resets on the 1st of each month",
    trend: { direction: "down", label: "3 used this week" },
  },
  {
    id: "generated",
    label: "Generated this month",
    value: "23",
    hint: "Across 5 platforms",
    trend: { direction: "up", label: "12% vs last month" },
  },
  {
    id: "copied",
    label: "Copied to clipboard",
    value: "18",
    hint: "Ready to publish",
    trend: { direction: "up", label: "Mostly LinkedIn" },
  },
  {
    id: "plan",
    label: "Current plan",
    value: "Free",
    hint: "10 credits / month",
  },
];

export const mockHistory: GeneratedContent[] = [
  {
    id: "cnt_6",
    title: "Launch thread for the waitlist",
    platform: "twitter",
    preview:
      "Most waitlists die in silence. Here is the 7-post thread we used to turn 400 signups into 1,200 — without a product video.",
    createdAt: "2026-09-08T14:20:00.000Z",
    creditsUsed: 1,
  },
  {
    id: "cnt_5",
    title: "Founder note: shipping in public",
    platform: "linkedin",
    preview:
      "We almost hid the messy middle. Publishing the unfinished dashboard mockups last Tuesday brought in more qualified conversations than our last ad set.",
    createdAt: "2026-09-07T09:05:00.000Z",
    creditsUsed: 1,
  },
  {
    id: "cnt_4",
    title: "Carousel caption: credit-aware drafting",
    platform: "instagram",
    preview:
      "Stop generating 12 variants you will never post. Draft once, tighten the hook, then spend credits only on the line you will actually ship.",
    createdAt: "2026-09-05T18:42:00.000Z",
    creditsUsed: 1,
  },
  {
    id: "cnt_3",
    title: "Newsletter: September recap",
    platform: "email",
    preview:
      "Subject: The 20-minute writing stack we actually use. Preview: templates, a credit budget, and the one prompt we retired.",
    createdAt: "2026-09-03T11:15:00.000Z",
    creditsUsed: 2,
  },
  {
    id: "cnt_2",
    title: "YouTube description: demo walkthrough",
    platform: "youtube",
    preview:
      "A 12-minute walkthrough of Aurateria’s dashboard: credits, history, and how drafts stay out of the model until you hit generate.",
    createdAt: "2026-09-01T16:30:00.000Z",
    creditsUsed: 1,
  },
  {
    id: "cnt_1",
    title: "Blog outline: credits without dark patterns",
    platform: "blog",
    preview:
      "Free plans should feel generous, not gimmicky. This outline covers transparent credit math, overage copy, and upgrade moments that do not nag.",
    createdAt: "2026-08-28T10:00:00.000Z",
    creditsUsed: 2,
  },
];
