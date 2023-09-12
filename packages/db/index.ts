import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as example from "./schema/example";
import { inviteCode } from "./schema/invite-code";
import { user } from "./schema/user";

export const schema = { ...example, user, inviteCode };

export function getDb(dbConnectionString: string) {
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dbConnectionString);
  const db = drizzle(sql, { schema });
  return db;
}

export type DbType = ReturnType<typeof getDb>;
