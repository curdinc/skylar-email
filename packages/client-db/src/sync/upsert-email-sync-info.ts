import type { EmailSyncInfoType } from "@skylar/parsers-and-types";

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
