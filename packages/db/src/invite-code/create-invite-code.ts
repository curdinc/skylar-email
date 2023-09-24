import type { DbType } from "../..";
import { schema } from "../..";

export async function createInviteCode({
  db,
  userId,
  inviteCode,
}: {
  db: DbType;
  userId: number;
  inviteCode: string;
}) {
  return db
    .insert(schema.inviteCode)
    .values({ createdBy: userId, inviteCode })
    .returning({
      inviteCode: schema.inviteCode.inviteCode,
      inviteCodeId: schema.inviteCode.inviteCodeId,
    });
}
