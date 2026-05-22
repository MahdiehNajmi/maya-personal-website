export function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

export function isRateLimitError(error: unknown): boolean {
  const msg = errorMessage(error);
  return /429|RESOURCE_EXHAUSTED|quota|rate.?limit|too many requests/i.test(
    msg,
  );
}

export function isRetryableError(error: unknown): boolean {
  const msg = errorMessage(error);
  return (
    isRateLimitError(error) ||
    /503|504|UNAVAILABLE|DEADLINE|timeout|fetch failed|ECONNRESET/i.test(msg)
  );
}

/** Exponential backoff with jitter; longer waits for rate limits. */
export function retryDelayMs(error: unknown, attempt: number): number {
  const base = isRateLimitError(error) ? 2000 : 600;
  const max = isRateLimitError(error) ? 20_000 : 5000;
  const exp = Math.min(max, base * 2 ** attempt);
  const jitter = Math.floor(Math.random() * 400);
  return exp + jitter;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
