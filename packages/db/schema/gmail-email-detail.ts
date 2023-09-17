import { relations, sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { SUPPORTED_EMAIL_CATEGORIES } from "@skylar/parsers-and-types";

import { emailProviderDetail } from "./email-provider-detail";

export const gmailEmailDetail = pgTable("gmail_email_detail", {
  gmailEmailDetailId: serial("gmail_email_detail_id").primaryKey(),
  emailProviderDetailId: integer("email_provider_detail_id")
    .unique()
    .notNull()
    .references(() => emailProviderDetail.emailProviderDetailId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  gmailMessageId: text("gmail_message_id"),
  emailMessageId: text("email_message_id"),
  threadId: text("thread_id"),
  category: text("category", {
    enum: SUPPORTED_EMAIL_CATEGORIES,
  }).notNull(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const gmailEmailDetailRelations = relations(
  gmailEmailDetail,
  ({ one }) => ({
    emailProviderDetail: one(emailProviderDetail, {
      fields: [gmailEmailDetail.emailProviderDetailId],
      references: [emailProviderDetail.emailProviderDetailId],
    }),
  }),
);
