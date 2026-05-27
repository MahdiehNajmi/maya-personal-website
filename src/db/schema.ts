import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  // Neon Auth user id (from neon_auth.user). Kept as text without FK so
  // Drizzle migrations don't attempt to manage Neon Auth's schema/tables.
  userId: text("user_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

/**
 * Stored after upload to Vercel Blob. `commentId` is nullable to allow a user to
 * upload images first, then attach them when they submit the comment.
 */
export const commentImages = pgTable("comment_images", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  commentId: integer("comment_id").references(() => comments.id, {
    onDelete: "cascade",
  }),
  url: text("url").notNull(),
  pathname: text("pathname").notNull(),
  contentType: text("content_type"),
  size: integer("size"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
