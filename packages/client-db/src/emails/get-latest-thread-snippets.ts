import { ThreadIndexType, ThreadType } from "../../schema/thread";
import { ClientDb } from "../db";

export async function getLatestThreadSnippets({
  db,
  limit = 25,
  lastEntry,
}: {
  db: ClientDb;
  limit?: number;
  lastEntry?: ThreadType;
}) {
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
