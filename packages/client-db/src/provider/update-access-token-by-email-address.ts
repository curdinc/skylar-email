import { clientDb } from "../db";
import { ACCESS_TOKEN_EXPIRY_MILLIS } from "./constants";

export async function updateAccessTokenByEmailAddress({
  emailAddress,
  accessToken,
}: {
  emailAddress: string;
  accessToken: string;
}) {
  const providerInfo = await clientDb.provider.get({
    user_email_address: emailAddress,
  });
  if (!providerInfo) throw new Error(`Provider ${emailAddress} not found`);
  await clientDb.provider.update(providerInfo.provider_id!.toString(), {
    access_token: accessToken,
    access_token_expires_at: Date.now() + ACCESS_TOKEN_EXPIRY_MILLIS,
  });
}
