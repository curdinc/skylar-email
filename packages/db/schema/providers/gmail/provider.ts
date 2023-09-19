import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { emailProviderDetail } from "../../email-provider-detail";

// token length: https://developers.google.com/identity/protocols/oauth2#:~:text=to%20service%20accounts.-,Token%20size,Refresh%20tokens%3A%20512%20bytes
export const gmailProvider = pgTable("gmail_provider", {
  gmailProviderId: serial("gmail_provider_id").primaryKey(),
  emailProviderDetailId: integer("email_provider_detail_id")
    .unique()
    .notNull()
    .references(() => emailProviderDetail.emailProviderDetailId, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  refreshToken: varchar("refresh_token", { length: 512 }).notNull(),
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

export const gmailProviderRelations = relations(gmailProvider, ({ one }) => ({
  emailProviderDetail: one(emailProviderDetail, {
    fields: [gmailProvider.emailProviderDetailId],
    references: [emailProviderDetail.emailProviderDetailId],
  }),
}));
