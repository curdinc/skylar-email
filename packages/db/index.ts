import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as providerAuthDetails from "./schema/emailProviders";
import * as users from "./schema/users";

export { and, eq } from "drizzle-orm";

export const schema = { ...providerAuthDetails, ...users };

export function getDb(dbConnectionString: string) {
  neonConfig.fetchConnectionCache = true;
  const sql = neon(dbConnectionString);
  const db = drizzle(sql, { schema });
  return db;
}

export type DbType = ReturnType<typeof getDb>;
