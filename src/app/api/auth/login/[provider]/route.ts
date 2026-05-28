import { auth } from "@/lib/auth/server";
import { getSiteUrl } from "@/lib/site-url";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROVIDERS = new Set(["google", "github"]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const site = getSiteUrl(request.nextUrl.origin);
  const commentsUrl = `${site}/comments`;

  if (!PROVIDERS.has(provider)) {
    return NextResponse.redirect(
      `${commentsUrl}?auth_error=${encodeURIComponent("Invalid login provider.")}`,
    );
  }

  const callbackURL = `${commentsUrl}`;

  const result = await auth.signIn.social({
    provider: provider as "google" | "github",
    callbackURL,
    // When this route is hit by bots / curl, the request may not include an
    // Origin header. Provide absolute URLs so Neon Auth doesn't need Origin
    // to resolve relative defaults.
    newUserCallbackURL: callbackURL,
    errorCallbackURL: callbackURL,
  });

  if (result.error) {
    const message =
      result.error.message ||
      "Login was blocked. Add this site to Neon Auth trusted domains and configure OAuth in the Neon Console.";
    return NextResponse.redirect(
      `${commentsUrl}?auth_error=${encodeURIComponent(message)}`,
    );
  }

  const redirectUrl = (result.data as { url?: string } | null)?.url;
  if (!redirectUrl) {
    return NextResponse.redirect(
      `${commentsUrl}?auth_error=${encodeURIComponent("Could not start OAuth redirect.")}`,
    );
  }

  return NextResponse.redirect(redirectUrl);
}
