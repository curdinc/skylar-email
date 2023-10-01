import type { EmailSyncInfoType } from "../../schema/sync";
import { DEFAULT_EMAIL_SYNC_INFO_ID } from "../../schema/sync";
import type { ClientDb } from "../db";

export async function updateEmailSyncInfo({
  db,
  emailSyncInfo,
}: {
  db: ClientDb;
  emailSyncInfo: Partial<Omit<EmailSyncInfoType, "email_sync_info_id">>;
}) {
  await db.sync.update(DEFAULT_EMAIL_SYNC_INFO_ID, {
    ...emailSyncInfo,
  });
}
