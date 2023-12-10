import type { MessageIndexType } from "@skylar/parsers-and-types/src/client-db-schema/message-types/src/client-db-schema/message";

import type { ThreadIndexType } from "../../../parsers-and-types/src/client-db-schema/threadd-types/src/client-db-schema/thread";
import { clientDb } from "../db";

export async function getAllThreadsFromSenderEmailAddress({
  senderEmail,
  clientEmail,
}: {
  senderEmail: string;
  clientEmail: string;
}) {
  return clientDb.thread
    .where("from_search" satisfies keyof ThreadIndexType)
    .anyOfIgnoreCase(senderEmail)
    .and((thread) => thread.user_email_address === clientEmail)
    .sortBy("created_at" satisfies keyof MessageIndexType);
}
