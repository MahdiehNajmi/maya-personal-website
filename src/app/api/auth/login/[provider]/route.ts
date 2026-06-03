import { auth } from "@/lib/auth/server";
import { safeReturnUrl, withAuthError } from "@/lib/auth/redirect";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PROVIDERS = new Set(["google", "github"]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const callbackURL = safeReturnUrl(request);

  if (!PROVIDERS.has(provider)) {
    return NextResponse.redirect(
      withAuthError(callbackURL, "Invalid login provider."),
    );
  }

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
      withAuthError(callbackURL, message),
    );
  }

  const redirectUrl = (result.data as { url?: string } | null)?.url;
  if (!redirectUrl) {
    return NextResponse.redirect(
      withAuthError(callbackURL, "Could not start OAuth redirect."),
    );
  }

  return NextResponse.redirect(redirectUrl);
}
