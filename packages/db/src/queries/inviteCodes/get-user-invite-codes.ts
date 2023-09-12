import { eq } from "drizzle-orm";

import type { UserType } from "@skylar/schema";

import type { DbType } from "../../..";
import { inviteCode } from "../../../schema/invite-code";
import { user } from "../../../schema/user";

export async function getUserInviteCodes({
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
      inviteCode: {
        where: eq(inviteCode.createdByUserId, user.id),
        with: {
          usedByUser: {
            columns: {
              email: true,
            },
          },
        },
      },
    },
  });
  return result?.inviteCode;
}
