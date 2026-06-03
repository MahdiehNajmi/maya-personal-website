import { getSiteUrl } from "@/lib/site-url";
import type { NextRequest } from "next/server";

export const HOME_COMMENTS_PATH = "/#comments";

export function safeReturnPath(raw: string | null): string {
  if (!raw) return HOME_COMMENTS_PATH;

  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return raw;
  }

  return HOME_COMMENTS_PATH;
}

export function safeReturnUrl(request: NextRequest): string {
  const site = getSiteUrl(request.nextUrl.origin);
  return `${site}${safeReturnPath(request.nextUrl.searchParams.get("returnTo"))}`;
}

export function withAuthError(targetUrl: string, message: string): string {
  const url = new URL(targetUrl);
  url.searchParams.set("auth_error", message);
  return url.toString();
}
