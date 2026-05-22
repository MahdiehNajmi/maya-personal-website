import { createComment, listComments } from "@/lib/comments";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required.").max(120),
  body: z
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters.")
    .max(2000, "Comment is too long (max 2000 characters)."),
  /** Honeypot — must stay empty */
  website: z.string().optional(),
});

const MIN_POST_GAP_MS = 5000;
let lastPostAt = 0;

export async function GET() {
  try {
    const items = await listComments();
    return NextResponse.json({ comments: items });
  } catch (e) {
    console.error("[comments] GET error:", e);
    return NextResponse.json(
      { error: "Could not load comments." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const now = Date.now();
  if (now - lastPostAt < MIN_POST_GAP_MS) {
    return NextResponse.json(
      { error: "Please wait a few seconds before posting again." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? "Invalid input.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (parsed.data.website?.trim()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const comment = await createComment({
      authorName: parsed.data.authorName,
      body: parsed.data.body,
    });
    lastPostAt = now;
    return NextResponse.json({ comment }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/DATABASE_NOT_CONFIGURED/i.test(msg)) {
      return NextResponse.json(
        {
          error:
            "Comments are not configured yet. Please try again later or email the site owner.",
        },
        { status: 503 },
      );
    }
    console.error("[comments] POST error:", e);
    return NextResponse.json(
      { error: "Could not save your comment. Please try again." },
      { status: 500 },
    );
  }
}
