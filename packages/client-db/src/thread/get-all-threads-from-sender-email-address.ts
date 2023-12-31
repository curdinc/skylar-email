import type {
  MessageIndexType,
  ThreadIndexType,
} from "@skylar/parsers-and-types";

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
