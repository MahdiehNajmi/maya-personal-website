import { GoogleGenAI } from "@google/genai";
import { MAYA_AI_SYSTEM_PROMPT } from "@/data/maya-ai";

export const GEMINI_MODEL = "gemini-2.5-flash";

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

export async function generateMayaReply(
  messages: ChatMessage[],
): Promise<string> {
  const ai = getClient();

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? ("model" as const) : ("user" as const),
    parts: [{ text: m.content }],
  }));

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: MAYA_AI_SYSTEM_PROMPT,
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("Empty response from Gemini.");
  }
  return text;
}
