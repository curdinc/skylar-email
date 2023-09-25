import type { DbType } from "../..";
import { schema } from "../..";
import type { emailProviderDetail } from "../../schema/email-provider-detail";

type InsertEmailProviderDetailInput =
  (typeof emailProviderDetail)["$inferInsert"];

export async function insertEmailProviderDetail({
  db,
  input,
}: {
  db: DbType;
  input: InsertEmailProviderDetailInput;
}) {
  const result = await db
    .insert(schema.emailProviderDetail)
    .values({
      ...input,
    })
    .onConflictDoNothing()
    .returning();
  return result[0];
}
