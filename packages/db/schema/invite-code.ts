import { relations, sql } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const inviteCode = pgTable(
  "invite_code",
  {
    inviteCodeId: serial("invite_code_id").primaryKey(),
    inviteCode: text("invite_code").unique().notNull(),

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
    };
  },
);

export const inviteCodeRelations = relations(inviteCode, () => ({}));
