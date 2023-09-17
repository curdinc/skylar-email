import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./user";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const inviteCode = pgTable(
  "invite_code",
  {
    inviteCodeId: serial("invite_code_id").primaryKey(),
    inviteCode: text("invite_code").unique().notNull(),
    createdBy: integer("created_by")
      .references(() => user.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    usedBy: integer("used_by")
      .references(() => user.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .unique(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    usedAt: timestamp("used_at", {
      withTimezone: true,
      mode: "date",
    }),
    deletedAt: timestamp("deleted_at", {
      withTimezone: true,
      mode: "date",
    }),
  },
  (table) => {
    return {
      inviteCodeIdx: index("invite_code_idx").on(table.inviteCode),
      usedByIdx: index("used_by_idx").on(table.usedBy),
    };
  },
);

export const inviteCodeRelations = relations(inviteCode, ({ one }) => ({
  createdByUser: one(user, {
    fields: [inviteCode.createdBy],
    references: [user.userId],
    relationName: "created_invite_code",
  }),
  usedByUser: one(user, {
    fields: [inviteCode.usedBy],
    references: [user.userId],
    relationName: "used_invite_code",
  }),
}));
