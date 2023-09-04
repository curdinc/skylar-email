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

const sql = neon(
  "postgres://curdcorp:Tfr9O3AIlcKt@ep-broken-bonus-09091505.us-west-2.aws.neon.tech/neondb?sslmode=require",
); //process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
