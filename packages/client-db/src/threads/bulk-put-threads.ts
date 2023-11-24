import type { ThreadType } from "../../schema/thread";
import type { ClientDb } from "../db";

export async function bulkPutThreads({
  db,
  threads,
}: {
  db: ClientDb;
  threads: ThreadType[];
}) {
  // TOOD: keep this in sync with email client DB in the future
  await db.thread.bulkPut(threads);
}
