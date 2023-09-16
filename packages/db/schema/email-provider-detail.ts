import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { providerEnumList } from "@skylar/parsers-and-types";

import { email_detail } from "./message-category";
import { sender_category } from "./sender-category";
import { user } from "./user";

export const providerEnum = pgEnum("email_provider", providerEnumList);

export const email_provider_detail = pgTable("email_provider_detail", {
  email_provider_detail_id: serial("email_provider_detail_id").primaryKey(),
  user_id: integer("user_id").references(() => user.user_id),
  email_provider: text("email_provider", {
    enum: providerEnumList,
  }).notNull(),
  email: text("email").notNull(),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  updated_at: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const emailProviderDetailRelations = relations(
  email_provider_detail,
  ({ one }) => ({
    sender_category: one(sender_category, {
      references: [sender_category.email_provider_detail_id],
      fields: [email_provider_detail.email_provider_detail_id],
    }),
    message_category: one(email_detail, {
      references: [email_detail.email_provider_detail_id],
      fields: [email_provider_detail.email_provider_detail_id],
    }),
  }),
);
