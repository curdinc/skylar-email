import { and, eq, isNull } from "drizzle-orm";

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
    where: and(eq(schema.user.authProviderId, userObj.authProviderId)),
    with: {
      createdInviteCode: {
        with: {
          usedByUser: {
            columns: {
              email: true,
            },
          },
        },
        where: isNull(schema.inviteCode.deletedAt),
        orderBy(fields, { desc }) {
          return desc(fields.createdAt);
        },
      },
    },
  });
  return result?.createdInviteCode;
}
