import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { user } from "../../schema/user";

export async function getUserByProviderId({
  db,
  authProviderId,
}: {
  db: DbType;
  authProviderId: string;
}) {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.auth_provider_id, authProviderId),
  });
  return foundUser;
}

export async function getValidUserByProviderId({
  db,
  authProviderId,
}: {
  db: DbType;
  authProviderId: string;
}) {
  const foundUser = await getUserByProviderId({ db, authProviderId });
  if (!foundUser) {
    throw new Error("User not found");
  }
  return foundUser;
}
