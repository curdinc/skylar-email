import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./user";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const inviteCode = pgTable("inviteCode", {
  id: serial("id").primaryKey(),
  inviteCode: text("inviteCode").unique().notNull(),
  userId: text("userId").references(() => user.id),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "date",
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  usedAt: timestamp("usedAt", {
    withTimezone: true,
    mode: "date",
  }),
});
