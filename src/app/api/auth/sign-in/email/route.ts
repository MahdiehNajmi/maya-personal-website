import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type EmailAuthResult = {
  error?: { message?: string } | null;
};

function authErrorMessage(message: string | undefined) {
  if (message && /invalid origin/i.test(message)) {
    return "This domain is not added to Neon Auth trusted domains. Add https://mayanajmi.app in Neon Auth settings, then try again.";
  }

  return message || "Could not sign in. Please try again.";
}

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    email?: unknown;
    password?: unknown;
  } | null;

  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Please enter your email and password." },
      { status: 400 },
    );
  }

  const result = (await auth.signIn.email({
    email,
    password,
  })) as EmailAuthResult;

  if (result.error) {
    return NextResponse.json(
      { error: authErrorMessage(result.error.message) },
      { status: 401 },
    );
  }

  return NextResponse.json({ ok: true });
}
