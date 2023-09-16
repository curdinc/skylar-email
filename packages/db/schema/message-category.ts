import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import { SUPPORTED_EMAIL_CATEGORIES } from "@skylar/parsers-and-types";

import { email_provider_detail } from "./email-provider-detail";

export const email_detail = pgTable("email_detail", {
  email_detail_id: serial("message_detail_id").primaryKey(),
  email_provider_detail_id: integer("email_provider_detail_id").references(
    () => email_provider_detail.emailProviderDetailId,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  ),
  message_id: text("message_id"),
  category: text("category", {
    enum: SUPPORTED_EMAIL_CATEGORIES,
  }).notNull(),
});

export const messageCategoryRelations = relations(email_detail, ({ one }) => ({
  email_provider_detail: one(email_provider_detail, {
    fields: [email_detail.email_provider_detail_id],
    references: [email_provider_detail.emailProviderDetailId],
  }),
}));
