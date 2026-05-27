-- Baseline schema for authenticated comments + image uploads.
-- Safe to apply repeatedly in dev: drops old anonymous comments table.

DROP TABLE IF EXISTS "comment_images" CASCADE;
DROP TABLE IF EXISTS "comments" CASCADE;

CREATE TABLE IF NOT EXISTS "comments" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "body" text NOT NULL,
  "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "comment_images" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "comment_id" integer,
  "url" text NOT NULL,
  "pathname" text NOT NULL,
  "content_type" text,
  "size" integer,
  "created_at" timestamptz DEFAULT now() NOT NULL,
  CONSTRAINT "comment_images_comment_id_comments_id_fk"
    FOREIGN KEY ("comment_id") REFERENCES "comments"("id")
    ON DELETE CASCADE
);

