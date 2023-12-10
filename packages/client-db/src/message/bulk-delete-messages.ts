import { clientDb } from "../db";
import { bulkGetMessages } from "./bulk-get-messages";

export async function bulkDeleteMessages({ emailIds }: { emailIds: string[] }) {
  const emailsToDelete = await bulkGetMessages({
    emailIds,
  });
  const threadIdsToDelete = emailsToDelete
    .map((email) => email?.email_provider_thread_id)
    .filter((id) => !!id) as string[];
  await clientDb.transaction(
    "rw",
    clientDb.message,
    clientDb.thread,
    async () => {
      await clientDb.message.bulkDelete(emailIds);
      await clientDb.thread.bulkDelete(threadIdsToDelete);
    },
  );
}
