/** Serialize Gemini API calls in the browser to avoid 429s from overlapping chat + TTS. */
let chain: Promise<unknown> = Promise.resolve();

export function enqueueGeminiClientRequest<T>(
  fn: () => Promise<T>,
): Promise<T> {
  const next = chain.then(() => fn());
  chain = next.catch(() => {});
  return next;
}
