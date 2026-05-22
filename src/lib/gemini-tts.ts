import { GoogleGenAI } from "@google/genai";
import {
  DEFAULT_MAHI_TTS_VOICE,
  type MahiTtsVoiceId,
  MAHI_TTS_VOICES,
} from "@/data/mahi-voices";
import {
  isRetryableError,
  retryDelayMs,
  sleep,
} from "@/lib/gemini-retry";

export const GEMINI_TTS_MODEL = "gemini-2.5-flash-preview-tts";
const FALLBACK_TTS_MODEL = "gemini-2.5-pro-preview-tts";
const TTS_MAX_RETRIES = 3;
/** Shorter spoken replies use less TTS quota and finish faster. */
const TTS_MAX_CHARS = 1200;

const SAMPLE_RATE = 24_000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({ apiKey });
}

export function resolveMahiVoiceId(
  requested?: string | null,
): MahiTtsVoiceId {
  const fromEnv = process.env.MAHI_TTS_VOICE?.trim();
  const candidate = (requested ?? fromEnv ?? DEFAULT_MAHI_TTS_VOICE).trim();
  const match = MAHI_TTS_VOICES.find((v) => v.id === candidate);
  return match?.id ?? DEFAULT_MAHI_TTS_VOICE;
}

function pcmToWav(pcm: Buffer): Buffer {
  const byteRate = (SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE) / 8;
  const blockAlign = (CHANNELS * BITS_PER_SAMPLE) / 8;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(CHANNELS, 22);
  header.writeUInt32LE(SAMPLE_RATE, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(BITS_PER_SAMPLE, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

async function callTts(
  model: string,
  text: string,
  voiceName: MahiTtsVoiceId,
): Promise<Buffer> {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName },
        },
      },
    },
  });

  const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!data) {
    const reason = response.candidates?.[0]?.finishReason ?? "unknown";
    throw new Error(`No audio in TTS response (finishReason: ${reason}).`);
  }

  const pcm = Buffer.from(data, "base64");
  return pcmToWav(pcm);
}

export async function generateMahiSpeech(
  text: string,
  voiceId?: string | null,
): Promise<Buffer> {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("Text is required for speech synthesis.");
  }
  const toSpeak =
    trimmed.length > TTS_MAX_CHARS
      ? `${trimmed.slice(0, TTS_MAX_CHARS).trimEnd()}…`
      : trimmed;

  const voiceName = resolveMahiVoiceId(voiceId);
  const models = [GEMINI_TTS_MODEL, FALLBACK_TTS_MODEL];
  let lastError: unknown;

  for (const model of models) {
    for (let attempt = 0; attempt <= TTS_MAX_RETRIES; attempt++) {
      try {
        return await callTts(model, toSpeak, voiceName);
      } catch (error) {
        lastError = error;
        if (!isRetryableError(error) || attempt === TTS_MAX_RETRIES) break;
        await sleep(retryDelayMs(error, attempt));
      }
    }
    if (lastError && isRetryableError(lastError)) {
      await sleep(retryDelayMs(lastError, 0));
    }
  }

  throw lastError;
}
