import type { EmailIndexType } from "../../schema/email";
import { clientDb } from "../db";

export async function getEmailThread({
  emailProviderThreadId,
}: {
  emailProviderThreadId: string;
}) {
  return clientDb.email
    .where("email_provider_thread_id" satisfies keyof EmailIndexType)
    .equals(emailProviderThreadId)
    .sortBy("created_at" satisfies keyof EmailIndexType);
}
