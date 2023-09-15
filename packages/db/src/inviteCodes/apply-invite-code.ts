import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { inviteCode } from "../../schema/invite-code";
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
    .update(inviteCode)
    .set({
      usedAt: new Date(),
      usedByUserId,
    })
    .where(eq(inviteCode.inviteCode, validInviteCode.inviteCode));
}
