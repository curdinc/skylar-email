import type { ClientDb } from "../db";

export async function bulkGetThreads({
  db,
  emailProviderThreadIds,
}: {
  db: ClientDb;
  emailProviderThreadIds: string[];
}) {
  return db.thread.bulkGet(emailProviderThreadIds);
}
