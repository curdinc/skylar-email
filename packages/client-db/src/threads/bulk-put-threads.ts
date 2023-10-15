import type { ThreadType } from "../../schema/thread";
import type { ClientDb } from "../db";

export async function bulkPutThreads({
  db,
  threads,
}: {
  db: ClientDb;
  threads: ThreadType[];
}) {
  await db.transaction("rw", db.email, db.thread, async () => {
    await db.thread.bulkPut(threads);
  });
}
