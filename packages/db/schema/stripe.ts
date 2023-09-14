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
    customerId: varchar("customerId", { length: 255 }).notNull(),
    subscriptionId: varchar("subscriptionId", { length: 255 }),
    createdAt: timestamp("createdAt", {
      withTimezone: true,
      mode: "date",
    })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      userIdx: index("userIdx").on(table.userId),
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
