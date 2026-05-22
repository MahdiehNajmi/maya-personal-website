import { comments } from "@/db/schema";
import { getDb } from "@/db/index";
import { desc } from "drizzle-orm";

export type CommentDto = {
  id: number;
  authorName: string;
  body: string;
  createdAt: string;
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
    .select()
    .from(comments)
    .orderBy(desc(comments.createdAt))
    .limit(200);

  return rows.map((row) => ({
    id: row.id,
    authorName: row.authorName,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  }));
}

export async function createComment(input: {
  authorName: string;
  body: string;
}): Promise<CommentDto> {
  const db = getDb();
  if (!db) {
    throw new Error("DATABASE_NOT_CONFIGURED");
  }

  const [row] = await db
    .insert(comments)
    .values({
      authorName: input.authorName,
      body: input.body,
    })
    .returning();

  return {
    id: row.id,
    authorName: row.authorName,
    body: row.body,
    createdAt: row.createdAt.toISOString(),
  };
}
