import { DEFAULT_EMAIL_SYNC_INFO_ID } from "../../schema/sync";
import type { ClientDb } from "../db";

export async function getEmailSyncInfo({ db }: { db: ClientDb }) {
  const syncInfo = await db.sync.get(DEFAULT_EMAIL_SYNC_INFO_ID);
  return syncInfo;
}
