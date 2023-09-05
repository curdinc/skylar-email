import { neon, neonConfig } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";

import * as providerAuthDetails from "./schema/emailProviders";
import * as users from "./schema/users";

dotenv.config({
  path: "../../.env",
});

export const schema = { ...providerAuthDetails, ...users };

neonConfig.fetchConnectionCache = true;

const sql = neon("process.env.DATABASE_URL");
export const db = drizzle(sql, { schema });
export type dbType = typeof db;
