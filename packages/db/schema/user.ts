import { relations, sql } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { SUPPORTED_AUTH_PROVIDERS } from "@skylar/parsers-and-types";

import { invite_code } from "./invite-code";
import { stripe_customer } from "./stripe";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const user = pgTable(
  "user",
  {
    user_id: serial("id").primaryKey(),
    auth_provider_id: text("providerId").notNull().unique(),
    auth_provider: text("provider", {
      enum: SUPPORTED_AUTH_PROVIDERS,
    }).notNull(),
    image_uri: text("imageUri"),
    name: text("name").default("").notNull(),
    email: text("email"),
    phone: text("phone"),
    created_at: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updated_at: timestamp("updatedAt", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      provider_idx: index("provider_idx").on(table.auth_provider_id),
    };
  },
);

export const usersRelations = relations(user, ({ many, one }) => ({
  creates_invite: many(invite_code, {
    relationName: "creates_invite",
  }),
  uses_invite: many(invite_code, {
    relationName: "uses_invite",
  }),
  stripe_customer: one(stripe_customer, {
    fields: [user.user_id],
    references: [stripe_customer.user_id],
  }),
}));
