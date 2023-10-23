import { clientDb } from "../db";

export async function getEmailSyncInfo({
  emailAddress,
}: {
  emailAddress: string;
}) {
  const syncInfo = await clientDb.sync.get(emailAddress);
  return syncInfo;
}
