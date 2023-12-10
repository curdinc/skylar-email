import type { EmailSyncInfoType } from "../../../parsers-and-types/src/client-db-schema/syncand-types/src/client-db-schema/sync";
import { clientDb } from "../db";

export async function updateEmailSyncInfo({
  syncEmailAddressToUpdate,
  emailSyncInfo,
}: {
  syncEmailAddressToUpdate: string;
  emailSyncInfo: Partial<Omit<EmailSyncInfoType, "email_sync_info_id">>;
}) {
  await clientDb.sync.update(syncEmailAddressToUpdate, {
    ...emailSyncInfo,
  });
}
