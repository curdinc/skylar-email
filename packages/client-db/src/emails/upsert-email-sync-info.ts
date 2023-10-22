import type { EmailSyncInfoType } from "../../schema/sync";
import type { ClientDb } from "../db";

export async function upsertEmailSyncInfo({
  db,
  emailSyncInfo,
}: {
  db: ClientDb;
  emailSyncInfo: EmailSyncInfoType;
}) {
  await db.sync.put({
    ...emailSyncInfo,
  });
}
