import { relations, sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { user } from "./user";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const inviteCode = pgTable("inviteCode", {
  id: serial("id").primaryKey(),
  inviteCode: text("inviteCode").unique().notNull(),
  createdByUserId: integer("userId")
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  usedByUserId: integer("usedByUserId")
    .references(() => user.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .unique(),
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
  deletedAt: timestamp("deletedAt", {
    withTimezone: true,
    mode: "date",
  }),
});

export const inviteCodeRelations = relations(inviteCode, ({ one }) => ({
  createdByUser: one(user, {
    fields: [inviteCode.createdByUserId],
    references: [user.id],
  }),
  usedByUser: one(user, {
    fields: [inviteCode.usedByUserId],
    references: [user.id],
  }),
}));
