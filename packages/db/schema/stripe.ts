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

export const stripe_customer = pgTable(
  "stripe_customer",
  {
    stripe_customer_id: serial("stripe_customer_id").primaryKey(),
    user_id: integer("user_id")
      .references(() => user.user_id)
      .unique()
      .notNull(),
    customer_id: varchar("customer_id", { length: 255 }).notNull().unique(),
    subscription_id: varchar("subscription_id", { length: 255 }),
    payment_method_added_at: timestamp("payment_method_added_at", {
      withTimezone: true,
      mode: "date",
    }),
    created_at: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      user_id_idx: index("user_id_idx").on(table.user_id),
      customer_id_idx: index("customer_id_idx").on(table.customer_id),
    };
  },
);

export const stripeCustomersRelations = relations(
  stripe_customer,
  ({ one }) => ({
    user: one(user, {
      fields: [stripe_customer.user_id],
      references: [user.user_id],
    }),
  }),
);
