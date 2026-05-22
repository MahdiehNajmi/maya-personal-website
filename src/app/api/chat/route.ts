import {
  generateMayaReply,
  prepareMessagesForGemini,
  type ChatMessage,
} from "@/lib/gemini";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

function errorMessageFor(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/GEMINI_API_KEY|not configured/i.test(msg)) {
    return "Chat is not configured on the server. Please try again later.";
  }
  if (/429|RESOURCE_EXHAUSTED|quota/i.test(msg)) {
    return "I'm getting a lot of requests right now. Please wait a moment and try again.";
  }
  if (/abort|timeout|DEADLINE/i.test(msg)) {
    return "That took too long. Please try a shorter question.";
  }
  if (/Invalid conversation/i.test(msg)) {
    return "Something went wrong with the chat history. Refresh the page and try again.";
  }
  return "Could not generate a response. Please try again.";
}

export async function POST(request: Request) {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    return NextResponse.json(
      { error: "Chat is not configured. Please try again later." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = chatSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid message format.", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const rawMessages = parsed.data.messages as ChatMessage[];

  try {
    prepareMessagesForGemini(rawMessages);
  } catch (e) {
    return NextResponse.json({ error: errorMessageFor(e) }, { status: 400 });
  }

  try {
    const reply = await generateMayaReply(rawMessages);
    return NextResponse.json({ message: reply });
  } catch (e) {
    console.error("[chat] Gemini error:", e);
    const msg = errorMessageFor(e);
    const status = /429|RESOURCE_EXHAUSTED|quota/i.test(
      e instanceof Error ? e.message : String(e),
    )
      ? 429
      : 502;
    return NextResponse.json({ error: msg }, { status });
  }
}
