import { relations, sql } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { SUPPORTED_AUTH_PROVIDERS } from "@skylar/schema";

import { inviteCode } from "./invite-code";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const user = pgTable(
  "user",
  {
    id: serial("id").primaryKey(),
    providerId: text("providerId").notNull().unique(),
    provider: text("provider", {
      enum: SUPPORTED_AUTH_PROVIDERS,
    }).notNull(),
    imageUri: text("imageUri"),
    name: text("name").default("").notNull(),
    email: text("email"),
    phone: text("phone"),
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
