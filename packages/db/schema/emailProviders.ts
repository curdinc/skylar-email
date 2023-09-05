// refresh tokens

import {
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  varchar,
} from "drizzle-orm/pg-core";

import { providerEnumList } from "@skylar/schema";

import { users } from "./users";

export const providerEnum = pgEnum("providers", providerEnumList);

// token length: https://developers.google.com/identity/protocols/oauth2#:~:text=to%20service%20accounts.-,Token%20size,Refresh%20tokens%3A%20512%20bytes
export const providerAuthDetails = pgTable(
  "providerAuthDetails",
  {
    userId: integer("user_id").references(() => users.id),
    refreshToken: varchar("refreshToken", { length: 512 }).notNull(),
    provider: providerEnum("providers").notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    name: varchar("name", { length: 800 }),
    lastCheckedHistoryId: varchar("lastCheckedHistoryId", {
      length: 100,
    }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.userId, table.provider, table.email),
    };
  },
);
