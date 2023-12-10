import type { DbType } from "../..";
import { and, eq, schema } from "../..";

export async function getGmailRefreshToken({
  db,
  userId,
  email,
}: {
  db: DbType;
  userId: number;
  email: string;
}) {
  const response = await db.query.emailProviderDetail.findFirst({
    where: and(
      eq(schema.user.userId, userId),
      eq(schema.emailProviderDetail.email, email),
    ),
    with: {
      gmailProvider: {
        columns: {
          refreshToken: true,
        },
      },
    },
    columns: {},
  });

  if (!response?.gmailProvider.refreshToken) {
    throw new Error("Error fetching refresh token.");
  }

  return response.gmailProvider.refreshToken;
}
