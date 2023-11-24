import type { ThreadType } from "../../schema/thread";
import type { ClientDb } from "../db";

export async function bulkPutThreads({
  db,
  threads,
}: {
  db: ClientDb;
  threads: ThreadType[];
}) {
  await db.thread.bulkPut(threads);
}
