import { clientDb } from "../db";
import { bulkGetMessages } from "./bulk-get-messages";

export async function bulkDeleteMessages({
  providerMessageIds,
}: {
  providerMessageIds: string[];
}) {
  const emailsToDelete = await bulkGetMessages({
    providerMessageIds: providerMessageIds,
  });
  const threadIdsToDelete = emailsToDelete
    .map((email) => email?.provider_thread_id)
    .filter((id) => !!id) as string[];
  await clientDb.transaction(
    "rw",
    clientDb.message,
    clientDb.thread,
    async () => {
      await clientDb.message.bulkDelete(providerMessageIds);
      await clientDb.thread.bulkDelete(threadIdsToDelete);
    },
  );
}
