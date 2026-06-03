import { createComment, listComments } from "@/lib/comments";
import { auth } from "@/lib/auth/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z
  .object({
    body: z
      .string()
      .trim()
      .max(2000, "Comment is too long (max 2000 characters)."),
    imageIds: z.array(z.number().int().positive()).optional(),
    /** Honeypot — must stay empty */
    website: z.string().optional(),
  })
  .refine(
    (data) =>
      data.body.length >= 3 || (data.imageIds?.length ?? 0) > 0,
    {
      message:
        "Add a message (at least 3 characters) or attach at least one image.",
    },
  );

const MIN_POST_GAP_MS = 5000;
let lastPostAt = 0;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { comments: items } = await listComments();
    return NextResponse.json(
      { comments: items },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      },
    );
  } catch (e) {
    console.error("[comments] GET error:", e);
    return NextResponse.json(
      { error: "Could not load comments." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  const user = session?.user;
  const userId = user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

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
      userId,
      authorName: user.name ?? user.email ?? null,
      authorImageUrl: user.image ?? null,
      body: parsed.data.body,
      imageIds: parsed.data.imageIds,
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
