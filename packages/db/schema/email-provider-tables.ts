import { relations } from "drizzle-orm";
import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { email_provider_detail } from "./email-provider-detail";

// token length: https://developers.google.com/identity/protocols/oauth2#:~:text=to%20service%20accounts.-,Token%20size,Refresh%20tokens%3A%20512%20bytes
export const gmail_provider = pgTable("gmail_provider", {
  gmail_provider_id: serial("gmail_provider_id").primaryKey(),
  email_provider_detail_id: integer("email_provider_detail_id").references(
    () => email_provider_detail.emailProviderDetailId,
    {
      onDelete: "cascade",
      onUpdate: "cascade",
    },
  ),
  refresh_token: varchar("refresh_token", { length: 512 }).notNull(),
});

export const gmailProviderRelations = relations(gmail_provider, ({ one }) => ({
  email_provider_detail: one(email_provider_detail, {
    fields: [gmail_provider.email_provider_detail_id],
    references: [email_provider_detail.emailProviderDetailId],
  }),
}));
