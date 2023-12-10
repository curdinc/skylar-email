import { relations, sql } from "drizzle-orm";
import { index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { SUPPORTED_AUTH_PROVIDERS } from "@skylar/parsers-and-types";

import { inviteCode } from "./invite-code";
import { stripeCustomer } from "./stripe";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const user = pgTable(
  "user",
  {
    userId: serial("user_id").primaryKey(),
    authProviderId: text("auth_provider_id").notNull().unique(),
    authProvider: text("auth_provider", {
      enum: SUPPORTED_AUTH_PROVIDERS,
    }).notNull(),
    image_uri: text("image_uri"),
    name: text("name").default("").notNull(),
    email: text("email"),
    phone: text("phone"),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      providerIdx: index("provider_idx").on(table.authProviderId),
    };
  },
);

export const userRelations = relations(user, ({ many, one }) => ({
  createdInviteCode: many(inviteCode, {
    relationName: "created_invite_code",
  }),
  usedInviteCode: one(inviteCode, {
    fields: [user.userId],
    references: [inviteCode.usedBy],
    relationName: "used_invite_code",
  }),
  stripeCustomer: one(stripeCustomer, {
    fields: [user.userId],
    references: [stripeCustomer.userId],
  }),
}));
