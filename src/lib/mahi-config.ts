/** Use Gemini Leda TTS (extra API call). Default off to stay within free-tier limits. */
export function useGeminiTts(): boolean {
  return process.env.NEXT_PUBLIC_MAHI_GEMINI_TTS === "true";
}
