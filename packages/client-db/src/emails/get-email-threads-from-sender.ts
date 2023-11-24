import type { EmailIndexType } from "../../schema/email";
import type { ThreadIndexType } from "../../schema/thread";
import type { ClientDb } from "../db";

export async function getEmailThreadsFrom({
  db,
  senderEmail,
}: {
  db: ClientDb;
  senderEmail: string;
}) {
  return db.thread
    .where("from" satisfies keyof ThreadIndexType)
    .anyOfIgnoreCase(senderEmail)
    .sortBy("created_at" satisfies keyof EmailIndexType);
}
