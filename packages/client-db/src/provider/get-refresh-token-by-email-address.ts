import { clientDb } from "../db";

export async function getRefreshTokenByEmailAddress({
  emailAddress,
}: {
  emailAddress: string;
}) {
  const providerInfo = await clientDb.provider.get({
    user_email_address: emailAddress,
  });
  if (!providerInfo) throw new Error(`Provider ${emailAddress} not found`);

  const { refresh_token } = providerInfo;
  return refresh_token;
}
