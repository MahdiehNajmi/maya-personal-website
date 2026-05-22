import { generateMahiSpeech } from "@/lib/gemini-tts";
import { NextResponse } from "next/server";

export const maxDuration = 60;

type TtsBody = {
  text?: string;
  voice?: string;
};

export async function POST(req: Request) {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    return NextResponse.json(
      { error: "Speech is not configured on the server." },
      { status: 503 },
    );
  }

  let body: TtsBody;
  try {
    body = (await req.json()) as TtsBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Text is required." }, { status: 400 });
  }

  try {
    const wav = await generateMahiSpeech(text, body.voice);
    return new NextResponse(new Uint8Array(wav), {
      status: 200,
      headers: {
        "Content-Type": "audio/wav",
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Speech synthesis failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
