import type { UserType } from "@skylar/parsers-and-types";

import type { DbType } from "../../index";
import { schema } from "../../index";

export async function insertNewUser({
  db,
  newUser,
}: {
  db: DbType;
  newUser: UserType;
}) {
  const result = await db
    .insert(schema.user)
    .values({
      authProvider: newUser.authProvider,
      authProviderId: newUser.authProviderId,
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      image_uri: newUser.imageUri,
    })
    .returning({ id: schema.user.userId });
  return { id: result[0]?.id };
}
