import type { ThreadType } from "../../schema/thread";
import { clientDb } from "../db";

export async function bulkPutThreads({ threads }: { threads: ThreadType[] }) {
  // TOOD: keep this in sync with email client DB in the future
  await clientDb.thread.bulkPut(threads);
}
