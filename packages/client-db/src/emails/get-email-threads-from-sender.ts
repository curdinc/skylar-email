import type { EmailIndexType } from "../../schema/email";
import type { ThreadIndexType } from "../../schema/thread";
import { clientDb } from "../db";

export async function getEmailThreadsFrom({
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
    .sortBy("created_at" satisfies keyof EmailIndexType);
}
