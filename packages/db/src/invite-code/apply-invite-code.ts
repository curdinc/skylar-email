import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { schema } from "../..";
import { getValidInviteCodeByInviteCode } from "./get-invite-code-by-invite-code";

export async function applyInviteCode({
  db,
  inviteCodeToUse,
}: {
  db: DbType;
  inviteCodeToUse: string;
}) {
  const validInviteCode = await getValidInviteCodeByInviteCode({
    db,
    inviteCodeToFind: inviteCodeToUse,
  });

  await db
    .update(schema.inviteCode)
    .set({
      usedAt: new Date(),
    })
    .where(eq(schema.inviteCode, validInviteCode.inviteCode));
}
