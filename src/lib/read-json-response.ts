/** fetch with a timeout; rejects if the request takes too long. */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit,
  timeoutMs: number,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new Error("Upload timed out. Try a smaller image (under 4MB).");
    }
    throw e;
  } finally {
    clearTimeout(timeout);
  }
}

/** Parse a fetch Response as JSON; surfaces empty/non-JSON bodies clearly. */
export async function readJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!text.trim()) {
    throw new Error(
      res.ok
        ? "Empty response from server."
        : `Request failed (${res.status}).`,
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    const preview = text.slice(0, 200);
    throw new Error(
      res.ok
        ? "Invalid response from server."
        : preview || `Request failed (${res.status}).`,
    );
  }
}
