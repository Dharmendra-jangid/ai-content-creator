import type {
  ContentLanguage,
  ContentLength,
  ContentTone,
  ContentType,
  GeneratorPlatform,
} from "@/types";

import type {
  ContentFamily,
  ContentTypePlaybook,
  LanguagePlaybook,
  LengthPlaybook,
  PlatformPlaybook,
  TonePlaybook,
} from "@/lib/ai/prompt/types";

export const PLATFORM_PLAYBOOKS: Record<GeneratorPlatform, PlatformPlaybook> = {
  instagram: {
    displayName: "Instagram",
    firstLineRule:
      "The first line is the hook. It must earn the tap on “…more”.",
    channelRules: [
      "Use short lines and generous line breaks.",
      "Keep emojis sparse and only if they match the tone.",
      "Put hashtags after the caption, never inside sentences.",
      "Sound like a person, not a brand deck.",
    ],
    hashtagPolicy: "standard",
  },
  linkedin: {
    displayName: "LinkedIn",
    firstLineRule:
      "The first line must earn the “see more” expand. Lead with a specific insight, not a greeting.",
    channelRules: [
      "Short paragraphs. White space is part of the craft.",
      "One idea per paragraph. No hashtag walls.",
      "Prefer a professional story, proof point, or takeaway over slogans.",
      "CTA should invite a comment or save, not a vague “link in comments”.",
    ],
    hashtagPolicy: "light",
  },
  facebook: {
    displayName: "Facebook",
    firstLineRule: "Open like a conversation, not an ad banner.",
    channelRules: [
      "Write for a feed skim: plain language, one thought at a time.",
      "A question or invitation works better than a hard sell unless the tone is sales.",
      "Avoid clickbait that the body cannot pay off.",
    ],
    hashtagPolicy: "light",
  },
  twitter: {
    displayName: "X / Twitter",
    firstLineRule: "The first sentence must stand alone as a complete thought.",
    channelRules: [
      "Punchy lines. Cut filler. No thread numbering unless length is long.",
      "If length is long, write a tight thread: each post should still make sense alone.",
      "Skip hashtag stuffing. One tag is enough, zero is often better.",
      "Do not use “thread 🧵” unless it is actually a multi-post thread.",
    ],
    hashtagPolicy: "none",
  },
  youtube: {
    displayName: "YouTube",
    firstLineRule:
      "The spoken hook must land in the first 8–15 seconds and preview the payoff.",
    channelRules: [
      "Write for the ear: short spoken sentences, retention beats, no essay syntax.",
      "Titles should be specific and clickable without bait-and-switch.",
      "Script stage directions only when they help a creator film (on-screen text, B-roll).",
      "Close with one clear next step: subscribe, watch next, or comment.",
    ],
    hashtagPolicy: "light",
  },
  blog: {
    displayName: "Blog",
    firstLineRule: "The title and opening promise a useful answer, not a teaser.",
    channelRules: [
      "Scannable headings. Short paragraphs. Specific examples.",
      "No keyword stuffing and no empty listicles.",
      "End with a practical next step the reader can take.",
    ],
    hashtagPolicy: "none",
  },
  email: {
    displayName: "Email",
    firstLineRule: "The subject line must earn the open without spammy urgency.",
    channelRules: [
      "One primary CTA. Secondary links dilute the message.",
      "Write like a note from a person who respects the inbox.",
      "Include a subject line first. Body should stand without images.",
    ],
    hashtagPolicy: "none",
  },
};

export const CONTENT_TYPE_PLAYBOOKS: Record<ContentType, ContentTypePlaybook> = {
  caption: {
    craft: "A social caption the creator can paste into the composer.",
    rules: [
      "Hook as the first line, then the body, then a single CTA.",
      "Readable on a phone. No title card unless the platform is a blog.",
    ],
  },
  post: {
    craft: "A complete feed or thought-leadership post.",
    rules: [
      "Build a beginning, middle, and close — not a caption with extra adjectives.",
      "Use line breaks so the post looks designed in the native feed.",
    ],
  },
  reel_script: {
    craft: "A short-form vertical video script ready to film.",
    rules: [
      "Label spoken lines vs on-screen text vs visual beats.",
      "The hook is a pattern interrupt, not a logo sting.",
      "Keep spoken copy natural. One idea per beat.",
    ],
  },
  video_script: {
    craft: "A video script a creator can record without rewriting.",
    rules: [
      "Include pacing: hook, setup, value, close.",
      "Mark on-screen text and B-roll only where they help.",
      "Write spoken lines the way people actually talk.",
    ],
  },
  blog_post: {
    craft: "A blog draft with a title, opening, sections, and close.",
    rules: [
      "Use 2–4 short sections with clear headings.",
      "Teach something specific. Skip generic intros like “In today’s world”.",
    ],
  },
  product_description: {
    craft: "Product copy that helps someone decide.",
    rules: [
      "Lead with the outcome, not the feature list.",
      "Benefits must be concrete. Do not invent specs, prices, or reviews.",
    ],
  },
  advertisement_copy: {
    craft: "Ad copy a media buyer could paste into an ad account.",
    rules: [
      "Headline, primary text, benefits, and one CTA.",
      "Do not invent discounts, ratings, limited-time offers, or social proof.",
    ],
  },
};

export const TONE_PLAYBOOKS: Record<ContentTone, TonePlaybook> = {
  professional: {
    voice: "Clear, confident, and precise. Respect the reader’s time.",
    avoid: ["slang", "hype", "emoji overload", "empty corporate jargon"],
  },
  friendly: {
    voice: "Warm and conversational. Write as “you” and “we”.",
    avoid: ["stiffness", "hard-sell pressure", "overfamiliar slang if it clashes with the platform"],
  },
  funny: {
    voice: "Witty and light. Humor should serve the point, not bury it.",
    avoid: ["mean-spirited jokes", "forced punchlines on every line", "memes that will date overnight"],
  },
  creative: {
    voice: "Fresh language and unexpected angles, still easy to understand.",
    avoid: ["obscure poetry", "style that hides the offer", "random metaphor chains"],
  },
  motivational: {
    voice: "Energetic and specific. Push toward one action the reader can take.",
    avoid: ["empty platitudes", "hustle-bro clichés", "shame as a motivator"],
  },
  sales: {
    voice: "Benefit-led and direct. Make the next step obvious.",
    avoid: ["fake scarcity", "invented testimonials", "pressure without a reason"],
  },
};

export const LANGUAGE_PLAYBOOKS: Record<ContentLanguage, LanguagePlaybook> = {
  english: {
    outputIn: "English",
    scriptRule: "Natural English. No unnecessary corporate filler.",
  },
  hindi: {
    outputIn: "Hindi",
    scriptRule:
      "Write in Devanagari. Natural spoken Hindi, not overly Sanskritized unless the tone is professional.",
  },
  hinglish: {
    outputIn: "Hinglish",
    scriptRule:
      "Write the mix people actually speak: English plus Hindi in Latin script. Do not switch the whole draft into pure English or pure Devanagari.",
  },
};

const SOCIAL_LENGTH: Record<ContentLength, LengthPlaybook> = {
  short: {
    target: "40–90 words",
    instruction: "One hook, one point, one close. No padding.",
    maxOutputTokens: 768,
  },
  medium: {
    target: "120–220 words",
    instruction: "Hook, 2–3 beats of value, then a CTA.",
    maxOutputTokens: 1536,
  },
  long: {
    target: "280–450 words",
    instruction: "Room for a story or several beats, still scannable.",
    maxOutputTokens: 2560,
  },
};

const VIDEO_LENGTH: Record<ContentLength, LengthPlaybook> = {
  short: {
    target: "45–75 seconds spoken",
    instruction: "A tight Short/Reel: hook, one payoff, CTA.",
    maxOutputTokens: 1536,
  },
  medium: {
    target: "2–4 minutes spoken",
    instruction: "Hook, setup, 2–3 value beats, CTA.",
    maxOutputTokens: 3072,
  },
  long: {
    target: "5–8 minutes spoken",
    instruction: "Full script with labeled beats. Keep it filmable, not an essay.",
    maxOutputTokens: 5120,
  },
};

const MARKETING_LENGTH: Record<ContentLength, LengthPlaybook> = {
  short: {
    target: "headline plus 50–90 words of copy",
    instruction: "One headline, a tight body, 3 benefits max, one CTA.",
    maxOutputTokens: 1024,
  },
  medium: {
    target: "120–200 words",
    instruction: "Headline, main copy, 3–5 benefits, CTA.",
    maxOutputTokens: 1792,
  },
  long: {
    target: "220–380 words",
    instruction: "More proof in the body, still one offer and one CTA.",
    maxOutputTokens: 3072,
  },
};

const EDITORIAL_LENGTH: Record<ContentLength, LengthPlaybook> = {
  short: {
    target: "180–280 words",
    instruction: "A tight article: title, hook, one section of value, close.",
    maxOutputTokens: 1792,
  },
  medium: {
    target: "400–700 words",
    instruction: "Title, opening, 2–3 sections, close.",
    maxOutputTokens: 3584,
  },
  long: {
    target: "800–1200 words",
    instruction: "A full draft with 3–4 sections. Stay specific.",
    maxOutputTokens: 6144,
  },
};

const EMAIL_LENGTH: Record<ContentLength, LengthPlaybook> = {
  short: {
    target: "60–110 words plus subject",
    instruction: "Subject, a short body, one CTA.",
    maxOutputTokens: 1024,
  },
  medium: {
    target: "140–240 words plus subject",
    instruction: "Subject, opening, value, CTA.",
    maxOutputTokens: 1792,
  },
  long: {
    target: "280–450 words plus subject",
    instruction: "A newsletter-style note. Still one primary CTA.",
    maxOutputTokens: 3072,
  },
};

const LENGTH_BY_FAMILY: Record<
  ContentFamily,
  Record<ContentLength, LengthPlaybook>
> = {
  social: SOCIAL_LENGTH,
  short_video: VIDEO_LENGTH,
  youtube: VIDEO_LENGTH,
  marketing: MARKETING_LENGTH,
  editorial: EDITORIAL_LENGTH,
  email: EMAIL_LENGTH,
};

export function getLengthPlaybook(
  family: ContentFamily,
  length: ContentLength,
): LengthPlaybook {
  return LENGTH_BY_FAMILY[family][length];
}

export function shouldIncludeHashtags(
  family: ContentFamily,
  platform: GeneratorPlatform,
  contentType: ContentType,
): boolean {
  if (contentType === "advertisement_copy") {
    return false;
  }

  if (family === "email" || family === "editorial" || family === "marketing") {
    return false;
  }

  if (family === "youtube") {
    return contentType === "caption";
  }

  return PLATFORM_PLAYBOOKS[platform].hashtagPolicy !== "none";
}

export function hashtagInstruction(
  platform: GeneratorPlatform,
  policy: PlatformPlaybook["hashtagPolicy"],
): string {
  switch (policy) {
    case "none":
      return "Do not include hashtags.";
    case "light":
      return `Add 1–3 precise hashtags for ${PLATFORM_PLAYBOOKS[platform].displayName}. No tag stuffing.`;
    case "standard":
      return `Add 3–8 relevant hashtags for ${PLATFORM_PLAYBOOKS[platform].displayName}, grouped at the end. Mix a few specific tags with a few discoverable ones. No banned or generic spam tags.`;
  }
}
