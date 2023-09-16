import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { schema } from "../..";
import { getValidInviteCodeByInviteCode } from "./get-invite-code-by-invite-code";

export async function applyInviteCode({
  db,
  inviteCodeToUse,
  usedByUserId,
}: {
  db: DbType;
  inviteCodeToUse: string;
  usedByUserId: number;
}) {
  const validInviteCode = await getValidInviteCodeByInviteCode({
    db,
    inviteCodeToFind: inviteCodeToUse,
  });

  await db
    .update(schema.invite_code)
    .set({
      used_at: new Date(),
      used_by: usedByUserId,
    })
    .where(eq(schema.invite_code, validInviteCode.invite_code));
}
