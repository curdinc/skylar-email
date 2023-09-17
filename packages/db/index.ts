import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as emailProviderDetail from "./schema/email-provider-detail";
import * as gmailProvider from "./schema/email-providers";
import * as gmailEmailDetail from "./schema/gmail-email-detail";
import * as inviteCode from "./schema/invite-code";
import * as stripeCustomer from "./schema/stripe";
import * as user from "./schema/user";
import * as whitelistedContact from "./schema/whitelisted-contact";

export { and, eq } from "drizzle-orm";

// ! Note that you have to import everything including the relation in order for the db object to infer the correct types
export const schema = {
  ...gmailProvider,
  ...emailProviderDetail,
  ...gmailEmailDetail,
  ...whitelistedContact,
  ...inviteCode,
  ...stripeCustomer,
  ...user,
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
