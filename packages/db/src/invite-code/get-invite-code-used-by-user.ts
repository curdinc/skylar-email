import { eq } from "drizzle-orm";

import type { UserType } from "@skylar/parsers-and-types";

import type { DbType } from "../..";
import { schema } from "../..";

export async function getInviteCodeUsedByUser({
  db,
  userObj,
}: {
  db: DbType;
  userObj: UserType;
}) {
  const result = await db.query.user.findFirst({
    columns: {},
    where: eq(schema.user.authProviderId, userObj.authProviderId),
    with: {
      usedInviteCode: {
        columns: {
          inviteCode: true,
        },
      },
    },
  });

  if (!result) {
    throw new Error("Valid invite code used-by not found");
  }
  return result.usedInviteCode?.inviteCode;
}
