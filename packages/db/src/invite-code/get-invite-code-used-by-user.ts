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
    where: eq(schema.user.auth_provider_id, userObj.providerId),
    with: {
      inviteCodeCreated: {
        where: eq(schema.invite_code.used_by, schema.user.user_id),
        columns: {
          inviteCode: true,
        },
      },
    },
  });
  return result?.inviteCodeCreated[0].inviteCodeCreated;
}
