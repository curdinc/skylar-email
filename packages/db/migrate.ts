// migrate.ts
import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

dotenv.config({
  path: "../../.env",
});

const databaseUrl = drizzle(
  postgres(`${process.env.DATABASE_URL}`, { ssl: "require", max: 1 }),
);

const main = async () => {
  try {
    await migrate(databaseUrl, { migrationsFolder: "migrations" });
    console.log("Migration complete");
  } catch (error) {
    console.log(error);
  }
  process.exit(0);
};

main();
