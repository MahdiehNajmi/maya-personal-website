import { boolean, pgSchema, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Neon Auth (Better Auth) tables under the `neon_auth` schema.
 * Managed by Neon — do not create/alter via Drizzle migrations.
 */
export const neonAuth = pgSchema("neon_auth");

export const neonAuthUser = neonAuth.table("user", {
  id: uuid("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  emailVerified: boolean("emailVerified"),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
});
