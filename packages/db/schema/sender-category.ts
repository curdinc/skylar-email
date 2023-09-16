import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";

import "drizzle-orm/mysql-core";

import { relations } from "drizzle-orm";

import { SUPPORTED_EMAIL_CATEGORIES } from "@skylar/parsers-and-types";

import { email_provider_detail } from "./email-provider-detail";

export const sender_category = pgTable("sender_category", {
  sender_category_id: serial("sender_category_id").primaryKey(),
  email_provider_detail_id: integer("email_provider_detail_id").references(
    () => email_provider_detail.email_provider_detail_id,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  ),
  email: text("email"),
  category: text("category", {
    enum: SUPPORTED_EMAIL_CATEGORIES,
  }).notNull(),
});

export const senderCategoryRelations = relations(
  sender_category,
  ({ one }) => ({
    email_provider_detail: one(email_provider_detail, {
      fields: [sender_category.email_provider_detail_id],
      references: [email_provider_detail.email_provider_detail_id],
    }),
  }),
);
