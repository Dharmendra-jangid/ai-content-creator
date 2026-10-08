import { BUSINESS_MONTHLY_CREDITS, FREE_MONTHLY_CREDITS, PRO_MONTHLY_CREDITS } from "@/lib/constants";

export const MARKETING_NAV = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#content-types", label: "Formats" },
  { href: "/pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
] as const;

export const HERO_STATS = [
  { value: "7", label: "content formats" },
  { value: `${FREE_MONTHLY_CREDITS}`, label: "free credits / month" },
  { value: "1 click", label: "to copy a draft" },
] as const;

export const FEATURES = [
  {
    id: "channel",
    title: "Channel-native drafts",
    body: "Captions, posts, and scripts follow the conventions of each platform — not a single generic paragraph pasted everywhere.",
  },
  {
    id: "tone",
    title: "Tone before you spend",
    body: "Set professional, casual, witty, or persuasive copy before a credit is used, so the first draft is closer to shippable.",
  },
  {
    id: "credits",
    title: "Credits you can see",
    body: "Free, Pro, and Business share one meter. Remaining credits sit in the sidebar so generation never feels like a black box.",
  },
  {
    id: "copy",
    title: "Copy in one click",
    body: "Every draft is clipboard-ready. Move it into Instagram, LinkedIn, or your CMS without reformatting the basics.",
  },
  {
    id: "history",
    title: "History that ships",
    body: "Keep the version you actually posted. Come back to hooks that worked instead of regenerating from scratch.",
  },
  {
    id: "theme",
    title: "A calm workspace",
    body: "Light and dark themes, a focused generator, and a dashboard that stays readable when you write late.",
  },
] as const;

export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose the format",
    body: "Start from Instagram, LinkedIn, YouTube, blog, product, campaign, or email so length and structure already fit the channel.",
  },
  {
    step: "02",
    title: "Brief it in your words",
    body: "Add the offer, audience, and angle. Pick a tone. Aurateria does not invent a brand voice you did not describe.",
  },
  {
    step: "03",
    title: "Generate, copy, publish",
    body: "Spend a credit, review the draft, copy it, and paste into the native publisher. History keeps the ones you keep.",
  },
] as const;

export const CONTENT_TYPES = [
  {
    id: "instagram",
    title: "Instagram captions",
    description: "Hooks, line breaks, and CTAs that read well under a reel or carousel.",
    example: "First frame stops the thumb. Caption earns the save.",
  },
  {
    id: "linkedin",
    title: "LinkedIn posts",
    description: "Thoughtful openers and short paragraphs built for the professional feed.",
    example: "Lead with the lesson, not the launch announcement.",
  },
  {
    id: "youtube",
    title: "YouTube scripts",
    description: "Spoken intros, beat sheets, and descriptions that match a watch-through.",
    example: "Promise the payoff in 12 seconds, then deliver it.",
  },
  {
    id: "blog",
    title: "Blog ideas",
    description: "Angles, outlines, and titles you can actually assign to a writing block.",
    example: "One idea, three titles, a skeleton you can finish.",
  },
  {
    id: "product",
    title: "Product descriptions",
    description: "Benefit-led copy for listings, landing blocks, and feature pages.",
    example: "What it does, who it is for, why it is different.",
  },
  {
    id: "marketing",
    title: "Marketing content",
    description: "Campaign lines, ads, and landing snippets with a clear next step.",
    example: "One offer. One audience. One reason to act today.",
  },
  {
    id: "email",
    title: "Email content",
    description: "Subjects, preview text, and bodies for newsletters and sequences.",
    example: "Subject earns the open. Body earns the click.",
  },
] as const;

export const FAQS = [
  {
    question: "What can Aurateria generate?",
    answer:
      "Instagram captions, LinkedIn posts, YouTube scripts, blog ideas, product descriptions, marketing copy, and email. Each format is tuned for how that channel is actually read.",
  },
  {
    question: "How do credits work?",
    answer:
      `Each generation uses 1 credit. Free includes ${FREE_MONTHLY_CREDITS} per month, Pro includes ${PRO_MONTHLY_CREDITS}, and Business includes ${BUSINESS_MONTHLY_CREDITS}. Remaining credits sit in the dashboard and reset at the start of each UTC month.`,
  },
  {
    question: "Is there a free plan?",
    answer:
      `Yes. Free includes ${FREE_MONTHLY_CREDITS} credits every month and every content type. Upgrade to Pro or Business when you need more volume.`,
  },
  {
    question: "Does Aurateria post to my social accounts?",
    answer:
      "Not in this version. Aurateria writes the draft and copies it. You paste into Instagram, LinkedIn, YouTube, or your email tool — where scheduling and analytics already live.",
  },
  {
    question: "Where does AI generation run?",
    answer:
      "On the server. The Gemini API key never ships to the browser. Prompts, credits, and billing checks run in a Next.js route, not in client JavaScript.",
  },
  {
    question: "Can I keep what I generate?",
    answer:
      "Yes. History is part of the product. Free lets you copy drafts in the session; Pro and Business are designed to persist them so you can reuse hooks that already worked.",
  },
  {
    question: "How will billing work?",
    answer:
      "Paid plans will bill through Razorpay. Checkout starts on the server; the secret key never ships to the browser. Payment collection is not live yet.",
  },
  {
    question: "Does it support dark mode?",
    answer:
      "Yes. The app follows your system theme and you can toggle light or dark from the header, dashboard, or settings.",
  },
] as const;

export const HERO_SAMPLE = {
  platform: "Instagram caption",
  brief: "Launch of a ceramic pour-over dripper for home baristas who care about ritual, not gadgets.",
  output: `The first pour is the quiet part.

This dripper is for the people who already grind by hand — who want the water to bloom, not the counter to clutter.

One piece. No extra attachments. A ritual you will still use on a Tuesday.

Save this if your morning coffee is the only meeting you never skip.

— New ceramic dripper. Link in bio.`,
} as const;
