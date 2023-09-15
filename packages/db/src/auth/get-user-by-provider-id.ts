import { eq } from "drizzle-orm";

import type { DbType } from "../..";
import { user } from "../../schema/user";

export async function getUserByProviderId({
  db,
  providerId,
}: {
  db: DbType;
  providerId: string;
}) {
  const foundUser = await db.query.user.findFirst({
    where: eq(user.providerId, providerId),
  });
  return foundUser;
}

export async function getValidUserByProviderId({
  db,
  providerId,
}: {
  db: DbType;
  providerId: string;
}) {
  const foundUser = await getUserByProviderId({ db, providerId });
  if (!foundUser) {
    throw new Error("User not found");
  }
  return foundUser;
}
