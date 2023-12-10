import type { DbType } from "../..";
import { schema } from "../..";

export async function createInviteCode({
  db,
  inviteCode,
}: {
  db: DbType;
  inviteCode: string;
}) {
  return db.insert(schema.inviteCode).values({ inviteCode }).returning({
    inviteCode: schema.inviteCode.inviteCode,
    inviteCodeId: schema.inviteCode.inviteCodeId,
  });
}
