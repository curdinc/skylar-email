import type { EmailIndexType } from "../../schema/email";
import type { ClientDb } from "../db";

export async function getEmailThread({
  db,
  emailProviderThreadId,
}: {
  db: ClientDb;
  emailProviderThreadId: string;
}) {
  return db.email
    .where("email_provider_thread_id" satisfies keyof EmailIndexType)
    .equals(emailProviderThreadId)
    .sortBy("created_at" satisfies keyof EmailIndexType);
}
