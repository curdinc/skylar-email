import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { user } from "./user";

export const stripeCustomer = pgTable(
  "stripeCustomer",
  {
    id: serial("id").primaryKey(),
    userId: integer("userId")
      .references(() => user.id)
      .unique()
      .notNull(),
    customerId: varchar("customerId", { length: 255 }).notNull().unique(),
    subscriptionId: varchar("subscriptionId", { length: 255 }),
    payment_method_added_at: timestamp("payment_method_added_at", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("userIdIdx").on(table.userId),
      customerIdIdx: index("customerIdIdx").on(table.customerId),
    };
  },
);

export const stripeCustomersRelations = relations(
  stripeCustomer,
  ({ one }) => ({
    user: one(user, {
      fields: [stripeCustomer.userId],
      references: [user.id],
    }),
  }),
);
