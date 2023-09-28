import type { ClientDb } from "../db";
import { bulkGetEmails } from "./bulk-get-emails";

export async function bulkDeleteEmails({
  db,
  emailIds,
}: {
  db: ClientDb;
  emailIds: string[];
}) {
  const emailsToDelete = await bulkGetEmails({
    db,
    emailIds,
  });
  const threadIdsToDelete = emailsToDelete
    .map((email) => email?.email_provider_thread_id)
    .filter((id) => !!id) as string[];
  await db.email.bulkDelete(emailIds);
  await db.thread.bulkDelete(threadIdsToDelete);
}
