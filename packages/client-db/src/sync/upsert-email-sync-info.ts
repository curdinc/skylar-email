import type { EmailSyncInfoType } from "../../../parsers-and-types/src/client-db-schema/syncand-types/src/client-db-schema/sync";
import { clientDb } from "../db";

export async function upsertEmailSyncInfo({
  emailSyncInfo,
}: {
  emailSyncInfo: EmailSyncInfoType;
}) {
  await clientDb.sync.put({
    ...emailSyncInfo,
  });
}
