import { eq } from "drizzle-orm";

import type { UserType } from "@skylar/parsers-and-types";

import type { DbType } from "../..";
import { schema } from "../..";

export async function getUserInviteCodes({
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
  return result?.inviteCodeCreated;
}
