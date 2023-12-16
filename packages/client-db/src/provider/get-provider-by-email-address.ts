import { clientDb } from "../db";

export async function getProviderByEmailAddress({
  emailAddress,
}: {
  emailAddress: string;
}) {
  return clientDb.provider.get({ user_email_address: emailAddress });
}
