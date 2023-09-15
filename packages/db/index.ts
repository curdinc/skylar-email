import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as providerAuthDetails from "./schema/emailProviders";
import * as inviteCode from "./schema/invite-code";
import * as user from "./schema/user";

export { and, eq } from "drizzle-orm";

export const schema = { ...providerAuthDetails, ...user, ...inviteCode };

export function getDb(dbConnectionString: string) {
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dbConnectionString);
  const db = drizzle(sql, { schema });
  return db;
}

export type DbType = ReturnType<typeof getDb>;

export * from "./src/mutations/apply-invite-code";
export * from "./src/mutations/insert-new-user";

export * from "./src/queries/auth/get-user-by-provider-id";
export * from "./src/queries/inviteCodes/get-invite-code-by-invite-code";
export * from "./src/queries/inviteCodes/get-invite-code-used-by-user";
export * from "./src/queries/inviteCodes/get-user-invite-codes";
