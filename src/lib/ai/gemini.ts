import "server-only";

import { ApiError, GoogleGenAI } from "@google/genai";

import { AiError, isTimeoutError, redactErrorMessage } from "@/lib/ai/errors";
import { buildContentGenerationPrompt } from "@/lib/ai/prompt";
import { getServerEnv } from "@/lib/env/server";
import type { GeneratorInput } from "@/types";

export const GEMINI_REQUEST_TIMEOUT_MS = 25_000;

type InteractionTextSource = {
  output_text?: string;
  steps?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

function createGeminiClient() {
  const { geminiApiKey } = getServerEnv();

  if (!geminiApiKey) {
    throw new AiError(
      "Generation is not configured yet.",
      503,
      "config",
    );
  }

  return new GoogleGenAI({ apiKey: geminiApiKey });
}

export async function generateContent(input: GeneratorInput): Promise<string> {
  const { geminiModel } = getServerEnv();
  const prompt = buildContentGenerationPrompt(input);
  const client = createGeminiClient();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEMINI_REQUEST_TIMEOUT_MS);

  try {
    const interaction = await client.interactions.create(
      {
        model: geminiModel,
        input: prompt.userPrompt,
        system_instruction: prompt.systemInstruction,
        store: false,
        generation_config: {
          max_output_tokens: prompt.maxOutputTokens,
        },
      },
      {
        timeout: GEMINI_REQUEST_TIMEOUT_MS,
        fetchOptions: { signal: controller.signal },
      },
    );

    const text = extractOutputText(interaction);

    if (!text) {
      throw new AiError(
        "The model returned an empty draft. Try a more specific topic.",
        502,
        "empty",
      );
    }

    return text;
  } catch (error) {
    throw mapGeminiError(error);
  } finally {
    clearTimeout(timer);
  }
}

function extractOutputText(interaction: InteractionTextSource) {
  const fromSdk = cleanGeneratedText(interaction.output_text);
  if (fromSdk) {
    return fromSdk;
  }

  const chunks: string[] = [];

  for (const step of interaction.steps ?? []) {
    if (step.type !== "model_output") {
      continue;
    }

    for (const part of step.content ?? []) {
      if (part.type === "text" && typeof part.text === "string") {
        chunks.push(part.text);
      }
    }
  }

  return cleanGeneratedText(chunks.join("\n\n"));
}

function cleanGeneratedText(value: string | undefined) {
  if (!value) {
    return "";
  }

  let text = value.trim();

  if (!text) {
    return "";
  }

  const fenced = text.match(/^```(?:[\w-]+)?\s*\n([\s\S]*?)\n```$/);
  if (fenced?.[1]) {
    text = fenced[1].trim();
  }

  return text;
}

function mapGeminiError(error: unknown): AiError {
  if (error instanceof AiError) {
    return error;
  }

  if (isTimeoutError(error)) {
    return new AiError(
      "Generation timed out. Try a shorter length or try again.",
      504,
      "timeout",
    );
  }

  if (error instanceof ApiError) {
    if (error.status === 401 || error.status === 403) {
      return new AiError(
        "Generation is temporarily unavailable.",
        502,
        "auth",
      );
    }

    if (error.status === 429) {
      return new AiError("The model is busy. Wait a moment and try again.", 429, "rate_limit");
    }

    if (error.status === 404) {
      return new AiError(
        "The configured generation model is not available.",
        502,
        "model",
      );
    }

    if (error.status >= 500) {
      return new AiError(
        "Gemini is temporarily unavailable. Try again shortly.",
        502,
        "upstream",
      );
    }
  }

  const message = redactErrorMessage(error);
  console.error("[ai] generation failed", message);

  return new AiError("Could not generate content. Try again.", 502, "unknown");
}
