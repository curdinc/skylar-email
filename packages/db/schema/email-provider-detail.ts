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

import { gmailEmailDetail } from "./email-details";
import { gmailProvider } from "./email-providers";
import { user } from "./user";
import { whitelistedContact } from "./whitelisted-contact";

export const providerEnum = pgEnum("email_provider", providerEnumList);

export const emailProviderDetail = pgTable("email_provider_detail", {
  emailProviderDetailId: serial("email_provider_detail_id").primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => user.userId),
  emailProvider: text("email_provider", {
    enum: providerEnumList,
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
    whitelistedContacts: many(whitelistedContact),
  }),
);
