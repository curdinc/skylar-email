import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { schema } from "../..";

export async function getInviteCodeByInviteCode({
  db,
  inviteCodeToFind,
}: {
  db: DbType;
  inviteCodeToFind: string;
}) {
  const result = await db.query.invite_code.findFirst({
    where: eq(schema.invite_code.invite_code, inviteCodeToFind),
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
    (!!inviteCodeFound?.used_at && !!inviteCodeFound.used_by)
  ) {
    throw new Error("Valid invite code not found");
  }
  return inviteCodeFound;
}
