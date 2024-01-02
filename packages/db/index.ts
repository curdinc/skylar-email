import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as inviteCode from "./schema/invite-code";
import * as mailingList from "./schema/mailing-list";

export { and, eq } from "drizzle-orm";

// ! Note that you have to import everything including the relation in order for the db object to infer the correct types
export const schema = {
  ...inviteCode,
  ...mailingList,
};

export function getDb(dbConnectionString: string) {
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dbConnectionString);
  const db = drizzle(sql, { schema });
  return db;
}

export type DbType = ReturnType<typeof getDb>;

export * from "./src/invite-code/apply-invite-code";
export * from "./src/invite-code/create-invite-code";
export * from "./src/invite-code/delete-invite-code";
export * from "./src/invite-code/get-invite-code-by-invite-code";

export * from "./src/mailing-list/insert-new-mailing-list";
