import { getRefreshTokenDetailsByEmailAddress } from "@skylar/client-db";

// FIXME: this is a hack to get around the fact that we don't have a way to
// hit the backend router yet to do the code exchange
export async function getAccessToken(emailAddress: string) {
  const providerDetails = await getRefreshTokenDetailsByEmailAddress({
    emailAddress,
  });
  if (!providerDetails) {
    throw new Error(`Provider ${emailAddress} not found`);
  }

  return providerDetails.access_token;
}
