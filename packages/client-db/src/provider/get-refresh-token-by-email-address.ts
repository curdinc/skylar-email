import { clientDb } from "../db";

export async function getRefreshTokenByEmailAddress({
  emailAddress,
}: {
  emailAddress: string;
}) {
  const refreshToken = (await clientDb.provider.get({ email: emailAddress }))
    ?.refresh_token;
  if (!refreshToken)
    throw new Error(
      `No refresh token found in the clientDb for ${emailAddress}`,
    );
  return refreshToken;
}