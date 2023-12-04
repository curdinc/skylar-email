import { clientDb } from "../db";

export async function bulkGetThreads({
  emailProviderThreadIds,
}: {
  emailProviderThreadIds: string[];
}) {
  return clientDb.thread.bulkGet(emailProviderThreadIds);
}
