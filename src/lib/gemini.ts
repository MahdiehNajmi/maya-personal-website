import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { loadPersonaPrompt } from "@/lib/persona";
import { MAYA_CHAT_GREETING } from "@/data/maya-ai";

export const GEMINI_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.0-flash";
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_RETRIES = 2;

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({ apiKey });
}

/** Gemini expects history to start with a user turn, not the welcome bubble. */
export function prepareMessagesForGemini(messages: ChatMessage[]): ChatMessage[] {
  const trimmed = messages
    .map((m) => ({ ...m, content: m.content.trim() }))
    .filter((m) => m.content.length > 0);

  let start = 0;
  while (start < trimmed.length && trimmed[start].role === "assistant") {
    start += 1;
  }

  const history = trimmed.slice(start);
  if (history.length === 0 || history[history.length - 1].role !== "user") {
    throw new Error("Invalid conversation: expected a user message to reply to.");
  }

  return history;
}

function extractText(response: GenerateContentResponse): string | null {
  const direct = response.text?.trim();
  if (direct) return direct;

  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts?.length) return null;

  const combined = parts
    .map((p) => ("text" in p && typeof p.text === "string" ? p.text : ""))
    .join("")
    .trim();

  return combined || null;
}

function isRetryableError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error !== null && "message" in error
        ? String((error as { message: unknown }).message)
        : String(error);

  return /429|503|504|UNAVAILABLE|RESOURCE_EXHAUSTED|DEADLINE|timeout|fetch failed/i.test(
    message,
  );
}

async function callGemini(
  model: string,
  contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>,
  systemInstruction: string,
): Promise<string> {
  const ai = getClient();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1024,
        abortSignal: controller.signal,
      },
    });

    const text = extractText(response);
    if (!text) {
      const reason = response.candidates?.[0]?.finishReason ?? "unknown";
      throw new Error(`Empty model response (finishReason: ${reason}).`);
    }
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

async function callWithRetries(
  contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }>,
  systemInstruction: string,
): Promise<string> {
  const models = [GEMINI_MODEL, FALLBACK_MODEL];
  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        return await callGemini(model, contents, systemInstruction);
      } catch (error) {
        lastError = error;
        if (!isRetryableError(error) || attempt === MAX_RETRIES) break;
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
    }
  }

  throw lastError;
}

export async function generateMayaReply(
  messages: ChatMessage[],
): Promise<string> {
  const history = prepareMessagesForGemini(messages);

  const contents = history.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const systemInstruction = `${loadPersonaPrompt()}\n\nYour usual opening line when someone starts chatting: "${MAYA_CHAT_GREETING}"`;

  return callWithRetries(contents, systemInstruction);
}
