import { commentImages, comments } from "@/db/schema";
import { neonAuthUser } from "@/db/neon-auth";
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

export async function listComments(): Promise<CommentDto[]> {
  const db = getDb();
  if (!db) return [];

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
    .orderBy(desc(comments.createdAt))
    .limit(200);

  const commentIds = rows.map((r) => r.id);
  const images =
    commentIds.length === 0
      ? []
      : await db
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
    arr.push({ id: img.id, url: img.url });
    imagesByCommentId.set(cid, arr);
  }

  return rows.map((row) => ({
    id: row.id,
    authorName: row.authorName ?? row.authorEmail ?? "Visitor",
    authorImageUrl: row.authorImageUrl ?? null,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    images: imagesByCommentId.get(row.id) ?? [],
  }));
}

export async function createComment(input: {
  userId: string;
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

  if (input.imageIds?.length) {
    await db
      .update(commentImages)
      .set({ commentId: row.id })
      .where(inArray(commentImages.id, input.imageIds));
  }

  return {
    id: row.id,
    authorName: "You",
    body: row.body,
    createdAt: row.createdAt.toISOString(),
    images: [],
  };
}
