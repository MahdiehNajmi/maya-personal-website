import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { loadPersonaPrompt } from "@/lib/persona";
import { MAYA_CHAT_GREETING } from "@/data/maya-ai";
import {
  isRateLimitError,
  isRetryableError,
  retryDelayMs,
  sleep,
} from "@/lib/gemini-retry";

/** Lighter model first — better availability on free-tier API keys. */
export const GEMINI_MODEL = "gemini-2.0-flash";
const FALLBACK_MODEL = "gemini-2.5-flash";
const REQUEST_TIMEOUT_MS = 22_000;
/** Stay under Vercel 60s limit (chat route maxDuration). */
const SERVER_BUDGET_MS = 50_000;
const MAX_RETRIES = 2;
const RATE_LIMIT_WAIT_MS = 5_000;
/** Keep history short to reduce tokens and API load. */
const MAX_HISTORY_TURNS = 12;

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

  if (history.length > MAX_HISTORY_TURNS) {
    return history.slice(-MAX_HISTORY_TURNS);
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
        maxOutputTokens: 512,
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
  const deadline = Date.now() + SERVER_BUDGET_MS;
  let lastError: unknown;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (Date.now() >= deadline) break;

    const model = attempt < models.length ? models[attempt] : models[models.length - 1];

    try {
      return await callGemini(model, contents, systemInstruction);
    } catch (error) {
      lastError = error;

      if (attempt === MAX_RETRIES) break;

      if (isRateLimitError(error)) {
        const wait = Math.min(RATE_LIMIT_WAIT_MS * (attempt + 1), deadline - Date.now() - 500);
        if (wait > 0) await sleep(wait);
        continue;
      }

      if (isRetryableError(error)) {
        const wait = Math.min(retryDelayMs(error, attempt), deadline - Date.now() - 500);
        if (wait > 0) await sleep(wait);
        continue;
      }

      break;
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

  const persona = loadPersonaPrompt();
  const systemInstruction =
    persona.length > 1200
      ? `${persona.slice(0, 1200)}…\n\nYour greeting: "${MAYA_CHAT_GREETING}"`
      : `${persona}\n\nYour greeting: "${MAYA_CHAT_GREETING}"`;

  return callWithRetries(contents, systemInstruction);
}
