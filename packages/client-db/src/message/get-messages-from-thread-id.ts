import type { MessageIndexType } from "@skylar/parsers-and-types";

import { clientDb } from "../db";

export async function getMessagesFromThreadId({
  emailProviderThreadId,
}: {
  emailProviderThreadId: string;
}) {
  return clientDb.message
    .where("provider_thread_id" satisfies keyof MessageIndexType)
    .equals(emailProviderThreadId)
    .sortBy("created_at" satisfies keyof MessageIndexType);
}
