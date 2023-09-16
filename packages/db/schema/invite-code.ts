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
export const invite_code = pgTable(
  "invite_code",
  {
    invite_code_id: serial("invite_code_id").primaryKey(),
    invite_code: text("invite_code").unique().notNull(),
    created_by: integer("created_by")
      .references(() => user.user_id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .notNull(),
    used_by: integer("used_by")
      .references(() => user.user_id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .unique(),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    used_at: timestamp("used_at", {
      withTimezone: true,
      mode: "date",
    }),
    deleted_at: timestamp("deleted_at", {
      withTimezone: true,
      mode: "date",
    }),
  },
  (table) => {
    return {
      invite_code_idx: index("invite_code_idx").on(table.invite_code),
      used_by_idx: index("used_by_idx").on(table.used_by),
    };
  },
);

export const inviteCodeRelations = relations(invite_code, ({ one }) => ({
  creates_invite: one(user, {
    fields: [invite_code.created_by],
    references: [user.user_id],
    relationName: "creates_invite",
  }),
  uses_invite: one(user, {
    fields: [invite_code.used_by],
    references: [user.user_id],
    relationName: "uses_invite",
  }),
}));
