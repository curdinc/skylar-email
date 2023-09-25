import type { EmailSyncInfoType } from "../../schema/sync";
import { DEFAULT_EMAIL_SYNC_INFO_ID } from "../../schema/sync";
import type { ClientDb } from "../db";

export async function upsertEmailSyncInfo({
  db,
  emailSyncInfo,
}: {
  db: ClientDb;
  emailSyncInfo: Omit<EmailSyncInfoType, "email_sync_info_id">;
}) {
  const emailSyncInfoStore = await db.sync.put({
    ...emailSyncInfo,
    email_sync_info_id: DEFAULT_EMAIL_SYNC_INFO_ID,
  });
  console.log("emailSyncInfoStore", emailSyncInfoStore);
}
