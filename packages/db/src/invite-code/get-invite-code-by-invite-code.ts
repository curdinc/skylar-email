import { and, eq, isNull } from "drizzle-orm";

import type { DbType } from "../..";
import { schema } from "../..";

export async function getInviteCodeByInviteCode({
  db,
  inviteCodeToFind,
}: {
  db: DbType;
  inviteCodeToFind: string;
}) {
  const result = await db.query.inviteCode.findFirst({
    where: and(
      eq(schema.inviteCode.inviteCode, inviteCodeToFind),
      isNull(schema.inviteCode.deletedAt),
    ),
    with: {
      usedByUser: {
        columns: {
          userId: true,
          authProviderId: true,
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
  if (!inviteCodeFound || !!inviteCodeFound?.usedAt) {
    throw new Error("Valid invite code not found");
  }
  return inviteCodeFound;
}
