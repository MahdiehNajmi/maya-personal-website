import { getDbOrThrow } from "@/db";
import { commentImages } from "@/db/schema";
import { get } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function filenameFromPathname(pathname: string, id: number): string {
  const base = pathname.split("/").pop()?.trim();
  if (base) return base.replaceAll(/[^a-zA-Z0-9._-]+/g, "-");
  return `comment-image-${id}.jpg`;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idParam } = await context.params;
  const id = Number.parseInt(idParam, 10);
  const forceDownload =
    new URL(request.url).searchParams.get("download") === "1";
  if (!Number.isFinite(id) || id <= 0) {
    return new NextResponse("Not found", { status: 404 });
  }

  const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  if (!blobToken) {
    return new NextResponse("Not configured", { status: 503 });
  }

  let row: { url: string; pathname: string; contentType: string | null } | undefined;
  try {
    const db = getDbOrThrow();
    [row] = await db
      .select({
        url: commentImages.url,
        pathname: commentImages.pathname,
        contentType: commentImages.contentType,
      })
      .from(commentImages)
      .where(eq(commentImages.id, id))
      .limit(1);
  } catch (e) {
    console.error("[comment-images/[id]] db", e);
    return new NextResponse("Server error", { status: 500 });
  }

  if (!row) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const result = await get(row.url, {
      access: "private",
      token: blobToken,
    });

    if (!result || result.statusCode !== 200 || !result.stream) {
      return new NextResponse("Not found", { status: 404 });
    }

    const contentType =
      result.blob.contentType ?? row.contentType ?? "application/octet-stream";
    const filename = filenameFromPathname(row.pathname, id);
    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Cache-Control": forceDownload ? "private, no-cache" : "public, max-age=86400",
    };
    if (forceDownload) {
      headers["Content-Disposition"] = `attachment; filename="${filename}"`;
    } else {
      headers["Content-Disposition"] = `inline; filename="${filename}"`;
    }

    return new Response(result.stream, { headers });
  } catch (e) {
    console.error("[comment-images/[id]] blob", e);
    return new NextResponse("Not found", { status: 404 });
  }
}
