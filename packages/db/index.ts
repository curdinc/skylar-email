import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { email_provider_detail } from "./schema/email-provider-detail";
import { gmail_provider } from "./schema/email-provider-tables";
import { invite_code } from "./schema/invite-code";
import { email_detail } from "./schema/message-category";
import { sender_category } from "./schema/sender-category";
import { stripe_customer } from "./schema/stripe";
import { user } from "./schema/user";

export { and, eq } from "drizzle-orm";

export const schema = {
  gmail_provider,
  email_provider_detail,
  message_category: email_detail,
  sender_category,
  invite_code,
  stripe_customer,
  user,
};

export function getDb(dbConnectionString: string) {
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dbConnectionString);
  const db = drizzle(sql, { schema });
  return db;
}

export type DbType = ReturnType<typeof getDb>;

export * from "./src/auth/get-user-by-provider-id";
export * from "./src/auth/insert-new-user";

export * from "./src/invite-code/apply-invite-code";
export * from "./src/invite-code/get-invite-code-by-invite-code";
export * from "./src/invite-code/get-invite-code-used-by-user";
export * from "./src/invite-code/get-user-invite-codes";

export * from "./src/stripe/get-stripe-customer-by-user-id";
export * from "./src/stripe/insert-stripe-customer";
export * from "./src/stripe/update-stripe-customer";
