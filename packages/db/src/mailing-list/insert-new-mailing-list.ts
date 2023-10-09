import type { DbType } from "../..";
import { mailingList } from "../../schema/mailing-list";

export async function insertNewMailingList({
  db,
  email,
}: {
  db: DbType;
  email: string;
}) {
  const result = await db
    .insert(mailingList)
    .values({
      email,
    })
    .onConflictDoNothing()
    .returning();
  return result[0];
}
