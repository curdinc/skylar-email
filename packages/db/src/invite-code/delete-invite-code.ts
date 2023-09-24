import type { DbType } from "../..";
import { eq, schema } from "../..";

export async function deleteInviteCode({
  db,
  inviteCodeId,
}: {
  db: DbType;
  inviteCodeId: number;
}) {
  await db
    .update(schema.inviteCode)
    .set({
      deletedAt: new Date(),
    })
    .where(eq(schema.inviteCode.inviteCodeId, inviteCodeId));
}
