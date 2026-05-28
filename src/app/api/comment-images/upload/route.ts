import { auth } from "@/lib/auth/server";
import { commentImagePublicUrl } from "@/lib/comment-image-url";
import { getDbOrThrow } from "@/db";
import { commentImages } from "@/db/schema";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/** Vercel serverless request body limit (~4.5MB). Stay under it. */
const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

function uploadErrorMessage(e: unknown): string {
  const msg = e instanceof Error ? e.message : String(e);
  if (/private store|Cannot use public access/i.test(msg)) {
    return "Blob store is private; uploads now use private access. Please try again.";
  }
  if (/DATABASE_NOT_CONFIGURED/i.test(msg)) {
    return "Comments database is not configured.";
  }
  if (/does not exist|relation/i.test(msg)) {
    return "Comments tables are missing. Run database migrations.";
  }
  if (msg) return msg;
  return "Could not upload image.";
}

export async function POST(request: Request) {
  const { data: session } = await auth.getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "Please log in first." }, { status: 401 });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!blobToken) {
    return NextResponse.json(
      { error: "Image uploads are not configured (missing BLOB_READ_WRITE_TOKEN)." },
      { status: 503 },
    );
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
      { error: "Image is too large (max 4MB on this site)." },
      { status: 400 },
    );
  }

  const safeName = (file.name || "upload")
    .replaceAll(/[^a-zA-Z0-9._-]+/g, "-")
    .slice(0, 80);
  const pathname = `comments/${userId}/${Date.now()}-${safeName}`;

  try {
    const bytes = await file.arrayBuffer();
    const blob = await put(pathname, bytes, {
      access: "private",
      token: blobToken,
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
        url: commentImagePublicUrl(row.id),
      },
    });
  } catch (e) {
    console.error("[comment-images/upload]", e);
    const message = uploadErrorMessage(e);
    const status = /not configured|migrations/i.test(message) ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
