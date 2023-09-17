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
  "stripe_customer",
  {
    stripeCustomerId: serial("stripe_customer_id").primaryKey(),
    userId: integer("user_id")
      .references(() => user.userId, {
        onDelete: "cascade",
        onUpdate: "cascade",
      })
      .unique()
      .notNull(),
    customerId: varchar("customer_id", { length: 255 }).notNull().unique(),
    subscriptionId: varchar("subscription_id", { length: 255 }),
    paymentMethodAddedAt: timestamp("payment_method_added_at", {
      withTimezone: true,
      mode: "date",
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      userIdIdx: index("user_id_idx").on(table.userId),
      customerIdIdx: index("customer_id_idx").on(table.customerId),
    };
  },
);

export const stripeCustomerRelations = relations(stripeCustomer, ({ one }) => ({
  user: one(user, {
    fields: [stripeCustomer.userId],
    references: [user.userId],
  }),
}));
