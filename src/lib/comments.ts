import { commentImages, comments } from "@/db/schema";
import { neonAuthUser } from "@/db/neon-auth";
import { commentImagePublicUrl } from "@/lib/comment-image-url";
import { getDb } from "@/db/index";
import { desc, eq, inArray, sql } from "drizzle-orm";

export type CommentDto = {
  id: number;
  authorName: string;
  authorImageUrl?: string | null;
  body: string;
  createdAt: string;
  images: { id: number; url: string }[];
};

/** Display format: Date Created : YYYY/MM/DD hh:mm:ss */
export function formatCommentDate(date: Date): string {
  const y = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `Date Created : ${y}/${mo}/${d} ${h}:${mi}:${s}`;
}

async function loadCommentImages(
  db: NonNullable<ReturnType<typeof getDb>>,
  commentIds: number[],
) {
  if (commentIds.length === 0) return new Map<number, { id: number; url: string }[]>();

  const images = await db
    .select({
      id: commentImages.id,
      commentId: commentImages.commentId,
      url: commentImages.url,
    })
    .from(commentImages)
    .where(inArray(commentImages.commentId, commentIds));

  const imagesByCommentId = new Map<number, { id: number; url: string }[]>();
  for (const img of images) {
    const cid = img.commentId;
    if (!cid) continue;
    const arr = imagesByCommentId.get(cid) ?? [];
    arr.push({ id: img.id, url: commentImagePublicUrl(img.id) });
    imagesByCommentId.set(cid, arr);
  }
  return imagesByCommentId;
}

async function listCommentsWithAuthors(
  db: NonNullable<ReturnType<typeof getDb>>,
): Promise<CommentDto[]> {
  const rows = await db
    .select({
      id: comments.id,
      body: comments.body,
      createdAt: comments.createdAt,
      userId: comments.userId,
      authorName: neonAuthUser.name,
      authorEmail: neonAuthUser.email,
      authorImageUrl: neonAuthUser.image,
    })
    .from(comments)
    .leftJoin(
      neonAuthUser,
      sql`${neonAuthUser.id}::text = ${comments.userId}`,
    )
    .orderBy(desc(comments.createdAt), desc(comments.id))
    .limit(200);

  const imagesByCommentId = await loadCommentImages(
    db,
    rows.map((r) => r.id),
  );

  return rows.map((row) => ({
    id: row.id,
    authorName: row.authorName ?? row.authorEmail ?? "Visitor",
    authorImageUrl: row.authorImageUrl ?? null,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    images: imagesByCommentId.get(row.id) ?? [],
  }));
}

async function listCommentsFallback(
  db: NonNullable<ReturnType<typeof getDb>>,
): Promise<CommentDto[]> {
  const rows = await db
    .select()
    .from(comments)
    .orderBy(desc(comments.createdAt), desc(comments.id))
    .limit(200);

  const imagesByCommentId = await loadCommentImages(
    db,
    rows.map((r) => r.id),
  );

  return rows.map((row) => ({
    id: row.id,
    authorName: "Visitor",
    authorImageUrl: null,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    images: imagesByCommentId.get(row.id) ?? [],
  }));
}

export type ListCommentsResult = {
  comments: CommentDto[];
  error: string | null;
};

export async function listComments(): Promise<ListCommentsResult> {
  const db = getDb();
  if (!db) {
    return {
      comments: [],
      error:
        "Comments database is not configured. Set DATABASE_URL on Vercel and redeploy.",
    };
  }

  try {
    return { comments: await listCommentsWithAuthors(db), error: null };
  } catch (e) {
    console.error("[comments] list with author join failed:", e);
    try {
      return { comments: await listCommentsFallback(db), error: null };
    } catch (e2) {
      console.error("[comments] list fallback failed:", e2);
      const msg = e2 instanceof Error ? e2.message : String(e2);
      const hint = /does not exist|relation/i.test(msg)
        ? " Run database migrations: pnpm exec drizzle-kit migrate"
        : "";
      return {
        comments: [],
        error: `Could not load comments.${hint}`,
      };
    }
  }
}

export async function createComment(input: {
  userId: string;
  authorName?: string | null;
  authorImageUrl?: string | null;
  body: string;
  imageIds?: number[];
}): Promise<CommentDto> {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const [row] = await db
    .insert(comments)
    .values({
      userId: input.userId,
      body: input.body,
    })
    .returning();

  let images: { id: number; url: string }[] = [];
  if (input.imageIds?.length) {
    await db
      .update(commentImages)
      .set({ commentId: row.id })
      .where(inArray(commentImages.id, input.imageIds));

    const attached = await db
      .select({ id: commentImages.id })
      .from(commentImages)
      .where(inArray(commentImages.id, input.imageIds));

    images = attached.map((img) => ({
      id: img.id,
      url: commentImagePublicUrl(img.id),
    }));
  }

  return {
    id: row.id,
    authorName: input.authorName?.trim() || "Community member",
    authorImageUrl: input.authorImageUrl ?? null,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    images,
  };
}
