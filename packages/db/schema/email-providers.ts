// refresh tokens

import { sql } from "drizzle-orm";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { providerEnumList } from "@skylar/parsers-and-types";

import { users } from "./users";

export const providerEnum = pgEnum("providers", providerEnumList);

// token length: https://developers.google.com/identity/protocols/oauth2#:~:text=to%20service%20accounts.-,Token%20size,Refresh%20tokens%3A%20512%20bytes
export const emailProviderOAuth = pgTable("emailProviderOAuth", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  refreshToken: varchar("refreshToken", { length: 512 }).notNull(),
  provider: text("providers", {
    enum: providerEnumList,
  }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
});

export const emailProviderDetails = pgTable("emailProviderDetails", {
  id: serial("id"),
  emailProviderOAuthId: integer("emailProviderOAuthId").references(
    () => emailProviderOAuth.id,
  ),
  inboxName: varchar("inboxName", { length: 255 }).notNull(),
  categorizedAt: timestamp("categorizedAt", {
    withTimezone: true,
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  lastCheckedHistoryId: varchar("lastCheckedHistoryId", {
    length: 512,
  }).notNull(),
});
