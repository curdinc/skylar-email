import { clientDb } from "../db";

export async function getRefreshTokenDetailsByEmailAddress({
  emailAddress,
}: {
  emailAddress: string;
}) {
  const providerInfo = await clientDb.provider.get({
    user_email_address: emailAddress,
  });
  if (!providerInfo) throw new Error(`Provider ${emailAddress} not found`);

  const { refresh_token, access_token, access_token_expires_at } = providerInfo;
  return {
    refresh_token,
    access_token,
    access_token_expires_at,
  };
}
