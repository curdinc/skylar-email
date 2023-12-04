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
    .update(schema.inviteCode)
    .set({
      usedAt: new Date(),
      usedBy: usedByUserId,
    })
    .where(eq(schema.inviteCode, validInviteCode.inviteCode));
}
