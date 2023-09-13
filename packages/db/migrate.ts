// migrate.ts
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

dotenv.config({
  path: "../../apps/backend/.dev.vars",
});

const databaseUrl = drizzle(
  postgres(`${process.env.DATABASE_URL}`, { ssl: "require", max: 1 }),
);

const main = async () => {
  return migrate(databaseUrl, { migrationsFolder: "migrations" });
};

main()
  .then(() => {
    console.log("Migration complete");
    process.exit(0);
  })
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
