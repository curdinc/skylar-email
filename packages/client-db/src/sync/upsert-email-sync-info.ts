import type { EmailSyncInfoType } from "../../schema/sync";
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
