import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as inviteCode from "./schema/invite-code";
import * as stripe from "./schema/stripe";
import * as user from "./schema/user";

export const schema = { ...user, ...inviteCode, ...stripe };

export function getDb(dbConnectionString: string) {
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dbConnectionString);
  const db = drizzle(sql, { schema });
  return db;
}

export type DbType = ReturnType<typeof getDb>;

export * from "./src/auth/get-user-by-provider-id";
export * from "./src/auth/insert-new-user";

export * from "./src/inviteCodes/apply-invite-code";
export * from "./src/inviteCodes/get-invite-code-by-invite-code";
export * from "./src/inviteCodes/get-invite-code-used-by-user";
export * from "./src/inviteCodes/get-user-invite-codes";

export * from "./src/stripe/get-stripe-customer-by-user-id";
export * from "./src/stripe/insert-stripe-customer";
export * from "./src/stripe/update-stripe-customer";
