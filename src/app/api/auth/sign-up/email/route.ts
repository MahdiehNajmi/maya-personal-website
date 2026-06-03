import { validatePasswordPolicy } from "@/lib/auth/password-policy";
import { auth } from "@/lib/auth/server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type EmailAuthResult = {
  error?: { message?: string } | null;
};

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
  } | null;

  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name) {
    return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  const policyError = validatePasswordPolicy(password);
  if (policyError) {
    return NextResponse.json({ error: policyError }, { status: 400 });
  }

  const result = (await auth.signUp.email({
    name,
    email,
    password,
  })) as EmailAuthResult;

  if (result.error) {
    return NextResponse.json(
      { error: result.error.message || "Could not create your account." },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
