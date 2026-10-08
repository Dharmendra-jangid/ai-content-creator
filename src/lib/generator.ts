import {
  CONTENT_TYPES,
  GENERATOR_PLATFORMS,
  LANGUAGES,
  LENGTHS,
  TONES,
} from "@/lib/constants";
import type { GeneratorInput } from "@/types";

export const TOPIC_MIN_LENGTH = 4;
export const TOPIC_MAX_LENGTH = 2000;
export const AUDIENCE_MAX_LENGTH = 300;

export function getOptionLabel<T extends string>(
  options: readonly { value: T; label: string }[],
  value: T,
) {
  return options.find((item) => item.value === value)?.label ?? value;
}

export type ParsedGeneratorInput =
  | { ok: true; data: GeneratorInput }
  | { ok: false; error: string };

export function parseGeneratorInput(value: unknown): ParsedGeneratorInput {
  if (!isRecord(value)) {
    return { ok: false, error: "Send a JSON body with the generation brief." };
  }

  if (!isOption(value.platform, GENERATOR_PLATFORMS)) {
    return { ok: false, error: "Choose a valid platform." };
  }

  if (!isOption(value.contentType, CONTENT_TYPES)) {
    return { ok: false, error: "Choose a valid content type." };
  }

  if (typeof value.topic !== "string") {
    return { ok: false, error: "Add a topic before generating." };
  }

  const topic = value.topic.trim();

  if (!topic) {
    return { ok: false, error: "Add a topic before generating." };
  }

  if (topic.length < TOPIC_MIN_LENGTH) {
    return { ok: false, error: "Give the topic a little more detail." };
  }

  if (topic.length > TOPIC_MAX_LENGTH) {
    return { ok: false, error: "Shorten the topic to 2,000 characters or fewer." };
  }

  if (value.audience !== undefined && typeof value.audience !== "string") {
    return { ok: false, error: "Target audience must be text." };
  }

  const audience = typeof value.audience === "string" ? value.audience.trim() : "";

  if (audience.length > AUDIENCE_MAX_LENGTH) {
    return { ok: false, error: "Keep the audience under 300 characters." };
  }

  if (!isOption(value.tone, TONES)) {
    return { ok: false, error: "Choose a valid tone." };
  }

  if (!isOption(value.language, LANGUAGES)) {
    return { ok: false, error: "Choose a valid language." };
  }

  if (!isOption(value.length, LENGTHS)) {
    return { ok: false, error: "Choose a valid content length." };
  }

  return {
    ok: true,
    data: {
      platform: value.platform,
      contentType: value.contentType,
      topic,
      audience,
      tone: value.tone,
      language: value.language,
      length: value.length,
    },
  };
}

export function validateGeneratorInput(input: GeneratorInput): string | null {
  const parsed = parseGeneratorInput(input);
  return parsed.ok ? null : parsed.error;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOption<T extends string>(
  value: unknown,
  options: readonly { value: T }[],
): value is T {
  return typeof value === "string" && options.some((item) => item.value === value);
}
