import type { DbType } from "../..";
import { eq, schema } from "../..";

export async function getEmailProvidersByUserId({
  db,
  userId,
}: {
  db: DbType;
  userId: number;
}) {
  const emailProviders = await db.query.emailProviderDetail.findMany({
    where: eq(schema.user.userId, userId),
  });

  return emailProviders;
}
