import { clientDb } from "../db";
import { bulkGetEmails } from "./bulk-get-emails";

export async function bulkDeleteEmails({ emailIds }: { emailIds: string[] }) {
  const emailsToDelete = await bulkGetEmails({
    db: clientDb,
    emailIds,
  });
  const threadIdsToDelete = emailsToDelete
    .map((email) => email?.email_provider_thread_id)
    .filter((id) => !!id) as string[];
  await clientDb.transaction(
    "rw",
    clientDb.email,
    clientDb.thread,
    async () => {
      await clientDb.email.bulkDelete(emailIds);
      await clientDb.thread.bulkDelete(threadIdsToDelete);
    },
  );
}
