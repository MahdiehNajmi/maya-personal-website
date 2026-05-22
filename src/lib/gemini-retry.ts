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
  if (isRateLimitError(error)) return false;
  return /503|504|UNAVAILABLE|DEADLINE|timeout|fetch failed|ECONNRESET|abort/i.test(
    msg,
  );
}

/** Short backoff for transient errors only (not rate limits). */
export function retryDelayMs(_error: unknown, attempt: number): number {
  const base = 800;
  const jitter = Math.floor(Math.random() * 300);
  return Math.min(4000, base * 2 ** attempt) + jitter;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
