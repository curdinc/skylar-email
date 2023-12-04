import { relations, sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

import { SUPPORTED_EMAIL_CATEGORIES } from "@skylar/parsers-and-types";

import { emailProviderDetail } from "./email-provider-detail";

export const categorizedContact = pgTable("categorized_contact", {
  categorizedContactId: serial("categorized_contact_id").primaryKey(),
  emailProviderDetailId: integer("email_provider_detail_id")
    .notNull()
    .references(() => emailProviderDetail.emailProviderDetailId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  email: text("email"),
  category: text("category", {
    enum: SUPPORTED_EMAIL_CATEGORIES,
  }).notNull(),
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

export const categorizedContactRelations = relations(
  categorizedContact,
  ({ one }) => ({
    emailProviderDetail: one(emailProviderDetail, {
      fields: [categorizedContact.categorizedContactId],
      references: [emailProviderDetail.emailProviderDetailId],
    }),
  }),
);
