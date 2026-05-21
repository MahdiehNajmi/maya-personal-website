import { generateMayaReply, type ChatMessage } from "@/lib/gemini";
import { NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(4000),
});

const chatSchema = z.object({
  messages: z.array(messageSchema).min(1).max(40),
});

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

  const messages = parsed.data.messages as ChatMessage[];

  try {
    const reply = await generateMayaReply(messages);
    return NextResponse.json({ message: reply });
  } catch (e) {
    console.error("[chat] Gemini error:", e);
    return NextResponse.json(
      { error: "Could not generate a response. Please try again." },
      { status: 502 },
    );
  }
}
