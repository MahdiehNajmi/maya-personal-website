import { auth } from "@/lib/auth/server";
import { getDbOrThrow } from "@/db";
import { commentImages } from "@/db/schema";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid form data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Image is too large (max 5MB)." },
      { status: 400 },
    );
  }

  const safeName = (file.name || "upload")
    .replaceAll(/[^a-zA-Z0-9._-]+/g, "-")
    .slice(0, 80);
  const pathname = `comments/${userId}/${Date.now()}-${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    contentType: file.type || undefined,
    addRandomSuffix: true,
  });

  const db = getDbOrThrow();
  const [row] = await db
    .insert(commentImages)
    .values({
      userId,
      commentId: null,
      url: blob.url,
      pathname: blob.pathname,
      contentType: file.type || null,
      size: file.size,
    })
    .returning();

  return NextResponse.json({
    image: {
      id: row.id,
      url: row.url,
      pathname: row.pathname,
      contentType: row.contentType,
      size: row.size,
    },
  });
}

