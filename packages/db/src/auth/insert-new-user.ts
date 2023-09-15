import type { UserType } from "@skylar/schema";

import type { DbType } from "../../index";
import { user } from "../../schema/user";

export async function insertNewUser({
  db,
  newUser,
}: {
  db: DbType;
  newUser: UserType;
}) {
  const result = await db
    .insert(user)
    .values({
      provider: newUser.provider,
      providerId: newUser.providerId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      imageUri: newUser.imageUri,
    })
    .returning({ id: user.id });
  console.log("new user inserted", JSON.stringify(result, null, 2));
  return { id: result[0]?.id };
}
