import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Do not use defaultNow, it's to be deprecated https://github.com/drizzle-team/drizzle-orm/issues/657
export const mailingList = pgTable("mailing_list", {
  mailingListId: serial("mailing_list_id").primaryKey(),
  email: text("email").unique(),
  created_at: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
