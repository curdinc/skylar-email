import { relations, sql } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { inviteCode } from "./invite-code";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    providerId: text("providerId").notNull().unique(),
    provider: text("provider", {
      enum: ["github", "discord", "facebook"],
    }).notNull(),
    imageUri: text("imageUri").default(""),
    name: text("name").default(""),
    email: text("email").default(""),
    phone: text("phone").default(""),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      providerIdx: index("providerIdx").on(table.providerId),
    };
  },
);

export const usersRelations = relations(user, ({ many }) => ({
  inviteCode: many(inviteCode),
}));
