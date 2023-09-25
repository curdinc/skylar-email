import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { SUPPORTED_EMAIL_PROVIDER_LIST } from "@skylar/parsers-and-types";

import { categorizedContact } from "./categorized_contact";
import { gmailEmailDetail } from "./providers/gmail/email-detail";
import { gmailProvider } from "./providers/gmail/provider";
import { user } from "./user";

export const providerEnum = pgEnum(
  "email_provider",
  SUPPORTED_EMAIL_PROVIDER_LIST,
);

export const emailProviderDetail = pgTable("email_provider_detail", {
  emailProviderDetailId: serial("email_provider_detail_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.userId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  emailProvider: text("email_provider", {
    enum: SUPPORTED_EMAIL_PROVIDER_LIST,
  }).notNull(),
  email: text("email").notNull(),
  inboxName: text("inbox_name").notNull(),
  imageUri: text("image_uri"),
  createdAt: timestamp("created_at", {
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
});

export const emailProviderDetailRelations = relations(
  emailProviderDetail,
  ({ many, one }) => ({
    user: one(user, {
      fields: [emailProviderDetail.userId],
      references: [user.userId],
    }),
    gmailProvider: one(gmailProvider, {
      fields: [emailProviderDetail.emailProviderDetailId],
      references: [gmailProvider.emailProviderDetailId],
    }),
    gmailEmailDetails: many(gmailEmailDetail),
    categorizedContact: many(categorizedContact),
  }),
);
