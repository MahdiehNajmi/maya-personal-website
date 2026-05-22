/** Gemini TTS prebuilt voices — preview at https://aistudio.google.com/generate-speech */
export const MAHI_TTS_VOICES = [
  { id: "Aoede", label: "Aoede", tone: "Breezy, light and natural" },
  { id: "Kore", label: "Kore", tone: "Firm, clear and confident" },
  { id: "Leda", label: "Leda", tone: "Youthful, bright and friendly" },
  { id: "Zephyr", label: "Zephyr", tone: "Bright, upbeat" },
  { id: "Vindemiatrix", label: "Vindemiatrix", tone: "Gentle, soft" },
  { id: "Achernar", label: "Achernar", tone: "Soft, warm" },
  { id: "Sulafat", label: "Sulafat", tone: "Warm, approachable" },
  { id: "Achird", label: "Achird", tone: "Friendly, conversational" },
] as const;

export type MahiTtsVoiceId = (typeof MAHI_TTS_VOICES)[number]["id"];

export const DEFAULT_MAHI_TTS_VOICE: MahiTtsVoiceId = "Leda";

export const MAHI_AVATAR = "/images/mahi-avatar.png";
