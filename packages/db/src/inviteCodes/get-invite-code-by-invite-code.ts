import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { inviteCode } from "../../schema/invite-code";

export async function getInviteCodeByInviteCode({
  db,
  inviteCodeToFind,
}: {
  db: DbType;
  inviteCodeToFind: string;
}) {
  const result = await db.query.inviteCode.findFirst({
    where: eq(inviteCode.inviteCode, inviteCodeToFind),
    with: {
      usedByUser: {
        columns: {
          id: true,
          providerId: true,
        },
      },
    },
  });
  return result;
}

export async function getValidInviteCodeByInviteCode({
  db,
  inviteCodeToFind,
}: {
  db: DbType;
  inviteCodeToFind: string;
}) {
  const inviteCodeFound = await getInviteCodeByInviteCode({
    db,
    inviteCodeToFind,
  });
  if (
    !inviteCodeFound ||
    (!!inviteCodeFound?.usedAt && !!inviteCodeFound.usedByUserId)
  ) {
    throw new Error("Valid invite code not found");
  }
  return inviteCodeFound;
}
