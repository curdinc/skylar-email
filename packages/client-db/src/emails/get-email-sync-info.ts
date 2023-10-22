import type { ClientDb } from "../db";

export async function getEmailSyncInfo({
  db,
  emailAddress,
}: {
  db: ClientDb;
  emailAddress: string;
}) {
  const syncInfo = await db.sync.get(emailAddress);
  return syncInfo;
}
