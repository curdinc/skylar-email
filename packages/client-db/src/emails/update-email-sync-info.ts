import type { EmailSyncInfoType } from "../../schema/sync";
import type { ClientDb } from "../db";

export async function updateEmailSyncInfo({
  db,
  syncEmailAddressToUpdate,
  emailSyncInfo,
}: {
  db: ClientDb;
  syncEmailAddressToUpdate: string;
  emailSyncInfo: Partial<Omit<EmailSyncInfoType, "email_sync_info_id">>;
}) {
  await db.sync.update(syncEmailAddressToUpdate, {
    ...emailSyncInfo,
  });
}
