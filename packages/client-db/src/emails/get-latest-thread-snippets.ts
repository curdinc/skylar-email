import type { ThreadIndexType, ThreadType } from "../../schema/thread";
import type { ClientDb } from "../db";

export async function getLatestThreadSnippets({
  getDb,
  limit = 25,
  lastEntry,
}: {
  getDb: () => ClientDb;
  limit?: number;
  lastEntry?: ThreadType;
}) {
  const db = getDb();
  if (lastEntry) {
    return db.thread
      .where("updated_at")
      .below(lastEntry.updated_at)
      .reverse()
      .limit(limit)
      .toArray();
  }

  return db.thread
    .orderBy("updated_at" satisfies keyof ThreadIndexType)
    .reverse()
    .limit(limit)
    .toArray();
}
