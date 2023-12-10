import type { EmailSyncInfoType } from "@skylar/parsers-and-types";

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
