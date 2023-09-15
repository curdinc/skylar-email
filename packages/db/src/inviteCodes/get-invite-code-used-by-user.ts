import { eq } from "drizzle-orm";

import type { UserType } from "@skylar/parsers-and-types";

import type { DbType } from "../..";
import { inviteCode } from "../../schema/invite-code";
import { user } from "../../schema/user";

export async function getInviteCodeUsedByUser({
  db,
  userObj,
}: {
  db: DbType;
  userObj: UserType;
}) {
  const result = await db.query.user.findFirst({
    columns: {},
    where: eq(user.providerId, userObj.providerId),
    with: {
      inviteCodeCreated: {
        where: eq(inviteCode.usedByUserId, user.id),
        columns: {
          inviteCode: true,
        },
      },
    },
  });
  return result?.inviteCodeCreated[0]?.inviteCode;
}
