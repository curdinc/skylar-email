import { clientDb } from "../db";

export async function bulkGetThreads({
  providerThreadIds,
}: {
  providerThreadIds: string[];
}) {
  return clientDb.thread.bulkGet(providerThreadIds);
}
