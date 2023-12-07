import { clientDb } from "../db";

export async function getRefreshTokenByEmail({
  emailAddress,
}: {
  emailAddress: string;
}) {
  return (await clientDb.provider.get({ email: emailAddress }))?.refresh_token;
}
